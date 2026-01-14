<?php
require_once 'db.php';

session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDbConnection();

switch ($method) {
    case 'GET':
        // Filter by user, date range, project, etc.
        $userId = $_GET['user_id'] ?? ($_SESSION['role'] === 'admin' ? null : $_SESSION['user_id']); // Admins can see all? Or restricted? Default to self if not admin.
        if ($userId && $_SESSION['role'] !== 'admin' && $userId !== $_SESSION['user_id']) {
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden']);
            exit;
        }

        $sql = "SELECT 
                    wl.id, 
                    wl.project_id as projectId, 
                    wl.user_id as userId, 
                    wl.date, 
                    wl.hours, 
                    wl.description, 
                    wl.type,
                    p.name as projectName, 
                    u.name as userName 
                FROM work_logs wl
                JOIN projects p ON wl.project_id = p.id
                JOIN users u ON wl.user_id = u.id
                WHERE 1=1";
        $params = [];

        if ($userId) {
            $sql .= " AND wl.user_id = ?";
            $params[] = $userId;
        }

        if (isset($_GET['start_date']) && isset($_GET['end_date'])) {
            $sql .= " AND wl.date BETWEEN ? AND ?";
            $params[] = $_GET['start_date'];
            $params[] = $_GET['end_date'];
        }

        $sql .= " ORDER BY wl.date DESC, wl.created_at DESC";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        echo json_encode($stmt->fetchAll());
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['project_id']) || empty($data['date']) || empty($data['hours']) || empty($data['type'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields']);
            exit;
        }

        $id = uniqid();
        $userId = $_SESSION['user_id']; // Always log for current user
        $description = $data['description'] ?? '';

        // Transaction to update contract used hours?
        // Ideally we should update the contract used_hours here, but let's stick to simple CRUD first or add a trigger/service logic.
        // For now, let's just insert the log.
        // NOTE: Updating contract hours is critical for the logic, let's try to add it.

        try {
            $pdo->beginTransaction();

            $stmt = $pdo->prepare("INSERT INTO work_logs (id, project_id, user_id, date, hours, description, type) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$id, $data['project_id'], $userId, $data['date'], $data['hours'], $description, $data['type']]);

            // Calculate hours to add to contract
            // Get contract ID from project
            $stmtC = $pdo->prepare("SELECT contract_id FROM projects WHERE id = ?");
            $stmtC->execute([$data['project_id']]);
            $project = $stmtC->fetch();

            if ($project) {
                $stmtUpdate = $pdo->prepare("UPDATE contracts SET used_hours = used_hours + ? WHERE id = ?");
                $stmtUpdate->execute([$data['hours'], $project['contract_id']]);
            }

            $pdo->commit();
            http_response_code(201);
            echo json_encode(['id' => $id, 'message' => 'Work log created']);

        } catch (Exception $e) {
            $pdo->rollBack();
            http_response_code(500);
            echo json_encode(['error' => 'Failed to log work: ' . $e->getMessage()]);
        }
        break;

    case 'PUT':
        // Complex logic: if hours change, we need to adjust contract used_hours.
        // This requires finding the old log, seeing the diff, and applying it.
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Log ID is required']);
            exit;
        }

        try {
            $pdo->beginTransaction();

            // Get existing log
            $stmt = $pdo->prepare("SELECT * FROM work_logs WHERE id = ?");
            $stmt->execute([$data['id']]);
            $oldLog = $stmt->fetch();

            if (!$oldLog) {
                throw new Exception("Log not found");
            }

            if ($oldLog['user_id'] !== $_SESSION['user_id'] && $_SESSION['role'] !== 'admin') {
                throw new Exception("Forbidden");
            }

            $fields = [];
            $params = [];
            $hourDiff = 0;

            if (isset($data['hours'])) {
                $fields[] = "hours = ?";
                $params[] = $data['hours'];
                $hourDiff = $data['hours'] - $oldLog['hours'];
            }
            if (isset($data['description'])) {
                $fields[] = "description = ?";
                $params[] = $data['description'];
            }
            if (isset($data['type'])) {
                $fields[] = "type = ?";
                $params[] = $data['type'];
            }
            if (isset($data['date'])) {
                $fields[] = "date = ?";
                $params[] = $data['date'];
            }

            if (!empty($fields)) {
                $params[] = $data['id'];
                $sql = "UPDATE work_logs SET " . implode(', ', $fields) . " WHERE id = ?";
                $stmt = $pdo->prepare($sql);
                $stmt->execute($params);

                // Update contract usage if hours changed
                if ($hourDiff != 0) {
                    $stmtC = $pdo->prepare("SELECT contract_id FROM projects WHERE id = ?");
                    $stmtC->execute([$oldLog['project_id']]); // Assuming project doesn't change for simplicity
                    $project = $stmtC->fetch();

                    if ($project) {
                        $stmtUpdate = $pdo->prepare("UPDATE contracts SET used_hours = used_hours + ? WHERE id = ?");
                        $stmtUpdate->execute([$hourDiff, $project['contract_id']]);
                    }
                }
            }

            $pdo->commit();
            echo json_encode(['message' => 'Work log updated']);

        } catch (Exception $e) {
            $pdo->rollBack();
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'ID required']);
            exit;
        }

        try {
            $pdo->beginTransaction();

            $stmt = $pdo->prepare("SELECT * FROM work_logs WHERE id = ?");
            $stmt->execute([$id]);
            $log = $stmt->fetch();

            if (!$log) {
                throw new Exception("Log not found");
            }

            if ($log['user_id'] !== $_SESSION['user_id'] && $_SESSION['role'] !== 'admin') {
                throw new Exception("Forbidden");
            }

            // Revert hours
            $stmtC = $pdo->prepare("SELECT contract_id FROM projects WHERE id = ?");
            $stmtC->execute([$log['project_id']]);
            $project = $stmtC->fetch();

            if ($project) {
                $stmtUpdate = $pdo->prepare("UPDATE contracts SET used_hours = used_hours - ? WHERE id = ?");
                $stmtUpdate->execute([$log['hours'], $project['contract_id']]);
            }

            $stmtDel = $pdo->prepare("DELETE FROM work_logs WHERE id = ?");
            $stmtDel->execute([$id]);

            $pdo->commit();
            echo json_encode(['message' => 'Work log deleted']);

        } catch (Exception $e) {
            $pdo->rollBack();
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

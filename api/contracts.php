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
        $sql = "SELECT 
                    c.id, 
                    c.client_id as clientId, 
                    c.name, 
                    c.total_hours as totalHours, 
                    c.used_hours as usedHours, 
                    c.hourly_rate as hourlyRate, 
                    c.start_date as startDate, 
                    c.end_date as endDate, 
                    c.status,
                    cl.name as clientName,
                    cl.logo as clientLogo
                FROM contracts c
                JOIN clients cl ON c.client_id = cl.id
                ORDER BY c.created_at DESC";
        $stmt = $pdo->query($sql);
        echo json_encode($stmt->fetchAll());
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);

        // Resolve client_id from client_name if provided
        if (!empty($data['client_name'])) {
            $stmt = $pdo->prepare("SELECT id FROM clients WHERE name = ?");
            $stmt->execute([$data['client_name']]);
            $client = $stmt->fetch();

            if ($client) {
                $data['client_id'] = $client['id'];
            } else {
                // Create new client
                $client_id = uniqid();
                $stmt = $pdo->prepare("INSERT INTO clients (id, name) VALUES (?, ?)");
                $stmt->execute([$client_id, $data['client_name']]);
                $data['client_id'] = $client_id;
            }
        }

        // Validation
        $required = ['client_id', 'name', 'total_hours', 'hourly_rate', 'start_date', 'end_date'];
        foreach ($required as $field) {
            if (empty($data[$field])) {
                http_response_code(400);
                echo json_encode(['error' => "Field $field is required (or client_name)"]);
                exit;
            }
        }

        $id = uniqid();
        $status = $data['status'] ?? 'Pending';

        $sql = "INSERT INTO contracts (id, client_id, name, total_hours, hourly_rate, start_date, end_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);

        try {
            $stmt->execute([
                $id,
                $data['client_id'],
                $data['name'],
                $data['total_hours'],
                $data['hourly_rate'],
                $data['start_date'],
                $data['end_date'],
                $status
            ]);
            http_response_code(201);
            echo json_encode(['id' => $id, 'message' => 'Contract created', 'client_id' => $data['client_id']]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create contract: ' . $e->getMessage()]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Contract ID is required']);
            exit;
        }

        $fields = [];
        $params = [];
        $updatable = ['name', 'total_hours', 'used_hours', 'hourly_rate', 'start_date', 'end_date', 'status'];

        foreach ($updatable as $col) {
            if (isset($data[$col])) {
                $fields[] = "$col = ?";
                $params[] = $data[$col];
            }
        }

        if (empty($fields)) {
            echo json_encode(['message' => 'No changes provided']);
            exit;
        }

        $params[] = $data['id'];
        $sql = "UPDATE contracts SET " . implode(', ', $fields) . " WHERE id = ?";
        $stmt = $pdo->prepare($sql);

        if ($stmt->execute($params)) {
            echo json_encode(['message' => 'Contract updated successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update contract']);
        }
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Contract ID is required']);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM contracts WHERE id = ?");
        if ($stmt->execute([$id])) {
            echo json_encode(['message' => 'Contract deleted successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete contract']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

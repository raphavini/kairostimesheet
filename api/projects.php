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
        $contract_id = $_GET['contract_id'] ?? null;
        if ($contract_id) {
            $stmt = $pdo->prepare("SELECT * FROM projects WHERE contract_id = ? ORDER BY name ASC");
            $stmt->execute([$contract_id]);
        } else {
            $stmt = $pdo->query("SELECT * FROM projects ORDER BY name ASC");
        }
        echo json_encode($stmt->fetchAll());
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['contract_id']) || empty($data['name'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Contract ID and Project Name are required']);
            exit;
        }

        $id = uniqid();
        $stmt = $pdo->prepare("INSERT INTO projects (id, contract_id, name) VALUES (?, ?, ?)");

        if ($stmt->execute([$id, $data['contract_id'], $data['name']])) {
            http_response_code(201);
            echo json_encode(['id' => $id, 'name' => $data['name'], 'contract_id' => $data['contract_id']]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create project']);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Project ID is required']);
            exit;
        }

        $fields = [];
        $params = [];

        if (isset($data['name'])) {
            $fields[] = "name = ?";
            $params[] = $data['name'];
        }
        // Can allow moving projects between contracts? Maybe.
        if (isset($data['contract_id'])) {
            $fields[] = "contract_id = ?";
            $params[] = $data['contract_id'];
        }

        if (empty($fields)) {
            echo json_encode(['message' => 'No changes provided']);
            exit;
        }

        $params[] = $data['id'];
        $sql = "UPDATE projects SET " . implode(', ', $fields) . " WHERE id = ?";
        $stmt = $pdo->prepare($sql);

        if ($stmt->execute($params)) {
            echo json_encode(['message' => 'Project updated successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update project']);
        }
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Project ID is required']);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM projects WHERE id = ?");
        if ($stmt->execute([$id])) {
            echo json_encode(['message' => 'Project deleted successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete project']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

<?php
require_once 'db.php';

session_start();

// Simple check for authentication - refine as needed
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDbConnection();

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT * FROM clients ORDER BY name ASC");
        echo json_encode($stmt->fetchAll());
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['name'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Client name is required']);
            exit;
        }

        $id = uniqid();
        $logo = $data['logo'] ?? null;

        $stmt = $pdo->prepare("INSERT INTO clients (id, name, logo) VALUES (?, ?, ?)");
        if ($stmt->execute([$id, $data['name'], $logo])) {
            http_response_code(201);
            echo json_encode(['id' => $id, 'name' => $data['name'], 'logo' => $logo]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create client']);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Client ID is required']);
            exit;
        }

        $fields = [];
        $params = [];

        if (isset($data['name'])) {
            $fields[] = "name = ?";
            $params[] = $data['name'];
        }
        if (isset($data['logo'])) {
            $fields[] = "logo = ?";
            $params[] = $data['logo'];
        }

        if (empty($fields)) {
            echo json_encode(['message' => 'No changes provided']);
            exit;
        }

        $params[] = $data['id'];
        $sql = "UPDATE clients SET " . implode(', ', $fields) . " WHERE id = ?";
        $stmt = $pdo->prepare($sql);

        if ($stmt->execute($params)) {
            echo json_encode(['message' => 'Client updated successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update client']);
        }
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Client ID is required']);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM clients WHERE id = ?");
        if ($stmt->execute([$id])) {
            echo json_encode(['message' => 'Client deleted successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete client']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

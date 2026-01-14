<?php
require_once 'db.php';

session_start();

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? null;

if (!$action) {
    $path_info = isset($_SERVER['PATH_INFO']) ? $_SERVER['PATH_INFO'] : (isset($_SERVER['ORIG_PATH_INFO']) ? $_SERVER['ORIG_PATH_INFO'] : '');
    $request = explode('/', trim($path_info, '/'));
    $action = array_shift($request);
}

$pdo = getDbConnection();

switch ($action) {
    case 'login':
        if ($method === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            $email = $data['email'] ?? '';
            $password = $data['password'] ?? '';

            if (empty($email) || empty($password)) {
                http_response_code(400);
                echo json_encode(['error' => 'Email and password are required']);
                exit;
            }

            $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch();

            if ($user && password_verify($password, $user['password_hash'])) {
                $_SESSION['user_id'] = $user['id'];
                unset($user['password_hash']);
                echo json_encode([
                    'status' => 'success',
                    'user' => $user,
                    'token' => session_id() // Use session ID as a dummy token for now
                ]);
            } else {
                http_response_code(401);
                echo json_encode(['error' => 'Invalid credentials']);
            }
        }
        break;

    case 'logout':
        if ($method === 'POST') {
            session_destroy();
            echo json_encode(['message' => 'Logged out successfully']);
        }
        break;

    case 'me':
        if ($method === 'GET') {
            if (isset($_SESSION['user_id'])) {
                $stmt = $pdo->prepare("SELECT id, name, email, role, avatar, two_factor_enabled FROM users WHERE id = ?");
                $stmt->execute([$_SESSION['user_id']]);
                $user = $stmt->fetch();
                if ($user) {
                    echo json_encode($user);
                } else {
                    http_response_code(404);
                    echo json_encode(['error' => 'User not found']);
                }
            } else {
                http_response_code(401);
                echo json_encode(['error' => 'Not authenticated']);
            }
        }
        break;

    case 'register':
        // Optional: Simple registration for testing purposes
        if ($method === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            $email = $data['email'] ?? '';
            $password = $data['password'] ?? '';
            $name = $data['name'] ?? '';

            if (empty($email) || empty($password) || empty($name)) {
                http_response_code(400);
                echo json_encode(['error' => 'Name, email and password are required']);
                exit;
            }

            // Check if user exists
            $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->execute([$email]);
            if ($stmt->fetch()) {
                http_response_code(400);
                echo json_encode(['error' => 'User already exists']);
                exit;
            }

            $id = uniqid(); // Or use UUID library
            $passwordHash = password_hash($password, PASSWORD_DEFAULT);
            $stmt = $pdo->prepare("INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)");
            if ($stmt->execute([$id, $name, $email, $passwordHash])) {
                echo json_encode(['message' => 'User registered successfully']);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Registration failed']);
            }
        }
        break;

    default:
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found']);
        break;
}

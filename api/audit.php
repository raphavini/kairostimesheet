<?php
require_once 'db.php';

session_start();

if (!isset($_SESSION['user_id'])) { // || $_SESSION['role'] !== 'admin'
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$pdo = getDbConnection();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT al.*, u.name as user_name, u.avatar as user_avatar 
            FROM audit_logs al 
            JOIN users u ON al.user_id = u.id 
            ORDER BY al.timestamp DESC LIMIT 100";

    $stmt = $pdo->query($sql);
    $logs = $stmt->fetchAll();

    // Decode JSON fields
    foreach ($logs as &$log) {
        $log['changes'] = json_decode($log['changes'], true);
        $log['metadata'] = json_decode($log['metadata'], true);
    }

    echo json_encode($logs);
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}

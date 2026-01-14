<?php
require_once 'db.php';

session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$pdo = getDbConnection();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stats = [];

    // Total Active Contracts
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM contracts WHERE status = 'Active'");
    $stats['activeContracts'] = $stmt->fetch()['count'];

    // Total Hours Logged (This Month)
    $startOfMonth = date('Y-m-01');
    $endOfMonth = date('Y-m-t');
    $stmt = $pdo->prepare("SELECT SUM(hours) as total_hours FROM work_logs WHERE date BETWEEN ? AND ?");
    $stmt->execute([$startOfMonth, $endOfMonth]);
    $stats['hoursLoggedMonth'] = $stmt->fetch()['total_hours'] ?? 0;

    // Remaining Hours (Across all active contracts)
    // This is a bit tricky, but let's sum (total - used) for active contracts
    $stmt = $pdo->query("SELECT SUM(total_hours - used_hours) as remaining FROM contracts WHERE status = 'Active'");
    $stats['remainingHours'] = $stmt->fetch()['remaining'] ?? 0;

    echo json_encode($stats);
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}

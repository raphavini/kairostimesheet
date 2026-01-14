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

    // Monthly Data (Last 6 months)
    $monthlyData = [];
    for ($i = 5; $i >= 0; $i--) {
        $monthStr = date('Y-m', strtotime("-$i months"));
        $monthName = date('M', strtotime("-$i months"));

        $stmt = $pdo->prepare("SELECT SUM(hours) as consumed FROM work_logs WHERE date LIKE ?");
        $stmt->execute(["$monthStr%"]);
        $consumed = $stmt->fetch()['consumed'] ?? 0;

        // Mock budget for now or calculate based on contracts active in that period
        $budget = 100 + (rand(0, 50));

        $monthlyData[] = [
            'name' => $monthName,
            'consumed' => (float) $consumed,
            'budget' => (float) $budget
        ];
    }
    $stats['monthlyData'] = $monthlyData;

    // Contract Health (Top 5 active)
    $contractHealth = [];
    $stmt = $pdo->query("SELECT name, (used_hours / total_hours * 100) as value FROM contracts WHERE total_hours > 0 ORDER BY value DESC LIMIT 5");
    $healthData = $stmt->fetchAll();

    foreach ($healthData as $row) {
        $val = (float) $row['value'];
        $color = '#135bec'; // Default blue
        if ($val > 90)
            $color = '#ef4444'; // Red
        else if ($val > 75)
            $color = '#f59e0b'; // Amber

        $contractHealth[] = [
            'name' => $row['name'],
            'value' => round($val, 1),
            'color' => $color
        ];
    }
    $stats['contractHealth'] = $contractHealth;

    echo json_encode($stats);
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}

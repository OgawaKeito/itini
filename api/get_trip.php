<?php
require_once 'db_config.php';
$share_id = $_GET['id'] ?? '';

try {
    $stmt = $pdo->prepare("SELECT * FROM trips WHERE share_id = ?");
    $stmt->execute([$share_id]);
    $trip = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$trip) { echo json_encode(['error' => 'Not found']); exit; }

    // 日順、その中で時間順に並べる
    $stmtAct = $pdo->prepare("SELECT * FROM activities WHERE trip_id = ? ORDER BY day_number ASC, start_time ASC");
    $stmtAct->execute([$trip['id']]);
    $activities = $stmtAct->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['trip' => $trip, 'activities' => $activities]);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
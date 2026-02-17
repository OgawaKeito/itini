<?php
require_once 'db_config.php';
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) exit;

try {
    $stmt = $pdo->prepare("SELECT id FROM trips WHERE share_id = ?");
    $stmt->execute([$data['share_id']]);
    $trip = $stmt->fetch();

    if ($trip) {
        // location を追加
        $sql = "INSERT INTO activities (trip_id, day_number, start_time, activity_name, location, memo) VALUES (?, ?, ?, ?, ?, ?)";
        $stmtInsert = $pdo->prepare($sql);
        $stmtInsert->execute([
            $trip['id'],
            $data['day_number'],
            $data['start_time'],
            $data['activity_name'], // 内容
            $data['location'],      // 行き先（追加！）
            $data['memo']
        ]);
        echo json_encode(['success' => true]);
    }
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
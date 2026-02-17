<?php
require_once 'db_config.php';
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id'])) {
    echo json_encode(['error' => 'ID is missing']);
    exit;
}

try {
    // location を追加して更新
    $sql = "UPDATE activities SET day_number = ?, start_time = ?, activity_name = ?, location = ?, memo = ? WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $data['day_number'],
        $data['start_time'],
        $data['activity_name'],
        $data['location'], // 追加！
        $data['memo'],
        $data['id']
    ]);
    
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
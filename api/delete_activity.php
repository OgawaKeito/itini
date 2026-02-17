<?php
require_once 'db_config.php';
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id'])) {
    echo json_encode(['error' => 'ID is missing']);
    exit;
}

try {
    // 指定されたIDの予定を削除
    $stmt = $pdo->prepare("DELETE FROM activities WHERE id = ?");
    $stmt->execute([$data['id']]);
    
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
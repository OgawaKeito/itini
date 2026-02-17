<?php
require_once 'db_config.php';
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) exit;

$share_id = bin2hex(random_bytes(16));

try {
    $stmt = $pdo->prepare("INSERT INTO trips (share_id, title, destination, start_date, end_date) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([
        $share_id, 
        $data['title'], 
        $data['destination'], 
        $data['start_date'], 
        $data['end_date']
    ]);
    echo json_encode(['share_id' => $share_id]);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
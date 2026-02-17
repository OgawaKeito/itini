<?php
// DB接続設定を読み込み
require_once 'db_config.php';

// JSON形式で送られてきたデータを受け取る
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// データが正しく受け取れなかった場合の処理
if (!$data) {
    header('Content-Type: application/json');
    echo json_encode(['error' => 'データが空です']);
    exit;
}

// --- 1. 共有用のユニークID（UUID風）を生成 ---
// indigo la End の曲名のように、唯一無二のIDを作ります
$share_id = bin2hex(random_bytes(16));

try {
    // --- 2. SQLインジェクション対策（プリペアドステートメント） ---
    $sql = "INSERT INTO trips (share_id, title, destination, start_date, end_date) 
            VALUES (:share_id, :title, :destination, :start_date, :end_date)";
    
    $stmt = $pdo->prepare($sql);
    
    // --- 3. データの実行 ---
    $stmt->execute([
        ':share_id'    => $share_id,
        ':title'       => $data['title'],
        ':destination' => $data['destination'],
        ':start_date'  => $data['start_date'],
        ':end_date'    => $data['end_date']
    ]);

    // --- 4. 成功レスポンスを返す ---
    header('Content-Type: application/json');
    echo json_encode(['share_id' => $share_id]);

} catch (PDOException $e) {
    // DBエラーが発生した場合
    header('Content-Type: application/json');
    echo json_encode(['error' => '保存に失敗しました: ' . $e->getMessage()]);
}
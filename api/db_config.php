<?php
// 環境判定 (localhost または 127.0.0.1 ならローカル)
$is_local = ($_SERVER['HTTP_HOST'] === 'localhost' || $_SERVER['SERVER_ADDR'] === '127.0.0.1');

if ($is_local) {
    // --- ローカル環境用 ---
    $host     = 'localhost';
    $dbname   = 'laa1188250-itini';  // ※あなたのローカルのDB名に合わせてください
    $user     = 'root';
    $password = '';
} else {
    // --- 本番環境用 (ロリポップ) ---
    $host     = 'mysql322.phy.lolipop.lan';
    $dbname   = 'LAA1188250-itini';
    $user     = 'LAA1188250';
    $password = 'keito716'; 
}

try {
    $dsn = "mysql:host={$host};dbname={$dbname};charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ];
    $pdo = new PDO($dsn, $user, $password, $options);
} catch (PDOException $e) {
    // エラー時はJSONで返す
    header('Content-Type: application/json; charset=utf-8', true, 500);
    echo json_encode(['error' => 'Database connection failed: ' . ($is_local ? $e->getMessage() : 'Server Error')]);
    exit;
}
?>
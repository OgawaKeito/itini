<?php
// データベース接続設定
$host     = 'mysql322.phy.lolipop.lan';
$dbname   = 'LAA1188250-itini';
$user     = 'LAA1188250';
$password = 'keito716'; 

try {
    // MySQL 8.0に対応した接続設定
    $dsn = "mysql:host={$host};dbname={$dbname};charset=utf8mb4";
    
    $options = [
        // エラーモードを例外に設定
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        // SQLインジェクション対策：静的プレースホルダを強制
        PDO::ATTR_EMULATE_PREPARES => false,
        // デフォルトの取得形式を連想配列に
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ];

    $pdo = new PDO($dsn, $user, $password, $options);

} catch (PDOException $e) {
    // セキュリティのため、本番環境ではエラー詳細を表示させない
    header('Content-Type: application/json', true, 500);
    echo json_encode(['error' => '現在、データベースに接続できません。']);
    exit;
}

// 画面上にPHPのエラーを表示させない（ハッキング対策）
ini_set('display_errors', 0);
?>
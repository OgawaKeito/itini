<?php
// デスクトップ環境用の設定
$host = 'localhost';
$dbname = 'itini_db';
$user = 'root';
$pass = ''; // WindowsのXAMPPなら基本は空です

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
    // エラー時に例外を投げるように設定
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // エラーをJSON形式で返す（フロントエンドでキャッチするため）
    header('Content-Type: application/json');
    die(json_encode(['error' => 'DB接続エラー: ' . $e->getMessage()]));
}
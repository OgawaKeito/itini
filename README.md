# Itini（イティニ）

**藍色のテーマで、記憶に残る旅のしおりを作成・共有できるサービス**

Itini は旅行のスケジュールや目的地をまとめ、ユニークな URL で友人や家族と手軽に共有できる旅行しおり作成サービスです。  
シンプルな操作性と藍色を基調とした落ち着いたデザインで、大切な旅の思い出づくりをサポートします。

---

## 主要機能

- **旅行プラン作成**: タイトル・目的地・日程を入力し、日ごとのアクティビティを自由に追加・編集・並び替え
- **UUID URL で共有**: 生成されたユニーク URL を共有するだけで、ログイン不要で旅のしおりを閲覧可能
- **天気統計**: `OpenWeatherMap API` を利用し、目的地の旅行期間中の天気予報を表示
- **マップ連携**: アクティビティの場所を指定して `Google Maps` へのリンクを自動生成
- **レスポンシブデザイン**: スマートフォン・タブレット・PC 幅に対応したレイアウト

---

## 技術スタック

| カテゴリ | 技術 |
| :--- | :--- |
| **Frontend** | Vue.js 3 (CDN / Composition API), CSS3 (Flex / Grid) |
| **Backend** | PHP 8.x |
| **Database** | MySQL 8.0 |
| **Infrastructure** | Lolipop! Managed Cloud |
| **外部 API** | OpenWeatherMap API, Google Maps |

---

## ファイル構成

```
itini/
├── index.html          # トップページ（旅行プラン一覧・作成）
├── edit.html           # 旅行プラン編集ページ
├── terms.html          # 利用規約ページ
├── .htaccess           # Apache 設定
├── .gitignore
├── README.md
├── api/
│   ├── db_config.php   # DB接続設定（.gitignore で除外）
│   ├── create_trip.php
│   ├── get_trip.php
│   ├── add_activity.php
│   ├── update_activity.php
│   └── delete_activity.php
├── css/
│   ├── style.css
│   └── responsive.css
└── js/
    ├── app.js
    └── edit.js
```

---

## セットアップ

### 1. リポジトリをクローン

```bash
git clone https://github.com/<your-username>/itini.git
```

### 2. データベースを作成

MySQL 8.0 でデータベースとテーブルを作成してください。

**`trips` テーブル（旅行プラン）**

| カラム名 | 型 | 説明 |
| :--- | :--- | :--- |
| `id` | INT (PK, AUTO_INCREMENT) | 内部管理 ID |
| `share_id` | VARCHAR(36) | 共有 URL 用のユニーク ID（UUID） |
| `title` | VARCHAR(255) | 旅行のタイトル |
| `destination` | VARCHAR(100) | 目的地（天気 API で使用） |
| `start_date` | DATE | 旅行開始日 |
| `end_date` | DATE | 旅行終了日 |

**`activities` テーブル（各日のアクティビティ）**

| カラム名 | 型 | 説明 |
| :--- | :--- | :--- |
| `id` | INT (PK, AUTO_INCREMENT) | 内部管理 ID |
| `trip_id` | INT (FK) | 紐づく trips.id |
| `day_number` | INT | 何日目か |
| `time` | VARCHAR(10) | 時刻（例: 10:00） |
| `title` | VARCHAR(255) | アクティビティ名 |
| `location` | VARCHAR(255) | 場所（Google Maps リンク生成に使用） |
| `note` | TEXT | メモ |
| `sort_order` | INT | 表示順 |

### 3. `db_config.php` を作成

`api/db_config.php` は `.gitignore` で除外されているため、手動で作成してください。

```php
<?php
define('DB_HOST', 'localhost');
define('DB_NAME', 'your_database_name');
define('DB_USER', 'your_database_user');
define('DB_PASS', 'your_database_password');
define('DB_CHARSET', 'utf8mb4');
```

### 4. サーバーにアップロード

Lolipop! Managed Cloud などのサーバーにファイルを転送し、ドキュメントルートに配置してください。

---

## ライセンス

[MIT License](LICENSE)

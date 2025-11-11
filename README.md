# 🔮 Voodoo Miracle BOT

**Gemini連携スピリチュアルAIコンシェルジュ**

古代ブードゥーのシャーマンの叡智を持つAIボットです。あなたの悩みや願いを聞き、スピリチュアルな視点からアドバイスと祈祷のメッセージを提供します。

## ✨ 主な機能

### 🕯️ 祈祷相談
5つの祈祷タイプから選択できます：
- **💕 恋愛の祈祷** - 縁結び、恋愛成就のアドバイス
- **💰 金運の祈祷** - 豊かさと繁栄を引き寄せる
- **🌿 健康の祈祷** - 心身の癒しと健康のサポート
- **🛡️ 厄除けの祈祷** - 邪気を祓い、守護のパワーを授ける
- **🔮 総合的な祈祷** - 人生全般の導きとアドバイス

### 🌙 今日の運勢
月の満ち欠けに基づいた運勢診断
- 全体運、恋愛運、金運、健康運
- ラッキーアイテムの提示
- シャーマンからの一言メッセージ

### 🌕 月の位相表示
リアルタイムで月の満ち欠けを計算し、その意味を表示

## 🚀 セットアップ

### 必要な環境
- Node.js (v14以上推奨)
- Gemini API Key

### インストール手順

1. **依存パッケージのインストール**
```bash
npm install
```

2. **環境変数の設定**
`.env.example`をコピーして`.env`ファイルを作成：
```bash
cp .env.example .env
```

`.env`ファイルを編集してGemini API Keyを設定：
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=3000
NODE_ENV=development
```

3. **Gemini API Keyの取得方法**
- [Google AI Studio](https://makersuite.google.com/app/apikey)にアクセス
- Googleアカウントでログイン
- "Get API Key"をクリックしてAPIキーを取得
- 取得したキーを`.env`ファイルに設定

## 🎮 使い方

### 開発モード（自動再起動）
```bash
npm run dev
```

### 本番モード
```bash
npm start
```

サーバーが起動したら、ブラウザで以下にアクセス：
```
http://localhost:3000
```

## 📁 プロジェクト構造

```
voodoo-miracle-bot/
├── public/              # フロントエンドファイル
│   ├── index.html       # メインHTML
│   ├── css/
│   │   └── style.css    # スタイルシート
│   └── js/
│       └── app.js       # クライアントサイドJS
├── src/
│   └── server.js        # Expressサーバー＆API
├── .env                 # 環境変数（自分で作成）
├── .env.example         # 環境変数のサンプル
├── .gitignore          # Git除外設定
├── package.json        # プロジェクト設定
└── README.md           # このファイル
```

## 🌟 API エンドポイント

### POST `/api/pray`
祈祷相談のエンドポイント

**リクエスト:**
```json
{
  "type": "love",
  "message": "素敵な人と出会いたいです"
}
```

**レスポンス:**
```json
{
  "success": true,
  "type": "恋愛の祈祷",
  "emoji": "💕",
  "moonPhase": {
    "phase": "満月",
    "meaning": "完成と達成の時...",
    "emoji": "🌕"
  },
  "message": "シャーマンからのメッセージ..."
}
```

### GET `/api/fortune`
今日の運勢取得

**レスポンス:**
```json
{
  "success": true,
  "date": "2024年11月11日",
  "moonPhase": {...},
  "fortune": "運勢の内容..."
}
```

### GET `/api/prayer-types`
祈祷タイプ一覧取得

## 🎨 技術スタック

- **バックエンド:** Node.js + Express
- **AI:** Google Gemini API
- **フロントエンド:** Vanilla JavaScript, HTML5, CSS3
- **スタイル:** カスタムCSS（ダークテーマ、星空背景、グラデーション）

## 🔒 セキュリティ

- 環境変数で機密情報を管理
- CORS設定によるアクセス制御
- API Keyは`.env`ファイルで管理（Gitにコミットしない）

## 📝 ライセンス

MIT License

## 🙏 クレジット

- AI: Google Gemini API
- デザイン: カスタムスピリチュアルテーマ
- 月の位相計算: 天文学的アルゴリズム

---

🕯️ **古代ブードゥーの叡智があなたを導きます** 🕯️

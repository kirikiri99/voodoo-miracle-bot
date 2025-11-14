# 🚀 デプロイメントガイド

Voodoo Miracle BOTのデプロイ手順を説明します。

## 📋 目次

1. [Vercelへのデプロイ（推奨）](#vercelへのデプロイ推奨)
2. [環境変数の設定](#環境変数の設定)
3. [デプロイ後の確認](#デプロイ後の確認)
4. [トラブルシューティング](#トラブルシューティング)

---

## Vercelへのデプロイ（推奨）

Vercelは無料プランでNode.jsアプリケーションをホスティングできます。

### 🌐 Webインターフェースでのデプロイ

#### ステップ1: Vercelアカウントの作成

1. [Vercel](https://vercel.com)にアクセス
2. "Sign Up"をクリック
3. GitHubアカウントで登録（推奨）

#### ステップ2: プロジェクトのインポート

1. Vercelダッシュボードで"New Project"をクリック
2. "Import Git Repository"を選択
3. GitHubリポジトリ一覧から`voodoo-miracle-bot`を選択
4. "Import"をクリック

#### ステップ3: プロジェクト設定

**Build & Development Settings:**
- Framework Preset: `Other`
- Build Command: （空欄のまま）
- Output Directory: `public`
- Install Command: `npm install`

**Root Directory:**
- `.` (デフォルト)

#### ステップ4: 環境変数の設定

"Environment Variables"セクションで以下を追加：

| Key | Value | Environment |
|-----|-------|-------------|
| `GEMINI_API_KEY` | `AIzaSy...` (あなたのAPIキー) | Production, Preview, Development |
| `NODE_ENV` | `production` | Production |

#### ステップ5: デプロイ

1. "Deploy"ボタンをクリック
2. ビルドとデプロイが完了するまで待機（通常1-2分）
3. デプロイが成功すると、URLが表示されます
   - 例: `https://voodoo-miracle-bot.vercel.app`

---

## 環境変数の設定

### 必須の環境変数

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Vercel CLIでの環境変数追加

```bash
# 本番環境
vercel env add GEMINI_API_KEY production

# プレビュー環境
vercel env add GEMINI_API_KEY preview

# 開発環境
vercel env add GEMINI_API_KEY development
```

### Vercel Web UIでの環境変数追加

1. プロジェクト設定 → "Environment Variables"
2. "Add"ボタンをクリック
3. Name: `GEMINI_API_KEY`
4. Value: あなたのAPIキー
5. Environments: すべてにチェック
6. "Save"をクリック

---

## デプロイ後の確認

### ✅ チェックリスト

1. **サイトが正常に表示される**
   - デプロイされたURLにアクセス
   - ページが読み込まれることを確認

2. **祈祷機能が動作する**
   - 祈祷タイプを選択
   - メッセージを入力して送信
   - AIレスポンスが返ってくることを確認

3. **運勢機能が動作する**
   - "今日の運勢"タブをクリック
   - 運勢が表示されることを確認

4. **月の位相が表示される**
   - ページ上部に月の位相が表示されることを確認

5. **アクションボタンが動作する**
   - 資料請求ボタンでPDFが開くことを確認
   - LINE相談ボタンでLINEページが開くことを確認

---

## 自動デプロイ設定

### GitHubとの連携

Vercelは自動的にGitHubリポジトリと連携し、以下のブランチへのpush時に自動デプロイされます：

- **main/master ブランチ** → 本番環境へデプロイ
- **その他のブランチ** → プレビュー環境へデプロイ

### デプロイトリガー

```bash
# ローカルで変更をコミット
git add .
git commit -m "feat: 新機能を追加"

# mainブランチにプッシュ
git push origin main
```

→ Vercelが自動的に検知してデプロイを開始

---

## Vercel CLI でのデプロイ

### CLI のインストール

```bash
npm install -g vercel
```

### 初回デプロイ

```bash
# プロジェクトディレクトリに移動
cd /path/to/voodoo-miracle-bot

# Vercelにログイン
vercel login

# デプロイ（プレビュー環境）
vercel

# 本番環境にデプロイ
vercel --prod
```

### 既存プロジェクトのデプロイ

```bash
# プレビュー環境
vercel

# 本番環境
vercel --prod
```

---

## トラブルシューティング

### 問題1: デプロイが失敗する

**原因:** 依存関係のインストールエラー

**解決策:**
```bash
# ローカルで依存関係を再インストール
rm -rf node_modules package-lock.json
npm install

# 問題がなければコミット＆プッシュ
git add package-lock.json
git commit -m "fix: 依存関係を更新"
git push origin main
```

### 問題2: APIが動作しない

**原因:** 環境変数が設定されていない

**解決策:**
1. Vercelダッシュボードで"Settings" → "Environment Variables"
2. `GEMINI_API_KEY`が正しく設定されているか確認
3. 設定後、"Deployments"タブから"Redeploy"を実行

### 問題3: 500 Internal Server Error

**原因:** サーバーエラー

**解決策:**
1. Vercelダッシュボードで"Deployments"をクリック
2. 最新のデプロイメントを選択
3. "Function Logs"でエラーログを確認
4. エラー内容に応じて修正

### 問題4: CORS エラー

**原因:** CORSの設定ミス

**解決策:**
`src/server.js`でCORS設定を確認：
```javascript
const cors = require('cors');
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS || '*',
    credentials: true
}));
```

---

## カスタムドメインの設定

### ステップ1: ドメインの追加

1. Vercelダッシュボードで"Settings" → "Domains"
2. "Add"ボタンをクリック
3. ドメイン名を入力（例: `voodoo-miracle.com`）
4. "Add"をクリック

### ステップ2: DNS設定

Vercelが提供するDNSレコードをドメインのDNS設定に追加：

**Aレコード:**
```
Type: A
Name: @
Value: 76.76.21.21
```

**CNAMEレコード:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### ステップ3: SSL証明書の自動発行

- Vercelが自動的にSSL証明書を発行
- 通常、数分～数時間で完了
- HTTPSが有効になると緑色のチェックマークが表示されます

---

## パフォーマンス最適化

### 1. Edge Functions の活用

Vercelは自動的にEdge Networkでコンテンツを配信：
- 静的ファイル: CDN経由で高速配信
- API: エッジでの実行で低レイテンシ

### 2. キャッシュ設定

`vercel.json`でキャッシュヘッダーを設定可能：
```json
{
  "headers": [
    {
      "source": "/css/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 3. 画像最適化

Vercel Image Optimizationを使用（自動）：
- WebP形式への自動変換
- レスポンシブ画像の生成
- 遅延読み込み

---

## モニタリング

### Vercel Analytics

1. プロジェクト設定 → "Analytics"
2. "Enable Analytics"をクリック
3. 以下の指標を確認可能：
   - ページビュー
   - ユニークビジター
   - トップページ
   - 参照元

### Function Logs

1. "Deployments"をクリック
2. 任意のデプロイメントを選択
3. "Function Logs"でリアルタイムログを確認

---

## バックアップとロールバック

### 以前のデプロイメントにロールバック

1. "Deployments"タブを開く
2. ロールバックしたいデプロイメントを選択
3. "..."メニューから"Promote to Production"を選択
4. 確認して実行

---

## セキュリティ

### 環境変数の保護

- 環境変数はGitにコミットしない
- `.env`ファイルは`.gitignore`に追加済み
- Vercelの環境変数は暗号化されて保存されます

### アクセス制限

Vercelでは以下の方法でアクセス制限が可能：
- パスワード保護（Pro プラン以上）
- IP許可リスト（Enterprise プラン）

---

## サポート

問題が発生した場合：

1. [Vercel Documentation](https://vercel.com/docs)を確認
2. [Vercel Community](https://github.com/vercel/vercel/discussions)で質問
3. プロジェクトのGitHubリポジトリでIssueを作成

---

🎉 **デプロイ完了！あなたのVoodoo Miracle BOTが世界中からアクセス可能になりました！** 🎉

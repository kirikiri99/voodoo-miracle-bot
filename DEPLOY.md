# 🚀 Renderへのデプロイガイド

このドキュメントでは、Voodoo Miracle BOTをRenderにデプロイする手順を説明します。

## 📋 前提条件

- GitHubアカウント
- Renderアカウント（無料）
- Gemini API Key

## 🔧 デプロイ手順

### ステップ 1: Renderアカウントを作成

1. [Render](https://render.com)にアクセス
2. "Get Started"をクリック
3. GitHubアカウントで認証
4. Renderアカウントが作成されます

### ステップ 2: GitHubリポジトリを接続

1. Renderダッシュボードで "New +" をクリック
2. "Web Service" を選択
3. GitHubリポジトリ `kirikiri99/voodoo-miracle-bot` を検索して選択
4. "Connect" をクリック

### ステップ 3: サービス設定

Renderが `render.yaml` を自動検出するので、基本設定は自動的に適用されます。

手動で設定する場合：

**基本設定:**
- **Name**: `voodoo-miracle-bot` （任意の名前に変更可能）
- **Region**: `Oregon (US West)` （無料プラン利用可能）
- **Branch**: `main`
- **Root Directory**: （空白のまま）
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**プラン:**
- **Instance Type**: `Free` （月750時間無料）

### ステップ 4: 環境変数を設定

1. "Environment" セクションで "Add Environment Variable" をクリック

2. 以下の環境変数を追加：

   | Key | Value | 説明 |
   |-----|-------|------|
   | `GEMINI_API_KEY` | `your_actual_api_key` | Gemini API Key（必須） |
   | `NODE_ENV` | `production` | 本番環境設定 |
   | `PORT` | `10000` | Renderのデフォルトポート |

**重要:** `GEMINI_API_KEY` は必ず設定してください。

### ステップ 5: デプロイ

1. すべての設定が完了したら "Create Web Service" をクリック
2. Renderが自動的にビルド＆デプロイを開始します
3. 進行状況は "Logs" タブで確認できます

### ステップ 6: デプロイ完了

- デプロイが成功すると、公開URLが表示されます
  - 例: `https://voodoo-miracle-bot.onrender.com`
- このURLにアクセスしてアプリケーションを確認

## 🔄 自動デプロイ

- GitHubの `main` ブランチにpushすると自動的に再デプロイされます
- コミット履歴から各デプロイバージョンを確認できます

## ⚙️ render.yamlを使った自動設定

リポジトリに `render.yaml` が含まれているため、以下の設定が自動適用されます：

```yaml
services:
  - type: web
    name: voodoo-miracle-bot
    env: node
    region: oregon
    plan: free
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: GEMINI_API_KEY
        sync: false
      - key: PORT
        value: 10000
```

**注意:** `GEMINI_API_KEY` は手動で設定する必要があります。

## 🐛 トラブルシューティング

### デプロイが失敗する場合

1. **ビルドエラー**
   - Logsタブでエラーメッセージを確認
   - `npm install` が正常に実行されているか確認
   - `package.json` の依存関係を確認

2. **起動エラー**
   - 環境変数が正しく設定されているか確認
   - `GEMINI_API_KEY` が設定されているか確認
   - Start Commandが `npm start` になっているか確認

3. **API Keyエラー**
   - Gemini API Keyが有効か確認
   - [Google AI Studio](https://makersuite.google.com/app/apikey)で新しいキーを生成

### アプリが起動しない場合

1. Renderダッシュボードの "Logs" タブでエラーを確認
2. Environment Variables が正しく設定されているか確認
3. デプロイを手動で再起動：
   - "Manual Deploy" → "Clear build cache & deploy"

## 📊 Renderの機能

### 無料プランの制限
- 月750時間の稼働時間（1つのサービスなら常時稼働可能）
- 15分間アクセスがないとスリープ状態になる
- スリープ後の初回アクセスは起動に数秒かかる
- メモリ: 512MB
- CPU: Shared

### 有料プランへのアップグレード
- スリープなし
- より多くのリソース
- カスタムドメイン

## 🔒 セキュリティ

- **環境変数**: RenderのUIで安全に管理
- **HTTPS**: 自動的に有効化
- **API Key**: `.env`ファイルはGitにコミットしない
- **CORS**: サーバー側で設定済み

## 📱 カスタムドメインの設定（オプション）

1. Renderダッシュボードで "Settings" タブを開く
2. "Custom Domain" セクションで "Add Custom Domain" をクリック
3. 所有しているドメインを入力
4. DNS設定を更新（Renderが指示を表示）

## 🔄 更新とメンテナンス

### コードの更新
1. ローカルで変更を行う
2. GitHubにpush
3. Renderが自動的に再デプロイ

### 環境変数の更新
1. Renderダッシュボードで "Environment" タブを開く
2. 変数を編集
3. "Save Changes" をクリック
4. サービスが自動的に再起動

### ログの確認
- Renderダッシュボードの "Logs" タブでリアルタイムログを確認
- エラーやデバッグ情報を確認できます

## 📞 サポート

問題が発生した場合：
1. [Render Documentation](https://render.com/docs)を確認
2. [Render Community](https://community.render.com/)でサポートを求める
3. GitHubリポジトリのIssuesセクションで報告

---

🕯️ **デプロイが成功したら、世界中の人々にスピリチュアルな導きを提供できます！** 🕯️

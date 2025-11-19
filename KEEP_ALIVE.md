# 🌟 Renderスリープ防止設定ガイド

Renderの無料プランでは、15分間アクセスがないとサーバーがスリープします。
このガイドでは、サーバーを常時起動状態に保つ方法を説明します。

## 🛌 問題：スリープとは？

### 無料プランの制限
- **15分間アクセスなし** → サーバーがスリープ（休眠）
- スリープ後の初回アクセス → **30秒〜1分の起動時間が必要**
- ユーザー体験が悪化

### 解決策
**定期的にサーバーにアクセスして、スリープさせない！**

---

## ✅ 方法1: Cron-Job.org を使う（おすすめ・無料）

### ステップ1: Cron-Job.orgにアクセス

👉 **https://cron-job.org/en/**

### ステップ2: アカウント作成

1. 「Sign up」をクリック
2. メールアドレスとパスワードを入力
3. メール認証を完了

### ステップ3: 新しいCron Jobを作成

1. ダッシュボードで **"Create cronjob"** をクリック

2. **設定を入力：**

   **Title（タイトル）:**
   ```
   Voodoo Miracle BOT Keep Alive
   ```

   **Address（URL）:**
   ```
   https://voodoo-miracle-bot.onrender.com
   ```

   **Schedule（スケジュール）:**
   - **Every**: `10 minutes`（10分ごと）
   
   または詳細設定：
   ```
   */10 * * * *
   ```
   （10分ごとに実行）

3. **Save** をクリック

### ステップ4: 動作確認

- Cron-Job.orgのダッシュボードで実行履歴を確認
- 「Last execution」が表示されればOK

---

## ✅ 方法2: UptimeRobot を使う（無料・簡単）

### ステップ1: UptimeRobotにアクセス

👉 **https://uptimerobot.com/**

### ステップ2: アカウント作成

1. 「Start Your Free Trial」をクリック
2. メールアドレスで登録（クレジットカード不要）

### ステップ3: モニターを追加

1. ダッシュボードで **"+ Add New Monitor"** をクリック

2. **設定を入力：**

   **Monitor Type:**
   ```
   HTTP(s)
   ```

   **Friendly Name:**
   ```
   Voodoo Miracle BOT
   ```

   **URL:**
   ```
   https://voodoo-miracle-bot.onrender.com
   ```

   **Monitoring Interval:**
   ```
   Every 5 minutes（5分ごと）
   ```

3. **Create Monitor** をクリック

### ステップ4: 動作確認

- ダッシュボードで「Up」と表示されればOK
- 自動的に5分ごとにアクセスしてくれる

---

## ✅ 方法3: GitHub Actions を使う（完全自動化）

### ステップ1: ワークフローファイルを作成

`.github/workflows/keep-alive.yml` を作成：

```yaml
name: Keep Render Alive

on:
  schedule:
    # 10分ごとに実行
    - cron: '*/10 * * * *'
  workflow_dispatch: # 手動実行も可能

jobs:
  keep-alive:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Render Service
        run: |
          curl -f https://voodoo-miracle-bot.onrender.com || echo "Failed to ping"
```

### ステップ2: GitHubにプッシュ

```bash
git add .github/workflows/keep-alive.yml
git commit -m "Add GitHub Actions keep-alive workflow"
git push origin main
```

### ステップ3: GitHub Actionsを有効化

1. GitHubリポジトリの「Actions」タブを開く
2. ワークフローが実行されていることを確認

---

## 📊 各方法の比較

| 方法 | 無料 | 設定の簡単さ | 信頼性 | おすすめ度 |
|------|------|-------------|--------|-----------|
| **Cron-Job.org** | ✅ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 🏆 最もおすすめ |
| **UptimeRobot** | ✅ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 🥈 監視機能付き |
| **GitHub Actions** | ✅ | ⭐⭐⭐ | ⭐⭐⭐⭐ | 🥉 完全自動化 |

---

## 🎯 おすすめの組み合わせ

### 初心者向け
```
Cron-Job.org だけでOK！
→ 設定が簡単で、すぐに使える
```

### 中級者向け
```
Cron-Job.org + UptimeRobot
→ ダウンタイム監視もできる
```

### 上級者向け
```
GitHub Actions
→ コードで管理、完全自動化
```

---

## ⚙️ 推奨設定

### アクセス間隔
```
✅ 推奨: 10分ごと
⚠️ 最低: 14分ごと（15分でスリープするため）
❌ 非推奨: 5分ごと（頻繁すぎ）
```

### なぜ10分？
- スリープまでの15分に余裕を持たせる
- サーバーに負荷をかけすぎない
- 十分な起動維持ができる

---

## 🔍 動作確認方法

### 1. Renderのダッシュボードで確認
```
https://dashboard.render.com/
↓
voodoo-miracle-bot を開く
↓
"Logs" タブを見る
↓
定期的にアクセスログが表示される
```

### 2. サイトにアクセス
```
https://voodoo-miracle-bot.onrender.com
↓
すぐに表示される（待ち時間なし）
```

---

## 🚨 トラブルシューティング

### Cron Jobが実行されない
- アカウントが有効か確認
- URLが正しいか確認
- スケジュール設定を見直す

### サーバーがまだスリープする
- アクセス間隔を短くする（10分→5分）
- 複数のサービスを併用する

### Renderのログにアクセスが記録されない
- URLが正しいか確認（https://で始まる）
- Renderのサービスが "Live" 状態か確認

---

## 💡 その他のヒント

### 1. ヘルスチェックエンドポイントを作る

サーバー側で軽量なエンドポイントを用意：

```javascript
// server.js に追加
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});
```

Cron JobでアクセスするURLを：
```
https://voodoo-miracle-bot.onrender.com/health
```
に変更すると、サーバー負荷が軽減されます。

### 2. 有料プランを検討
```
Starter プラン: $7/月
→ スリープなし
→ より高速
→ より多くのリソース
```

本格的に運用する場合は有料プランもおすすめ。

---

## 📋 設定完了チェックリスト

- [ ] Cron-Job.org または UptimeRobot のアカウント作成
- [ ] サイトURLを登録
- [ ] アクセス間隔を10分に設定
- [ ] 初回実行を確認
- [ ] Renderのログでアクセスを確認
- [ ] サイトが素早く表示されることを確認

---

## 🎉 完了！

これでRenderのスリープ問題は解決です！

サーバーが常時起動状態を保ち、ユーザーは待ち時間なくサイトにアクセスできます。

---

**最終更新日：2025年11月19日**

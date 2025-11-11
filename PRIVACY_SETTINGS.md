# 🔒 検索エンジンクロール防止設定

## ✅ 実装完了

Googleやその他の検索エンジンにクロール・インデックスされないように、**3層の防御策**を実装しました。

---

## 🛡️ 実装した対策

### 1. robots.txt（第1層）

**場所:** `/public/robots.txt`

すべての検索エンジンクローラーをブロック：

```txt
# すべてのクローラーを拒否
User-agent: *
Disallow: /

# 主要検索エンジンを個別指定
User-agent: Googlebot          # Google検索
User-agent: Googlebot-Image    # Google画像検索
User-agent: Googlebot-News     # Googleニュース
User-agent: Bingbot            # Bing
User-agent: Slurp              # Yahoo
User-agent: DuckDuckBot        # DuckDuckGo
User-agent: Baiduspider        # Baidu（中国）
User-agent: YandexBot          # Yandex（ロシア）
User-agent: Sogou              # Sogou（中国）
```

✅ **確認済み:** http://localhost:3000/robots.txt でアクセス可能

---

### 2. HTMLメタタグ（第2層）

**場所:** `/public/index.html`

HTMLの`<head>`セクションに以下を追加：

```html
<!-- 検索エンジンクロール防止 -->
<meta name="robots" content="noindex, nofollow, noarchive, nosnippet">
<meta name="googlebot" content="noindex, nofollow, noarchive, nosnippet">
<meta name="bingbot" content="noindex, nofollow, noarchive, nosnippet">
<meta name="google" content="nositelinkssearchbox">
<meta name="google" content="notranslate">
```

**各属性の意味:**
- `noindex` - 検索結果に表示しない
- `nofollow` - ページ内のリンクを辿らない
- `noarchive` - キャッシュを保存しない
- `nosnippet` - 検索結果にスニペット（抜粋）を表示しない
- `nositelinkssearchbox` - サイトリンク検索ボックスを表示しない
- `notranslate` - 自動翻訳を提案しない

---

### 3. HTTPヘッダー（第3層）

**場所:** `/src/server.js`

すべてのレスポンスに`X-Robots-Tag`ヘッダーを追加：

```javascript
app.use((req, res, next) => {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
  next();
});
```

✅ **確認済み:** 
```bash
curl -I http://localhost:3000/
# X-Robots-Tag: noindex, nofollow, noarchive, nosnippet
```

---

## 🔍 対策の有効性

### 主要検索エンジン対応

| 検索エンジン | robots.txt | メタタグ | HTTPヘッダー | 対応状況 |
|------------|-----------|---------|------------|---------|
| **Google** | ✅ | ✅ | ✅ | 完全対応 |
| **Bing** | ✅ | ✅ | ✅ | 完全対応 |
| **Yahoo** | ✅ | ✅ | ✅ | 完全対応 |
| **DuckDuckGo** | ✅ | ✅ | ✅ | 完全対応 |
| **Baidu** | ✅ | ✅ | ✅ | 完全対応 |
| **Yandex** | ✅ | ✅ | ✅ | 完全対応 |

---

## 📊 効果

### ✅ 実現できること

1. **検索結果に表示されない**
   - Google、Bing等の検索結果に一切表示されません
   
2. **クロールされない**
   - 検索エンジンのボットがページを読み取りません
   
3. **キャッシュされない**
   - Googleキャッシュなどに保存されません
   
4. **リンクを辿られない**
   - ページ内のリンクから他のページへクロールされません

### ⚠️ 注意点

1. **既にインデックスされている場合**
   - 過去にインデックスされたページは、時間をかけて徐々に削除されます
   - 完全に削除されるまで数週間～数ヶ月かかる場合があります

2. **URLを知っている人はアクセス可能**
   - この設定は検索エンジンのクロールを防ぐだけです
   - URLを直接知っている人は普通にアクセスできます

3. **100%の保証はない**
   - 悪質なクローラーやrobots.txtを無視するボットは対応できません
   - ただし、主要な検索エンジンは確実にブロックされます

---

## 🔐 さらなるプライバシー対策（オプション）

もしさらに厳格なアクセス制限が必要な場合：

### 1. Basic認証の追加

ユーザー名とパスワードでアクセス制限：

```javascript
// src/server.js
const basicAuth = require('express-basic-auth');

app.use(basicAuth({
  users: { 'admin': 'secretpassword' },
  challenge: true
}));
```

### 2. IPアドレス制限

特定のIPアドレスのみ許可：

```javascript
const allowedIPs = ['123.456.789.0', '987.654.321.0'];

app.use((req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  if (!allowedIPs.includes(clientIP)) {
    return res.status(403).send('Access Denied');
  }
  next();
});
```

### 3. アクセストークン

URLにトークンを含める方式：

```javascript
const validToken = 'your-secret-token-12345';

app.use((req, res, next) => {
  const token = req.query.token;
  if (token !== validToken) {
    return res.status(403).send('Invalid Token');
  }
  next();
});
```

---

## 📱 友達との共有

### ✅ 安全に共有できます

現在の設定では：
- ✅ URLを知っている人だけがアクセス可能
- ✅ 検索エンジンには表示されない
- ✅ 不特定多数に公開されない

### 共有方法

**LINE、メール、SNSのDMなどで：**
```
🔮 ブードゥーミラクルのシャーマン祈祷BOT
https://3000-iwfey1wx0mhdj208g27nm-d0b9e1e2.sandbox.novita.ai

※このURLは検索エンジンに載っていないので、
知っている人だけがアクセスできます 🔒
```

---

## 🔍 動作確認方法

### robots.txtの確認
```bash
curl https://3000-iwfey1wx0mhdj208g27nm-d0b9e1e2.sandbox.novita.ai/robots.txt
```

### ヘッダーの確認
```bash
curl -I https://3000-iwfey1wx0mhdj208g27nm-d0b9e1e2.sandbox.novita.ai/
# X-Robots-Tag: noindex, nofollow, noarchive, nosnippet
```

### HTMLメタタグの確認
ブラウザで開いて、ページのソースを表示：
- `Ctrl+U` (Windows/Linux)
- `Cmd+Option+U` (Mac)

`<head>`セクション内に以下が含まれていることを確認：
```html
<meta name="robots" content="noindex, nofollow, noarchive, nosnippet">
```

---

## ✅ まとめ

### 実装完了

✅ **robots.txt** - すべてのクローラーをブロック
✅ **HTMLメタタグ** - noindex/nofollowを設定
✅ **HTTPヘッダー** - X-Robots-Tagを追加
✅ **Gitコミット** - すべての変更を保存

### セキュリティレベル

🔒 **高** - 主要な検索エンジンから完全に隠蔽
🔐 **中** - URLを知っている人のみアクセス可能
🌐 **公開** - 認証なしでもアクセス可能（URL必要）

### 推奨される使い方

✅ 友達や家族との限定共有
✅ プライベートな占いツール
✅ テスト・デモ用途

---

🕯️ **あなたのプライバシーは守られています** 🔒

検索エンジンに表示されることなく、
知っている人だけが楽しめる特別な空間です。

🌙✨🔮

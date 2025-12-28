# 🚀 今すぐデプロイする

## ステップ1: Vercelアカウントを作成

1. **Vercelにアクセス**: https://vercel.com
2. **"Start Deploying"**または**"Sign Up"**をクリック
3. **GitHubアカウント**で認証（推奨）

## ステップ2: プロジェクトをインポート

### 方法1: ワンクリックデプロイ（最速）

下のボタンをクリック：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/taichi-tac/auto_comic)

### 方法2: 手動インポート

1. Vercelダッシュボードにログイン
2. **"Add New..."** → **"Project"**をクリック
3. GitHubリポジトリから **"taichi-tac/auto_comic"** を選択
4. **"Import"**をクリック

## ステップ3: プロジェクト設定

### ✅ 自動設定される項目（そのままでOK）

`vercel.json`により自動的に設定されます：

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 環境変数（オプション）

**現在の実装では不要です** - ユーザーがブラウザでAPIキーを入力します

もし共用APIキーを使いたい場合は：
- Key: `VITE_GOOGLE_AI_API_KEY`
- Value: あなたのGoogle AI Studio APIキー

⚠️ **セキュリティ注意**: 共用APIキーを使う場合は、サーバーサイド実装への移行を強く推奨します（`DEPLOYMENT.md`参照）

## ステップ4: デプロイ実行

**"Deploy"**ボタンをクリック

デプロイ中の画面が表示されます：
- ✓ Building...
- ✓ Deploying...
- ✓ Assigning domain...

約1-3分で完了します。

## ステップ5: 公開完了！

デプロイが完了すると、以下のようなURLが発行されます：

```
https://auto-comic-xxxx.vercel.app
```

このURLでアプリが公開されました 🎊

### 確認事項

- [ ] アプリが正しく表示される
- [ ] APIキー入力フォームが動作する
- [ ] 画像生成機能が動作する
- [ ] ダウンロード機能が動作する

## 次のステップ（オプション）

### カスタムドメインの設定

1. Vercelダッシュボードで**"Settings"** → **"Domains"**
2. カスタムドメインを追加（例: comic.example.com）
3. DNSレコードを設定

### 自動デプロイの有効化（既に有効）

GitHubの`main`ブランチに変更をプッシュすると、Vercelが自動的に：
1. 変更を検出
2. ビルドを実行
3. 新バージョンをデプロイ

## トラブルシューティング

### ビルドが失敗する場合

1. Vercelの**"Deployments"**タブでログを確認
2. エラーメッセージをコピー
3. ローカルで確認：
   ```bash
   npm install
   npm run build
   ```

### アプリが表示されない場合

1. ブラウザのキャッシュをクリア（Cmd+Shift+R / Ctrl+Shift+R）
2. Vercelダッシュボードで**"Domains"**タブを確認
3. デプロイステータスが"Ready"になっているか確認

### 404エラーが出る場合

`vercel.json`のrewritesルールを確認：
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## パフォーマンス最適化

### Vercel Analytics（無料）

1. Vercelダッシュボードで**"Analytics"**タブ
2. **"Enable Analytics"**をクリック
3. リアルタイムでアクセス状況を確認

### Speed Insights（無料）

1. **"Speed Insights"**タブ
2. **"Enable Speed Insights"**をクリック
3. ページ読み込み速度を分析

## コスト管理

### Vercel無料プラン

✅ **商用利用可能**
- 100GB 帯域幅/月
- 無制限のデプロイ
- カスタムドメイン
- HTTPS自動設定
- 自動スケーリング

超過した場合のみ有料プランへのアップグレードが必要

### Google AI API

ユーザーが自分のAPIキーを使用するため、**あなたには課金されません**

## サポート

- **Vercel Documentation**: https://vercel.com/docs
- **Vercel Community**: https://github.com/vercel/vercel/discussions
- **このプロジェクトのIssue**: https://github.com/taichi-tac/auto_comic/issues

---

## 📊 デプロイ済みの場合

デプロイURL: `https://auto-comic-xxxx.vercel.app`

### 共有方法

1. **Twitter/X**:
   ```
   AI漫画生成アプリ「オートコミック Pro」を公開しました！
   Nano Banana Pro (Gemini 3 Pro Image) を使用した高品質な漫画生成が可能です。

   🔗 https://auto-comic-xxxx.vercel.app

   #AI #漫画 #NanoBananaPro #Gemini
   ```

2. **README.mdに追加**:
   ```markdown
   ## 🌐 デモ

   https://auto-comic-xxxx.vercel.app
   ```

3. **GitHub Aboutに設定**:
   - GitHubリポジトリページの"About"の歯車アイコンをクリック
   - "Website"にURLを入力

---

✨ おめでとうございます！あなたのAI漫画生成アプリが世界中からアクセス可能になりました！

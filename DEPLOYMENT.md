# Vercelへのデプロイ手順

このドキュメントでは、オートコミック ProをVercelにデプロイする手順を説明します。

## 前提条件

- GitHubアカウント
- Vercelアカウント（無料で作成可能）
- Google AI Studio APIキー

## デプロイ手順

### 1. GitHubリポジトリにプッシュ

```bash
# 変更をコミット
git add .
git commit -m "feat: Vercel deployment setup"

# GitHubにプッシュ
git push origin main
```

### 2. Vercelにサインアップ

1. [Vercel](https://vercel.com)にアクセス
2. "Sign Up"をクリック
3. GitHubアカウントで認証

### 3. プロジェクトをインポート

1. Vercelダッシュボードで"Add New..." → "Project"をクリック
2. GitHubリポジトリ`taichi-tac/auto_comic`を選択
3. "Import"をクリック

### 4. プロジェクト設定

#### Build & Development Settings

すでに`vercel.json`で設定済みのため、デフォルトのままでOKです：

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

#### Environment Variables（重要）

**現在、このアプリはクライアントサイドでGoogle AI Studioのキーを使用しています。**

セキュリティ上の理由から、本番環境では以下の対応を推奨します：

**オプション1: ユーザーにAPIキーを入力してもらう（現在の実装）**
- 環境変数の設定は不要
- ユーザーが自分のAPIキーをUIで入力
- 最もシンプルだが、ユーザーがAPIキーを用意する必要あり

**オプション2: サーバーサイドでAPIキーを管理（推奨）**
- Vercel Functions（サーバーレス関数）を使用
- 環境変数 `VITE_GOOGLE_AI_API_KEY` を設定
- コードの修正が必要（APIコールをサーバーサイドに移行）

現在の実装（オプション1）の場合、環境変数の設定は不要です。

### 5. デプロイ

"Deploy"ボタンをクリックすると、自動的にビルドとデプロイが開始されます。

数分後、以下のようなURLでアプリが公開されます：
```
https://auto-comic-xxxx.vercel.app
```

### 6. カスタムドメインの設定（オプション）

1. Vercelダッシュボードで"Settings" → "Domains"を開く
2. カスタムドメインを追加
3. DNSレコードを設定

## 自動デプロイ

GitHubの`main`ブランチにプッシュすると、Vercelが自動的に：
1. 変更を検出
2. ビルドを実行
3. 新バージョンをデプロイ

## トラブルシューティング

### ビルドエラー

```bash
# ローカルで確認
npm run build

# TypeScriptエラーをチェック
npm run typecheck

# Lintエラーをチェック
npm run lint
```

### 環境変数が反映されない

1. Vercelダッシュボードで"Settings" → "Environment Variables"を確認
2. 変数を追加/変更したら、再デプロイが必要
3. "Deployments" → 最新デプロイの"Redeploy"をクリック

### 404エラー

`vercel.json`のrewritesルールが正しく設定されているか確認してください。

## セキュリティに関する注意

### APIキーの取り扱い

**重要**: 現在の実装では、ユーザーがブラウザでAPIキーを入力します。

本番環境で共用APIキーを使う場合は、**必ずサーバーサイド実装に変更してください**：

1. Vercel Functionsを作成（`/api/generate-image.ts`など）
2. サーバーサイドでGoogle AI APIを呼び出す
3. クライアントは自分のFunctionを呼び出すだけ

詳細は[セキュリティベストプラクティス](#セキュリティベストプラクティス)を参照してください。

## パフォーマンス最適化

### 画像の最適化

生成された画像は大きいため、以下を検討してください：

- 画像の圧縮
- Progressive JPEG
- WebP形式への変換

### コード分割

`vite.config.ts`で既に設定済み：
- React関連ライブラリを別チャンク
- Google AI SDKを別チャンク

### キャッシュ戦略

Vercelは自動的に静的アセットをキャッシュしますが、さらに最適化する場合は：

```javascript
// vercel.json に追加
{
  "headers": [
    {
      "source": "/assets/(.*)",
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

## セキュリティベストプラクティス

### サーバーサイドAPI実装例

```typescript
// /api/generate-image.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  // Vercelの環境変数から取得
  const apiKey = process.env.GOOGLE_AI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-3-pro-image' });

  try {
    const { prompt, aspectRatio, imageSize } = req.body;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      // ... その他のパラメータ
    });

    return res.status(200).json({ imageUrl: result.imageUrl });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
```

## モニタリング

Vercelダッシュボードで以下を確認できます：

- **Analytics**: ページビュー、訪問者数
- **Speed Insights**: ページ読み込み速度
- **Logs**: サーバーログとエラー
- **Usage**: 帯域幅、ビルド時間

## コスト管理

### Vercel無料プラン

- 商用利用可能
- 100GB帯域幅/月
- 無制限のデプロイ
- カスタムドメイン対応

### Google AI API料金

- **1K/2K画像**: $0.134 per image
- **4K画像**: $0.24 per image

**ユーザーに自分のAPIキーを使ってもらう場合、コストはユーザー負担になります。**

## 参考リンク

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Google AI Studio](https://aistudio.google.com/)

---

✨ Powered by [Vercel](https://vercel.com) & [Miyabi](https://github.com/ShunsukeHayashi/Miyabi)

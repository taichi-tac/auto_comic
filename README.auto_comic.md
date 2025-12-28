# オートコミック Pro

Nano Banana Pro API (Gemini 3 Pro Image) を使用したAI漫画生成アプリケーション

## 概要

このアプリは[コミクル3.0 Pro](https://service-3-0-51080207511.us-west1.run.app/)を参考に、Nano Banana Pro APIを使って同様の機能を提供します。

### 🔐 認証システム

**Google認証とユーザー承認機能を実装済み**：
- Googleアカウントでログイン
- 新規ユーザーは管理者の承認待ち
- 管理者ページでユーザー承認/拒否
- 承認されたユーザーのみアプリを利用可能

詳細は [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) を参照してください。

## 主な機能

### シンプルモード
- 🎨 **AI画像生成**: Nano Banana Pro (Gemini 3 Pro Image) を使用した高品質な画像生成
- 🖼️ **複数アスペクト比対応**: 1:1、16:9、4:3のアスペクト比を選択可能
- 📐 **画像サイズ選択**: 1K、2K、4Kの解像度から選択
- 🌙 **ダークモードUI**: 目に優しいダークテーマ
- 💾 **画像ダウンロード**: 生成した画像を簡単にダウンロード

### プロモード（コミクル3.0互換）
- 👤 **キャラクターライブラリ**: キャラクター画像を登録して一貫性を保持
- 📐 **コマ割りテンプレート**: 10種類までのテンプレート管理（最大30枚）
- 📊 **CSV一括生成**: CSVファイルから複数ページを一括生成
- ✏️ **マニュアル生成**: 1ページずつ個別に生成
- 📦 **ZIP一括ダウンロード**: 生成した画像をZIPで一括ダウンロード
- 📈 **進捗表示**: リアルタイムで生成状況を確認
- 🔄 **リトライ機能**: 503エラー時の自動リトライ

## 技術スタック

- **React 19.2.0**: UIライブラリ
- **TypeScript**: 型安全な開発
- **Vite**: 高速なビルドツール
- **Electron**: デスクトップアプリ化
- **Google Generative AI SDK**: Nano Banana Pro API統合
- **Miyabi Framework**: 自律型開発フレームワーク

## 配布形式

このアプリは2つの方法で利用できます：

### 🌐 Webアプリ版
ブラウザで動作する通常のWebアプリケーション

### 💻 デスクトップアプリ版
Electronでパッケージ化されたスタンドアロンアプリ
- **Mac**: DMG/ZIPファイル
- **Windows**: インストーラー/ポータブル版
- **Linux**: AppImage/DEBパッケージ

詳細は [README.electron.md](./README.electron.md) を参照してください。

## セットアップ

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. APIキーの取得

1. [Google AI Studio](https://aistudio.google.com/apikey) にアクセス
2. APIキーを作成（**注意**: Nano Banana Proは有料プランが必要です）
3. 課金設定を有効化

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

## 使い方

### シンプルモード
1. **APIキーを入力**: Google AI Studioから取得したAPIキーを入力
2. **プロンプトを入力**: 生成したい画像の説明を入力
3. **オプション設定**: アスペクト比、画像サイズを選択
4. **生成**: 「🎨 コミック画像を生成」ボタンをクリック

### プロモード
1. **APIキーを入力**: Google AI Studioから取得したAPIキーを入力
2. **キャラクター画像をアップロード**:
   - 推奨サイズ: 896×1200px
   - ファイル名: カタカナまたは漢字（例: サトル.png、優奈.jpg）
   - 複数のキャラクターを登録可能
3. **コマ割りテンプレートをアップロード**:
   - 推奨サイズ: 896×1200px
   - テンプレート名を指定（例: テンプレ1、テンプレ2）
   - 最大30枚まで登録可能
4. **生成モードを選択**:
   - **CSV一括生成**: CSVファイルから複数ページを自動生成
   - **マニュアル生成**: 1ページずつ手動で生成
5. **CSV一括生成の場合**:
   ```csv
   ページ番号,使用するコマ割りテンプレ,漫画作成のプロンプト
   1,テンプレ1,◆【絶対最優先】キャラクター外見: サトルは添付のサトル.png...
   2,テンプレ2,◆【絶対最優先】キャラクター外見: ...
   ```
6. **バッチ生成開始**: 「🚀 バッチ生成開始」ボタンをクリック
7. **進捗確認**: 生成状況をリアルタイムで確認
8. **一括ダウンロード**: 「📦 ZIP一括ダウンロード」で全画像をダウンロード

## 料金について

Nano Banana Pro APIの料金:
- **1K/2K画像**: $0.134 per image
- **4K画像**: $0.24 per image
- **Batch API**: 50%割引（最大24時間待機）

詳細は[公式ドキュメント](https://dev.to/googleai/introducing-nano-banana-pro-complete-developer-tutorial-5fc8)を参照してください。

## プロジェクト構造

```
auto_comic/
├── src/
│   ├── components/
│   │   ├── ComicGenerator.tsx     # メインのコミック生成コンポーネント
│   │   └── ComicGenerator.css     # スタイル
│   ├── services/
│   │   └── nanoBananaApi.ts       # Nano Banana Pro API統合
│   ├── App.tsx                    # アプリケーションルート
│   ├── App.css                    # アプリケーションスタイル
│   ├── main.tsx                   # エントリーポイント
│   └── index.css                  # グローバルスタイル
├── index.html                     # HTMLテンプレート
├── vite.config.ts                 # Vite設定
└── package.json                   # パッケージ設定
```

## スクリプト

### Webアプリ開発
```bash
npm run dev        # 開発サーバー起動（ポート5173）
npm run build      # プロダクションビルド
npm run preview    # ビルド結果のプレビュー
npm run typecheck  # TypeScript型チェック
npm run lint       # ESLintでコードチェック
npm test           # テスト実行
```

### Electronアプリ
```bash
npm run electron:dev           # Electronアプリを開発モードで起動
npm run electron:build         # すべてのプラットフォーム向けにビルド
npm run electron:build:mac     # Mac向けにビルド
npm run electron:build:win     # Windows向けにビルド
npm run electron:build:linux   # Linux向けにビルド
```

詳細は [README.electron.md](./README.electron.md) を参照してください。

## Miyabi Framework

このプロジェクトは[Miyabi](https://github.com/ShunsukeHayashi/Miyabi)フレームワークで管理されています。

### 自律型AI開発

```bash
# プロジェクト状態の確認
npx miyabi status

# リアルタイム監視
npx miyabi status --watch

# 新しいIssueを作成
gh issue create --title "機能追加" --body "説明"
```

AIエージェントが自動的にIssueを分析し、実装し、PRを作成します。

## 参考

- **元アプリ**: [コミクル3.0 Pro](https://service-3-0-51080207511.us-west1.run.app/)
- **Nano Banana Pro**: [公式チュートリアル](https://dev.to/googleai/introducing-nano-banana-pro-complete-developer-tutorial-5fc8)
- **Google AI Studio**: [https://aistudio.google.com](https://aistudio.google.com)

## ライセンス

MIT

---

✨ Powered by [Miyabi](https://github.com/ShunsukeHayashi/Miyabi) & Nano Banana Pro (Gemini 3 Pro Image)

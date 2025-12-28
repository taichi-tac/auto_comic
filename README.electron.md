# オートコミック Pro - デスクトップアプリ配布ガイド

このドキュメントでは、オートコミック ProをElectronデスクトップアプリとしてビルド・配布する方法を説明します。

## 📦 ビルド済みアプリの配布

### 現在利用可能なビルド

`release/` ディレクトリに以下のファイルが生成されています：

#### Mac用
- **DMGファイル**: `オートコミック Pro-0.1.0-arm64.dmg` (約107MB)
  - ダブルクリックして開き、アプリをApplicationsフォルダにドラッグ&ドロップ
  - M1/M2/M3 Mac向け（Apple Silicon）

- **ZIPファイル**: `オートコミック Pro-0.1.0-arm64-mac.zip` (約104MB)
  - 解凍して.appファイルを取り出し、Applicationsフォルダに移動

### 他のユーザーへの配布方法

1. **ファイル共有**
   - `release/`ディレクトリ内のDMGまたはZIPファイルを送付
   - Google Drive、Dropbox、OneDriveなどで共有

2. **インストール方法を伝える**
   - DMG: ダブルクリックしてApplicationsにドラッグ
   - ZIP: 解凍してApplicationsに移動

3. **初回起動時の注意**
   - macOSの「開発元を確認できません」警告が表示される場合：
     1. アプリを右クリック（またはControl+クリック）
     2. 「開く」を選択
     3. 「開く」ボタンをクリック
   - これにより署名されていないアプリでも起動できます

## 🛠️ 他のプラットフォーム向けにビルドする

### Windows用ビルド

Windows向けのインストーラーとポータブル版を作成：

```bash
npm run electron:build:win
```

生成されるファイル：
- `オートコミック Pro Setup 0.1.0.exe` - インストーラー（推奨）
- `オートコミック Pro 0.1.0.exe` - ポータブル版（インストール不要）

**注意**: WindowsアプリをMacでビルドする場合、Wineが必要です。
または、Windows PCでビルドすることを推奨します。

### Linux用ビルド

Linux向けのAppImageとDEBパッケージを作成：

```bash
npm run electron:build:linux
```

生成されるファイル：
- `オートコミック Pro-0.1.0.AppImage` - 汎用的なAppImage（推奨）
- `オートコミック-pro_0.1.0_amd64.deb` - Debian/Ubuntu用パッケージ

### 全プラットフォーム一括ビルド

```bash
npm run electron:build
```

## 🚀 開発・テスト

### 開発モードで起動

Electronアプリを開発モードで起動（ホットリロード対応）：

```bash
npm run electron:dev
```

- 自動的にVite開発サーバーが起動
- Electronウィンドウが開き、アプリが表示されます
- コードを変更すると自動的にリロードされます
- 開発者ツールが自動的に開きます

### 通常のWebアプリとして起動

```bash
npm run dev
```

ブラウザで http://localhost:5173 を開きます。

## 📝 ビルド設定のカスタマイズ

### アプリ情報の変更

`package.json`の`build`セクションで設定を変更できます：

```json
"build": {
  "appId": "com.autocomic.app",           // アプリID
  "productName": "オートコミック Pro",      // アプリ名
  "directories": {
    "output": "release"                    // 出力ディレクトリ
  }
}
```

### アイコンの追加

アプリアイコンを追加する場合：

1. `build/`ディレクトリに以下のファイルを配置：
   - `icon.icns` - Mac用（512x512px以上）
   - `icon.ico` - Windows用（256x256px以上）
   - `icon.png` - Linux用（512x512px以上）

2. アイコン生成ツールを使用：
   - [electron-icon-builder](https://www.npmjs.com/package/electron-icon-builder)
   - [electron-icon-maker](https://www.npmjs.com/package/electron-icon-maker)

### コード署名（オプション）

#### Mac

開発者証明書を取得し、以下を`package.json`に追加：

```json
"build": {
  "mac": {
    "identity": "Developer ID Application: Your Name (XXXXXXXXXX)"
  }
}
```

#### Windows

証明書ファイルを取得し、以下を追加：

```json
"build": {
  "win": {
    "certificateFile": "path/to/certificate.pfx",
    "certificatePassword": "password"
  }
}
```

## 🔒 セキュリティに関する注意

1. **APIキーの保護**
   - ユーザーがアプリ内でAPIキーを入力する仕様のため安全
   - APIキーはソースコードに含めないでください

2. **自動更新機能（今後追加予定）**
   - electron-updaterを使用して自動更新を実装可能
   - サーバーまたはGitHub Releasesでアップデートを配信

## 📋 配布チェックリスト

アプリを配布する前に：

- [ ] すべての機能が正常に動作することを確認
- [ ] 各プラットフォームでビルドとインストールをテスト
- [ ] README.mdを更新してインストール方法を記載
- [ ] ライセンスファイルを含める
- [ ] バージョン番号を更新（package.json）
- [ ] アイコンを追加（オプション）
- [ ] コード署名を検討（オプション）

## 🆘 トラブルシューティング

### ビルドエラーが発生する

1. 依存関係を再インストール：
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. ビルドディレクトリをクリーンアップ：
   ```bash
   rm -rf dist release
   ```

### アプリが起動しない

1. 開発モードで動作確認：
   ```bash
   npm run electron:dev
   ```

2. コンソールログを確認してエラーメッセージを確認

### 「開発元を確認できません」エラー（Mac）

- 右クリック→「開く」で初回起動
- または、システム環境設定→セキュリティとプライバシー→「このまま開く」

### Windows Defenderが警告を出す（Windows）

- コード署名がない場合は警告が表示されます
- 「詳細情報」→「実行」で起動可能
- 本番環境では証明書による署名を推奨

## 📚 参考リンク

- [Electron公式ドキュメント](https://www.electronjs.org/docs)
- [electron-builder](https://www.electron.build/)
- [Vite + Electron](https://github.com/electron-vite/electron-vite-vue)

---

✨ Powered by Electron & Vite

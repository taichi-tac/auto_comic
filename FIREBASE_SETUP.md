# Firebase セットアップガイド

このガイドでは、オートコミック ProでGoogle認証とユーザー承認システムを有効化するためのFirebase設定手順を説明します。

## 📋 概要

実装される機能：
- ✅ Googleアカウントでログイン
- ✅ 新規ユーザーは自動的に「承認待ち」状態
- ✅ 管理者がユーザーを承認/拒否
- ✅ 承認されたユーザーのみアプリを利用可能
- ✅ 管理者ダッシュボードでユーザー管理

---

## 🚀 セットアップ手順

### ステップ1: Firebaseプロジェクトの作成

1. **Firebase Consoleにアクセス**
   - https://console.firebase.google.com/

2. **新しいプロジェクトを作成**
   - 「プロジェクトを追加」をクリック
   - プロジェクト名: `auto-comic`（任意の名前でOK）
   - Google Analyticsは任意（不要なら無効化）
   - 「プロジェクトを作成」をクリック

### ステップ2: Webアプリの追加

1. **プロジェクト概要画面**で、Webアイコン（`</>`）をクリック

2. **アプリの登録**
   - アプリのニックネーム: `auto-comic-web`
   - Firebase Hostingは不要（チェックなし）
   - 「アプリを登録」をクリック

3. **Firebase SDK設定をコピー**

   表示される設定をメモします：
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
     authDomain: "your-project-id.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project-id.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:xxxxxxxxxxxxx"
   };
   ```

4. 「コンソールに進む」をクリック

### ステップ3: Authenticationの設定

1. **左メニュー**から「Authentication」を選択

2. 「始める」をクリック

3. **Sign-in method**タブで「Google」を選択

4. **有効化**
   - ステータスを「有効」に切り替え
   - プロジェクトのサポートメール: あなたのメールアドレスを選択
   - 「保存」をクリック

### ステップ4: Cloud Firestoreの設定

1. **左メニュー**から「Firestore Database」を選択

2. 「データベースの作成」をクリック

3. **ロケーション選択**
   - 本番環境モードで開始（推奨）
   - ロケーション: `asia-northeast1`（東京）または `asia-northeast2`（大阪）
   - 「有効にする」をクリック

4. **セキュリティルールの設定**

   「ルール」タブを開き、以下のルールに置き換えます：

   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // ユーザーコレクション
       match /users/{userId} {
         // 自分のデータは読み取り可能
         allow read: if request.auth != null && request.auth.uid == userId;

         // 新規ユーザー作成は認証済みユーザーのみ
         allow create: if request.auth != null
                       && request.auth.uid == userId
                       && request.resource.data.status == 'pending';

         // 管理者のみ他のユーザーを読み取り・更新可能
         allow read, update: if request.auth != null
                             && request.auth.token.email in [
                               'admin@example.com',  // ここに管理者のメールアドレスを設定
                               'admin2@example.com'
                             ];
       }
     }
   }
   ```

   **重要**: `admin@example.com` を実際の管理者メールアドレスに置き換えてください。

5. 「公開」をクリック

### ステップ5: 環境変数の設定

#### ローカル開発の場合

1. プロジェクトルートで`.env`ファイルを作成：
   ```bash
   cp .env.example .env
   ```

2. `.env`ファイルを編集し、Firebase設定を追加：
   ```bash
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
   VITE_FIREBASE_APP_ID=1:123456789012:web:xxxxxxxxxxxxx

   # Admin Email Addresses (comma-separated)
   VITE_ADMIN_EMAILS=your-email@gmail.com,admin2@example.com
   ```

3. 開発サーバーを起動：
   ```bash
   npm run dev
   ```

#### Vercelデプロイの場合

1. **Vercelダッシュボード**を開く

2. プロジェクト **"auto-comic"** を選択

3. **Settings** → **Environment Variables**

4. 以下の環境変数を追加：

   | Name | Value |
   |------|-------|
   | `VITE_FIREBASE_API_KEY` | AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX |
   | `VITE_FIREBASE_AUTH_DOMAIN` | your-project-id.firebaseapp.com |
   | `VITE_FIREBASE_PROJECT_ID` | your-project-id |
   | `VITE_FIREBASE_STORAGE_BUCKET` | your-project-id.appspot.com |
   | `VITE_FIREBASE_MESSAGING_SENDER_ID` | 123456789012 |
   | `VITE_FIREBASE_APP_ID` | 1:123456789012:web:xxxxxxxxxxxxx |
   | `VITE_ADMIN_EMAILS` | your-email@gmail.com,admin2@example.com |

5. **すべての環境**（Production, Preview, Development）にチェック

6. 「Save」をクリック

7. **Deployments**タブで最新デプロイを**Redeploy**

---

## 📱 使い方

### 一般ユーザー

1. **ログイン**
   - アプリにアクセス
   - 「Googleでログイン」をクリック
   - Googleアカウントを選択

2. **承認待ち**
   - 初回ログイン時は自動的に「承認待ち」状態
   - 管理者による承認をお待ちください

3. **承認後**
   - 管理者が承認すると、アプリの全機能が利用可能になります

### 管理者

1. **ログイン**
   - 管理者メールアドレスでログイン

2. **管理者ダッシュボードへアクセス**
   - ヘッダーの「管理者ページ」ボタンをクリック
   - または `/admin` にアクセス

3. **ユーザーを承認/拒否**
   - 承認待ちユーザー一覧が表示されます
   - 「承認」または「拒否」ボタンをクリック

4. **フィルター機能**
   - すべて / 承認待ち / 承認済み / 拒否済み で絞り込み可能

---

## 🔒 セキュリティ設定

### Firestore セキュリティルールの更新

管理者メールアドレスを変更する場合：

1. **Firebase Console** → **Firestore Database** → **ルール**

2. ルール内の管理者メールアドレスを更新：
   ```javascript
   allow read, update: if request.auth != null
                       && request.auth.token.email in [
                         'new-admin@example.com',  // 新しい管理者メール
                         'another-admin@example.com'
                       ];
   ```

3. 「公開」をクリック

### Firebase Authenticationの承認済みドメイン

本番環境のドメインを追加：

1. **Firebase Console** → **Authentication** → **Settings** → **Authorized domains**

2. 「ドメインを追加」をクリック

3. Vercelのドメインを追加：
   - `auto-comic-xxxx.vercel.app`
   - カスタムドメイン（設定している場合）

---

## 📊 データベース構造

### `users` コレクション

各ドキュメントはユーザーIDをキーとし、以下のフィールドを持ちます：

```typescript
{
  email: string,
  displayName: string | null,
  photoURL: string | null,
  status: 'pending' | 'approved' | 'rejected',
  createdAt: Timestamp,
  approvedAt?: Timestamp,
  approvedBy?: string,
  rejectedAt?: Timestamp,
  rejectedBy?: string
}
```

---

## 🛠️ トラブルシューティング

### ログインエラー

**症状**: 「Firebase: Error (auth/unauthorized-domain)」

**解決方法**:
1. Firebase Console → Authentication → Settings → Authorized domains
2. 現在のドメインを追加

### 管理者ページにアクセスできない

**確認事項**:
1. 環境変数 `VITE_ADMIN_EMAILS` が正しく設定されているか
2. ログインしているメールアドレスが管理者リストに含まれているか
3. Vercelでデプロイ後、環境変数を変更した場合は再デプロイが必要

### ユーザーデータが表示されない

**確認事項**:
1. Firestore Databaseが有効化されているか
2. セキュリティルールが正しく設定されているか
3. ブラウザのコンソールでエラーを確認

### ビルドエラー

**症状**: 「Firebase configuration is missing」

**解決方法**:
1. すべての環境変数が設定されているか確認
2. `VITE_` プレフィックスが付いているか確認
3. Vercelの場合、環境変数保存後に再デプロイ

---

## 💰 料金

### Firebase 無料プラン（Spark）

以下の範囲内であれば**完全無料**：

- **Authentication**: 無制限
- **Firestore**:
  - 保存容量: 1 GB
  - 読み取り: 50,000 / day
  - 書き込み: 20,000 / day
  - 削除: 20,000 / day

小規模～中規模のサービスであれば無料プランで十分です。

---

## 📚 参考リンク

- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Authentication ドキュメント](https://firebase.google.com/docs/auth)
- [Cloud Firestore ドキュメント](https://firebase.google.com/docs/firestore)
- [Firebase セキュリティルール](https://firebase.google.com/docs/firestore/security/get-started)

---

✨ これでGoogle認証とユーザー承認システムが完全に動作します！

const { app, BrowserWindow, protocol } = require('electron');
const path = require('path');
const fs = require('fs');

// 開発モードかどうかを判定
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
    },
    icon: path.join(__dirname, '../build/icon.png'),
  });

  // 開発モードの場合はViteの開発サーバーに接続
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    // プロダクションモードの場合はビルドされたファイルを読み込む
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// アプリの準備ができたらウィンドウを作成
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// すべてのウィンドウが閉じられたらアプリを終了（macOS以外）
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// セキュリティ: 外部サイトへのナビゲーションを防止
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);

    // ローカルホスト以外へのナビゲーションを防止
    if (parsedUrl.origin !== 'http://localhost:3000' &&
        parsedUrl.protocol !== 'file:') {
      event.preventDefault();
    }
  });
});

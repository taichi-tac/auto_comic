import React, { useState } from 'react';
import ComicGenerator from './components/ComicGenerator';
import AdvancedComicGenerator from './components/AdvancedComicGenerator';
import './App.css';

function App() {
  const [mode, setMode] = useState<'basic' | 'advanced'>('advanced');

  return (
    <div className="app">
      <header className="app-header">
        <h1>オートコミック Pro</h1>
        <p className="subtitle">Nano Banana Pro AI搭載コミック生成ツール</p>

        <div className="mode-switcher">
          <button
            className={mode === 'basic' ? 'active' : ''}
            onClick={() => setMode('basic')}
          >
            シンプルモード
          </button>
          <button
            className={mode === 'advanced' ? 'active' : ''}
            onClick={() => setMode('advanced')}
          >
            プロモード
          </button>
        </div>
      </header>

      <main className="app-main">
        {mode === 'basic' ? <ComicGenerator /> : <AdvancedComicGenerator />}
      </main>

      <footer className="app-footer">
        <p>Powered by Nano Banana Pro (Gemini 3 Pro Image) & Miyabi Framework</p>
      </footer>
    </div>
  );
}

export default App;

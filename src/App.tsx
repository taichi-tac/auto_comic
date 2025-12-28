import React, { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import PendingApproval from './components/PendingApproval';
import AdminPage from './components/AdminPage';
import ComicGenerator from './components/ComicGenerator';
import AdvancedComicGenerator from './components/AdvancedComicGenerator';
import './App.css';

function App() {
  const { user, loading, isAdmin, signOut } = useAuth();
  const [mode, setMode] = useState<'basic' | 'advanced'>('advanced');

  // 読み込み中
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0f1a',
        color: '#94a3b8',
      }}>
        <div>読み込み中...</div>
      </div>
    );
  }

  // 未ログイン
  if (!user) {
    return <Login />;
  }

  // 管理者ページ
  if (isAdmin && window.location.pathname === '/admin') {
    return <AdminPage />;
  }

  // 承認待ち
  if (user.status === 'pending') {
    return <PendingApproval />;
  }

  // 拒否済み
  if (user.status === 'rejected') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)',
        padding: '2rem',
      }}>
        <div style={{
          background: '#0f172a',
          borderRadius: '1rem',
          padding: '3rem',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❌</div>
          <h1 style={{ fontSize: '1.5rem', color: '#f1f5f9', marginBottom: '1rem' }}>
            アクセスが拒否されました
          </h1>
          <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
            このサービスへのアクセスは許可されていません。
          </p>
          <button
            onClick={signOut}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#374151',
              color: '#9ca3af',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600',
            }}
          >
            ログアウト
          </button>
        </div>
      </div>
    );
  }

  // 承認済み - アプリ利用可能
  return (
    <div className="app">
      <header className="app-header">
        <h1>オートコミック Pro</h1>
        <p className="subtitle">Nano Banana Pro AI搭載コミック生成ツール</p>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginTop: '1rem',
        }}>
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

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {isAdmin && (
              <a
                href="/admin"
                style={{
                  padding: '0.5rem 1rem',
                  background: '#3b82f6',
                  color: '#fff',
                  textDecoration: 'none',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                }}
              >
                管理者ページ
              </a>
            )}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.5rem 1rem',
              background: '#1e293b',
              borderRadius: '0.5rem',
            }}>
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                  }}
                />
              )}
              <span style={{ color: '#e2e8f0', fontSize: '0.875rem' }}>
                {user.displayName || user.email}
              </span>
              <button
                onClick={signOut}
                style={{
                  padding: '0.25rem 0.75rem',
                  background: '#374151',
                  color: '#9ca3af',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                }}
              >
                ログアウト
              </button>
            </div>
          </div>
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

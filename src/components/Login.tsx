import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'ログインに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 100%)',
      padding: '2rem',
    }}>
      <div style={{
        background: '#0f172a',
        borderRadius: '1rem',
        padding: '3rem',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem',
          background: 'linear-gradient(to right, #60a5fa, #a78bfa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          オートコミック Pro
        </h1>

        <p style={{
          color: '#94a3b8',
          marginBottom: '2rem',
          fontSize: '0.875rem',
        }}>
          AI漫画生成サービス
        </p>

        <div style={{
          marginBottom: '2rem',
          padding: '1.5rem',
          background: '#1e293b',
          borderRadius: '0.5rem',
          border: '1px solid #334155',
        }}>
          <p style={{
            color: '#e2e8f0',
            fontSize: '0.875rem',
            lineHeight: '1.5',
          }}>
            Googleアカウントでログイン後、管理者の承認をお待ちください。
          </p>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.875rem 1.5rem',
            background: loading ? '#374151' : '#fff',
            color: loading ? '#9ca3af' : '#000',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            transition: 'all 0.2s',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z"/>
            <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z"/>
            <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z"/>
            <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.3z"/>
          </svg>
          {loading ? 'ログイン中...' : 'Googleでログイン'}
        </button>

        {error && (
          <div style={{
            marginTop: '1rem',
            padding: '0.75rem',
            background: '#7f1d1d',
            borderRadius: '0.375rem',
            color: '#fecaca',
            fontSize: '0.875rem',
          }}>
            {error}
          </div>
        )}

        <p style={{
          marginTop: '2rem',
          fontSize: '0.75rem',
          color: '#64748b',
          lineHeight: '1.5',
        }}>
          ログインすることで、利用規約とプライバシーポリシーに同意したものとみなされます。
        </p>
      </div>
    </div>
  );
}

export default Login;

import React from 'react';
import { useAuth } from '../contexts/AuthContext';

function PendingApproval() {
  const { user, signOut } = useAuth();

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
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
      }}>
        <div style={{
          fontSize: '4rem',
          marginBottom: '1rem',
        }}>
          ⏳
        </div>

        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          color: '#f1f5f9',
        }}>
          承認待ちです
        </h1>

        <p style={{
          color: '#94a3b8',
          marginBottom: '2rem',
          lineHeight: '1.6',
        }}>
          管理者による承認をお待ちください。<br />
          承認されると、サービスをご利用いただけます。
        </p>

        <div style={{
          background: '#1e293b',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          marginBottom: '2rem',
          border: '1px solid #334155',
          textAlign: 'left',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1rem',
          }}>
            {user?.photoURL && (
              <img
                src={user.photoURL}
                alt={user.displayName || 'User'}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                }}
              />
            )}
            <div>
              <div style={{
                color: '#f1f5f9',
                fontWeight: '600',
                marginBottom: '0.25rem',
              }}>
                {user?.displayName || '名前なし'}
              </div>
              <div style={{
                color: '#64748b',
                fontSize: '0.875rem',
              }}>
                {user?.email}
              </div>
            </div>
          </div>

          <div style={{
            fontSize: '0.875rem',
            color: '#94a3b8',
          }}>
            登録日時: {user?.createdAt?.toLocaleString('ja-JP')}
          </div>
        </div>

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
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#4b5563';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#374151';
          }}
        >
          ログアウト
        </button>

        <p style={{
          marginTop: '2rem',
          fontSize: '0.75rem',
          color: '#64748b',
          lineHeight: '1.5',
        }}>
          承認に関するお問い合わせは、管理者までご連絡ください。
        </p>
      </div>
    </div>
  );
}

export default PendingApproval;

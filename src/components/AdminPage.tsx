import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAllUsers, approveUser, rejectUser, resetUserToPending, approveRejectedUser } from '../services/userService';
import { User } from '../types/user';

function AdminPage() {
  const { user: currentUser, signOut } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    } catch (err: any) {
      setError(err.message || 'ユーザーの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (uid: string) => {
    if (!currentUser?.email) return;

    try {
      await approveUser(uid, currentUser.email);
      await loadUsers();
    } catch (err: any) {
      setError(err.message || '承認に失敗しました');
    }
  };

  const handleReject = async (uid: string) => {
    if (!currentUser?.email) return;

    if (!confirm('本当にこのユーザーを拒否しますか？')) {
      return;
    }

    try {
      await rejectUser(uid, currentUser.email);
      await loadUsers();
    } catch (err: any) {
      setError(err.message || '拒否に失敗しました');
    }
  };

  const handleResetToPending = async (uid: string) => {
    if (!currentUser?.email) return;

    if (!confirm('このユーザーを承認待ちに戻しますか？')) {
      return;
    }

    try {
      await resetUserToPending(uid);
      await loadUsers();
    } catch (err: any) {
      setError(err.message || '承認待ちへの変更に失敗しました');
    }
  };

  const handleApproveRejected = async (uid: string) => {
    if (!currentUser?.email) return;

    if (!confirm('拒否済みユーザーを承認しますか？')) {
      return;
    }

    try {
      await approveRejectedUser(uid, currentUser.email);
      await loadUsers();
    } catch (err: any) {
      setError(err.message || '承認に失敗しました');
    }
  };

  const filteredUsers = users.filter(user => {
    if (filter === 'all') return true;
    return user.status === filter;
  });

  const pendingCount = users.filter(u => u.status === 'pending').length;
  const approvedCount = users.filter(u => u.status === 'approved').length;
  const rejectedCount = users.filter(u => u.status === 'rejected').length;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0f1a',
      padding: '2rem',
    }}>
      {/* ヘッダー */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            background: 'linear-gradient(to right, #60a5fa, #a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.5rem',
          }}>
            管理者ダッシュボード
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            ユーザー承認管理
          </p>
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
          }}
        >
          ログアウト
        </button>
      </div>

      {/* 統計カード */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto 2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
      }}>
        <div style={{
          background: '#1e293b',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          border: '1px solid #334155',
        }}>
          <div style={{ color: '#60a5fa', fontSize: '2rem', fontWeight: 'bold' }}>
            {users.length}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            総ユーザー数
          </div>
        </div>

        <div style={{
          background: '#1e293b',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          border: '1px solid #334155',
        }}>
          <div style={{ color: '#fbbf24', fontSize: '2rem', fontWeight: 'bold' }}>
            {pendingCount}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            承認待ち
          </div>
        </div>

        <div style={{
          background: '#1e293b',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          border: '1px solid #334155',
        }}>
          <div style={{ color: '#10b981', fontSize: '2rem', fontWeight: 'bold' }}>
            {approvedCount}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            承認済み
          </div>
        </div>

        <div style={{
          background: '#1e293b',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          border: '1px solid #334155',
        }}>
          <div style={{ color: '#ef4444', fontSize: '2rem', fontWeight: 'bold' }}>
            {rejectedCount}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            拒否済み
          </div>
        </div>
      </div>

      {/* フィルター */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto 1.5rem',
        display: 'flex',
        gap: '0.5rem',
      }}>
        {(['all', 'pending', 'approved', 'rejected'] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            style={{
              padding: '0.5rem 1rem',
              background: filter === status ? '#3b82f6' : '#1e293b',
              color: filter === status ? '#fff' : '#94a3b8',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600',
            }}
          >
            {status === 'all' && 'すべて'}
            {status === 'pending' && '承認待ち'}
            {status === 'approved' && '承認済み'}
            {status === 'rejected' && '拒否済み'}
          </button>
        ))}
      </div>

      {/* エラー表示 */}
      {error && (
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto 1.5rem',
          padding: '1rem',
          background: '#7f1d1d',
          borderRadius: '0.5rem',
          color: '#fecaca',
        }}>
          {error}
        </div>
      )}

      {/* ユーザーリスト */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: '#1e293b',
        borderRadius: '0.5rem',
        overflow: 'hidden',
        border: '1px solid #334155',
      }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
            読み込み中...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
            ユーザーが見つかりません
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#0f172a', borderBottom: '1px solid #334155' }}>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#94a3b8', fontSize: '0.875rem', fontWeight: '600' }}>
                  ユーザー
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#94a3b8', fontSize: '0.875rem', fontWeight: '600' }}>
                  ステータス
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#94a3b8', fontSize: '0.875rem', fontWeight: '600' }}>
                  登録日時
                </th>
                <th style={{ padding: '1rem', textAlign: 'right', color: '#94a3b8', fontSize: '0.875rem', fontWeight: '600' }}>
                  アクション
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr
                  key={user.uid}
                  style={{
                    borderBottom: index < filteredUsers.length - 1 ? '1px solid #334155' : 'none',
                  }}
                >
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      {user.photoURL && (
                        <img
                          src={user.photoURL}
                          alt={user.displayName || 'User'}
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                          }}
                        />
                      )}
                      <div>
                        <div style={{ color: '#f1f5f9', fontWeight: '600', marginBottom: '0.25rem' }}>
                          {user.displayName || '名前なし'}
                        </div>
                        <div style={{ color: '#64748b', fontSize: '0.875rem' }}>
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      background: user.status === 'approved' ? '#064e3b' :
                                  user.status === 'pending' ? '#78350f' :
                                  '#7f1d1d',
                      color: user.status === 'approved' ? '#6ee7b7' :
                             user.status === 'pending' ? '#fcd34d' :
                             '#fecaca',
                    }}>
                      {user.status === 'approved' && '✓ 承認済み'}
                      {user.status === 'pending' && '⏳ 承認待ち'}
                      {user.status === 'rejected' && '✗ 拒否済み'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.875rem' }}>
                    {user.createdAt.toLocaleString('ja-JP')}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    {user.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleApprove(user.uid)}
                          style={{
                            padding: '0.5rem 1rem',
                            background: '#059669',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                          }}
                        >
                          承認
                        </button>
                        <button
                          onClick={() => handleReject(user.uid)}
                          style={{
                            padding: '0.5rem 1rem',
                            background: '#dc2626',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                          }}
                        >
                          拒否
                        </button>
                      </div>
                    )}
                    {user.status === 'approved' && user.approvedBy && (
                      <div style={{ color: '#64748b', fontSize: '0.75rem' }}>
                        承認者: {user.approvedBy}
                      </div>
                    )}
                    {user.status === 'rejected' && (
                      <div>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                          <button
                            onClick={() => handleApproveRejected(user.uid)}
                            style={{
                              padding: '0.5rem 1rem',
                              background: '#059669',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '0.375rem',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                              fontWeight: '600',
                            }}
                          >
                            承認
                          </button>
                          <button
                            onClick={() => handleResetToPending(user.uid)}
                            style={{
                              padding: '0.5rem 1rem',
                              background: '#f59e0b',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '0.375rem',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                              fontWeight: '600',
                            }}
                          >
                            承認待ちに戻す
                          </button>
                        </div>
                        {user.rejectedBy && (
                          <div style={{ color: '#64748b', fontSize: '0.75rem' }}>
                            拒否者: {user.rejectedBy}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminPage;

'use client';
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';

export default function AnalyticsPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/analytics');
        const data = await res.json();
        if (data.success) setStats(data.stats);
      } catch (e) {
        console.error('Failed to load analytics', e);
      }
    }
    loadStats();
  }, []);

  const downloadCSV = () => {
    if (!stats) return;

    const avgPostsPerUser = stats.totalUsers > 0 ? (stats.totalPosts / stats.totalUsers).toFixed(1) : 0;
    const avgLikesPerPost = stats.totalPosts > 0 ? (stats.totalLikes / stats.totalPosts).toFixed(1) : 0;
    const avgCommentsPerPost = stats.totalPosts > 0 ? (stats.totalComments / stats.totalPosts).toFixed(1) : 0;

    const rows = [
      ['JayConnect Analytics Report'],
      ['Generated', new Date().toLocaleString()],
      [],
      ['--- Platform Summary ---'],
      ['Metric', 'Value'],
      ['Total Users', stats.totalUsers],
      ['Total Posts', stats.totalPosts],
      ['Total Likes', stats.totalLikes],
      ['Total Comments', stats.totalComments],
      [],
      ['--- Engagement Metrics ---'],
      ['Metric', 'Value'],
      ['Avg Posts per User', avgPostsPerUser],
      ['Avg Likes per Post', avgLikesPerPost],
      ['Avg Comments per Post', avgCommentsPerPost],
      [],
      ['--- Users by Major ---'],
      ['Major', 'User Count'],
      ...Object.entries(stats.usersByMajor).map(([major, count]) => [major, count]),
    ];

    const csvContent = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `JayConnect_Analytics_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!stats) return <div className="page-shell"><Navbar /><p>Loading analytics...</p></div>;

  return (
    <div className="page-shell">
      <Navbar />
      <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px' }}>

        {/* Header + Export Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0 }}>
            JayConnect Analytics Dashboard
          </h1>
          <button
            onClick={downloadCSV}
            className="btn-gold"
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', fontSize: '0.95rem', fontWeight: 700, borderRadius: 12 }}
          >
            ⬇ Export CSV Report
          </button>
        </div>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20, marginBottom: 40 }}>
          <div className="card" style={{ padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--blue)' }}>{stats.totalUsers}</div>
            <div style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Total Users</div>
          </div>
          <div className="card" style={{ padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--gold)' }}>{stats.totalPosts}</div>
            <div style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Total Posts</div>
          </div>
          <div className="card" style={{ padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: '#f472b6' }}>{stats.totalLikes}</div>
            <div style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Total Likes</div>
          </div>
          <div className="card" style={{ padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: '#34d399' }}>{stats.totalComments}</div>
            <div style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Total Comments</div>
          </div>
        </div>

        {/* Users by Major */}
        <div className="card" style={{ padding: 32, marginBottom: 32 }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 24 }}>Users by Major</h2>
          <div style={{ display: 'grid', gap: 12 }}>
            {Object.entries(stats.usersByMajor).map(([major, count]) => (
              <div key={major} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1, fontWeight: 600 }}>{major}</div>
                <div style={{ flex: 3, background: 'var(--bg-surface)', borderRadius: 8, height: 32, position: 'relative', overflow: 'hidden' }}>
                  <div style={{
                    width: `${(count / stats.totalUsers) * 100}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #1565c0, #7c3aed)',
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: 12,
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.9rem'
                  }}>
                    {count}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Metrics */}
        <div className="card" style={{ padding: 32 }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 24 }}>Engagement Metrics</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            <div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 8 }}>Avg Posts per User</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--blue)' }}>
                {stats.totalUsers > 0 ? (stats.totalPosts / stats.totalUsers).toFixed(1) : 0}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 8 }}>Avg Likes per Post</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--gold)' }}>
                {stats.totalPosts > 0 ? (stats.totalLikes / stats.totalPosts).toFixed(1) : 0}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 8 }}>Avg Comments per Post</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399' }}>
                {stats.totalPosts > 0 ? (stats.totalComments / stats.totalPosts).toFixed(1) : 0}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

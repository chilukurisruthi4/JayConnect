export default function EmptyState({ icon = '📭', title, message, action }) {
  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '60px 20px',
      background: 'var(--bg-surface)',
      borderRadius: 16,
      border: '1px solid var(--border-color)'
    }}>
      <div style={{ fontSize: '4rem', marginBottom: 16 }}>{icon}</div>
      <h3 style={{ fontSize: '1.3rem', marginBottom: 8, fontWeight: 700 }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 20, maxWidth: 400, margin: '0 auto' }}>
        {message}
      </p>
      {action && action}
    </div>
  );
}

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div style={{ 
      padding: '20px', 
      background: 'rgba(239,68,68,0.1)', 
      border: '1px solid rgba(239,68,68,0.3)',
      borderRadius: 12,
      textAlign: 'center',
      margin: '20px 0'
    }}>
      <div style={{ fontSize: '2rem', marginBottom: 8 }}>⚠️</div>
      <p style={{ color: '#ef4444', marginBottom: 12 }}>{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          style={{ 
            padding: '8px 20px', 
            borderRadius: 8, 
            background: '#ef4444', 
            color: 'white', 
            border: 'none',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Try Again
        </button>
      )}
    </div>
  );
}

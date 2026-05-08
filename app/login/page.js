'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [eNumber, setENumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check if already logged in
    const stored = localStorage.getItem('jc-user');
    if (stored) {
      window.location.href = '/feed';
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!eNumber || !password) {
      setError('Please provide your E-Number and password.');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eNumber, password, action: 'login' })
      });

      const data = await res.json();
      
      if (data.success) {
        // Save user session in localStorage
        localStorage.setItem('jc-user', JSON.stringify(data.user));
        // Redirect to feed
        window.location.href = '/feed';
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch (err) {
      console.error(err);
      setError('A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-page)' }}>
      <motion.div 
        className="card"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ width: '100%', maxWidth: 420, padding: 40 }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img src="/logo.png" alt="JayConnect Logo" style={{ width: '54px', height: '54px', borderRadius: '12px', objectFit: 'cover', margin: '0 auto 16px auto', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }} />
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0 0 8px 0' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            Sign in to your Elmhurst account
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>E-Number</label>
            <input 
              type="text" 
              placeholder="e0805693"
              value={eNumber}
              onChange={e => setENumber(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 8,
                border: '1px solid var(--border-color)',
                background: 'var(--bg-surface-2)',
                color: 'var(--text-primary)',
                fontSize: '0.95rem',
                outline: 'none',
                textTransform: 'lowercase'
              }}
              required
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 8,
                border: '1px solid var(--border-color)',
                background: 'var(--bg-surface-2)',
                color: 'var(--text-primary)',
                fontSize: '0.95rem',
                outline: 'none'
              }}
              required
            />
          </div>

          {error && (
            <div style={{ padding: 12, borderRadius: 8, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', fontSize: '0.85rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="btn-gold" 
            disabled={loading}
            style={{ padding: '14px', width: '100%', justifyContent: 'center', fontSize: '1rem', marginTop: 8 }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <div style={{ marginBottom: '12px' }}>
            <a href="/reset-password" style={{ color: 'var(--blue)', fontWeight: 600, textDecoration: 'none' }}>
              Forgot Password?
            </a>
          </div>
          <div>
            New to JayConnect?
            <a href="/register" style={{ color: 'var(--blue)', fontWeight: 600, marginLeft: 6, textDecoration: 'none' }}>
              Create Account
            </a>
          </div>
        </div>

      </motion.div>
    </div>
  );
}

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [eNumber, setENumber] = useState('');
  const [password, setPassword] = useState('');
  const [major, setMajor] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!eNumber || !password) {
      setError('Please provide your ID and password.');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const actionType = isForgotPassword ? 'reset' : (isRegistering ? 'register' : 'login');
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eNumber, password, major, action: actionType })
      });

      const data = await res.json();
      
      if (data.success) {
        // Save user session in localStorage (Basic Auth)
        localStorage.setItem('jc-user', JSON.stringify(data.user));
        // Redirect to feed
        router.push('/feed');
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
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0 0 8px 0' }}>
            {isForgotPassword ? 'Reset Password' : 'Welcome to JayConnect'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            {isForgotPassword ? 'Enter your e-Number and your new password.' : 
             (isRegistering ? 'Register your Elmhurst Student account.' : 'Sign in using your Elmhurst e-Number.')}
          </p>
        </div>

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Student ID (e-Number)</label>
            <input 
              type="text" 
              placeholder="e.g. e12345678"
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
                outline: 'none'
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

          {isRegistering && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Major / Field of Study</label>
              <input 
                type="text" 
                placeholder="e.g. Data Science"
                value={major}
                onChange={e => setMajor(e.target.value)}
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
                required={isRegistering}
              />
            </motion.div>
          )}

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
            {loading ? 'Processing...' : (isForgotPassword ? 'Reset Password' : (isRegistering ? 'Register Account' : 'Sign In'))}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {isForgotPassword ? (
            <>
              Remember your password? 
              <button 
                onClick={() => { setIsForgotPassword(false); setError(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--blue)', fontWeight: 600, marginLeft: 6, cursor: 'pointer', padding: 0 }}
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              <div style={{ marginBottom: '12px' }}>
                <button 
                  onClick={() => { setIsForgotPassword(true); setIsRegistering(false); setError(''); }}
                  style={{ background: 'none', border: 'none', color: 'var(--blue)', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                >
                  Forgot Password?
                </button>
              </div>
              <div>
                {isRegistering ? 'Already have an account?' : 'New to JayConnect?'}
                <button 
                  onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
                  style={{ background: 'none', border: 'none', color: 'var(--blue)', fontWeight: 600, marginLeft: 6, cursor: 'pointer', padding: 0 }}
                >
                  {isRegistering ? 'Sign In here' : 'Register here'}
                </button>
              </div>
            </>
          )}
        </div>

      </motion.div>
    </div>
  );
}

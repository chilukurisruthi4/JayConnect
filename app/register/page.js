'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    eNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    major: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if already logged in
    const stored = localStorage.getItem('jc-user');
    if (stored) {
      window.location.href = '/feed';
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!formData.eNumber.match(/^e\d{7}$/i)) {
      setError('E-Number must be in format e1234567 (e + 7 digits)');
      return;
    }

    if (!formData.email.endsWith('@365.elmhurst.edu')) {
      setError('Email must end with @365.elmhurst.edu');
      return;
    }

    setLoading(true);

    try {
      const displayName = `${formData.firstName} ${formData.lastName}`.trim();
      
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eNumber: formData.eNumber.toUpperCase(),
          email: formData.email,
          password: formData.password,
          displayName: displayName,
          major: formData.major
        })
      });

      const data = await res.json();

      if (data.success) {
        // Save user to localStorage
        localStorage.setItem('jc-user', JSON.stringify(data.user));
        // Redirect to feed
        window.location.href = '/feed';
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="page-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-page)', padding: '20px' }}>
      <motion.div 
        className="card"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ width: '100%', maxWidth: 480, padding: 40 }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img src="/logo.png" alt="JayConnect Logo" style={{ width: '54px', height: '54px', borderRadius: '12px', objectFit: 'cover', margin: '0 auto 16px auto', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }} />
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0 0 8px 0' }}>Create Your Account</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            Join the Elmhurst University network
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* First Name & Last Name */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>First Name</label>
              <input 
                type="text" 
                placeholder="John"
                value={formData.firstName}
                onChange={e => setFormData({...formData, firstName: e.target.value})}
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
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Last Name</label>
              <input 
                type="text" 
                placeholder="Doe"
                value={formData.lastName}
                onChange={e => setFormData({...formData, lastName: e.target.value})}
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
          </div>

          {/* E-Number */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>E-Number</label>
            <input 
              type="text" 
              placeholder="e0805693"
              value={formData.eNumber}
              onChange={e => setFormData({...formData, eNumber: e.target.value})}
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

          {/* Email (Editable) */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Elmhurst Email</label>
            <input 
              type="email" 
              placeholder="yourname@365.elmhurst.edu"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
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
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>Must end with @365.elmhurst.edu</p>
          </div>

          {/* Major */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Major</label>
            <select
              value={formData.major}
              onChange={e => setFormData({...formData, major: e.target.value})}
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
            >
              <option value="">Select Major</option>
              <option value="CIT">Computer Information Technology</option>
              <option value="Business">Business</option>
              <option value="Psychology">Psychology</option>
              <option value="Biology">Biology</option>
              <option value="Nursing">Nursing</option>
              <option value="Engineering">Engineering</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Password */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Password</label>
            <input 
              type="password" 
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
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

          {/* Confirm Password */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Confirm Password</label>
            <input 
              type="password" 
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
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

          {/* Error Message */}
          {error && (
            <div style={{ padding: 12, borderRadius: 8, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', fontSize: '0.85rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn-gold" 
            disabled={loading}
            style={{ padding: '14px', width: '100%', justifyContent: 'center', fontSize: '1rem', marginTop: 8 }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Login Link */}
        <div style={{ marginTop: 24, textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Already have an account?
          <a href="/login" style={{ color: 'var(--blue)', fontWeight: 600, marginLeft: 6, textDecoration: 'none' }}>
            Sign In
          </a>
        </div>

      </motion.div>
    </div>
  );
}

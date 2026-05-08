'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';

export default function EditProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [major, setMajor] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('jc-user');
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
      setDisplayName(u.displayName || '');
      setBio(u.bio || '');
      setMajor(u.major || '');
    }
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          displayName,
          bio,
          major
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('jc-user', JSON.stringify(data.user));
        router.push('/profile');
      }
    } catch (err) {
      alert('Failed to update profile');
    }
    setSaving(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)' }}>
      <Navbar />
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: 32 }}>Edit Profile</h1>
        
        <div style={{ background: 'var(--bg-surface)', borderRadius: 16, padding: 24, border: '1px solid var(--border-color)' }}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Display Name</label>
            <input 
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Bio</label>
            <textarea 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              style={{ width: '100%', padding: '12px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)', resize: 'vertical' }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Major</label>
            <select 
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
            >
              <option value="">Select Major</option>
              <option value="CIT">Computer Information Technology</option>
              <option value="Business">Business</option>
              <option value="Psychology">Psychology</option>
              <option value="Biology">Biology</option>
              <option value="Nursing">Nursing</option>
              <option value="Engineering">Engineering</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button 
              onClick={handleSave}
              disabled={saving}
              style={{ flex: 1, padding: '12px 24px', borderRadius: 8, background: '#1565c0', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button 
              onClick={() => router.push('/profile')}
              style={{ flex: 1, padding: '12px 24px', borderRadius: 8, background: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', fontWeight: 600, cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

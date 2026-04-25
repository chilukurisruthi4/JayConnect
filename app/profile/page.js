'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';

export default function ProfilePage() {
  const [localUser, setLocalUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  // Editable fields
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [major, setMajor] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [banner, setBanner] = useState(null);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');

  // Posts stats
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('jc-user');
      if (stored) {
        const user = JSON.parse(stored);
        setLocalUser(user);
        loadProfile(user.id);
        loadPosts(user.id);
      }
    } catch (e) {}

    // Load saved skills from localStorage (per user)
    try {
      const stored = localStorage.getItem('jc-user');
      if (stored) {
        const user = JSON.parse(stored);
        const savedSkills = localStorage.getItem(`jc-skills-${user.id}`);
        if (savedSkills) setSkills(JSON.parse(savedSkills));
      }
    } catch (e) {}

    // Load banner from localStorage
    try {
      const stored = localStorage.getItem('jc-user');
      if (stored) {
        const user = JSON.parse(stored);
        const savedBanner = localStorage.getItem(`jc-banner-${user.id}`);
        if (savedBanner) setBanner(savedBanner);
      }
    } catch (e) {}
  }, []);

  const loadProfile = async (userId) => {
    try {
      const res = await fetch(`/api/profile?userId=${userId}`);
      const data = await res.json();
      if (data.success) {
        setProfile(data.user);
        setDisplayName(data.user.displayName || '');
        setBio(data.user.bio || '');
        setMajor(data.user.major || '');
        setAvatarUrl(data.user.avatarUrl || '');
      }
    } catch (e) {}
  };

  const loadPosts = async (userId) => {
    try {
      const res = await fetch(`/api/posts?userId=${userId}`);
      const data = await res.json();
      if (data.success) setUserPosts(data.posts || []);
    } catch (e) {}
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSave = async () => {
    if (!localUser) return;
    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: localUser.id, displayName, bio, major, avatarUrl }),
      });
      const data = await res.json();
      if (data.success) {
        // Update localStorage session too
        const updated = { ...localUser, displayName, bio, major, avatarUrl };
        localStorage.setItem('jc-user', JSON.stringify(updated));
        setLocalUser(updated);
        setProfile(prev => ({ ...prev, displayName, bio, major, avatarUrl }));
        // Save skills locally
        localStorage.setItem(`jc-skills-${localUser.id}`, JSON.stringify(skills));
        // Save banner locally
        if (banner) localStorage.setItem(`jc-banner-${localUser.id}`, banner);
        showToast('✅ Profile saved!');
        setEditMode(false);
      } else {
        showToast('❌ Save failed: ' + data.error);
      }
    } catch (e) {
      showToast('❌ Network error saving profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setAvatarUrl(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setBanner(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const addSkill = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setNewSkill('');
    }
  };

  const removeSkill = (s) => setSkills(skills.filter(sk => sk !== s));

  // Derived display values
  const initials = (displayName || localUser?.displayName || localUser?.adUsername || 'U')
    .split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const name = profile?.displayName || displayName || localUser?.displayName || localUser?.adUsername || 'Student';
  const profileBio = profile?.bio || bio || 'No bio yet. Click Edit Profile to add yours!';
  const profileMajor = profile?.major || major || 'Undecided Major';
  const profileAvatar = avatarUrl || profile?.avatarUrl;

  if (!localUser) {
    return (
      <div className="page-shell">
        <Navbar />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: 16 }}>Please sign in to view your profile.</p>
            <a href="/login" className="btn-gold" style={{ padding: '10px 24px' }}>Sign In</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <Navbar />

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: 12, padding: '12px 24px', fontWeight: 600, fontSize: '0.9rem', zIndex: 9999, boxShadow: 'var(--shadow-lg)' }}>
          {toast}
        </div>
      )}

      <div className="profile-layout">

        {/* Profile Hero */}
        <motion.div
          className="profile-hero"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div
            className="profile-bg-gradient"
            style={banner ? { background: `url(${banner}) center/cover no-repeat` } : {}}
          >
            {editMode && (
              <div
                style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(0,0,0,0.6)', padding: '6px 14px', borderRadius: 24, color: 'white', fontSize: '0.8rem', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', gap: 6, border: '1px solid rgba(255,255,255,0.2)' }}
                onClick={() => document.getElementById('banner-upload').click()}
              >
                <span style={{ fontSize: '1.2rem' }}>📷</span> Change Cover
              </div>
            )}
          </div>
          <input type="file" id="banner-upload" style={{ display: 'none' }} accept="image/*" onChange={handleBannerUpload} />

          <div className="profile-content">
            <div className="profile-ava-overlap">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{ position: 'relative', cursor: editMode ? 'pointer' : 'default', borderRadius: '50%' }}
                  onClick={() => editMode && document.getElementById('ava-upload').click()}
                >
                  {profileAvatar ? (
                    <img src={profileAvatar} className="profile-ava" style={{ objectFit: 'cover', padding: 0 }} alt="Avatar" />
                  ) : (
                    <div className="profile-ava">{initials}</div>
                  )}
                  {editMode && (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                      <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 700 }}>EDIT</span>
                    </div>
                  )}
                </div>
              </div>
              <input type="file" id="ava-upload" style={{ display: 'none' }} accept="image/*" onChange={handleAvatarUpload} />
            </div>

            <div className="profile-info-block" style={{ position: 'relative' }}>
              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button className="btn-gold" onClick={() => editMode ? handleSave() : setEditMode(true)} disabled={saving}>
                  {saving ? 'Saving...' : (editMode ? 'Save Profile' : 'Edit Profile')}
                </button>
                {editMode && (
                  <button className="btn-ghost" onClick={() => { setEditMode(false); loadProfile(localUser.id); }} style={{ padding: '8px 16px' }}>
                    Cancel
                  </button>
                )}
              </div>

              {editMode ? (
                <input
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="Your full name"
                  style={{ fontSize: '1.6rem', fontWeight: 800, background: 'var(--bg-surface-2)', border: '1px solid var(--border-color)', borderRadius: 8, padding: '6px 12px', color: 'var(--text-primary)', width: '100%', marginTop: 12 }}
                />
              ) : (
                <div className="profile-name">{name}</div>
              )}

              {editMode ? (
                <input
                  value={major}
                  onChange={e => setMajor(e.target.value)}
                  placeholder="e.g. M.S. Computer Information Technology"
                  style={{ fontSize: '0.95rem', background: 'var(--bg-surface-2)', border: '1px solid var(--border-color)', borderRadius: 8, padding: '6px 12px', color: 'var(--text-secondary)', width: '100%', marginTop: 8 }}
                />
              ) : (
                <div className="profile-title">{profileMajor} · Elmhurst University</div>
              )}

              <div className="profile-badges" style={{ marginTop: 12 }}>
                <span className="tag tag-blue">{profileMajor.split(' ').slice(0, 2).join(' ') || 'Student'}</span>
                <span className="tag tag-gold">JayConnect Member</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="profile-stats">
            {[
              { num: profile?._count?.posts ?? userPosts.length, label: 'Posts' },
              { num: profile?._count?.connections ?? '—', label: 'Connections' },
              { num: profile?._count?.connectedBy ?? '—', label: 'Followers' },
            ].map(s => (
              <div className="p-stat" key={s.label}>
                <div className="p-stat-num">{s.num}</div>
                <div className="p-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="profile-main">

          {/* About / Bio */}
          <motion.div className="card" style={{ padding: 28, marginBottom: 20 }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 14 }}>About</h2>
            {editMode ? (
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                rows={4}
                placeholder="Write something about yourself — your experience, goals, etc."
                style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-surface-2)', color: 'var(--text-primary)', fontSize: '0.92rem', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }}
              />
            ) : (
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.93rem' }}>{profileBio}</p>
            )}
          </motion.div>

          {/* Skills */}
          <motion.div className="card" style={{ padding: 28, marginBottom: 20 }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 14 }}>Skills</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: editMode ? 14 : 0 }}>
              {skills.length === 0 && !editMode && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No skills added yet. Edit profile to add yours.</p>
              )}
              {skills.map(s => (
                <span key={s} className="tag tag-blue" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {s}
                  {editMode && (
                    <button onClick={() => removeSkill(s)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '0.85rem', lineHeight: 1, padding: 0, marginLeft: 2 }}>✕</button>
                  )}
                </span>
              ))}
            </div>
            {editMode && (
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  value={newSkill}
                  onChange={e => setNewSkill(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addSkill()}
                  placeholder="Add a skill (e.g. Python, SQL)"
                  style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-surface-2)', color: 'var(--text-primary)', fontSize: '0.88rem' }}
                />
                <button className="btn-primary" onClick={addSkill} style={{ padding: '8px 16px', borderRadius: 8, fontSize: '0.88rem' }}>+ Add</button>
              </div>
            )}
          </motion.div>

          {/* Recent Posts */}
          <motion.div className="card" style={{ padding: 28 }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 14 }}>My Posts</h2>
            {userPosts.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No posts yet. Share something on the Feed!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {userPosts.slice(0, 5).map(post => (
                  <div key={post.id} style={{ padding: '14px 16px', background: 'var(--bg-surface-2)', borderRadius: 10, border: '1px solid var(--border-color)' }}>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 6 }}>{post.content?.substring(0, 160)}{post.content?.length > 160 ? '…' : ''}</p>
                    <div style={{ display: 'flex', gap: 16, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      <span>❤️ {post._count?.likes || 0}</span>
                      <span>💬 {post._count?.comments || 0}</span>
                      <span>🕒 {new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
}

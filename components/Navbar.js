'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

function useTheme() {
 const [theme, setTheme] = useState('dark');
 useEffect(() => {
 const saved = localStorage.getItem('jc-theme') || 'dark';
 setTheme(saved);
 document.documentElement.setAttribute('data-theme', saved);
 }, []);
 const toggle = () => {
 const next = theme === 'dark' ? 'light' : 'dark';
 setTheme(next);
 document.documentElement.setAttribute('data-theme', next);
 localStorage.setItem('jc-theme', next);
 };
 return { theme, toggle };
}

export default function Navbar({ user: initialUser }) {
 const path = usePathname();
 const router = useRouter();
 const [notifOpen, setNotifOpen] = useState(false);
 const [userMenuOpen, setUserMenuOpen] = useState(false);
 const { theme, toggle } = useTheme();
 const [user, setUser] = useState(initialUser || { name: 'Sruthi C.', initials: 'SC', email: 'chilukurisruthi4@gmail.com' });

 useEffect(() => {
   try {
     const stored = localStorage.getItem('jc-user');
     if (stored) {
       const parsed = JSON.parse(stored);
       const initials = parsed.fullName?.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() || 'U';
       setUser({ ...parsed, name: parsed.fullName, initials });
     }
   } catch(e) {}
 }, []);

 const handleLogout = (e) => {
   e.preventDefault();
   localStorage.removeItem('jc-user');
   setUserMenuOpen(false);
   router.push('/login');
 };

 const links = [
 { href: '/feed', label: 'Feed', icon: '' },
 { href: '/network', label: 'Network', icon: '' },
 { href: '/events', label: 'Events', icon: '' },
 { href: '/messages', label: 'Messages', icon: '' },
 { href: '/profile', label: 'Profile', icon: '' },
 { href: '/dashboard', label: 'Admin', icon: '' },
 ];

 const isDark = theme === 'dark';

 return (
 <nav className="navbar">
        <Link href="/" className="navbar-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/logo.png" alt="JayConnect Logo" style={{ width: '38px', height: '38px', borderRadius: '8px', objectFit: 'cover', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} />
            <div style={{ display: 'flex', alignItems: 'center' }}>Jay<span>Connect</span></div>
        </Link>

 <div className="navbar-nav">
 {links.map(l => (
 <Link
 key={l.href}
 href={l.href}
 className={`nav-link ${path === l.href ? 'active' : ''}`}
 >
 {l.icon} {l.label}
 </Link>
 ))}
 </div>

 <div className="navbar-right">
 {/* Theme Toggle */}
 <button
 id="theme-toggle-btn"
 onClick={toggle}
 title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
 style={{
 background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
 border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'}`,
 borderRadius: '8px',
 width: 38,
 height: 38,
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 cursor: 'pointer',
 fontSize: '1.1rem',
 transition: 'all 0.2s ease',
 }}
 >
 {isDark ? '☀️' : '🌙'}
 </button>

 {/* Notifications */}
 <button
 id="notif-btn"
 onClick={() => setNotifOpen(o => !o)}
 style={{
 background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
 border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'}`,
 borderRadius: '8px',
 width: 38,
 height: 38,
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 cursor: 'pointer',
 fontSize: '1rem',
 position: 'relative'
 }}
 >
 🔔
 <span style={{
 position: 'absolute',
 top: 6, right: 6,
 width: 8, height: 8,
 background: 'var(--gold)',
 borderRadius: '50%',
 border: `2px solid var(--bg-page)`
 }} />
 </button>

 <div 
 className="avatar" 
 title={user.name} 
 onClick={() => { setUserMenuOpen(!userMenuOpen); setNotifOpen(false); }}
 style={{ cursor: 'pointer' }}
 >
 {user.initials}
 </div>
 </div>

 {/* User Dropdown */}
 {userMenuOpen && (
 <div style={{
 position: 'absolute',
 top: 74,
 right: 16,
 width: 260,
 background: 'var(--navbar-bg)',
 backdropFilter: 'blur(30px)',
 WebkitBackdropFilter: 'blur(30px)',
 border: '1px solid var(--border-color)',
 borderRadius: 16,
 boxShadow: 'var(--shadow-lg)',
 zIndex: 300,
 overflow: 'hidden',
 display: 'flex',
 flexDirection: 'column'
 }}>
 <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)' }}>
 <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{user.name}</div>
 <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>chilukurisruthi4@gmail.com</div>
 </div>
 
 <div style={{ padding: '8px 0' }}>
 <Link href="/profile" style={{ display: 'block', padding: '10px 20px', fontSize: '0.85rem', color: 'var(--text-secondary)', textDecoration: 'none' }} onClick={() => setUserMenuOpen(false)}>👤 View Profile</Link>
 <a href="#" style={{ display: 'block', padding: '10px 20px', fontSize: '0.85rem', color: 'var(--text-secondary)', textDecoration: 'none' }} onClick={(e) => e.preventDefault()}>⚙️ Settings</a>
 </div>

 <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
 <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Appearance</div>
 <div style={{ display: 'flex', gap: 8 }}>
 <button onClick={() => theme === 'dark' && toggle()} style={{ flex: 1, padding: '8px', borderRadius: 8, background: theme === 'light' ? 'var(--blue-light)' : 'transparent', border: '1px solid var(--border-color)', color: theme === 'light' ? '#fff' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>☀️ Light</button>
 <button onClick={() => theme === 'light' && toggle()} style={{ flex: 1, padding: '8px', borderRadius: 8, background: theme === 'dark' ? 'var(--blue-light)' : 'transparent', border: '1px solid var(--border-color)', color: theme === 'dark' ? '#fff' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>🌙 Dark</button>
 </div>
 </div>

 <div style={{ padding: '8px 0' }}>
 <a href="#" style={{ display: 'block', padding: '10px 20px', fontSize: '0.85rem', color: '#ef4444', textDecoration: 'none', fontWeight: 600 }} onClick={handleLogout}>Sign Out</a>
 </div>
 </div>
 )}

 {notifOpen && (
 <div style={{
 position: 'absolute',
 top: 74,
 right: 32,
 width: 320,
 background: 'var(--navbar-bg)',
 backdropFilter: 'blur(30px)',
 WebkitBackdropFilter: 'blur(30px)',
 border: '1px solid var(--border-color)',
 borderRadius: 16,
 boxShadow: 'var(--shadow-lg)',
 zIndex: 300,
 overflow: 'hidden'
 }}>
 <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', fontWeight: 700, color: 'var(--text-primary)' }}>
 Notifications
 </div>
 {[
 { icon: '🤝', msg: 'Prof. Chen liked your AI Research post', time: '2m ago' },
 { icon: '💬', msg: 'Alex K. commented: "Love this idea!"', time: '14m ago' },
 { icon: '🚀', msg: 'Hackathon registration opens tomorrow!', time: '1h ago' },
 ].map((n, i) => (
 <div key={i} style={{
 display: 'flex', gap: 12, alignItems: 'flex-start',
 padding: '12px 20px',
 borderBottom: '1px solid var(--border-color)',
 cursor: 'pointer',
 transition: 'background 0.15s'
 }}>
 <span style={{ fontSize: '1.2rem' }}>{n.icon}</span>
 <div style={{ flex: 1 }}>
 <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{n.msg}</p>
 <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 3 }}>{n.time}</p>
 </div>
 </div>
 ))}
 </div>
 )}
 </nav>
 );
}

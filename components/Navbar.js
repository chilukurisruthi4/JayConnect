'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

export default function Navbar({ user = { name: 'Sruthi C.', initials: 'SC' } }) {
 const path = usePathname();
 const [notifOpen, setNotifOpen] = useState(false);
 const { theme, toggle } = useTheme();

 const links = [
 { href: '/feed', label: 'Feed', icon: '' },
 { href: '/network', label: 'Network', icon: '' },
 { href: '/events', label: 'Events', icon: '' },
 { href: '/messages', label: 'Messages', icon: '' },
 { href: '/resume', label: 'Resume', icon: '' },
 { href: '/profile', label: 'Profile', icon: '' },
 { href: '/dashboard', label: 'Admin', icon: '' },
 ];

 const isDark = theme === 'dark';

 return (
 <nav className="navbar">
 <Link href="/" className="navbar-logo">
 Jay<span>Connect</span>
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
 {isDark ? 'Light' : 'Dark'}
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
 Notifs
 <span style={{
 position: 'absolute',
 top: 6, right: 6,
 width: 8, height: 8,
 background: 'var(--gold)',
 borderRadius: '50%',
 border: `2px solid var(--bg-page)`
 }} />
 </button>

 <div className="avatar" title={user.name}>{user.initials}</div>
 </div>

 {notifOpen && (
 <div style={{
 position: 'absolute',
 top: 74,
 right: 32,
 width: 320,
 background: 'var(--bg-surface)',
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
 { icon: '', msg: 'Prof. Chen liked your AI Research post', time: '2m ago' },
 { icon: '', msg: 'Alex K. commented: "Love this idea!"', time: '14m ago' },
 { icon: '', msg: 'Hackathon registration opens tomorrow!', time: '1h ago' },
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

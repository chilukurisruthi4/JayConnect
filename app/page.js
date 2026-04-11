 'use client';
 import { useState } from 'react';
 import Link from 'next/link';

 export default function LandingPage() {
 const [majorsSelected, setMajorsSelected] = useState(['CIT']);

 const majors = [
   { code: 'CIT', label: 'Computer Info Tech' },
   { code: 'DSA', label: 'Data Science' },
   { code: 'MBA', label: 'Business Admin' },
   { code: 'MPM', label: 'Project Management' }
 ];

 return (
 <div className="page-shell">
 <nav className="navbar">
 <div className="navbar-logo">
 <div className="logo-icon"></div>
 Jay<span>Connect</span>
 </div>
 <div className="navbar-right">
 <Link href={`/feed?majors=${majorsSelected.join(',')}`} className="btn-ghost">Sign In</Link>
 <Link href={`/feed?majors=${majorsSelected.join(',')}`} className="btn-gold">Join Now</Link>
 </div>
 </nav>

 <section className="hero">
 <div className="hero-bg" />
 <div className="hero-badge"> Elmhurst University · Student Innovation Hub</div>
 <h1>Where BlueJays Build<br />the Future Together</h1>
 <p>
 Share ideas, discover research, collaborate on projects, and grow your career —
 the innovation hub built for Elmhurst students &amp; professors.
 </p>
 <div className="hero-cta" style={{ marginBottom: 24 }}>
 <Link href={`/feed?majors=${majorsSelected.join(',')}`} className="btn-gold" id="hero-join-btn"> Get Started</Link>
 </div>

 <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
 <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Select your majors to personalize your feed</div>
 <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
 {majors.map(m => {
   const isSelected = majorsSelected.includes(m.code);
   return (
   <button 
     key={m.code} 
     onClick={() => {
       if (isSelected && majorsSelected.length > 1) {
         setMajorsSelected(majorsSelected.filter(c => c !== m.code));
       } else if (!isSelected) {
         setMajorsSelected([...majorsSelected, m.code]);
       }
     }}
     style={{
       padding: '8px 16px',
       borderRadius: 20,
       border: `1px solid ${isSelected ? 'var(--gold)' : 'rgba(255,255,255,0.15)'}`,
       background: isSelected ? 'rgba(245, 166, 35, 0.15)' : 'rgba(0,0,0,0.2)',
       color: isSelected ? 'var(--gold)' : 'var(--text-primary)',
       cursor: 'pointer',
       fontSize: '0.85rem',
       fontWeight: 600,
       transition: 'all 0.2s',
       display: 'flex',
       alignItems: 'center',
       gap: 6
     }}
   >
     {isSelected && <span style={{ fontSize: '0.9rem' }}>✓</span>}{m.label}
   </button>
 )})}
 </div>
 </div>

 <div className="hero-stats" style={{ marginTop: 48 }}>
 {[
 { num: '1,200+', label: 'Students Connected' },
 { num: '84', label: 'Active Projects' },
 { num: '340+', label: 'Resumes Built' },
 { num: '15+', label: 'Disciplines' }
 ].map(s => (
 <div className="stat" key={s.label}>
 <div className="stat-num">{s.num}</div>
 <div className="stat-label">{s.label}</div>
 </div>
 ))}
 </div>
 </section>


 </div>
 );
}

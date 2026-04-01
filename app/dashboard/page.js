'use client';
import Navbar from '../../components/Navbar';

const MAJORS_DATA = [
 { name: 'Computer Science (MS)', count: 342, pct: '42%' },
 { name: 'Information Technology (MS)', count: 215, pct: '26%' },
 { name: 'Data Science (MS)', count: 143, pct: '18%' },
 { name: 'Business Administration (MBA)', count: 85, pct: '10%' },
 { name: 'Cybersecurity (BS)', count: 32, pct: '4%' },
];

export default function DashboardPage() {
 return (
 <div className="page-shell">
 <Navbar />
 <div style={{ maxWidth: 1100, margin: '40px auto', padding: '0 20px' }}>
 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
 <div>
 <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
 <span style={{ background: 'rgba(245,166,35,0.15)', border: '1px solid rgba(245,166,35,0.3)', color: 'var(--gold)', padding: '4px 10px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
 Faculty / Admin Access Required
 </span>
 </div>
 <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Platform Analytics Dashboard</h1>
 <p style={{ color: 'var(--gray-400)', marginTop: 8 }}>
 Real-time overview of JayConnect student engagement and university adoption metrics.
 </p>
 </div>
 <button className="btn-primary" style={{ padding: '12px 24px', opacity: 0.7, cursor: 'not-allowed' }}>
 Export CSV Report
 </button>
 </div>

 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 32 }}>
 <div className="card" style={{ padding: 24 }}>
 <div style={{ color: 'var(--gray-400)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>Total Registered Students</div>
 <div style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1 }}>817</div>
 <div style={{ color: '#4ade80', fontSize: '0.85rem', marginTop: 12, fontWeight: 500 }}>↑ +12% user growth this week</div>
 </div>
 <div className="card" style={{ padding: 24 }}>
 <div style={{ color: 'var(--gray-400)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>Daily Active Sessions</div>
 <div style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1 }}>324</div>
 <div style={{ color: '#4ade80', fontSize: '0.85rem', marginTop: 12, fontWeight: 500 }}>↑ High engagement on Feed</div>
 </div>
 <div className="card" style={{ padding: 24 }}>
 <div style={{ color: 'var(--gray-400)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>Resumes Optimized</div>
 <div style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1 }}>1,402</div>
 <div style={{ color: '#60a5fa', fontSize: '0.85rem', marginTop: 12, fontWeight: 500 }}>Using JayConnect AI builder</div>
 </div>
 </div>

 {/* Majors Distribution */}
 <div className="card" style={{ padding: 32 }}>
 <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 24 }}>Student Demographics by Major</h2>
 <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
 {MAJORS_DATA.map((major, idx) => (
 <div key={idx}>
 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.95rem' }}>
 <span style={{ fontWeight: 600 }}>{major.name}</span>
 <span style={{ color: 'var(--gray-400)' }}>{major.count} students ({major.pct})</span>
 </div>
 <div style={{ height: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 8, overflow: 'hidden', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)' }}>
 <div style={{ height: '100%', width: major.pct, background: idx === 0 ? 'linear-gradient(90deg, #3b82f6, #8b5cf6)' : idx === 1 ? 'linear-gradient(90deg, #10b981, #3b82f6)' : idx === 2 ? 'linear-gradient(90deg, #f59e0b, #ef4444)' : 'var(--gray-500)', borderRadius: 8 }} />
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 );
}

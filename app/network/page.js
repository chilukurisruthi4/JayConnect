'use client';
import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Link from 'next/link';

const PEOPLE_DATABASE = [
 { id: 1, name: 'Dr. John Richards', role: 'Professor of Computer Science', type: 'Faculty', mutuals: 12, connected: false, avatar: 'JR' },
 { id: 2, name: 'Alice Chen', role: 'MS in Data Science Candidate', type: 'Student', mutuals: 4, connected: false, avatar: 'AC' },
 { id: 3, name: 'Marcus Freeman', role: 'Career Services Advisor', type: 'Staff', mutuals: 2, connected: false, avatar: 'MF' },
 { id: 4, name: 'Sarah Miller', role: 'BS Computer Information Technology', type: 'Student', mutuals: 15, connected: false, avatar: 'SM' },
 { id: 5, name: 'David Lee', role: 'Alumni (Software Engineer at DXC)', type: 'Alumni', mutuals: 8, connected: false, avatar: 'DL' },
 { id: 6, name: 'Erika Vasquez', role: 'MS IT Management', type: 'Student', mutuals: 6, connected: false, avatar: 'EV' },
];

export default function NetworkPage() {
 const [search, setSearch] = useState('');
 const [people, setPeople] = useState(PEOPLE_DATABASE);
 const [toast, setToast] = useState(null);
 const [aiModal, setAiModal] = useState(null);
 const [aiIntro, setAiIntro] = useState('');
 const [isGenerating, setIsGenerating] = useState(false);

 const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3500); };

 const handleConnect = (id) => {
 setPeople(prev => prev.map(p => {
 if (p.id !== id) return p;
 if (!p.connected) showToast(` Connection request sent to ${p.name}!`);
 return { ...p, connected: !p.connected };
 }));
 };

 const searchLower = search.toLowerCase();
 const filtered = people.filter(p => 
 p.name.toLowerCase().includes(searchLower) || 
 p.role.toLowerCase().includes(searchLower) ||
 p.type.toLowerCase().includes(searchLower)
 );

 return (
 <div className="page-shell">
 <Navbar />
 
 {/* Header section */}
 <header className="page-header" style={{ padding: '40px 20px', textAlign: 'center', background: 'var(--header-bg)', borderBottom: '1px solid var(--glass-border)' }}>
 <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: 12 }}>Your University Network</h1>
 <p style={{ fontSize: '1.1rem', color: 'var(--gray-400)', maxWidth: 600, margin: '0 auto' }}>
 Discover Elmhurst peers, connect with faculty, and build your professional circle. Search by name, major, or role.
 </p>
 <div style={{ maxWidth: 600, margin: '24px auto 0', position: 'relative' }}>
 <input 
 className="form-input" 
 style={{ paddingLeft: 46, height: 50, borderRadius: 25, fontSize: '1.05rem', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
 placeholder="Search for people (e.g., 'Data Science', 'Professor')..."
 value={search}
 onChange={e => setSearch(e.target.value)}
 />
 <span style={{ position: 'absolute', left: 16, top: 14, fontSize: '1.2rem', opacity: 0.5 }}></span>
 </div>
 </header>

 <main style={{ maxWidth: 1100, margin: '40px auto', padding: '0 20px' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
 <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{search ? `Search Results (${filtered.length})` : 'People You May Know'}</h2>
 </div>

 {filtered.length === 0 ? (
 <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--card-bg)', borderRadius: 16, border: '1px dashed var(--glass-border)' }}>
 <div style={{ fontSize: '3rem', marginBottom: 16 }}>️‍️</div>
 <h3 style={{ fontSize: '1.2rem', marginBottom: 8 }}>No results found</h3>
 <p style={{ color: 'var(--gray-500)' }}>We couldn't find anyone matching "{search}". Try searching for something else.</p>
 </div>
 ) : (
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
 {filtered.map(p => (
 <div key={p.id} className="card" style={{ display: 'flex', flexDirection: 'column', padding: 24, textAlign: 'center', alignItems: 'center', transition: 'transform 0.2s', cursor: 'default' }}>
 <div className="avatar" style={{ width: 80, height: 80, fontSize: '2rem', marginBottom: 16, background: p.type === 'Faculty' ? 'var(--blue)' : p.type === 'Alumni' ? 'var(--gold)' : 'var(--blue-light)' }}>
 {p.avatar}
 </div>
 <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 4 }}>{p.name}</h3>
 <p style={{ fontSize: '0.9rem', color: 'var(--gray-400)', marginBottom: 8 }}>{p.role}</p>
 <div style={{ fontSize: '0.8rem', color: 'var(--gray-400)', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '4px 12px', borderRadius: 12, marginBottom: 20, display: 'inline-block' }}>
 {p.mutuals} mutual connections
 </div>
 <div style={{ marginTop: 'auto', width: '100%' }}>
 <button 
 className={p.connected ? 'btn-ghost' : 'btn-primary'}
 style={{ width: '100%', padding: '10px 0', borderRadius: 8, fontWeight: 600, opacity: p.connected ? 0.7 : 1 }}
 onClick={() => p.connected ? handleConnect(p.id) : setAiModal(p)}
 >
 {p.connected ? 'Pending Request' : '+ Connect'}
 </button>
 </div>
 </div>
 ))}
 </div>
 )}
 </main>

 {/* AI Connect Modal */}
 {aiModal && (
 <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
 <div className="card" style={{ width: '100%', maxWidth: 520, padding: 32 }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
 <h2 style={{ fontSize: '1.4rem' }}>Connect with {aiModal.name}</h2>
 <button onClick={() => { setAiModal(null); setAiIntro(''); }} style={{ fontSize: '1.2rem', background: 'transparent', color: 'var(--text-muted)' }}>✕</button>
 </div>
 <p style={{ fontSize: '0.9rem', color: 'var(--gray-400)', marginBottom: 16 }}>
 A great invitation includes a personalized note. Let JayConnect AI draft one for you based on your mutual synergies!
 </p>
 
 <textarea
 className="form-textarea"
 style={{ minHeight: 140, fontSize: '0.95rem', marginBottom: 16, background: 'rgba(255,255,255,0.02)' }}
 placeholder="Write your invitation note..."
 value={aiIntro}
 onChange={e => setAiIntro(e.target.value)}
 />

 <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
 <button
 className="btn-ghost"
 style={{ flex: 1, borderColor: 'rgba(167,139,250,0.4)', color: '#a78bfa', fontWeight: 600 }}
 onClick={() => {
 setIsGenerating(true);
 setTimeout(() => {
 let draft = `Hi ${aiModal.name.split(' ')[0]},\n\nI noticed we share ${aiModal.mutuals} mutual connections here at Elmhurst University! `;
 if (aiModal.type === 'Alumni') {
 draft += `I’m really impressed by your post-grad career and would love to connect and learn from your journey.`;
 } else if (aiModal.type === 'Faculty') {
 draft += `Your work within the department is incredibly inspiring. I'd love to connect to follow your ongoing research!`;
 } else {
 draft += `As a fellow student, I'm always looking to expand my network with driven peers. Let's connect!`;
 }
 setAiIntro(draft);
 setIsGenerating(false);
 }, 1200);
 }}
 disabled={isGenerating}
 >
 {isGenerating ? ' Generating...' : ' Auto-Draft with AI'}
 </button>
 <button
 className="btn-primary"
 style={{ padding: '0 32px' }}
 onClick={() => {
 handleConnect(aiModal.id);
 setAiModal(null);
 setAiIntro('');
 }}
 >
 Send Request
 </button>
 </div>
 </div>
 </div>
 )}

 {/* Global Toast */}
 {toast && (
 <div className="toast-notification">
 {toast}
 </div>
 )}
 </div>
 );
}

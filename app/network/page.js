'use client';
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';

export default function NetworkPage() {
 const [search, setSearch] = useState('');
 const [people, setPeople] = useState([]);
 const [toast, setToast] = useState(null);
 const [aiModal, setAiModal] = useState(null);
 const [aiIntro, setAiIntro] = useState('');
 const [isGenerating, setIsGenerating] = useState(false);
 const [activeUser, setActiveUser] = useState(null);

 useEffect(() => {
   async function fetchNetwork() {
     try {
       const stored = localStorage.getItem('jc-user');
       if (!stored) {
         console.log('No user in localStorage');
         return;
       }
       
       const user = JSON.parse(stored);
       setActiveUser(user);
       
       console.log('=== NETWORK DEBUG ===');
       console.log('Current user:', user);
       console.log('Current user ID:', user.id);

       const usersRes = await fetch('/api/users', { headers: { 'Cache-Control': 'no-store' } });
       const usersData = await usersRes.json();

       console.log('All users from API:', usersData.users);

       if (usersData.success && usersData.users.length > 0) {
         const filtered = usersData.users.filter(u => {
           const isCurrentUser = u.id === user.id;
           console.log(`User ${u.displayName} (ID: ${u.id}) - Current user? ${isCurrentUser}`);
           return !isCurrentUser; // Exclude current user
         });
           
         console.log('Filtered users (should exclude you):', filtered);

         const formattedUsers = filtered.map(u => ({
           id: u.id,
           name: u.displayName || u.adUsername || 'Student',
           role: u.major || 'Undecided Major',
           type: u.role?.includes('Professor') ? 'Faculty' : 'Student',
           mutuals: Math.floor(Math.random() * 20),
           connectionStatus: 'NONE',
           avatar: (u.displayName || u.adUsername || 'U').split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase()
         }));
         
         console.log('Final formatted users:', formattedUsers);
         setPeople(formattedUsers);
       }
     } catch (e) {
       console.error("Network sync failed", e);
     }
   }
   fetchNetwork();
 }, []);

 const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3500); };

 const handleConnect = async (id) => {
   if (!activeUser) {
     showToast('Please sign in to connect with peers!');
     return;
   }
   
   const person = people.find(p => p.id === id);
   if (!person) return;
   
   setPeople(prev => prev.map(p => {
     if (p.id !== id) return p;
     showToast(`Connection request sent to ${p.name}!`);
     return { ...p, connectionStatus: 'PENDING' };
   }));

   try {
     await fetch('/api/connections', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
         followerId: activeUser.id,
         followingId: id,
         action: 'connect'
       })
     });
   } catch (e) {
     console.error('Failed to update connection', e);
   }
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
 <span style={{ position: 'absolute', left: 16, top: 14, fontSize: '1.2rem', opacity: 0.5 }}>🔍</span>
 </div>
 </header>

 <main style={{ maxWidth: 1100, margin: '40px auto', padding: '0 20px' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
 <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{search ? `Search Results (${filtered.length})` : 'People You May Know'}</h2>
 </div>

 {filtered.length === 0 ? (
 <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--card-bg)', borderRadius: 16, border: '1px dashed var(--glass-border)' }}>
 <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔍</div>
 <h3 style={{ fontSize: '1.2rem', marginBottom: 8 }}>No results found</h3>
 <p style={{ color: 'var(--gray-500)' }}>
   {search ? `We couldn't find anyone matching "${search}". Try searching for something else.` : 'No other users available yet. Check back soon!'}
 </p>
 </div>
 ) : (
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
 {filtered.map(p => (
 <div key={p.id} className="card" style={{ display: 'flex', flexDirection: 'column', padding: 24, textAlign: 'center', alignItems: 'center', transition: 'transform 0.2s' }}>
 <div className="avatar" style={{ width: 80, height: 80, fontSize: '2rem', marginBottom: 16, background: p.type === 'Faculty' ? 'var(--blue)' : 'var(--blue-light)' }}>
 {p.avatar}
 </div>
 <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 4 }}>{p.name}</h3>
 <p style={{ fontSize: '0.9rem', color: 'var(--gray-400)', marginBottom: 8 }}>{p.role}</p>
 <div style={{ fontSize: '0.8rem', color: 'var(--gray-400)', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '4px 12px', borderRadius: 12, marginBottom: 20 }}>
 {p.mutuals} mutual connections
 </div>
 <div style={{ marginTop: 'auto', width: '100%' }}>
 {p.connectionStatus === 'PENDING' ? (
   <button className="btn-ghost" style={{ width: '100%', padding: '10px 0', borderRadius: 8, fontWeight: 600, opacity: 0.6, cursor: 'default' }} disabled>⏳ Pending</button>
 ) : (
   <button className="btn-primary" style={{ width: '100%', padding: '10px 0', borderRadius: 8, fontWeight: 600 }} onClick={() => setAiModal(p)}>+ Connect</button>
 )}
 </div>
 </div>
 ))}
 </div>
 )}
 </main>

 {aiModal && (
 <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
 <div className="card" style={{ width: '100%', maxWidth: 520, padding: 32 }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
 <h2 style={{ fontSize: '1.4rem' }}>Connect with {aiModal.name}</h2>
 <button onClick={() => { setAiModal(null); setAiIntro(''); }} style={{ fontSize: '1.2rem', background: 'transparent', color: 'var(--text-muted)', border: 'none', cursor: 'pointer' }}>✕</button>
 </div>
 <p style={{ fontSize: '0.9rem', color: 'var(--gray-400)', marginBottom: 16 }}>
 Send a personalized connection request!
 </p>
 
 <textarea
 className="form-textarea"
 style={{ minHeight: 140, fontSize: '0.95rem', marginBottom: 16, background: 'rgba(255,255,255,0.02)' }}
 placeholder="Write your invitation note..."
 value={aiIntro}
 onChange={e => setAiIntro(e.target.value)}
 />

 <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
 <button className="btn-ghost" style={{ flex: 1, borderColor: 'rgba(167,139,250,0.4)', color: '#a78bfa', fontWeight: 600 }} onClick={() => {
 setIsGenerating(true);
 setTimeout(() => {
 setAiIntro(`Hi ${aiModal.name.split(' ')[0]},\n\nI'd love to connect with you on JayConnect! Let's build our network together.\n\nLooking forward to it!`);
 setIsGenerating(false);
 }, 1200);
 }} disabled={isGenerating}>
 {isGenerating ? '✨ Generating...' : '✨ Auto-Draft'}
 </button>
 <button className="btn-primary" style={{ padding: '0 32px' }} onClick={() => { handleConnect(aiModal.id); setAiModal(null); setAiIntro(''); }}>
 Send Request
 </button>
 </div>
 </div>
 </div>
 )}

 {toast && (
 <div className="toast-notification">{toast}</div>
 )}
 </div>
 );
}

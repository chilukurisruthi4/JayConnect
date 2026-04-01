'use client';
import { useState, useRef, useEffect } from 'react';
import Navbar from '../../components/Navbar';

// Dummy connections network for JayConnect
const CONNECTIONS = [
 {
 id: '1',
 name: 'Dr. Emily Chen',
 title: 'Professor of Computer Science · Elmhurst Univ',
 role: 'Faculty',
 initials: 'EC',
 color: '#8b5cf6',
 chat: [
 { text: 'Hi Sruthi, saw your recent project on the Feed. Very impressive optimization.', isSelf: false, time: 'Mon 10:30 AM' },
 { text: 'Thank you Professor! I used the techniques we covered in Database Management.', isSelf: true, time: 'Mon 11:15 AM' },
 ],
 },
 {
 id: '2',
 name: 'Marcus Johnson',
 title: 'Senior Career Advisor · Elmhurst Career Services',
 role: 'Advisor',
 initials: 'MJ',
 color: '#10b981',
 chat: [
 { text: 'Hi Sruthi! I was reviewing your ATS-optimized resume uploaded to JayConnect, and the new format looks fantastic.', isSelf: false, time: 'Yesterday 2:10 PM' },
 { text: 'Are you open to a quick call next week to discuss strategies for the upcoming Elmhurst Spring Career Fair?', isSelf: false, time: 'Yesterday 2:12 PM' },
 ],
 },
 {
 id: '3',
 name: 'Alex Rivera',
 title: 'Software Engineer · Alumni',
 role: 'Alumni',
 initials: 'AR',
 color: '#f59e0b',
 chat: [
 { text: 'Hey wait, are you going to the April Hackathon?', isSelf: false, time: '9:40 AM' },
 { text: 'Yes! I just registered actually.', isSelf: true, time: '9:45 AM' },
 { text: 'Awesome, want to team up?', isSelf: false, time: '10:00 AM' },
 ],
 }
];

export default function MessagesPage() {
 const [threads, setThreads] = useState(CONNECTIONS);
 const [activeId, setActiveId] = useState(CONNECTIONS[1].id);
 const [text, setText] = useState('');
 const [isTyping, setIsTyping] = useState(false);
 const chatEndRef = useRef(null);

 const activeUser = threads.find(t => t.id === activeId);

 useEffect(() => {
 chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
 }, [activeId, threads, isTyping]);

 const handleSend = (e) => {
 e.preventDefault();
 if (!text.trim()) return;

 const val = text;
 setText('');

 // 1) Append user message
 setThreads(curr => curr.map(t => {
 if (t.id === activeId) {
 return { ...t, chat: [...t.chat, { text: val, isSelf: true, time: 'Just now' }] };
 }
 return t;
 }));

 // 2) Simulate reply
 setIsTyping(true);
 setTimeout(() => {
 setIsTyping(false);
 setThreads(curr => curr.map(t => {
 if (t.id === activeId) {
 let reply = 'That sounds great! Let\'s connect soon.';
 if (val.toLowerCase().includes('resume') || val.toLowerCase().includes('interview')) {
 reply = 'Absolutely, I\'d love to review that with you.';
 } else if (val.toLowerCase().includes('call') || val.toLowerCase().includes('time') || val.toLowerCase().includes('yes')) {
 reply = 'Does Tuesday at 2 PM work for you?';
 } else if (val.toLowerCase().includes('hackathon')) {
 reply = 'Perfect. Let\'s coordinate on Discord!';
 }
 return { ...t, chat: [...t.chat, { text: reply, isSelf: false, time: 'Just now' }] };
 }
 return t;
 }));
 }, 1500 + Math.random() * 1000);
 };

 return (
 <div className="page-shell" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
 <Navbar />
 <div style={{ flex: 1, display: 'flex', overflow: 'hidden', padding: '24px', maxWidth: '1200px', margin: '0 auto', width: '100%', gap: '20px' }}>
 
 {/* LEFT: Connections List */}
 <div style={{ width: '340px', background: 'var(--bg)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-xl)', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}>
 <div style={{ padding: '20px', borderBottom: '1px solid var(--glass-border)' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
 <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Connections</h2>
 <button className="btn-ghost" style={{ padding: '6px' }}>️</button>
 </div>
 <input className="form-input" placeholder="Search messages..." style={{ padding: '10px 14px', borderRadius: 20 }} />
 </div>
 <div style={{ overflowY: 'auto', flex: 1 }}>
 {threads.map(t => {
 const lastMsg = t.chat[t.chat.length - 1];
 const isActive = t.id === activeId;
 return (
 <div 
 key={t.id} 
 onClick={() => setActiveId(t.id)}
 style={{ 
 padding: '16px 20px', 
 cursor: 'pointer',
 borderBottom: '1px solid var(--glass-border)',
 background: isActive ? 'rgba(255,255,255,0.06)' : 'transparent',
 borderLeft: isActive ? '3px solid #60a5fa' : '3px solid transparent',
 transition: 'all var(--transition)'
 }}
 >
 <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
 <div style={{ width: 48, height: 48, borderRadius: '50%', background: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '1.1rem', flexShrink: 0 }}>
 {t.initials}
 </div>
 <div style={{ overflow: 'hidden', flex: 1 }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
 <div style={{ fontWeight: 700, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.name}</div>
 <div style={{ fontSize: '0.7rem', color: 'var(--gray-500)' }}>{lastMsg ? lastMsg.time.split(' ')[0] : ''}</div>
 </div>
 <div style={{ fontSize: '0.8rem', color: 'var(--gray-400)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '4px' }}>
 {lastMsg ? (lastMsg.isSelf ? `You: ${lastMsg.text}` : lastMsg.text) : 'Start a conversation...'}
 </div>
 </div>
 </div>
 </div>
 );
 })}
 </div>
 </div>

 {/* RIGHT: Active Chat */}
 <div style={{ flex: 1, background: 'var(--bg)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-xl)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
 {activeUser ? (
 <>
 {/* Chat Header */}
 <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
 <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
 <div style={{ width: 50, height: 50, borderRadius: '50%', background: activeUser.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '1.3rem' }}>
 {activeUser.initials}
 </div>
 <div>
 <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{activeUser.name} <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '3px 10px', borderRadius: 12, background: 'rgba(255,255,255,0.08)', marginLeft: 8 }}>{activeUser.role}</span></div>
 <div style={{ fontSize: '0.85rem', color: 'var(--gray-400)', marginTop: 4 }}>{activeUser.title}</div>
 </div>
 </div>
 <button className="btn-ghost" style={{ fontSize: '0.85rem' }}>View Profile</button>
 </div>

 {/* Chat Messages */}
 <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
 <div style={{ textAlign: 'center', margin: '10px 0 20px' }}>
 <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.06)', padding: '6px 14px', borderRadius: 16, color: 'var(--gray-500)' }}>You connected on JayConnect</span>
 </div>
 
 {activeUser.chat.map((msg, i) => {
 const isSelf = msg.isSelf;
 return (
 <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: isSelf ? 'flex-end' : 'flex-start' }}>
 <div style={{ 
 maxWidth: '75%', 
 padding: '14px 18px', 
 background: isSelf ? 'var(--blue)' : 'rgba(255,255,255,0.08)',
 color: isSelf ? '#fff' : 'inherit',
 border: isSelf ? 'none' : '1px solid rgba(255,255,255,0.1)',
 borderRadius: isSelf ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
 fontSize: '0.95rem',
 lineHeight: 1.5,
 boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
 }}>
 {msg.text}
 </div>
 <div style={{ fontSize: '0.7rem', color: 'var(--gray-500)', marginTop: '6px', marginRight: isSelf ? '4px' : 0, marginLeft: isSelf ? 0 : '4px' }}>
 {msg.time}
 </div>
 </div>
 );
 })}

 {isTyping && (
 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
 <div style={{ padding: '14px 20px', background: 'rgba(255,255,255,0.05)', borderRadius: '18px 18px 18px 4px', fontSize: '1rem', color: 'var(--gray-400)', letterSpacing: '2px' }}>
 <span className="typing-dot">.</span><span className="typing-dot">.</span><span className="typing-dot">.</span>
 </div>
 </div>
 )}
 
 <div ref={chatEndRef} style={{ float: 'left', clear: 'both' }} />
 </div>

 {/* Chat Input */}
 <form onSubmit={handleSend} style={{ padding: '20px 24px', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '12px', background: 'rgba(255,255,255,0.015)' }}>
 <button type="button" style={{ background: 'transparent', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: 'var(--gray-400)' }}></button>
 <input 
 className="form-input" 
 style={{ flex: 1, borderRadius: 24, padding: '14px 20px', background: 'var(--input-bg)', border: '1px solid var(--glass-border)', fontSize: '0.95rem' }} 
 placeholder={`Message ${activeUser.name.split(' ')[0]}...`}
 value={text}
 onChange={e => setText(e.target.value)}
 />
 <button type="submit" className="btn-primary" style={{ borderRadius: 24, padding: '0 24px', opacity: text.trim() ? 1 : 0.5, cursor: text.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: '8px' }}>
 Send <span style={{ fontSize: '1.1rem' }}></span>
 </button>
 </form>
 </>
 ) : (
 <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-500)' }}>
 Select a connection to start messaging
 </div>
 )}
 </div>

 </div>
 
 <style jsx>{`
 .typing-dot { animation: typing 1.4s infinite ease-in-out both; font-weight: bold; }
 .typing-dot:nth-child(1) { animation-delay: -0.32s; }
 .typing-dot:nth-child(2) { animation-delay: -0.16s; }
 @keyframes typing { 0%, 80%, 100% { opacity: 0; } 40% { opacity: 1; } }
 `}</style>
 </div>
 );
}

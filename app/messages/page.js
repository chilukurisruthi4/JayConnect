'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/Navbar';

export default function MessagesPage() {
 const [threads, setThreads] = useState([]);
 const [activeId, setActiveId] = useState(null);
 const [text, setText] = useState('');
 const [isTyping, setIsTyping] = useState(false);
 const [localUser, setLocalUser] = useState(null);
 const chatEndRef = useRef(null);

 useEffect(() => {
   const stored = localStorage.getItem('jc-user');
   let activeU = null;
   if (stored) {
     activeU = JSON.parse(stored);
     setLocalUser(activeU);
   }

   async function fetchMessages() {
     try {
       // Fetch all users to create the left sidebar threads
       const usersRes = await fetch('/api/users');
       const usersData = await usersRes.json();
       
       let activeMessages = [];
       if (activeU?.id) {
         const msgRes = await fetch(`/api/messages?userId=${activeU.id}`);
         const msgData = await msgRes.json();
         if (msgData.success) activeMessages = msgData.messages;
       }

       if (usersData.success) {
         const builtThreads = usersData.users
           .filter(u => u.id !== activeU?.id)
           .map(u => {
             const userMsgs = activeMessages.filter(m => m.senderId === u.id || m.receiverId === u.id);
             return {
               id: u.id,
               name: u.displayName || u.adUsername || 'Student',
               title: u.bio || 'Elmhurst University Network',
               initials: (u.displayName || u.adUsername || 'U').substring(0, 2).toUpperCase(),
               color: '#1565c0',
               chat: userMsgs.map(m => ({
                 text: m.content,
                 isSelf: m.senderId === activeU?.id,
                 time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
               }))
             };
           });
           
         const AI_AGENT = {
           id: '0',
           name: 'JayConnect AI Assistant 💬',
           title: 'Real-time Generative AI · Platform Support',
           role: 'AI Agent',
           initials: 'AI',
           color: '#10b981',
           chat: [
             { text: 'Hello! I am your JayConnect AI Assistant. I can help you draft connection requests or optimize your feed posts. Try asking me about your network!', isSelf: false, time: 'Now' },
           ],
         };

         setThreads([AI_AGENT, ...builtThreads]);
         if (!activeId) setActiveId('0');
       }
     } catch(e) {}
   }
   if (typeof window !== 'undefined') fetchMessages();
 }, []);

 const activeUser = threads.find(t => t.id === activeId);

 useEffect(() => {
 chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
 }, [activeId, threads, isTyping]);

 const handleSend = async (e) => {
 e.preventDefault();
 if (!text.trim() || !localUser || !activeId) return;

 const val = text;
 setText('');

 // Optimistic Update
 setThreads(curr => curr.map(t => {
 if (t.id === activeId) {
 return { ...t, chat: [...t.chat, { text: val, isSelf: true, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }] };
 }
 return t;
 }));

 if (activeId === '0') {
   // AI Agent routing logic
   setIsTyping(true);
   setTimeout(() => {
     let reply = 'I processed your request! Since I am an AI demo, try asking me about finding projects or connecting with professors.';
     if (val.toLowerCase().includes('project') || val.toLowerCase().includes('hackathon')) {
       reply = 'That sounds like a great project! You should post about it on the Feed to find teammates.';
     } else if (val.toLowerCase().includes('prof') || val.toLowerCase().includes('connect')) {
       reply = 'Connecting with faculty is crucial. When messaging a professor, always highlight a specific piece of their research you admire.';
     }
     setIsTyping(false);
     setThreads(curr => curr.map(t => {
       if (t.id === '0') {
         return { ...t, chat: [...t.chat, { text: reply, isSelf: false, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }] };
       }
       return t;
     }));
   }, 1500);
   return;
 }

 try {
   await fetch('/api/messages', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       senderId: localUser.id,
       receiverId: activeId,
       content: val
     })
   });
 } catch (err) {
   console.error('Failed to post message', err);
 }
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
 <motion.div 
 key={i} 
 initial={{ opacity: 0, y: 15, scale: 0.95 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 transition={{ type: "spring", stiffness: 350, damping: 25 }}
 style={{ display: 'flex', flexDirection: 'column', alignItems: isSelf ? 'flex-end' : 'flex-start' }}
 >
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
 </motion.div>
 );
 })}

 <AnimatePresence>
 {isTyping && (
 <motion.div 
 initial={{ opacity: 0, scale: 0.8, y: 10 }} 
 animate={{ opacity: 1, scale: 1, y: 0 }} 
 exit={{ opacity: 0, scale: 0.8, y: -10 }}
 transition={{ type: "spring", stiffness: 400, damping: 30 }}
 style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
 >
 <div style={{ padding: '14px 20px', background: 'rgba(255,255,255,0.05)', borderRadius: '18px 18px 18px 4px', fontSize: '1rem', color: 'var(--gray-400)', letterSpacing: '2px' }}>
 <span className="typing-dot">.</span><span className="typing-dot">.</span><span className="typing-dot">.</span>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 
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

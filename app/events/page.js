'use client';
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';

const EVENTS = [
 {
 id: 1,
 emoji: '',
 banner: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
 title: 'JayConnect April Hackathon',
 date: 'April 12–14, 2026',
 type: 'hackathon',
 typeBadge: ' Hackathon',
 typeColor: 'rgba(139,92,246,0.25)',
 typeText: '#a78bfa',
 desc: '48-hour online hackathon open to all Elmhurst students. Build something amazing, present to judges, and win prizes. Theme: AI for Social Good.',
 location: 'Online · Discord + Devpost',
 attendees: 47,
 avaColors: ['#6366f1', '#ec4899', '#f59e0b', '#10b981'],
 registered: false,
 sponsored: 'Department of CS',
 },
 {
 id: 2,
 emoji: '️',
 banner: 'linear-gradient(135deg,#0f766e,#065f46)',
 title: 'Tech Career Panel',
 date: 'March 28, 2026 · 4:00 PM',
 type: 'panel',
 typeBadge: '️ Panel',
 typeColor: 'rgba(6,95,70,0.3)',
 typeText: '#34d399',
 desc: 'Five industry professionals from Google, Microsoft, and local startups share how they broke into tech. Live Q&A after.',
 location: 'Frick Center, Room 101 + Zoom',
 attendees: 112,
 avaColors: ['#059669', '#0284c7', '#dc2626', '#7c3aed'],
 registered: false,
 sponsored: 'Career Services',
 },
 {
 id: 3,
 emoji: '',
 banner: 'linear-gradient(135deg,#1d4ed8,#1565c0)',
 title: 'Machine Learning Workshop',
 date: 'April 4, 2026 · 2:00 PM',
 type: 'workshop',
 typeBadge: ' Workshop',
 typeColor: 'rgba(21,101,192,0.25)',
 typeText: '#60a5fa',
 desc: 'Hands-on workshop covering PyTorch fundamentals, model training, and deploying ML models to the cloud. Bring your laptop!',
 location: 'A.C. Buehler Library, Lab B',
 attendees: 28,
 avaColors: ['#1d4ed8', '#0891b2', '#6366f1'],
 registered: false,
 sponsored: 'Prof. Chen',
 },
 {
 id: 4,
 emoji: '️',
 banner: 'linear-gradient(135deg,#0e7490,#0284c7)',
 title: 'AWS Cloud Certification Bootcamp',
 date: 'April 19–20, 2026',
 type: 'workshop',
 typeBadge: ' Workshop',
 typeColor: 'rgba(21,101,192,0.25)',
 typeText: '#60a5fa',
 desc: 'Two-day intensive prep session for the AWS Cloud Practitioner exam. All materials provided. Limited to 20 students.',
 location: 'Online · Zoom',
 attendees: 18,
 avaColors: ['#0e7490', '#0284c7'],
 registered: false,
 sponsored: 'AWS Educate',
 },
 {
 id: 5,
 emoji: '',
 banner: 'linear-gradient(135deg,#be185d,#9333ea)',
 title: 'Women in Tech Networking Night',
 date: 'April 9, 2026 · 6:00 PM',
 type: 'networking',
 typeBadge: ' Networking',
 typeColor: 'rgba(236,72,153,0.2)',
 typeText: '#f472b6',
 desc: 'An evening of networking, mentorship, and inspiration for women pursuing careers in technology. Light refreshments provided.',
 location: 'Elmhurst University Student Center',
 attendees: 63,
 avaColors: ['#be185d', '#9333ea', '#ec4899', '#7c3aed'],
 registered: false,
 sponsored: 'Student Affairs',
 },
 {
 id: 6,
 emoji: '',
 banner: 'linear-gradient(135deg,#b45309,#d97706)',
 title: 'May Hackathon – Mobile Edition',
 date: 'May 10–12, 2026',
 type: 'hackathon',
 typeBadge: ' Hackathon',
 typeColor: 'rgba(139,92,246,0.25)',
 typeText: '#a78bfa',
 desc: 'Build a mobile app in 48 hours. Prizes for Best UX, Most Innovative, and Best Use of AI. Registration opens April 20.',
 location: 'Online · Discord + Devpost',
 attendees: 23,
 avaColors: ['#b45309', '#d97706'],
 registered: false,
 sponsored: 'Department of CS',
 },
];

const FILTERS = ['All', 'Hackathons', 'Workshops', 'Panels', 'Networking'];

function useCountdown(targetDate) {
 const [time, setTime] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
 useEffect(() => {
 const calc = () => {
 const diff = new Date(targetDate) - new Date();
 if (diff <= 0) return;
 setTime({
 days: Math.floor(diff / 86400000),
 hours: Math.floor((diff % 86400000) / 3600000),
 mins: Math.floor((diff % 3600000) / 60000),
 secs: Math.floor((diff % 60000) / 1000),
 });
 };
 calc();
 const id = setInterval(calc, 1000);
 return () => clearInterval(id);
 }, [targetDate]);
 return time;
}

export default function EventsPage() {
 const [events, setEvents] = useState(EVENTS);
 const [filter, setFilter] = useState('All');
 const [toast, setToast] = useState(null);
 const [isCreating, setIsCreating] = useState(false);
 const [newEvent, setNewEvent] = useState({ title: '', type: 'networking', date: '', location: '', desc: '' });
 const [activeUser, setActiveUser] = useState(null);
 const countdown = useCountdown('2026-04-12T00:00:00');

 useEffect(() => {
   const stored = localStorage.getItem('jc-user');
   if (stored) setActiveUser(JSON.parse(stored));

   async function fetchEvents() {
     try {
       const res = await fetch('/api/events');
       const data = await res.json();
       if (data.success && data.events.length > 0) {
         const eventTypeMap = {
           hackathon: { typeBadge: ' Hackathon', typeColor: 'rgba(139,92,246,0.25)', typeText: '#a78bfa', emoji: '' },
           workshop: { typeBadge: ' Workshop', typeColor: 'rgba(21,101,192,0.25)', typeText: '#60a5fa', emoji: '' },
           panel: { typeBadge: '️ Panel', typeColor: 'rgba(6,95,70,0.3)', typeText: '#34d399', emoji: '️' },
           networking: { typeBadge: ' Networking', typeColor: 'rgba(245,166,35,0.2)', typeText: '#fbbf24', emoji: '️' },
         };
         
         const formattedEvents = data.events.map(ev => ({
           id: ev.id,
           banner: 'linear-gradient(135deg,#1d4ed8,#1565c0)',
           title: ev.title,
           date: new Date(ev.eventDate).toLocaleString(),
           type: 'workshop', // Fallback type
           ...eventTypeMap['workshop'],
           desc: ev.description || 'Join us for this upcoming event!',
           location: ev.location,
           attendees: Math.floor(Math.random() * 50) + 1,
           avaColors: ['#1d4ed8', '#0891b2'],
           registered: false,
           sponsored: ev.organizer?.fullName || 'Event Organizer'
         }));
         // Prepend to static events or replace, we'll prepend for showcase
         setEvents(prev => [...formattedEvents, ...prev]);
       }
     } catch(e) {
       console.error(e);
     }
   }
   if (typeof window !== 'undefined') fetchEvents();
 }, []);

 const handleCreateEvent = async (e) => {
   e.preventDefault();
   if (!newEvent.title.trim()) return;

   if (!activeUser) {
     showToast('Please login to create an event!');
     return;
   }

   const eventTypeMap = {
     hackathon: { typeBadge: ' Hackathon', typeColor: 'rgba(139,92,246,0.25)', typeText: '#a78bfa', emoji: '' },
     workshop: { typeBadge: ' Workshop', typeColor: 'rgba(21,101,192,0.25)', typeText: '#60a5fa', emoji: '' },
     panel: { typeBadge: '️ Panel', typeColor: 'rgba(6,95,70,0.3)', typeText: '#34d399', emoji: '️' },
     networking: { typeBadge: ' Networking', typeColor: 'rgba(245,166,35,0.2)', typeText: '#fbbf24', emoji: '️' },
   };

   try {
     const res = await fetch('/api/events', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
         title: newEvent.title,
         description: newEvent.desc,
         location: newEvent.location || 'TBA',
         eventDate: newEvent.date || new Date().toISOString(),
         organizerId: activeUser.eNumber || activeUser.id
       })
     });
     const data = await res.json();
     if (data.success) {
       const backendEvent = data.event;
       const created = {
         id: backendEvent.id,
         banner: 'linear-gradient(135deg,#db2777,#9333ea)',
         title: backendEvent.title,
         date: new Date(backendEvent.eventDate).toLocaleString(),
         type: newEvent.type,
         ...eventTypeMap[newEvent.type],
         desc: backendEvent.description,
         location: backendEvent.location,
         attendees: 1,
         avaColors: ['#db2777'],
         registered: true,
         sponsored: activeUser.fullName,
       };

       setEvents([created, ...events]);
       setIsCreating(false);
       setNewEvent({ title: '', date: '', location: '', desc: '', type: 'networking' });
       showToast(' Event Created Successfully!');
     }
   } catch(err) {
     showToast('Failed to connect to the database.');
   }
 };

 const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

 const handleRegister = (id) => {
 setEvents(es => es.map(e => {
 if (e.id !== id) return e;
 if (!e.registered) showToast(` You're registered! Check your email for details.`);
 return { ...e, registered: !e.registered, attendees: e.registered ? e.attendees - 1 : e.attendees + 1 };
 }));
 };

 const filtered = filter === 'All'
 ? events
 : events.filter(e => {
 if (filter === 'Hackathons') return e.type === 'hackathon';
 if (filter === 'Workshops') return e.type === 'workshop';
 if (filter === 'Panels') return e.type === 'panel';
 if (filter === 'Networking') return e.type === 'networking';
 return true;
 });

 return (
 <div className="page-shell">
 <Navbar />
 <div className="events-layout">

 {/* Hackathon Banner */}
 <div className="hackathon-banner">
 <div className="hackathon-info">
 <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
 <span style={{ fontSize: '2rem' }}></span>
 <span style={{
 padding: '4px 12px',
 background: 'rgba(245,166,35,0.2)',
 border: '1px solid rgba(245,166,35,0.35)',
 borderRadius: 20,
 fontSize: '0.72rem',
 fontWeight: 700,
 color: 'var(--gold)',
 letterSpacing: '0.08em',
 textTransform: 'uppercase'
 }}>Monthly Hackathon · April Edition</span>
 </div>
 <h2>JayConnect April Hackathon</h2>
 <p>48-hour online challenge — build AI-powered solutions for social good. Open to all Elmhurst students. Top 3 teams win prizes &amp; recognition.</p>
 <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
 <button className="btn-gold" onClick={() => handleRegister(1)} id="hackathon-register-btn">
 {events[0].registered ? ' Registered!' : ' Register Now'}
 </button>
 <button className="btn-ghost">Learn More</button>
 </div>
 </div>

 <div className="countdown">
 {[
 { label: 'Days', val: countdown.days },
 { label: 'Hours', val: countdown.hours },
 { label: 'Minutes', val: countdown.mins },
 { label: 'Seconds', val: countdown.secs },
 ].map(u => (
 <div className="countdown-unit" key={u.label}>
 <span className="countdown-num">{String(u.val).padStart(2, '0')}</span>
 <span className="countdown-label">{u.label}</span>
 </div>
 ))}
 </div>
 </div>

 {/* Filter + Heading */}
 <div className="section-heading">
 <h1>All Events</h1>
 <button className="btn-primary" onClick={() => setIsCreating(true)} id="create-event-btn">+ Create Event</button>
 </div>

 <div className="filter-bar" style={{ marginBottom: 24 }}>
 {FILTERS.map(f => (
 <button key={f} className={`filter-chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
 {f}
 </button>
 ))}
 </div>

 {/* Events Grid */}
 <div className="events-grid">
 {filtered.map(ev => (
 <div className="event-card" key={ev.id}>
 <div className="event-banner" style={{ background: ev.banner }}>
 <span style={{ fontSize: '3rem' }}>{ev.emoji}</span>
 <div style={{
 position: 'absolute', top: 12, right: 12,
 padding: '4px 10px',
 background: 'rgba(0,0,0,0.4)',
 backdropFilter: 'blur(8px)',
 borderRadius: 20,
 fontSize: '0.72rem',
 fontWeight: 700,
 color: ev.typeText,
 }}>
 {ev.typeBadge}
 </div>
 </div>
 <div className="event-body">
 <div className="event-meta">
 <span className="event-date"> {ev.date}</span>
 </div>
 <div className="event-title">{ev.title}</div>
 <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 10 }}>
 <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}> {ev.location}</span>
 </div>
 <p className="event-desc">{ev.desc}</p>
 <div className="event-footer">
 <div className="event-attendees">
 <div className="attendee-stack">
 {ev.avaColors.map((c, i) => (
 <div key={i} className="attendee-dot" style={{ background: c }} />
 ))}
 </div>
 <span>{ev.attendees} joined</span>
 </div>
 <button
 className={ev.registered ? 'btn-ghost' : 'btn-primary'}
 style={{ padding: '8px 18px', fontSize: '0.8rem' }}
 onClick={() => handleRegister(ev.id)}
 id={`register-btn-${ev.id}`}
 >
 {ev.registered ? ' Registered' : 'Register'}
 </button>
 </div>
 </div>
 </div>
 ))}
 </div>

 {filtered.length === 0 && (
 <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--gray-500)' }}>
 <div style={{ fontSize: '3rem', marginBottom: 12 }}></div>
 <p>No events in this category yet. Check back soon!</p>
 </div>
 )}
 </div>

 {isCreating && (
 <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
 <div style={{ background: 'var(--bg)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-xl)', padding: '32px', width: '90%', maxWidth: '500px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', position: 'relative' }}>
 <button style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', color: 'var(--gray-400)', fontSize: '1.2rem', cursor: 'pointer' }} onClick={() => setIsCreating(false)}>✕</button>
 <h2 style={{ marginBottom: '24px', fontSize: '1.5rem', color: 'var(--text-primary)' }}>Create New Event</h2>
 
 <div className="form-group" style={{ marginBottom: 16 }}>
 <label className="form-label">Event Title</label>
 <input className="form-input" placeholder="e.g. Elmhurst Coding Night" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} />
 </div>
 
 <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
 <div className="form-group" style={{ flex: 1 }}>
 <label className="form-label">Event Type</label>
 <select className="form-input" value={newEvent.type} onChange={e => setNewEvent({...newEvent, type: e.target.value})} style={{ appearance: 'none', background: 'var(--input-bg)' }}>
 <option value="hackathon"> Hackathon</option>
 <option value="workshop"> Workshop</option>
 <option value="panel">️ Panel</option>
 <option value="networking"> Networking</option>
 </select>
 </div>
 <div className="form-group" style={{ flex: 1 }}>
 <label className="form-label">Date &amp; Time</label>
 <input className="form-input" placeholder="e.g. May 15, 2026" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} />
 </div>
 </div>

 <div className="form-group" style={{ marginBottom: 16 }}>
 <label className="form-label">Location</label>
 <input className="form-input" placeholder="e.g. Student Center or Zoom Link" value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} />
 </div>

 <div className="form-group" style={{ marginBottom: 24 }}>
 <label className="form-label">Description</label>
 <textarea className="form-textarea" placeholder="What is this event about?" rows={3} value={newEvent.desc} onChange={e => setNewEvent({...newEvent, desc: e.target.value})} />
 </div>

 <button className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1rem' }} onClick={() => {
 if (!newEvent.title) return showToast('️ Title is required');
 
 const types = {
 hackathon: { emoji: '', banner: 'linear-gradient(135deg,#6366f1,#8b5cf6)', typeBadge: ' Hackathon', typeText: '#a78bfa' },
 workshop: { emoji: '', banner: 'linear-gradient(135deg,#1d4ed8,#1565c0)', typeBadge: ' Workshop', typeText: '#60a5fa' },
 panel: { emoji: '️', banner: 'linear-gradient(135deg,#0f766e,#065f46)', typeBadge: '️ Panel', typeText: '#34d399' },
 networking: { emoji: '', banner: 'linear-gradient(135deg,#be185d,#9333ea)', typeBadge: ' Networking', typeText: '#f472b6' }
 };
 
 const cfg = types[newEvent.type];

 setEvents([{
 id: Date.now(),
 title: newEvent.title,
 date: newEvent.date || 'TBD',
 location: newEvent.location || 'TBA',
 desc: newEvent.desc,
 type: newEvent.type,
 emoji: cfg.emoji,
 banner: cfg.banner,
 typeBadge: cfg.typeBadge,
 typeText: cfg.typeText,
 attendees: 1,
 avaColors: ['#6366f1'],
 registered: true,
 sponsored: 'Sruthi C.',
 }, ...events]);

 setIsCreating(false);
 setNewEvent({ title: '', type: 'networking', date: '', location: '', desc: '' });
 showToast(' Event published successfully!');
 }}>Publish Event</button>
 </div>
 </div>
 )}

 {toast && <div className="toast">{toast}</div>}
 </div>
 );
}

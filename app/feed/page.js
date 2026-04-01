'use client';
import { useState } from 'react';
import Navbar from '../../components/Navbar';

const INITIAL_POSTS = [
 {
 id: 1,
 name: 'Sruthi Chilukuri',
 initials: 'SC',
 color: 'linear-gradient(135deg,#1565c0,#7c3aed)',
 role: 'Student · Computer Science',
 time: '2h ago',
 type: 'project',
 typeBadge: ' Project',
 typeColor: 'rgba(139,92,246,0.2)',
 typeTextColor: '#a78bfa',
 content:
 'Building a real-time collaboration tool for remote teams using WebSockets and Next.js. Looking for teammates who are interested in frontend or backend development. We aim to present at the April hackathon!',
 tags: ['#WebDev', '#Next.js', '#Hackathon'],
 likes: 24,
 comments: 8,
 interested: 6,
 isLiked: false,
 isInterested: false,
 },
 {
 id: 2,
 name: 'Prof. James Chen',
 initials: 'JC',
 color: 'linear-gradient(135deg,#0f766e,#065f46)',
 role: 'Professor · Database Management',
 time: '5h ago',
 type: 'research',
 typeBadge: ' Research',
 typeColor: 'rgba(6,95,70,0.3)',
 typeTextColor: '#34d399',
 content:
 'Looking for motivated students to join a research project on distributed database optimization using AI query planners. Prior SQL experience required. This will count towards your research credits!',
 tags: ['#Research', '#Database', '#AI', '#SQL'],
 likes: 42,
 comments: 15,
 interested: 12,
 isLiked: false,
 isInterested: false,
 },
 {
 id: 3,
 name: 'Alex Kumar',
 initials: 'AK',
 color: 'linear-gradient(135deg,#dc2626,#9333ea)',
 role: 'Student · Data Science',
 time: '1d ago',
 type: 'idea',
 typeBadge: ' Idea',
 typeColor: 'rgba(245,166,35,0.15)',
 typeTextColor: '#fbbf24',
 content:
 'What if we built an AI-powered study buddy that personalizes learning materials based on your weak areas identified from past quiz performance? Thinking ML + NLP + a simple mobile app. Anyone interested?',
 tags: ['#MachineLearning', '#EdTech', '#NLP', '#Mobile'],
 likes: 31,
 comments: 11,
 interested: 9,
 isLiked: false,
 isInterested: false,
 },
 {
 id: 4,
 name: 'Maria Torres',
 initials: 'MT',
 color: 'linear-gradient(135deg,#0284c7,#0369a1)',
 role: 'Student · Cybersecurity',
 time: '2d ago',
 type: 'project',
 typeBadge: ' Project',
 typeColor: 'rgba(139,92,246,0.2)',
 typeTextColor: '#a78bfa',
 content:
 'Completed my first ethical hacking lab using Kali Linux! If anyone wants to team up for the upcoming CTF challenge next month, drop a comment. Also happy to share my notes on network penetration testing basics.',
 tags: ['#Cybersecurity', '#CTF', '#KaliLinux', '#Networking'],
 likes: 55,
 comments: 22,
 interested: 3,
 isLiked: false,
 isInterested: false,
 },
];

const SIDEBAR_PEOPLE = [
 { initials: 'RK', name: 'Rahul K.', sub: 'AI Research', color: '#6366f1' },
 { initials: 'LP', name: 'Lily P.', sub: 'Frontend Dev', color: '#ec4899' },
 { initials: 'DS', name: 'Dr. Singh', sub: 'Prof · ML', color: '#059669' },
 { initials: 'TN', name: 'Tom N.', sub: 'Data Engineering', color: '#f59e0b' },
];

const TOPICS = [
 { name: '#MachineLearning', count: '38 posts' },
 { name: '#WebDevelopment', count: '29 posts' },
 { name: '#Cybersecurity', count: '21 posts' },
 { name: '#DataScience', count: '18 posts' },
 { name: '#CloudComputing', count: '15 posts' },
];

const FILTERS = ['All', 'Projects', 'Research', 'Ideas', 'Events'];

export default function FeedPage() {
 const [posts, setPosts] = useState(INITIAL_POSTS);
 const [activeFilter, setActiveFilter] = useState('All');
 const [newPost, setNewPost] = useState('');
 const [newPostType, setNewPostType] = useState('idea');
 const [isPublishing, setIsPublishing] = useState(false);
 const [toast, setToast] = useState(null);
 const [activeCommentPostId, setActiveCommentPostId] = useState(null);
 const [commentText, setCommentText] = useState('');
 const [isEnhancing, setIsEnhancing] = useState(false);

 const handleAIEnhance = () => {
 if (!newPost.trim()) {
 showToast('Please type a draft first so the AI can analyze it.');
 return;
 }
 setIsEnhancing(true);
 setTimeout(() => {
 const topicKeywords = {
 idea: '#Innovation #ElmhurstBrainstorm #FutureTech',
 project: '#SoftwareEngineering #CampusProject #TechBuild',
 research: '#DataScience #MachineLearning #ElmhurstResearch'
 };
 const hashtags = topicKeywords[newPostType] || '#ElmhurstUniversity';
 
 let baseText = newPost.trim();
 if (baseText.length > 0) baseText = baseText.charAt(0).toUpperCase() + baseText.slice(1);
 if (!/[.!?]$/.test(baseText)) baseText += '.';
 
 let seoPadding = '';
 const lower = baseText.toLowerCase();
 if (lower.includes('research') || lower.includes('data')) {
 seoPadding = ' Investigating novel methodologies to improve predictive accuracy across complex datasets.';
 } else if (lower.includes('app') || lower.includes('web')) {
 seoPadding = ' Optimized the architecture to ensure a seamless, high-performance user experience.';
 } else if (baseText.length < 50) {
 seoPadding = ' Looking to connect with fellow peers to gather feedback and collaborate!';
 }
 
 const enhancedText = `Excited to share an update: ${baseText}${seoPadding}\n\n${hashtags} #StudentSuccess`;
 
 setNewPost(enhancedText);
 setIsEnhancing(false);
 showToast('Post enhanced for engagement & SEO!');
 }, 1200);
 };

 const showToast = (msg) => {
 setToast(msg);
 setTimeout(() => setToast(null), 3500);
 };

 const handleLike = (id) => {
 setPosts(ps => ps.map(p =>
 p.id === id
 ? { ...p, likes: p.isLiked ? p.likes - 1 : p.likes + 1, isLiked: !p.isLiked }
 : p
 ));
 };

 const handleInterest = (id) => {
 setPosts(ps => ps.map(p => {
 if (p.id !== id) return p;
 if (!p.isInterested) showToast(" Your interest has been sent! The author will be notified.");
 return { ...p, interested: p.isInterested ? p.interested - 1 : p.interested + 1, isInterested: !p.isInterested };
 }));
 };

 // ==========================================
 // DATABASE INTEGRATION POINT (VM-4)
 // ==========================================
 // When the Azure PostgreSQL server is live, this function will format the 
 // new post and send a POST request to an API route (e.g., /api/posts), 
 // which will run: `await prisma.post.create({ data: ... })`
 const handlePost = () => {
 if (!newPost.trim()) return;
 setIsPublishing(true);

 // Simulate network delay to database
 setTimeout(() => {
 const typeMap = {
 idea: { typeBadge: ' Idea', typeColor: 'rgba(245,166,35,0.15)', typeTextColor: '#fbbf24' },
 project: { typeBadge: ' Project', typeColor: 'rgba(139,92,246,0.2)', typeTextColor: '#a78bfa' },
 research: { typeBadge: ' Research', typeColor: 'rgba(6,95,70,0.3)', typeTextColor: '#34d399' },
 };
 setPosts(ps => [{
 id: Date.now(),
 name: 'Sruthi Chilukuri',
 initials: 'SC',
 color: 'linear-gradient(135deg,#1565c0,#7c3aed)',
 role: 'Student · Computer Science',
 time: 'just now',
 type: newPostType,
 ...typeMap[newPostType],
 content: newPost,
 tags: [],
 likes: 0, comments: 0, interested: 0,
 isLiked: false, isInterested: false,
 }, ...ps]);
 setNewPost('');
 setIsPublishing(false);
 showToast(' Post securely saved to Database and published!');
 }, 800); // Simulated DB latency
 };

 const filtered = activeFilter === 'All'
 ? posts
 : posts.filter(p => p.type === activeFilter.toLowerCase().replace('s', ''));

 return (
 <div className="page-shell">
 <Navbar />
 <div className="feed-layout">
 {/* Left Sidebar */}
 <aside>
 <div className="sidebar-card">
 <div className="sidebar-title">Suggested to Follow</div>
 {SIDEBAR_PEOPLE.map(p => (
 <div className="sidebar-prof-item" key={p.initials}>
 <div className="prof-ava" style={{ background: p.color }}>{p.initials}</div>
 <div className="prof-info">
 <div className="prof-name">{p.name}</div>
 <div className="prof-sub">{p.sub}</div>
 </div>
 <button className="btn-ghost" style={{ padding: '4px 10px', fontSize: '0.72rem' }}>Follow</button>
 </div>
 ))}
 </div>
 <div className="sidebar-card">
 <div className="sidebar-title">Trending Topics</div>
 {TOPICS.map(t => (
 <div className="topic-pill" key={t.name}>
 <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#3b82f6' }}>{t.name}</span>
 <span className="topic-pill-count" style={{ fontWeight: 600, fontSize: '0.85rem' }}>{t.count}</span>
 </div>
 ))}
 </div>
 </aside>

 {/* Main Feed */}
 <main>
 {/* Composer */}
 <div className="composer">
 <div className="composer-row">
 <div className="avatar" style={{ flexShrink: 0 }}>SC</div>
 <textarea
 className="composer-input"
 style={{ minHeight: '60px', resize: 'vertical' }}
 placeholder="Share an idea, project update, or research opportunity…"
 value={newPost}
 onChange={e => setNewPost(e.target.value)}
 onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handlePost()}
 id="post-input"
 disabled={isPublishing || isEnhancing}
 />
 </div>
 <div className="composer-actions">
 {['idea', 'project', 'research'].map(t => (
 <button
 key={t}
 className="composer-btn"
 onClick={() => setNewPostType(t)}
 style={newPostType === t ? { borderColor: 'var(--blue-light)', color: '#60a5fa', background: 'rgba(21,101,192,0.15)' } : {}}
 >
 {t === 'idea' ? '' : t === 'project' ? '' : ''} {t.charAt(0).toUpperCase() + t.slice(1)}
 </button>
 ))}
 <button
 className="btn-ghost"
 style={{ marginLeft: 'auto', padding: '6px 14px', fontSize: '0.82rem', color: '#a78bfa', borderColor: 'rgba(167,139,250,0.4)', opacity: isEnhancing ? 0.6 : 1, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}
 onClick={handleAIEnhance}
 disabled={isEnhancing || isPublishing}
 >
 {isEnhancing ? ' Analyzing...' : ' AI Enhance'}
 </button>
 <button
 className="btn-primary"
 style={{ padding: '8px 20px', fontSize: '0.82rem', opacity: isPublishing ? 0.7 : 1 }}
 onClick={handlePost}
 id="publish-btn"
 disabled={isPublishing || isEnhancing}
 >
 {isPublishing ? 'Saving to DB...' : 'Publish'}
 </button>
 </div>
 </div>

 {/* Filters */}
 <div className="filter-bar">
 {FILTERS.map(f => (
 <button
 key={f}
 className={`filter-chip ${activeFilter === f ? 'active' : ''}`}
 onClick={() => setActiveFilter(f)}
 >
 {f}
 </button>
 ))}
 </div>

 {/* Posts */}
 {filtered.map(p => (
 <div className="post-card" key={p.id}>
 <div className="post-header">
 <div className="post-ava" style={{ background: p.color }}>{p.initials}</div>
 <div className="post-meta">
 <div className="post-name">{p.name}</div>
 <div className="post-sub">{p.role} · {p.time}</div>
 </div>
 <div className="post-type-badge" style={{ background: p.typeColor, color: p.typeTextColor }}>
 {p.typeBadge}
 </div>
 </div>

 <p className="post-content">{p.content}</p>

 {p.tags.length > 0 && (
 <div className="post-tags">
 {p.tags.map(t => (
 <span key={t} className="tag tag-blue">{t}</span>
 ))}
 </div>
 )}

 <div className="post-footer">
 <button
 className={`post-action ${p.isLiked ? 'liked' : ''}`}
 onClick={() => handleLike(p.id)}
 >
 <span>{p.isLiked ? '️' : ''}</span> {p.likes}
 </button>
 <button 
 className="post-action"
 onClick={() => setActiveCommentPostId(activeCommentPostId === p.id ? null : p.id)}
 >
 {p.comments}
 </button>
 <button 
 className="post-action"
 onClick={() => {
 navigator.clipboard.writeText(window.location.href);
 showToast(' Link copied to clipboard!');
 }}
 >
 Share
 </button>
 <button
 className={`interested-btn ${p.isInterested ? 'active' : ''}`}
 onClick={() => handleInterest(p.id)}
 style={{ marginLeft: 'auto' }}
 >
 {p.isInterested ? ' Interested' : " I'm Interested"}
 </button>
 </div>

 {activeCommentPostId === p.id && (
 <div style={{ marginTop: '16px', borderTop: '1px solid rgba(120,120,120,0.2)', paddingTop: '16px', display: 'flex', gap: '10px' }}>
 <div className="avatar" style={{ width: '36px', height: '36px', minWidth: '36px', fontSize: '0.8rem', background: 'var(--gold)' }}>SC</div>
 <input 
 className="form-input" 
 style={{ flex: 1, padding: '10px 16px', borderRadius: '20px', background: 'var(--input-bg)', border: '1px solid var(--glass-border)', fontSize: '0.9rem' }}
 placeholder="Type your comment..."
 value={commentText}
 onChange={(e) => setCommentText(e.target.value)}
 onKeyDown={(e) => {
 if (e.key === 'Enter' && commentText.trim()) {
 setPosts(ps => ps.map(post => post.id === p.id ? { ...post, comments: post.comments + 1 } : post));
 setCommentText('');
 setActiveCommentPostId(null);
 showToast(' Comment published!');
 }
 }}
 autoFocus
 />
 <button 
 className="btn-primary" 
 style={{ padding: '0 20px', borderRadius: '20px', opacity: commentText.trim() ? 1 : 0.5, cursor: commentText.trim() ? 'pointer' : 'not-allowed', fontSize: '0.9rem' }}
 onClick={() => {
 if (!commentText.trim()) return;
 setPosts(ps => ps.map(post => post.id === p.id ? { ...post, comments: post.comments + 1 } : post));
 setCommentText('');
 setActiveCommentPostId(null);
 showToast(' Comment published!');
 }}
 >
 Post
 </button>
 </div>
 )}

 </div>
 ))}
 </main>

 {/* Right Sidebar */}
 <aside>
 <div className="sidebar-card" style={{ background: 'rgba(245,166,35,0.08)', borderColor: 'rgba(245,166,35,0.2)' }}>
 <div className="sidebar-title" style={{ color: 'var(--gold)' }}> April Hackathon</div>
 <p style={{ fontSize: '0.83rem', color: 'var(--gray-300)', lineHeight: 1.6, marginBottom: 14 }}>
 Registration is open! Build something amazing in 48 hours with your team.
 </p>
 <div style={{ display: 'flex', gap: 8, fontSize: '0.8rem', color: 'var(--gray-400)', marginBottom: 14 }}>
 <span> April 12–14</span>
 <span>·</span>
 <span>47 joined</span>
 </div>
 <a href="/events" className="btn-gold" style={{ width: '100%', justifyContent: 'center', display: 'flex', textDecoration: 'none' }}>Register Now</a>
 </div>

 <div className="sidebar-card">
 <div className="sidebar-title">Your Activity</div>
 {[
 { label: 'Posts', val: '7' },
 { label: 'Collaborations', val: '3' },
 { label: 'Followers', val: '42' },
 ].map(a => (
 <div key={a.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem' }}>
 <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{a.label}</span>
 <span style={{ fontWeight: 800, color: 'var(--gold)', fontSize: '1rem' }}>{a.val}</span>
 </div>
 ))}
 </div>
 </aside>
 </div>

 {toast && (
 <div className="toast toast-success">
 <span className="toast-icon" />
 {toast}
 </div>
 )}
 </div>
 );
}

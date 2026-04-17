'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/Navbar';

const INITIAL_POSTS = [
 {
 id: 1,
 name: 'Sruthi Chilukuri',
 initials: 'SC',
 color: 'linear-gradient(135deg,#1565c0,#7c3aed)',
 role: 'Student · M.S. Computer Information Technology',
 time: '2h ago',
 type: 'project',
 typeBadge: ' Project',
 typeColor: 'rgba(139,92,246,0.2)',
 typeTextColor: '#a78bfa',
 content:
 'Building a real-time collaboration tool for remote teams using WebSockets and Next.js. Looking for teammates who are interested in frontend or backend development. We aim to present at the April showcase!',
 tags: ['#WebDev', '#Next.js', '#CIT'],
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
 role: 'Professor · M.S. Computer Information Technology',
 time: '5h ago',
 type: 'research',
 typeBadge: ' Research',
 typeColor: 'rgba(6,95,70,0.3)',
 typeTextColor: '#34d399',
 content:
 'Looking for motivated students to join a research project on distributed database optimization using AI query planners. Prior SQL experience required. This will count towards your research credits!',
 tags: ['#Research', '#Database', '#AI', '#CIT'],
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
 role: 'Student · M.S. Data Science and Analytics',
 time: '1d ago',
 type: 'idea',
 typeBadge: ' Idea',
 typeColor: 'rgba(245,166,35,0.15)',
 typeTextColor: '#fbbf24',
 content:
 'What if we built an AI-powered study buddy that personalizes learning materials based on your weak areas identified from past quiz performance? Thinking ML + NLP + a simple mobile app. Anyone interested?',
 tags: ['#MachineLearning', '#EdTech', '#NLP', '#DSA'],
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
 role: 'Student · Master of Project Management',
 time: '2d ago',
 type: 'project',
 typeBadge: ' Project',
 typeColor: 'rgba(139,92,246,0.2)',
 typeTextColor: '#a78bfa',
 content:
 'Just finished leading our scrum sprint for the Agile framework assignment! If any other MPM students want to swap notes on resource allocation or Jira tracking best practices, let\'s connect.',
 tags: ['#ProjectManagement', '#Agile', '#Scrum', '#MPM'],
 likes: 55,
 comments: 22,
 interested: 3,
 isLiked: false,
 isInterested: false,
 },
 {
 id: 5,
 name: 'Sarah Jenkins',
 initials: 'SJ',
 color: 'linear-gradient(135deg,#047857,#064e3b)',
 role: 'Student · MBA',
 time: '4h ago',
 type: 'idea',
 typeBadge: ' Idea',
 typeColor: 'rgba(245,166,35,0.15)',
 typeTextColor: '#fbbf24',
 content:
 'Looking for technical co-founders to help build a B2B SaaS platform for local Elmhurst businesses. I have the business plan, marketing strategy, and initial funding secured. Let\'s build the MVP together!',
 tags: ['#Startup', '#Business', '#Entrepreneurship', '#MBA'],
 likes: 18,
 comments: 14,
 interested: 5,
 isLiked: false,
 isInterested: false,
 }
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

const FILTERS = ['All', 'Projects', 'Research', 'Ideas', 'Showcase'];

export default function FeedPage() {
 const [localUser, setLocalUser] = useState(null);
 const [posts, setPosts] = useState(INITIAL_POSTS);
 const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('jc-user');
      if (stored) {
        setLocalUser(JSON.parse(stored));
      }
    } catch(e) {}
    async function fetchPosts() {
      try {
        const params = new URLSearchParams(window.location.search);
        const majorsParam = params.get('majors') || params.get('major');
        
        const url = majorsParam ? `/api/posts?majors=${encodeURIComponent(majorsParam)}` : '/api/posts';
        const res = await fetch(url, { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate', 'Pragma': 'no-cache' } });
        const data = await res.json();
        
        if (data.success && data.posts && data.posts.length > 0) {
          const typeMap = {
            idea: { typeBadge: ' Idea', typeColor: 'rgba(245,166,35,0.15)', typeTextColor: '#fbbf24' },
            project: { typeBadge: ' Project', typeColor: 'rgba(139,92,246,0.2)', typeTextColor: '#a78bfa' },
            research: { typeBadge: ' Research', typeColor: 'rgba(6,95,70,0.3)', typeTextColor: '#34d399' },
            showcase: { typeBadge: '🚀 Showcase', typeColor: 'rgba(236,72,153,0.15)', typeTextColor: '#f472b6' },
          };

          const formatted = data.posts.map(post => ({
            id: post.id,
            name: post.author?.displayName || post.author?.adUsername || 'Student Match',
            initials: (post.author?.displayName || 'U').split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase(),
            color: 'linear-gradient(135deg,#1565c0,#7c3aed)',
            role: post.author?.bio || 'Student · Elmhurst Network',
            time: new Date(post.createdAt).toLocaleDateString(),
            type: 'idea',
            ...typeMap['idea'],
            content: post.content,
            tags: post.tags || [],
            likes: post.likes || 0,
            comments: post._count?.comments || 0,
            interested: 0,
            isLiked: false,
            isInterested: false,
          }));
          setPosts(formatted);
        } else {
            // Keep INITIAL_POSTS if no actual mock DB data returns
        }
      } catch (err) {
        console.error("Failed to load DB posts:", err);
      }
    }
    
    if (typeof window !== 'undefined') {
      fetchPosts();
    }
  }, []);
 const [newPost, setNewPost] = useState('');
 const [newPostType, setNewPostType] = useState('idea');
 const [isPublishing, setIsPublishing] = useState(false);
 const [toast, setToast] = useState(null);
 const [activeCommentPostId, setActiveCommentPostId] = useState(null);
 const [commentText, setCommentText] = useState('');
 const [isEnhancing, setIsEnhancing] = useState(false);
 const [imagePreview, setImagePreview] = useState(null);
 const [shareModalId, setShareModalId] = useState(null);
 const [reactionHoverId, setReactionHoverId] = useState(null);
 const fileInputRef = useRef(null);

 const handleImageUpload = (e) => {
   const file = e.target.files[0];
   if (file) {
     const reader = new FileReader();
     reader.onloadend = () => setImagePreview(reader.result);
     reader.readAsDataURL(file);
   }
 };

 const handleAddReaction = (postId, emoji) => {
   setPosts(ps => ps.map(p => {
     if (p.id !== postId) return p;
     return { ...p, myReaction: emoji, likes: p.myReaction ? p.likes : p.likes + 1, isLiked: true };
   }));
   setReactionHoverId(null);
 };

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

  const handlePost = async () => {
    if (!newPost.trim()) return;
    setIsPublishing(true);

    try {
      if (!localUser || !localUser.id) {
        showToast('You must be logged in to post');
        setIsPublishing(false);
        return;
      }
      
      const isProjectForm = newPostType === 'project';
      const endpoint = isProjectForm ? '/api/projects' : '/api/posts';
      const payload = isProjectForm 
         ? { title: 'Collaboration Blueprint', description: newPost, userId: localUser.id }
         : { content: newPost, title: 'Feed Update', userId: localUser.id };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      const data = await res.json();
      
      const typeMap = {
        idea: { typeBadge: ' Idea', typeColor: 'rgba(245,166,35,0.15)', typeTextColor: '#fbbf24' },
        project: { typeBadge: ' Project', typeColor: 'rgba(139,92,246,0.2)', typeTextColor: '#a78bfa' },
        research: { typeBadge: ' Research', typeColor: 'rgba(6,95,70,0.3)', typeTextColor: '#34d399' },
        showcase: { typeBadge: '🚀 Showcase', typeColor: 'rgba(236,72,153,0.15)', typeTextColor: '#f472b6' },
      };

      if (data.success && (data.post || data.project)) {
        const item = data.post || data.project;
        setPosts(ps => [{
          id: item.id,
          name: localUser?.name || localUser?.displayName || 'Student',
          initials: (localUser?.name || localUser?.displayName || 'S').split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase(),
          color: 'linear-gradient(135deg,#1565c0,#7c3aed)',
          role: localUser?.bio || 'Elmhurst University Network',
          time: 'just now',
          type: newPostType,
          ...typeMap[newPostType],
          content: newPost,
          image: imagePreview,
          tags: [],
          likes: 0, comments: 0, interested: 0,
          isLiked: false, isInterested: false, myReaction: null,
        }, ...ps]);
        setNewPost('');
        setImagePreview(null);
        showToast('Post securely saved to Database and published!');
      } else {
        showToast('Database Error: Your user session is likely outdated. Please sign out and sign back in.');
      }
    } catch (e) {
      console.error(e);
      showToast('Network error publishing post');
    }
    setIsPublishing(false);
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
 <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
   <textarea
   className="composer-input"
   style={{ minHeight: '60px', resize: 'vertical' }}
   placeholder="Share an idea, project update, or a finished Showcase prototype…"
   value={newPost}
   onChange={e => setNewPost(e.target.value)}
   onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handlePost()}
   id="post-input"
   disabled={isPublishing || isEnhancing}
   />
   {imagePreview && (
     <div style={{ position: 'relative', width: 'fit-content' }}>
       <img src={imagePreview} alt="Upload preview" style={{ maxHeight: 200, borderRadius: 12, border: '1px solid var(--border-color)' }} />
       <button onClick={() => setImagePreview(null)} style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.6)', color: 'white', borderRadius: '50%', width: 24, height: 24, border: 'none', cursor: 'pointer' }}>✕</button>
     </div>
   )}
 </div>
 </div>
 <div className="composer-actions">
 <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" style={{ display: 'none' }} />
 <button className="btn-ghost" onClick={() => fileInputRef.current?.click()} style={{ padding: '6px', opacity: 0.7 }} title="Upload Image">📷</button>
 {['idea', 'project', 'research', 'showcase'].map(t => (
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
 <AnimatePresence>
 {filtered.map(p => (
 <motion.div 
   className="post-card" 
   key={p.id}
   layout
   initial={{ opacity: 0, y: 30, scale: 0.95 }}
   animate={{ opacity: 1, y: 0, scale: 1 }}
   exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
   transition={{ type: "spring", stiffness: 350, damping: 25 }}
 >
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
 
 {p.image && (
   <div style={{ marginTop: 12, marginBottom: 12 }}>
     <img src={p.image} alt="Post image" style={{ maxWidth: '100%', maxHeight: 350, objectFit: 'cover', borderRadius: 12, border: '1px solid var(--border-color)' }} />
   </div>
 )}

 {p.tags.length > 0 && (
 <div className="post-tags">
 {p.tags.map(t => (
 <span key={t} className="tag tag-blue">{t}</span>
 ))}
 </div>
 )}

 <div className="post-footer" style={{ position: 'relative' }}>
 <div 
   onMouseEnter={() => setReactionHoverId(p.id)} 
   onMouseLeave={() => setReactionHoverId(null)}
   style={{ position: 'relative' }}
 >
   <button
   className={`post-action ${p.myReaction ? 'liked' : ''}`}
   onClick={() => handleLike(p.id)}
   >
   <span>{p.myReaction || '👍'}</span> {p.likes}
   </button>
   
   <AnimatePresence>
   {reactionHoverId === p.id && (
     <motion.div 
       initial={{ opacity: 0, y: 10, scale: 0.8 }} 
       animate={{ opacity: 1, y: 0, scale: 1 }} 
       exit={{ opacity: 0, y: 10, scale: 0.8 }}
       style={{ position: 'absolute', bottom: '100%', left: 0, background: 'var(--bg-surface)', padding: '6px 10px', borderRadius: 24, display: 'flex', gap: 6, border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)', zIndex: 50 }}
     >
       {['👍', '❤️', '💡', '🎉'].map(emoji => (
         <button key={emoji} onClick={(e) => { e.stopPropagation(); handleAddReaction(p.id, emoji); }} style={{ fontSize: '1.4rem', padding: '4px', background: 'transparent', border: 'none', cursor: 'pointer', transition: 'transform 0.1s' }} className="reaction-emoji-btn">{emoji}</button>
       ))}
     </motion.div>
   )}
   </AnimatePresence>
 </div>
 <button 
 className="post-action"
 onClick={() => setActiveCommentPostId(activeCommentPostId === p.id ? null : p.id)}
 >
 💬 {p.comments}
 </button>
 <button 
 className="post-action"
 onClick={() => setShareModalId(p.id)}
 >
 ↗️ Share
 </button>
 <button
 className={`interested-btn ${p.isInterested ? 'active' : ''}`}
 onClick={() => handleInterest(p.id)}
 style={{ marginLeft: 'auto' }}
 >
 {p.isInterested ? ' Interested' : " I'm Interested"}
 </button>
 </div>

 <AnimatePresence>
 {activeCommentPostId === p.id && (
 <motion.div 
   initial={{ opacity: 0, height: 0 }} 
   animate={{ opacity: 1, height: 'auto' }} 
   exit={{ opacity: 0, height: 0 }} 
   style={{ overflow: 'hidden', marginTop: '16px', borderTop: '1px solid rgba(120,120,120,0.2)', paddingTop: '16px', display: 'flex', gap: '10px' }}
 >
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
  </motion.div>
  )}
  </AnimatePresence>

  </motion.div>
  ))}
  </AnimatePresence>
  </main>

  {/* Share Modal */}
  <AnimatePresence>
    {shareModalId && (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShareModalId(null)}>
        <motion.div 
          onClick={e => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          exit={{ opacity: 0, scale: 0.9 }}
          style={{ background: 'var(--bg-page)', width: 400, maxWidth: '90%', borderRadius: 16, padding: 24, border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Share to Connection</h3>
            <button onClick={() => setShareModalId(null)} className="btn-ghost" style={{ padding: 4 }}>✕</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 300, overflowY: 'auto' }}>
            {SIDEBAR_PEOPLE.map((person, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: person.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>{person.initials}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{person.name}</div>
                  </div>
                </div>
                <button className="btn-primary" style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: 14 }} onClick={() => { showToast(`Shared via Direct Message to ${person.name}!`); setShareModalId(null); }}>Send</button>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border-color)' }}>
            <button className="btn-ghost" style={{ width: '100%', padding: 12, borderRadius: 12, background: 'var(--bg-surface)' }} onClick={() => { navigator.clipboard.writeText(window.location.href); showToast('Link copied to clipboard!'); setShareModalId(null); }}>
              Copy Link to Post
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>

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

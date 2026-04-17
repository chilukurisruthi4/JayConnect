'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Link from 'next/link';

const SKILLS = ['SQL', 'ETL Pipelines', 'Data Analysis', 'Excel Dashboards', 'CRM Systems', 'Predictive Modeling', 'Process Optimization', 'Data Standardization', 'Leadership'];

const PROJECTS = [
 { title: 'Enterprise Database Optimization', status: ' Completed', desc: 'Designed automated data validation checks ensuring high standards for organizational compliance at DXC.', tags: ['SQL', 'Data Integrity', 'Analytics'] },
 { title: 'Campus Facilities Ticketing Portal', status: ' In Progress', desc: 'Streamlining service requests and work orders for institutional operations at Elmhurst.', tags: ['React', 'Workflow Optimization'] },
];

const CERTS = [
 { name: 'Google Data Analytics Professional', issuer: 'Google', year: 2024, icon: '' },
 { name: 'Advanced SQL Certification', issuer: 'HackerRank', year: 2023, icon: '' },
];

const ACTIVITY = [
 { icon: '', text: 'Connected with 5 Elmhurst University Peers', time: '2h ago' },
 { icon: '', text: 'Registered for April Hackathon', time: '1d ago' },
 { icon: '', text: 'Published updated Skills framework', time: '3d ago' },
];

export default function ProfilePage() {
 const [editMode, setEditMode] = useState(false);
 const [bio, setBio] = useState("Graduate student at Elmhurst University pursuing a Master of Science in Computer Information Technology. Former Software Engineer at DXC Technology with extensive experience in enterprise database management, SQL analytics, and building robust data workflows. Passionate about applying predictive modeling to drive business optimization.");
 const [bioEdit, setBioEdit] = useState(bio);
 const [avatar, setAvatar] = useState(null);
 const [banner, setBanner] = useState(null);
 const [features, setFeatures] = useState([
  { id: 1, text: "Just successfully deployed my entire Elmhurst Capstone platform onto a secure Azure cloud cluster utilizing Docker containers and remote Bastion administration! 🚀 It took weeks of backend debugging, but the database migration finally worked.", image: null, time: "1 hour ago" },
 ]);
 const [featureText, setFeatureText] = useState('');
 const [featureImg, setFeatureImg] = useState(null);
 const [userProjects, setUserProjects] = useState(PROJECTS);

 useEffect(() => {
   async function fetchLocalData() {
     try {
       const stored = localStorage.getItem('jc-user');
       if (stored) {
         const user = JSON.parse(stored);
         const res = await fetch(`/api/projects?userId=${user.id}`);
         const data = await res.json();
         if (data.success && data.projects.length > 0) {
           setUserProjects([...data.projects.map(p => ({ title: p.title, status: ' Active', desc: p.description, tags: [] })), ...PROJECTS]);
         }
       }
     } catch (e) {}
   }
   if (typeof window !== 'undefined') fetchLocalData();
 }, []);

 const handlePostFeature = () => {
  if (!featureText && !featureImg) return;
  setFeatures([{ id: Date.now(), text: featureText, image: featureImg, time: 'Just now' }, ...features]);
  setFeatureText('');
  setFeatureImg(null);
 };

 const handleFeatureImgUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = ev => setFeatureImg(ev.target.result);
    reader.readAsDataURL(file);
  }
 };

 const handleAvatarUpload = (e) => {
 const file = e.target.files[0];
 if (file) {
 const reader = new FileReader();
 reader.onload = (ev) => setAvatar(ev.target.result);
 reader.readAsDataURL(file);
 }
 };

 const handleBannerUpload = (e) => {
 const file = e.target.files[0];
 if (file) {
 const reader = new FileReader();
 reader.onload = (ev) => setBanner(ev.target.result);
 reader.readAsDataURL(file);
 }
 };

 return (
 <div className="page-shell">
 <Navbar />
 <div className="profile-layout">

 {/* Profile Hero */}
 <motion.div 
   className="profile-hero"
   initial={{ opacity: 0, y: 20 }}
   animate={{ opacity: 1, y: 0 }}
   transition={{ duration: 0.5, ease: "easeOut" }}
 >
 <div 
   className="profile-bg-gradient" 
   style={banner ? { background: `url(${banner}) center/cover no-repeat` } : {}}
 >
   {editMode && (
     <div 
       style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(0,0,0,0.6)', padding: '6px 14px', borderRadius: 24, color: 'white', fontSize: '0.8rem', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', gap: 6, border: '1px solid rgba(255,255,255,0.2)' }}
       onClick={() => document.getElementById('banner-upload').click()}
     >
       <span style={{ fontSize: '1.2rem' }}>📷</span> Change Cover
     </div>
   )}
 </div>
 <input type="file" id="banner-upload" style={{ display: 'none' }} accept="image/*" onChange={handleBannerUpload} />
 <div className="profile-content">
 <div className="profile-ava-overlap">
 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
 <div 
 style={{ position: 'relative', cursor: editMode ? 'pointer' : 'default', borderRadius: '50%' }}
 onClick={() => editMode && document.getElementById('ava-upload').click()}
 title={editMode ? "Upload new photo" : ""}
 >
 {avatar ? (
 <img src={avatar} className="profile-ava" style={{ objectFit: 'cover', padding: 0 }} alt="Avatar" />
 ) : (
 <div className="profile-ava">SC</div>
 )}
 
 {editMode && (
 <div style={{
 position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
 background: 'rgba(0,0,0,0.4)',
 borderRadius: '50%',
 display: 'flex', alignItems: 'center', justifyContent: 'center',
 zIndex: 10
 }}>
 <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.05em' }}>EDIT</span>
 </div>
 )}
 </div>
 </div>
 <input type="file" id="ava-upload" style={{ display: 'none' }} accept="image/*" onChange={handleAvatarUpload} />
 </div>

 <div className="profile-info-block" style={{ position: 'relative' }}>
 <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
 <button className="btn-gold" onClick={() => { if (editMode) { setBio(bioEdit); } setEditMode(e => !e); }}>
 {editMode ? 'Save Profile' : 'Edit Profile'}
 </button>
 </div>
 <div className="profile-name">Sruthi Chilukuri</div>
 <div className="profile-title">Master's Student · Elmhurst University · CIT</div>
 <div className="profile-badges">
 <span className="tag tag-blue">Data Analytics</span>
 <span className="tag tag-purple">Process Optimization</span>
 <span className="tag tag-gold">Open to Work</span>
 </div>
 </div>

 {/* Stats */}
 <div className="profile-stats">
 {[
 { num: '42', label: 'Followers' },
 { num: '18', label: 'Following' },
 { num: '7', label: 'Posts' },
 { num: '3', label: 'Collaborations' },
 { num: '340', label: 'Profile Views' },
 ].map(s => (
 <div className="p-stat" key={s.label}>
 <div className="p-stat-num">{s.num}</div>
 <div className="p-stat-label">{s.label}</div>
 </div>
 ))}
 </div>

 {/* Bio */}
 <div>
 <div className="profile-section-title">About</div>
 {editMode ? (
 <textarea
 className="form-textarea"
 value={bioEdit}
 onChange={e => setBioEdit(e.target.value)}
 style={{ minHeight: 80, fontSize: '0.92rem' }}
 />
 ) : (
 <p className="profile-bio">{bio}</p>
 )}
 </div>
 </div>
 </motion.div>

 {/* Main grid */}
 <div className="profile-grid">
 {/* Skills */}
 <motion.div 
   className="card"
   initial={{ opacity: 0, y: 20 }}
   animate={{ opacity: 1, y: 0 }}
   transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
 >
 <div className="profile-section-title">Skills</div>
 <div className="skill-list">
 {SKILLS.map(s => <span className="skill-badge" key={s}>{s}</span>)}
 </div>
 </motion.div>

 {/* Certifications */}
 <motion.div 
   className="card"
   initial={{ opacity: 0, y: 20 }}
   animate={{ opacity: 1, y: 0 }}
   transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
 >
 <div className="profile-section-title">Certifications</div>
 {CERTS.map(c => (
 <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
 <span style={{ fontSize: '1.8rem' }}>{c.icon}</span>
 <div>
 <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{c.name}</div>
 <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{c.issuer} · {c.year}</div>
 </div>
 </div>
 ))}
 <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>Featured Accomplishments</h3>
 <div style={{ background: 'var(--bg-card)', padding: 16, borderRadius: 12, border: '1px solid var(--border-color)', marginBottom: 12 }}>
 <div style={{ fontWeight: 600 }}>Dean's List 2024</div>
 <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Awarded for holding a 3.9+ GPA over two consecutive semesters.</div>
 </div>
 </motion.div>
 </div>

 {/* Featured Accomplishments */}
 <motion.div 
   className="card" 
   style={{ marginBottom: 20 }}
   initial={{ opacity: 0, y: 20 }}
   animate={{ opacity: 1, y: 0 }}
   transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
 >
 <div className="profile-section-title" style={{ marginBottom: 16 }}>Featured Accomplishments</div>
 
 {/* New feature input form */}
 <div style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-color)', borderRadius: 12, padding: 16, marginBottom: 24 }}>
 <textarea 
 placeholder="What did you accomplish recently? Share your project wins here..."
 value={featureText}
 onChange={e => setFeatureText(e.target.value)}
 style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', resize: 'none', minHeight: 60, fontSize: '0.9rem' }}
 />
 
 {featureImg && (
 <div style={{ position: 'relative', marginTop: 12, display: 'inline-block' }}>
 <img src={featureImg} style={{ maxHeight: 150, borderRadius: 8, objectFit: 'cover' }} alt="Feature attached" />
 <button onClick={() => setFeatureImg(null)} style={{ position: 'absolute', top: -8, right: -8, background: 'rgba(0,0,0,0.7)', color: 'white', border: 'none', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer' }}>×</button>
 </div>
 )}
 
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border-color)' }}>
 <div>
 <label style={{ cursor: 'pointer', fontSize: '0.85rem', color: 'var(--blue)', display: 'flex', alignItems: 'center', gap: 6 }}>
 📷 Attach Media
 <input type="file" style={{ display: 'none' }} accept="image/*" onChange={handleFeatureImgUpload} />
 </label>
 </div>
 <button className="btn-primary" onClick={handlePostFeature} style={{ padding: '6px 16px', fontSize: '0.85rem' }}>Post Feature</button>
 </div>
 </div>

 {/* Render Features */}
 <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
 {features.map(f => (
 <div key={f.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', padding: 16, borderRadius: 12 }}>
 <p style={{ fontSize: '0.9rem', color: 'var(--gray-300)', lineHeight: 1.6, marginBottom: f.image ? 12 : 0 }}>{f.text}</p>
 {f.image && <img src={f.image} style={{ width: '100%', maxHeight: 300, objectFit: 'cover', borderRadius: 8 }} alt="Feature" />}
 <div style={{ marginTop: 12, fontSize: '0.75rem', color: 'var(--gray-500)' }}>{f.time}</div>
 </div>
 ))}
 </div>
 </motion.div>

 {/* Projects */}
 <motion.div 
   className="card" 
   style={{ marginBottom: 20 }}
   initial={{ opacity: 0, y: 20 }}
   animate={{ opacity: 1, y: 0 }}
   transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
 >
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
 <div className="profile-section-title" style={{ marginBottom: 0 }}>My Projects</div>
 <Link href="/feed" className="btn-ghost" style={{ fontSize: '0.8rem' }}>+ Share New Project</Link>
 </div>
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
 {userProjects.map((p, idx) => (
 <div key={p.title + idx} style={{
 padding: '16px 18px',
 background: 'rgba(255,255,255,0.04)',
 border: '1px solid rgba(255,255,255,0.08)',
 borderRadius: 12,
 }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
 <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{p.title}</span>
 <span style={{ fontSize: '0.72rem', color: 'var(--gray-500)' }}>{p.status}</span>
 </div>
 <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)', lineHeight: 1.6, marginBottom: 10 }}>{p.desc}</p>
 <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
 {p.tags.map(t => <span className="tag tag-blue" key={t}>{t}</span>)}
 </div>
 </div>
 ))}
 </div>
 </motion.div>

 {/* Recent Activity */}
 <motion.div 
   className="card"
   initial={{ opacity: 0, y: 20 }}
   animate={{ opacity: 1, y: 0 }}
   transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
 >
 <div className="profile-section-title" style={{ marginBottom: 16 }}>Recent Activity</div>
 {ACTIVITY.map((a, i) => (
 <div key={i} style={{
 display: 'flex', alignItems: 'flex-start', gap: 12,
 padding: '12px 0',
 borderBottom: i < ACTIVITY.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
 }}>
 <span style={{ fontSize: '1.2rem', marginTop: 2 }}>{a.icon}</span>
 <div style={{ flex: 1 }}>
 <p style={{ fontSize: '0.85rem', color: 'var(--gray-300)' }}>{a.text}</p>
 <p style={{ fontSize: '0.72rem', color: 'var(--gray-600)', marginTop: 2 }}>{a.time}</p>
 </div>
 </div>
 ))}
 </motion.div>

 </div>
 </div>
 );
}

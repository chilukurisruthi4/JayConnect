'use client';
import { useState } from 'react';
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
 { icon: '', text: 'Optimized Resume to 100% ATS Match', time: 'Just now' },
 { icon: '', text: 'Connected with 5 Elmhurst University Peers', time: '2h ago' },
 { icon: '', text: 'Registered for April Hackathon', time: '1d ago' },
 { icon: '', text: 'Published updated Skills framework', time: '3d ago' },
];

export default function ProfilePage() {
 const [editMode, setEditMode] = useState(false);
 const [bio, setBio] = useState("Graduate student at Elmhurst University pursuing a Master of Science in Computer Information Technology. Former Software Engineer at DXC Technology with extensive experience in enterprise database management, SQL analytics, and building robust data workflows. Passionate about applying predictive modeling to drive business optimization.");
 const [bioEdit, setBioEdit] = useState(bio);
 const [avatar, setAvatar] = useState(null);

 const handleAvatarUpload = (e) => {
 const file = e.target.files[0];
 if (file) {
 const reader = new FileReader();
 reader.onload = (ev) => setAvatar(ev.target.result);
 reader.readAsDataURL(file);
 }
 };

 return (
 <div className="page-shell">
 <Navbar />
 <div className="profile-layout">

 {/* Profile Hero */}
 <div className="profile-hero">
 <div className="profile-bg-gradient" />
 <div className="profile-content">
 <div className="profile-ava-wrap">
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
 fontSize: '1.8rem', zIndex: 10
 }}>
 
 </div>
 )}
 </div>
 <input type="file" id="ava-upload" style={{ display: 'none' }} accept="image/*" onChange={handleAvatarUpload} />
 </div>
 <div style={{ flex: 1 }}>
 <div className="profile-name">CHILUKURI SRUTHI</div>
 <div className="profile-title"> Master's Student · Elmhurst University · CIT</div>
 <div className="profile-badges">
 <span className="tag tag-blue">Data Analytics</span>
 <span className="tag tag-purple">Process Optimization</span>
 <span className="tag tag-gold">Open to Work</span>
 </div>
 </div>
 <div style={{ display: 'flex', gap: 10 }}>
 <button
 className="btn-gold"
 onClick={() => { if (editMode) { setBio(bioEdit); } setEditMode(e => !e); }}
 id="edit-profile-btn"
 >
 {editMode ? ' Save Profile' : '️ Edit Profile'}
 </button>
 <Link href="/resume" className="btn-ghost"> Resume</Link>
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
 </div>

 {/* Main grid */}
 <div className="profile-grid">
 {/* Skills */}
 <div className="card">
 <div className="profile-section-title">️ Skills</div>
 <div className="skill-list">
 {SKILLS.map(s => <span className="skill-badge" key={s}>{s}</span>)}
 </div>
 </div>

 {/* Certifications */}
 <div className="card">
 <div className="profile-section-title"> Certifications</div>
 {CERTS.map(c => (
 <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
 <span style={{ fontSize: '1.8rem' }}>{c.icon}</span>
 <div>
 <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{c.name}</div>
 <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{c.issuer} · {c.year}</div>
 </div>
 </div>
 ))}
 <Link href="/resume" className="btn-ghost" style={{ fontSize: '0.78rem', marginTop: 4, display: 'inline-flex' }}>
 + Add to Resume
 </Link>
 </div>
 </div>

 {/* Projects */}
 <div className="card" style={{ marginBottom: 20 }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
 <div className="profile-section-title" style={{ marginBottom: 0 }}> My Projects</div>
 <Link href="/feed" className="btn-ghost" style={{ fontSize: '0.8rem' }}>+ Share New Project</Link>
 </div>
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
 {PROJECTS.map(p => (
 <div key={p.title} style={{
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
 </div>

 {/* Recent Activity */}
 <div className="card">
 <div className="profile-section-title" style={{ marginBottom: 16 }}> Recent Activity</div>
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
 </div>

 </div>
 </div>
 );
}

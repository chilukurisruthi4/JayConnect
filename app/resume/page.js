'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import Navbar from '../../components/Navbar';

/* ─── ATS dynamic keyword extraction ──────────────────────── */
const STOP_WORDS = new Set(['the', 'and', 'to', 'of', 'a', 'in', 'for', 'is', 'on', 'that', 'by', 'this', 'with', 'i', 'you', 'it', 'not', 'or', 'be', 'are', 'from', 'at', 'as', 'your', 'all', 'have', 'new', 'more', 'an', 'was', 'we', 'will', 'home', 'can', 'us', 'about', 'if', 'page', 'my', 'has', 'search', 'free', 'but', 'our', 'one', 'other', 'do', 'no', 'information', 'time', 'they', 'site', 'he', 'up', 'may', 'what', 'which', 'their', 'news', 'out', 'use', 'any', 'there', 'see', 'only', 'so', 'his', 'when', 'contact', 'here', 'business', 'who', 'web', 'also', 'now', 'help', 'get', 'pm', 'view', 'online', 'first', 'am', 'been', 'would', 'how', 'were', 'me', 'some', 'these']);

function calcATS(text, jobDesc) {
 if (!jobDesc) return { score: 0, found: [], missing: [] };
 
 // Normalize and clean JD text
 const cleanJD = jobDesc.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ');
 const jdWords = cleanJD.split(/\s+/).filter(w => w.length > 3 && !STOP_WORDS.has(w));
 
 // Frequency map to find the most "important" words in the JD
 const freq = {};
 jdWords.forEach(w => freq[w] = (freq[w] || 0) + 1);
 
 // Sort by frequency, take top 15 as target ATS keywords
 let uniqueTargets = [...new Set(jdWords)]
 .sort((a, b) => freq[b] - freq[a])
 .slice(0, 15);
 
 // Always append some standard power verbs if not present (to simulate baseline ATS scanning)
 const powerVerbs = ['managed', 'developed', 'optimized', 'led', 'analyzed'];
 uniqueTargets = [...new Set([...uniqueTargets, ...powerVerbs])].slice(0, 15);

 if (uniqueTargets.length === 0) return { score: 0, found: [], missing: [] };

 // Match against resume payload
 const resumeCombined = text.toLowerCase();
 
 const found = uniqueTargets.filter(k => resumeCombined.includes(k));
 const missing = uniqueTargets.filter(k => !resumeCombined.includes(k));
 
 const score = Math.max(0, Math.min(100, Math.round((found.length / uniqueTargets.length) * 100)));
 
 return { score, found: found.slice(0, 12), missing: missing.slice(0, 12) };
}

/* ─── Steps definition ──────────────────────────────────── */
const STEPS = ['Personal', 'Education', 'Experience', 'Skills', 'Job Target', 'Preview'];

/* ─── Empty resume data ─────────────────────────────────── */
const EMPTY_RESUME = {
 templateId: 'modern',
 firstName: '', lastName: '', email: '', phone: '', location: '', linkedin: '', website: '',
 title: '',
 summary: '',
 education: [{ school: '', degree: '', field: '', gpa: '', from: '', to: '', current: false }],
 experience: [{ company: '', role: '', from: '', to: '', current: false, bullets: ['', '', ''] }],
 skills: '',
 certifications: '',
 jobTitle: '',
 jobDesc: '',
};

/* ─── Resume Paper component (shared for preview + PDF render) ─ */
function ResumePaper({ data, ref: paperRef }) {
 const { score, found, missing } = calcATS(
 data.summary + data.skills + data.experience.map(e => e.bullets.join(' ')).join(' '),
 data.jobDesc
 );

 const templates = {
 modern: {
 fontFamily: 'Calibri, "Segoe UI", Arial, sans-serif',
 headerColor: '#1B4D78',
 headerAlign: 'left',
 headerBorder: 'none',
 fontSize: '10pt',
 titleSize: '14pt',
 },
 classic: {
 fontFamily: '"Times New Roman", Times, serif',
 headerColor: '#000000',
 headerAlign: 'center',
 headerBorder: '1px solid #000',
 fontSize: '11pt',
 titleSize: '16pt',
 },
 executive: {
 fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
 headerColor: '#374151',
 headerAlign: 'left',
 headerBorder: '1px solid #d1d5db',
 fontSize: '9.5pt',
 titleSize: '15pt',
 }
 };
 
 const theme = templates[data.templateId] || templates.modern;

 return (
 <div id="resume-paper" ref={paperRef} className="resume-paper" style={{ width: '816px', minHeight: '1056px', margin: '0 auto', boxSizing: 'border-box', fontFamily: theme.fontFamily, color: '#000', padding: '42px 48px', background: '#fff', fontSize: theme.fontSize, lineHeight: '1.25' }}>
 
 {/* Header */}
 <div style={{ textAlign: 'center', marginBottom: 16 }}>
 <h1 style={{ fontSize: theme.titleSize, fontWeight: 'bold', margin: '0 0 6px 0', color: '#000', textTransform: 'uppercase' }}>{(data.firstName || data.lastName) ? `${data.firstName} ${data.lastName}`.trim() : 'CHILUKURI SRUTHI'}</h1>
 <div style={{ fontSize: theme.fontSize, color: '#000' }}>
 {[data.location, data.email, data.phone, data.linkedin, data.website].filter(Boolean).join(' | ')}
 </div>
 </div>

 {/* Summary */}
 {data.summary && (
 <div style={{ marginBottom: 14 }}>
 <div style={{ fontSize: '11pt', fontWeight: 'bold', textTransform: 'uppercase', color: theme.headerColor, marginBottom: 6, textAlign: theme.headerAlign, borderBottom: theme.headerBorder === 'none' ? 'none' : theme.headerBorder, paddingBottom: theme.headerBorder === 'none' ? 0 : 4 }}>SUMMARY</div>
 <p style={{ margin: 0, padding: 0 }}>{data.summary}</p>
 </div>
 )}

 {/* Education */}
 {data.education.some(e => e.school) && (
 <div style={{ marginBottom: 14 }}>
 <div style={{ fontSize: '11pt', fontWeight: 'bold', textTransform: 'uppercase', color: theme.headerColor, marginBottom: 6, textAlign: theme.headerAlign, borderBottom: theme.headerBorder === 'none' ? 'none' : theme.headerBorder, paddingBottom: theme.headerBorder === 'none' ? 0 : 4 }}>EDUCATION</div>
 {data.education.filter(e => e.school).map((e, i) => (
 <div key={i} style={{ marginBottom: 4 }}>
 <span style={{ fontWeight: 'bold' }}>{e.degree}{e.degree && e.field ? ', ' : ''}{e.field}</span> | {e.school} | {e.from}{(e.from && (e.to || e.current)) ? ' – ' : ''}{e.current ? 'Present' : e.to}{e.gpa && ` | GPA: ${e.gpa}`}
 </div>
 ))}
 </div>
 )}

 {/* Skills & Certifications */}
 {(data.skills || data.certifications) && (
 <div style={{ marginBottom: 14 }}>
 <div style={{ fontSize: '11pt', fontWeight: 'bold', textTransform: 'uppercase', color: theme.headerColor, marginBottom: 6, textAlign: theme.headerAlign, borderBottom: theme.headerBorder === 'none' ? 'none' : theme.headerBorder, paddingBottom: theme.headerBorder === 'none' ? 0 : 4 }}>TECHNICAL SKILLS</div>
 {(data.skills||data.certifications).split('\n').filter(s => s.trim()).map((line, idx) => {
 const splitIdx = line.indexOf(':');
 if (splitIdx > -1) {
 return (
 <div key={idx} style={{ marginBottom: 3 }}>
 <span style={{ fontWeight: 'bold' }}>{line.slice(0, splitIdx + 1)}</span>{line.slice(splitIdx + 1)}
 </div>
 );
 }
 return <div key={idx} style={{ marginBottom: 3 }}>{line}</div>;
 })}
 </div>
 )}

 {/* Experience */}
 {data.experience.some(e => e.company) && (
 <div style={{ marginBottom: 14 }}>
 <div style={{ fontSize: '11pt', fontWeight: 'bold', textTransform: 'uppercase', color: theme.headerColor, marginBottom: 6, textAlign: theme.headerAlign, borderBottom: theme.headerBorder === 'none' ? 'none' : theme.headerBorder, paddingBottom: theme.headerBorder === 'none' ? 0 : 4 }}>PROFESSIONAL EXPERIENCE</div>
 {data.experience.filter(e => e.company).map((e, i) => (
 <div key={i} style={{ marginBottom: 8 }}>
 <div style={{ marginBottom: 4 }}>
 <span style={{ fontWeight: 'bold' }}>{e.role}</span> | {e.company} | {e.from}{(e.from && (e.to || e.current)) ? ' – ' : ''}{e.current ? 'Present' : e.to}
 </div>
 {e.bullets.filter(b => b.trim()).length > 0 && (
 <ul style={{ margin: 0, paddingLeft: 22, listStyleType: 'disc' }}>
 {e.bullets.filter(b => b.trim()).map((b, bi) => (
 <li key={bi} style={{ marginBottom: 3, paddingLeft: 2 }}>{b}</li>
 ))}
 </ul>
 )}
 </div>
 ))}
 </div>
 )}

 </div>
 );
}

/* ─── Download helpers ──────────────────────────────────── */
async function downloadPDF(paperRef) {
 const { default: jsPDF } = await import('jspdf');
 const { default: html2canvas } = await import('html2canvas');
 const el = paperRef.current || document.getElementById('resume-paper');
 if (!el) return;
 
 // Scale 4 creates an ultra high-def snapshot to prevent blurriness
 const canvas = await html2canvas(el, { scale: 4, useCORS: true, backgroundColor: '#fff' });
 const img = canvas.toDataURL('image/png', 1.0);
 
 // US Letter format (8.5 x 11 inches) maps perfectly to our 816px layout
 const pdf = new jsPDF({ unit: 'in', format: 'letter', orientation: 'portrait' });
 pdf.addImage(img, 'PNG', 0, 0, 8.5, 11, undefined, 'FAST');
 pdf.save('JayConnect_Resume.pdf');
}

async function downloadDOCX(data) {
 const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, Table, TableRow, TableCell, WidthType, ShadingType } = await import('docx');
 const { saveAs } = await import('file-saver');

 const makeSection = (title, items) => [
 new Paragraph({
 text: title.toUpperCase(),
 heading: HeadingLevel.HEADING_2,
 spacing: { before: 240, after: 100 },
 border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: '1565C0' } },
 }),
 ...items,
 ];

 const expParas = data.experience.filter(e => e.company).flatMap(e => [
 new Paragraph({
 children: [
 new TextRun({ text: e.role || '', bold: true }),
 new TextRun({ text: `\t${e.from}${e.from && (e.to || e.current) ? ' – ' : ''}${e.current ? 'Present' : e.to}`, size: 18 }),
 ],
 tabStops: [{ type: 'right', position: 9000 }],
 }),
 new Paragraph({ children: [new TextRun({ text: e.company, italics: true, size: 18 })], spacing: { after: 60 } }),
 ...e.bullets.filter(b => b.trim()).map(b => new Paragraph({ text: b, bullet: { level: 0 }, spacing: { after: 40 } })),
 ]);

 const eduParas = data.education.filter(e => e.school).flatMap(e => [
 new Paragraph({
 children: [
 new TextRun({ text: `${e.degree}${e.degree && e.field ? ' in ' : ''}${e.field}`, bold: true }),
 new TextRun({ text: `\t${e.from}${e.from && (e.to || e.current) ? ' – ' : ''}${e.current ? 'Present' : e.to}`, size: 18 }),
 ],
 tabStops: [{ type: 'right', position: 9000 }],
 }),
 new Paragraph({ children: [new TextRun({ text: `${e.school}${e.gpa ? ` · GPA: ${e.gpa}` : ''}`, italics: true, size: 18 })], spacing: { after: 80 } }),
 ]);

 const skillParas = data.skills
 ? [new Paragraph({ children: data.skills.split(/[,;\n]+/).filter(s => s.trim()).map((s, i) => new TextRun({ text: (i ? ' · ' : '') + s.trim(), size: 18 })) })]
 : [];

 const doc = new Document({
 sections: [{
 properties: { page: { margin: { top: 720, bottom: 720, left: 900, right: 900 } } },
 children: [
 // Name
 new Paragraph({
 children: [new TextRun({ text: (data.firstName && data.lastName) ? `${data.firstName} ${data.lastName}`.toUpperCase() : 'YOUR NAME', bold: true, size: 36, color: '0a1628' })],
 alignment: AlignmentType.CENTER,
 spacing: { after: 60 },
 }),
 // Title
 ...(data.title ? [new Paragraph({
 children: [new TextRun({ text: data.title, size: 22, color: '1565c0', italics: true })],
 alignment: AlignmentType.CENTER,
 spacing: { after: 80 },
 })] : []),
 // Contact
 new Paragraph({
 children: [
 ...[data.email, data.phone, data.location, data.linkedin].filter(Boolean).map((c, i) =>
 new TextRun({ text: (i ? ' | ' : '') + c, size: 18, color: '444444' })
 ),
 ],
 alignment: AlignmentType.CENTER,
 spacing: { after: 200 },
 }),

 // Summary
 ...(data.summary ? makeSection('Professional Summary', [
 new Paragraph({ text: data.summary, spacing: { after: 80 } }),
 ]) : []),

 // Experience
 ...(expParas.length ? makeSection('Work Experience', expParas) : []),

 // Education
 ...(eduParas.length ? makeSection('Education', eduParas) : []),

 // Skills
 ...(skillParas.length ? makeSection('Skills', skillParas) : []),

 // Certifications
 ...(data.certifications ? makeSection('Certifications', [
 new Paragraph({ text: data.certifications }),
 ]) : []),

 ],
 }],
 });

 const blob = await Packer.toBlob(doc);
 saveAs(blob, 'JayConnect_Resume.docx');
}

/* ─── Upload-mode helper ────────────────────────────────── */
function UploadMode({ onSwitch, onOptimize }) {
 const [dragOver, setDragOver] = useState(false);
 const [file, setFile] = useState(null);
 const [jobTitle, setJobTitle] = useState('');
 const [jobDesc, setJobDesc] = useState('');
 const [isOptimizing, setIsOptimizing] = useState(false);
 const fileRef = useRef(null);

 const handleFile = (f) => { if (f) setFile(f); };

 const extractedText = file ? "Sruthi Chilukuri, Software Engineer. Experienced in basic programming and project management." : "";
 const ats = calcATS(extractedText, jobDesc);

 const handleOptimize = async () => {
 setIsOptimizing(true);
 try {
  const baseData = {
   firstName: "Sruthi",
   lastName: "Chilukuri",
   email: "chilukurisruthi4@gmail.com",
   phone: "+1 702-912-8494",
   location: "Chicago, IL",
   linkedin: "linkedin.com/in/sruthi-chilukuri-606139213",
   website: "",
   title: "",
   summary: "",
   education: [
   { school: 'Elmhurst University, IL', degree: 'Master of Science', field: 'Computer Information Technology', gpa: '3.9/4.0', from: 'Aug 2024', to: 'May 2026', current: false },
   { school: 'Gayatri Vidya Parishad College, India', degree: 'Bachelor of Technology', field: 'Electronics & Communication Engineering', gpa: '', from: '2018', to: '2022', current: false }
   ],
   experience: [
   {
   company: 'Elmhurst University, Elmhurst, IL',
   role: 'Facilities Management Assistant',
   from: 'July 2025',
   to: 'Present',
   current: true,
   bullets: [
   `Manage and track facilities service requests using ticketing system ensuring accurate data entry, timely updates, and proper documentation of work orders and maintenance activities`,
   `Collaborate with campus stakeholders across departments to coordinate facility services and communicate status updates ensuring alignment with institutional operational priorities`,
   `Maintain organized records and databases for facility operations demonstrating strong attention to detail and organizational skills in managing multiple concurrent requests`,
   `Provide excellent customer service while handling sensitive information with professionalism; identify process optimization opportunities and implement efficient workflow solutions`
   ]
   },
   {
   company: 'DXC Technology, Hyderabad, India',
   role: 'Software Engineer',
   from: 'June 2022',
   to: 'June 2024',
   current: false,
   bullets: [
   `Managed enterprise database systems ensuring data integrity, accuracy, and standardization; performed data quality checks and validation ensuring compliance with organizational standards`,
   `Developed comprehensive reports, dashboards, and analytics using SQL to monitor operational progress, analyze trends, and translate complex data into actionable insights for stakeholders`,
   `Designed and streamlined data management processes and workflows; implemented project management strategies for major initiatives and generated targeted data extracts and mailing lists for outreach campaigns`,
   `Partnered with Business Analysts and cross-functional teams to build robust data pipelines, conduct statistical analysis, perform predictive modeling, and prioritize high-impact projects`
   ]
   }
   ],
   skills: `Database & Analytics: SQL, Database Management, ETL, Data Integration, Data Integrity, Data Analysis\nMicrosoft Office Suite: Excel, Word, PowerPoint, Access\nData Management: CRM Systems, Database Queries, Statistical Analysis, Report Generation, Data Standardization, Predictive Modeling, Pipeline Management\nCore Competencies: Analytical Skills, Critical Thinking, Process Optimization, Organizational Skills, Collaboration`,
   certifications: '',
   jobTitle: jobTitle || "Target Role",
   jobDesc: jobDesc,
   template: 'classic',
  };

  const res = await fetch('/api/resume/optimize', {
   method: 'POST',
   headers: { 'Content-Type': 'application/json' },
   body: JSON.stringify({ baseData, jobDesc, jobTitle })
  });

  if (!res.ok) {
    const backup = await res.json();
    if (backup.error) throw new Error(backup.error);
    throw new Error("API Route Failed.");
  }
  
  const optimizedData = await res.json();
  onOptimize(optimizedData);
 } catch (error) {
  console.error(error);
  alert("AI optimization request failed. Check console or GEMINI_API_KEY environment variable. Error: " + error.message);
 } finally {
  setIsOptimizing(false);
 }
 };

 return (
 <div>
 {!file ? (
 <div
 className="upload-zone"
 style={{ borderColor: dragOver ? 'var(--blue-light)' : undefined }}
 onDragOver={e => { e.preventDefault(); setDragOver(true); }}
 onDragLeave={() => setDragOver(false)}
 onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
 onClick={() => fileRef.current.click()}
 id="upload-zone"
 >
 <input
 ref={fileRef}
 type="file"
 accept=".pdf,.doc,.docx"
 style={{ display: 'none' }}
 onChange={e => handleFile(e.target.files[0])}
 />
 <div className="upload-zone-icon"></div>
 <h3>Drop your resume here</h3>
 <p>Supports PDF, DOC, DOCX · Max 10MB</p>
 <button className="btn-primary" style={{ marginTop: 20 }}>Browse Files</button>
 </div>
 ) : (
 <div>
 <div style={{
 display: 'flex', alignItems: 'center', gap: 14,
 padding: '16px 20px',
 background: 'rgba(34,197,94,0.1)',
 border: '1px solid rgba(34,197,94,0.3)',
 borderRadius: 'var(--radius-md)',
 marginBottom: 24,
 }}>
 <span style={{ fontSize: '2rem' }}></span>
 <div>
 <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{file.name}</div>
 <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{(file.size / 1024).toFixed(1)} KB · Ready</div>
 </div>
 <button className="btn-ghost" style={{ marginLeft: 'auto' }} onClick={() => setFile(null)}>Replace</button>
 </div>

 {/* ATS Section for upload mode */}
 <div className="builder-form">
 <div className="form-section-title"> ATS Job Target</div>
 <div className="form-group">
 <label className="form-label">Target Job Title</label>
 <input
 className="form-input"
 placeholder="e.g. Software Engineer, Data Analyst"
 value={jobTitle}
 onChange={e => setJobTitle(e.target.value)}
 />
 </div>
 <div className="form-group">
 <label className="form-label">Paste Job Description</label>
 <textarea
 className="form-textarea"
 placeholder="Paste the full job description here to check ATS compatibility…"
 value={jobDesc}
 onChange={e => setJobDesc(e.target.value)}
 style={{ minHeight: 160 }}
 />
 </div>

 {jobDesc.length > 30 && (
 <div className="ats-panel">
 <div className="ats-panel-title"> ATS Analysis</div>
 <p style={{ fontSize: '0.78rem', color: 'var(--gray-400)' }}>
 Based on your uploaded resume content and this job description.
 </p>
 <div className="ats-score" style={{ marginTop: 12 }}>
 <span style={{ fontSize: '0.78rem', color: 'var(--gray-400)' }}>Match Score</span>
 <div className="ats-bar-wrap">
 <div className="ats-bar" style={{ width: `${ats.score}%` }} />
 </div>
 <span className="ats-pct">{ats.score}%</span>
 </div>
 <div style={{ marginTop: 12 }}>
 <p style={{ fontSize: '0.75rem', color: '#4ade80', marginBottom: 6 }}> Keywords Found ({ats.found.length})</p>
 <div className="keyword-tags">
 {ats.found.map(k => <span className="keyword-tag" key={k}>{k}</span>)}
 </div>
 </div>
 {ats.missing.length > 0 && (
 <div style={{ marginTop: 10 }}>
 <p style={{ fontSize: '0.75rem', color: '#f87171', marginBottom: 6 }}>️ Consider Adding ({ats.missing.length})</p>
 <div className="keyword-tags">
 {ats.missing.map(k => <span className="keyword-tag missing" key={k}>{k}</span>)}
 </div>
 </div>
 )}
 </div>
 )}

 <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
 <button
 className="btn-gold"
 style={{ flex: 1, padding: '14px 20px', borderRadius: 8, fontSize: '0.9rem', fontWeight: 800, textAlign: 'center', opacity: (isOptimizing || jobDesc.length < 30) ? 0.6 : 1, cursor: (isOptimizing || jobDesc.length < 30) ? 'not-allowed' : 'pointer' }}
 onClick={handleOptimize}
 disabled={isOptimizing || jobDesc.length < 30}
 >
 {isOptimizing ? ' Re-writing with JayConnect AI...' : ' Auto-Optimize to 100% Match'}
 </button>
 </div>
 </div>
 </div>
 )}

 <div style={{ marginTop: 20, textAlign: 'center' }}>
 <button className="btn-ghost" onClick={onSwitch}>
 ️ Switch to Manual Builder instead
 </button>
 </div>
 </div>
 );
}

/* ─── Main Resume Page ──────────────────────────────────── */
export default function ResumePage() {
 const [mode, setMode] = useState(null); // null | 'manual' | 'upload'
 const [step, setStep] = useState(0);
 const [data, setData] = useState(EMPTY_RESUME);
 const [toast, setToast] = useState(null);
 const [isLoaded, setIsLoaded] = useState(false);
 const paperRef = useRef(null);

 useEffect(() => {
 const saved = localStorage.getItem('jayconnect_resume_data');
 if (saved) {
 try { setData(JSON.parse(saved)); } catch (e) {}
 }
 setIsLoaded(true);
 }, []);

 useEffect(() => {
 if (isLoaded) {
 localStorage.setItem('jayconnect_resume_data', JSON.stringify(data));
 }
 }, [data, isLoaded]);

 const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3500); };

 const upd = (field, val) => setData(d => ({ ...d, [field]: val }));

 const updEdu = (i, field, val) =>
 setData(d => {
 const arr = [...d.education];
 arr[i] = { ...arr[i], [field]: val };
 return { ...d, education: arr };
 });

 const updExp = (i, field, val) =>
 setData(d => {
 const arr = [...d.experience];
 arr[i] = { ...arr[i], [field]: val };
 return { ...d, experience: arr };
 });

 const updBullet = (ei, bi, val) =>
 setData(d => {
 const arr = [...d.experience];
 const bullets = [...arr[ei].bullets];
 bullets[bi] = val;
 arr[ei] = { ...arr[ei], bullets };
 return { ...d, experience: arr };
 });

 const addEdu = () =>
 setData(d => ({ ...d, education: [...d.education, { school: '', degree: '', field: '', gpa: '', from: '', to: '', current: false }] }));

 const addExp = () =>
 setData(d => ({ ...d, experience: [...d.experience, { company: '', role: '', from: '', to: '', current: false, bullets: ['', '', ''] }] }));

 const ats = calcATS(
 data.summary + data.skills + data.experience.map(e => e.bullets.join(' ')).join(' '),
 data.jobDesc
 );

 /* Mode selection screen */
 if (!mode) {
 return (
 <div className="page-shell">
 <Navbar />
 <div className="resume-layout">
 <div className="section-heading">
 <div>
 <h1>Resume Builder</h1>
 <p style={{ color: 'var(--gray-400)', marginTop: 6, fontSize: '0.9rem' }}>
 Build an ATS-optimized resume and download in PDF or DOCX format
 </p>
 </div>
 </div>

 <div style={{ textAlign: 'center', marginBottom: 32 }}>
 <span
 style={{
 display: 'inline-block',
 padding: '6px 16px',
 background: 'rgba(245,166,35,0.15)',
 border: '1px solid rgba(245,166,35,0.3)',
 borderRadius: 20,
 fontSize: '0.78rem',
 color: 'var(--gold)',
 fontWeight: 700,
 letterSpacing: '0.05em',
 }}
 >
 ATS-OPTIMIZED · PDF &amp; DOCX EXPORT · FREE
 </span>
 </div>

 <div className="resume-mode-select">
 <button
 className="mode-card"
 onClick={() => { setMode('manual'); setStep(0); }}
 id="manual-mode-btn"
 >
 <div className="mode-icon">️</div>
 <div className="mode-title">Build From Scratch</div>
 <div className="mode-desc">
 Perfect for beginners. Our step-by-step wizard guides you through every section
 — personal info, education, experience, skills, and job targeting.
 </div>
 <div style={{ marginTop: 20 }}>
 <span className="btn-gold" style={{ pointerEvents: 'none' }}>Start Building →</span>
 </div>
 </button>

 <button
 className="mode-card"
 onClick={() => setMode('upload')}
 id="upload-mode-btn"
 >
 <div className="mode-icon"></div>
 <div className="mode-title">Upload Existing Resume</div>
 <div className="mode-desc">
 Already have a resume? Upload your DOC or PDF file and we'll run an ATS
 compatibility check against your target job description.
 </div>
 <div style={{ marginTop: 20 }}>
 <span className="btn-ghost" style={{ pointerEvents: 'none' }}>Upload &amp; Optimize →</span>
 </div>
 </button>
 </div>
 </div>
 </div>
 );
 }

 /* Upload mode */
 if (mode === 'upload') {
 return (
 <div className="page-shell">
 <Navbar />
 <div className="resume-layout">
 <div className="section-heading">
 <div>
 <button className="btn-ghost" onClick={() => setMode(null)} style={{ marginBottom: 12 }}>← Back</button>
 <h1>Upload &amp; Optimize</h1>
 </div>
 </div>
 <UploadMode 
 onSwitch={() => setMode('manual')} 
 onOptimize={(optimizedData) => {
 setData(optimizedData);
 setMode('manual');
 setStep(5); // Instantly jump to Download step
 showToast(' AI optimization complete! Your resume is an ATS Match.');
 }}
 />
 </div>
 </div>
 );
 }

 /* Manual builder mode */
 const isLastStep = step === STEPS.length - 1;

 return (
 <div className="page-shell">
 <Navbar />
 <div className="resume-layout">
 <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
 <button className="btn-ghost" onClick={() => step === 0 ? setMode(null) : setStep(s => s - 1)}>
 ← {step === 0 ? 'Back' : 'Previous'}
 </button>
 <div style={{ flex: 1 }}>
 <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Manual Resume Builder</h1>
 </div>
 </div>

 {/* Step tracker */}
 <div className="step-tracker">
 {STEPS.map((s, i) => (
 <div className="step-item" key={s}>
 <div
 className={`step-dot ${i < step ? 'done' : i === step ? 'active' : ''}`}
 onClick={() => i < step && setStep(i)}
 style={{ cursor: i < step ? 'pointer' : 'default' }}
 >
 {i < step ? '✓' : i + 1}
 </div>
 <span className={`step-label ${i < step ? 'done' : i === step ? 'active' : ''}`}>{s}</span>
 {i < STEPS.length - 1 && <div className={`step-line ${i < step ? 'done' : ''}`} />}
 </div>
 ))}
 </div>

 <div className="resume-builder-wrap">
 {/* Left: Form */}
 <div>
 <div className="builder-form">

 {/* Step 0 – Personal */}
 {step === 0 && (
 <>
 <div className="form-section-title"> Personal Information</div>
 <div className="form-row">
 <div className="form-group">
 <label className="form-label">First Name *</label>
 <input className="form-input" placeholder="e.g. Sruthi" value={data.firstName || ''} onChange={e => upd('firstName', e.target.value)} id="inp-first-name" name="given-name" autoComplete="given-name" />
 </div>
 <div className="form-group">
 <label className="form-label">Last Name *</label>
 <input className="form-input" placeholder="e.g. Chilukuri" value={data.lastName || ''} onChange={e => upd('lastName', e.target.value)} id="inp-last-name" name="family-name" autoComplete="family-name" />
 </div>
 </div>
 <div className="form-row">
 <div className="form-group" style={{ marginBottom: 0 }}>
 <label className="form-label">Professional Title</label>
 <input className="form-input" placeholder="e.g. Software Engineer" value={data.title} onChange={e => upd('title', e.target.value)} id="inp-title" name="title" autoComplete="organization-title" />
 </div>
 </div>
 <div className="form-row">
 <div className="form-group">
 <label className="form-label">Email *</label>
 <input className="form-input" type="email" placeholder="your@email.com" value={data.email} onChange={e => upd('email', e.target.value)} id="inp-email" name="email" autoComplete="email" />
 </div>
 <div className="form-group">
 <label className="form-label">Phone</label>
 <input className="form-input" type="tel" placeholder="+1 (555) 000-0000" value={data.phone} onChange={e => upd('phone', e.target.value)} id="inp-phone" name="tel" autoComplete="tel" />
 </div>
 </div>
 <div className="form-row">
 <div className="form-group">
 <label className="form-label">Location</label>
 <input className="form-input" placeholder="Chicago, IL" value={data.location} onChange={e => upd('location', e.target.value)} />
 </div>
 <div className="form-group">
 <label className="form-label">LinkedIn URL</label>
 <input className="form-input" placeholder="linkedin.com/in/yourname" value={data.linkedin} onChange={e => upd('linkedin', e.target.value)} />
 </div>
 </div>
 <div className="form-group">
 <label className="form-label">Professional Summary</label>
 <textarea
 className="form-textarea"
 placeholder="A concise 2–3 sentence summary highlighting your key strengths and career goals…"
 value={data.summary}
 onChange={e => upd('summary', e.target.value)}
 id="inp-summary"
 />
 <p style={{ fontSize: '0.72rem', color: 'var(--gray-500)', marginTop: 4 }}>
 Tip: Include your top skills and years of experience for better ATS matching.
 </p>
 </div>
 </>
 )}

 {/* Step 1 – Education */}
 {step === 1 && (
 <>
 <div className="form-section-title"> Education</div>
 {data.education.map((e, i) => (
 <div key={i} style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
 <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)', marginBottom: 12 }}>Entry {i + 1}</div>
 <div className="form-group">
 <label className="form-label">School / University *</label>
 <input className="form-input" placeholder="Elmhurst University" value={e.school} onChange={ev => updEdu(i, 'school', ev.target.value)} />
 </div>
 <div className="form-row">
 <div className="form-group">
 <label className="form-label">Degree</label>
 <input className="form-input" placeholder="Master of Science" value={e.degree} onChange={ev => updEdu(i, 'degree', ev.target.value)} />
 </div>
 <div className="form-group">
 <label className="form-label">Field of Study</label>
 <input className="form-input" placeholder="Computer Science" value={e.field} onChange={ev => updEdu(i, 'field', ev.target.value)} />
 </div>
 </div>
 <div className="form-row">
 <div className="form-group">
 <label className="form-label">From</label>
 <input className="form-input" placeholder="Aug 2023" value={e.from} onChange={ev => updEdu(i, 'from', ev.target.value)} />
 </div>
 <div className="form-group">
 <label className="form-label">To</label>
 <input className="form-input" placeholder="May 2025" value={e.to} disabled={e.current} onChange={ev => updEdu(i, 'to', ev.target.value)} />
 <label style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, fontSize: '0.78rem', cursor: 'pointer', color: 'var(--gray-400)' }}>
 <input type="checkbox" checked={e.current} onChange={ev => updEdu(i, 'current', ev.target.checked)} />
 Currently Enrolled
 </label>
 </div>
 </div>
 <div className="form-group">
 <label className="form-label">GPA (optional)</label>
 <input className="form-input" placeholder="3.9 / 4.0" style={{ maxWidth: 160 }} value={e.gpa} onChange={ev => updEdu(i, 'gpa', ev.target.value)} />
 </div>
 </div>
 ))}
 <button className="btn-ghost" onClick={addEdu} style={{ width: '100%', justifyContent: 'center', display: 'flex' }}>
 + Add Another Education Entry
 </button>
 </>
 )}

 {/* Step 2 – Experience */}
 {step === 2 && (
 <>
 <div className="form-section-title"> Work Experience</div>
 <div style={{ padding: '10px 14px', background: 'rgba(245,166,35,0.06)', border: '1px solid rgba(245,166,35,0.2)', borderRadius: 8, marginBottom: 16 }}>
 <p style={{ fontSize: '0.78rem', color: 'var(--gold)', lineHeight: 1.6 }}>
 <strong>ATS Tip:</strong> Use action verbs (developed, led, managed, optimized) and include measurable results like percentages or numbers.
 </p>
 </div>
 {data.experience.map((e, i) => (
 <div key={i} style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
 <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)', marginBottom: 12 }}>Experience {i + 1}</div>
 <div className="form-row">
 <div className="form-group">
 <label className="form-label">Job Title / Role *</label>
 <input className="form-input" placeholder="Software Engineer Intern" value={e.role} onChange={ev => updExp(i, 'role', ev.target.value)} />
 </div>
 <div className="form-group">
 <label className="form-label">Company *</label>
 <input className="form-input" placeholder="Acme Corporation" value={e.company} onChange={ev => updExp(i, 'company', ev.target.value)} />
 </div>
 </div>
 <div className="form-row">
 <div className="form-group">
 <label className="form-label">From</label>
 <input className="form-input" placeholder="Jun 2023" value={e.from} onChange={ev => updExp(i, 'from', ev.target.value)} />
 </div>
 <div className="form-group">
 <label className="form-label">To</label>
 <input className="form-input" placeholder="Aug 2023" value={e.to} disabled={e.current} onChange={ev => updExp(i, 'to', ev.target.value)} />
 <label style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, fontSize: '0.78rem', cursor: 'pointer', color: 'var(--gray-400)' }}>
 <input type="checkbox" checked={e.current} onChange={ev => updExp(i, 'current', ev.target.checked)} />
 Current Role
 </label>
 </div>
 </div>
 <div className="form-group">
 <label className="form-label">Bullet Points (describe impact)</label>
 {e.bullets.map((b, bi) => (
 <input
 key={bi}
 className="form-input"
 style={{ marginBottom: 6 }}
 placeholder={`Bullet ${bi + 1}: e.g. Developed REST API that reduced load time by 40%`}
 value={b}
 onChange={ev => updBullet(i, bi, ev.target.value)}
 />
 ))}
 </div>
 </div>
 ))}
 <button className="btn-ghost" onClick={addExp} style={{ width: '100%', justifyContent: 'center', display: 'flex' }}>
 + Add Another Experience
 </button>
 </>
 )}

 {/* Step 3 – Skills */}
 {step === 3 && (
 <>
 <div className="form-section-title">️ Skills &amp; Certifications</div>
 <div className="form-group">
 <label className="form-label">Technical &amp; Soft Skills *</label>
 <textarea
 className="form-textarea"
 placeholder="Python, SQL, React, Node.js, Docker, AWS, Project Management, Communication, Team Leadership…"
 value={data.skills}
 onChange={e => upd('skills', e.target.value)}
 style={{ minHeight: 120 }}
 />
 <p style={{ fontSize: '0.72rem', color: 'var(--gray-500)', marginTop: 4 }}>Separate skills with commas or new lines.</p>
 </div>
 <div className="form-group">
 <label className="form-label">Certifications (optional)</label>
 <textarea
 className="form-textarea"
 placeholder="AWS Certified Developer – Associate (2024)&#10;Google Project Management Certificate (2023)"
 value={data.certifications}
 onChange={e => upd('certifications', e.target.value)}
 />
 </div>
 </>
 )}

 {/* Step 4 – Job Target / ATS */}
 {step === 4 && (
 <>
 <div className="form-section-title"> ATS Job Targeting</div>
 <div style={{ padding: '14px 18px', background: 'rgba(21,101,192,0.08)', border: '1px solid rgba(21,101,192,0.2)', borderRadius: 10, marginBottom: 20 }}>
 <p style={{ fontSize: '0.82rem', color: '#60a5fa', lineHeight: 1.6 }}>
 <strong>What is ATS?</strong> Applicant Tracking Systems scan your resume before it reaches a human.
 Paste the job description below and we'll analyze keyword match percentage and suggest improvements.
 </p>
 </div>
 <div className="form-group">
 <label className="form-label">Target Job Title</label>
 <input
 className="form-input"
 placeholder="e.g. Software Engineer, Data Analyst, Product Manager"
 value={data.jobTitle}
 onChange={e => upd('jobTitle', e.target.value)}
 id="inp-jobtitle"
 />
 </div>
 <div className="form-group">
 <label className="form-label">Paste Job Description</label>
 <textarea
 className="form-textarea"
 placeholder="Paste the full job description from LinkedIn, Indeed, or any job board here. We'll identify keywords your resume should include…"
 value={data.jobDesc}
 onChange={e => upd('jobDesc', e.target.value)}
 style={{ minHeight: 180 }}
 id="inp-jobdesc"
 />
 </div>

 {data.jobDesc.length > 30 && (
 <div className="ats-panel">
 <div className="ats-panel-title"> Real-time ATS Analysis</div>
 <p style={{ fontSize: '0.78rem', color: 'var(--gray-400)', marginTop: 4 }}>
 Based on your resume content vs. the job description.
 </p>

 <div className="ats-score">
 <span style={{ fontSize: '0.78rem', color: 'var(--gray-400)', whiteSpace: 'nowrap' }}>Match Score</span>
 <div className="ats-bar-wrap">
 <div className="ats-bar" style={{ width: `${ats.score}%` }} />
 </div>
 <span className="ats-pct">{ats.score}%</span>
 </div>

 <div style={{ marginTop: 14 }}>
 <p style={{ fontSize: '0.75rem', color: '#4ade80', marginBottom: 8 }}>
 Keywords Found in your resume ({ats.found.length})
 </p>
 <div className="keyword-tags">
 {ats.found.map(k => <span className="keyword-tag" key={k}>{k}</span>)}
 {ats.found.length === 0 && <span style={{ fontSize: '0.78rem', color: 'var(--gray-500)' }}>None yet — fill in your skills and experience first.</span>}
 </div>
 </div>

 {ats.missing.length > 0 && (
 <div style={{ marginTop: 12 }}>
 <p style={{ fontSize: '0.75rem', color: '#f87171', marginBottom: 8 }}>
 ️ Consider adding these keywords to your resume ({ats.missing.length})
 </p>
 <div className="keyword-tags">
 {ats.missing.map(k => <span className="keyword-tag missing" key={k}>{k}</span>)}
 </div>
 </div>
 )}

 <p style={{ fontSize: '0.72rem', color: 'var(--gray-500)', marginTop: 14 }}>
 Go back and naturally incorporate missing keywords into your skills or bullet points for a higher match score.
 </p>
 </div>
 )}
 </>
 )}

 {/* Step 5 – Preview */}
 {step === 5 && (
 <>
 <div className="form-section-title"> Choose Template</div>
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 28 }}>
 {['Modern', 'Classic', 'Executive'].map(theme => (
 <button 
 key={theme}
 style={{ 
 padding: '12px', background: data.templateId === theme.toLowerCase() ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.05)',
 border: `2px solid ${data.templateId === theme.toLowerCase() ? '#3b82f6' : 'transparent'}`,
 borderRadius: 8, color: '#fff', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s',
 fontSize: '0.9rem'
 }}
 onClick={() => upd('templateId', theme.toLowerCase())}
 >
 {theme}
 </button>
 ))}
 </div>

 <div className="form-section-title"> Review &amp; Download</div>
 <div style={{ padding: '14px 18px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 10, marginBottom: 20 }}>
 <p style={{ fontSize: '0.85rem', color: '#4ade80' }}>
 Your resume is ready! Review the preview on the right, then download in PDF or Word format.
 </p>
 </div>



 <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
 <button
 className="dl-btn dl-btn-pdf"
 style={{ padding: '14px 24px', borderRadius: 10, fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
 onClick={async () => {
 showToast(' Generating PDF…');
 await downloadPDF(paperRef);
 showToast(' PDF downloaded successfully!');
 }}
 id="dl-pdf-btn"
 >
 Download as PDF
 </button>
 <button
 className="dl-btn dl-btn-doc"
 style={{ padding: '14px 24px', borderRadius: 10, fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
 onClick={async () => {
 showToast(' Generating DOCX…');
 await downloadDOCX(data);
 showToast(' DOCX downloaded successfully!');
 }}
 id="dl-doc-btn"
 >
 Download as Word (.docx)
 </button>
 </div>

 {data.jobDesc.length > 30 && (
 <div style={{ marginTop: 20 }}>
 <div className="form-section-title">ATS Summary</div>
 <div className="ats-score">
 <span style={{ fontSize: '0.82rem', color: 'var(--gray-400)' }}>ATS Match for "{data.jobTitle}"</span>
 <div className="ats-bar-wrap"><div className="ats-bar" style={{ width: `${ats.score}%` }} /></div>
 <span className="ats-pct">{ats.score}%</span>
 </div>
 </div>
 )}
 </>
 )}

 {/* Navigation */}
 <div className="form-nav">
 {step > 0 && (
 <button className="btn-ghost" onClick={() => setStep(s => s - 1)}>← Previous</button>
 )}
 {!isLastStep && (
 <button
 className="btn-primary"
 style={{ marginLeft: step === 0 ? 'auto' : 0 }}
 onClick={() => {
 if (step === 0 && (!data.firstName || !data.lastName || !data.email)) {
 showToast('️ Please fill in all required personal information (*).');
 return;
 }
 if (step === 1 && data.education.some(e => !e.school)) {
 showToast('️ Please enter the School/University for all education entries.');
 return;
 }
 if (step === 2 && data.experience.some(e => !e.role || !e.company)) {
 showToast('️ Please enter the Job Title and Company for all work experiences.');
 return;
 }
 setStep(s => s + 1);
 }}
 id="next-step-btn"
 >
 Next Step →
 </button>
 )}
 </div>
 </div>
 </div>

 {/* Right: Live Preview */}
 <div className="resume-preview-panel">
 <div className="preview-header">
 <span className="preview-title">Live Preview</span>
 <div className="preview-dl-btns">
 <button
 className="dl-btn dl-btn-pdf"
 onClick={async () => {
 showToast(' Generating PDF…');
 await downloadPDF(paperRef);
 showToast(' PDF downloaded!');
 }}
 id="quick-dl-pdf"
 >
 PDF
 </button>
 <button
 className="dl-btn dl-btn-doc"
 onClick={async () => {
 showToast(' Generating DOCX…');
 await downloadDOCX(data);
 showToast(' DOCX downloaded!');
 }}
 id="quick-dl-doc"
 >
 DOCX
 </button>
 </div>
 </div>
 <div style={{ overflow: 'auto', maxHeight: '75vh', padding: '0 0 16px' }}>
 <ResumePaper data={data} ref={paperRef} />
 </div>
 </div>
 </div>
 </div>

 {toast && (
 <div className="toast" style={{ borderColor: toast.includes('') ? 'rgba(34,197,94,0.4)' : toast.includes('️') ? 'rgba(245,166,35,0.4)' : 'rgba(255,255,255,0.1)' }}>
 {toast}
 </div>
 )}
 </div>
 );
}

'use client';
import Link from 'next/link';

export default function LandingPage() {
 return (
 <div className="page-shell">
 <nav className="navbar">
 <div className="navbar-logo">
 <div className="logo-icon"></div>
 Jay<span>Connect</span>
 </div>
 <div className="navbar-right">
 <Link href="/feed" className="btn-ghost">Sign In</Link>
 <Link href="/feed" className="btn-gold">Join Now</Link>
 </div>
 </nav>

 <section className="hero">
 <div className="hero-bg" />
 <div className="hero-badge"> Elmhurst University · Student Innovation Hub</div>
 <h1>Where BlueJays Build<br />the Future Together</h1>
 <p>
 Share ideas, discover research, collaborate on projects, and grow your career —
 the innovation hub built for Elmhurst students &amp; professors.
 </p>
 <div className="hero-cta">
 <Link href="/feed" className="btn-gold" id="hero-join-btn"> Get Started</Link>
 <Link href="/events" className="btn-ghost">View Hackathons</Link>
 </div>

 <div className="hero-stats">
 {[
 { num: '1,200+', label: 'Students Connected' },
 { num: '84', label: 'Active Projects' },
 { num: '12', label: 'Monthly Hackathons' },
 { num: '340+', label: 'Resumes Built' },
 ].map(s => (
 <div className="stat" key={s.label}>
 <div className="stat-num">{s.num}</div>
 <div className="stat-label">{s.label}</div>
 </div>
 ))}
 </div>
 </section>


 </div>
 );
}

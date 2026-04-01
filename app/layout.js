import './globals.css';

export const metadata = {
 title: 'JayConnect – Elmhurst University',
 description: 'The official student collaboration and innovation hub for Elmhurst University. Share ideas, build projects, and connect with peers.',
};

export default function RootLayout({ children }) {
 return (
 <html lang="en">
 <head>
 <link rel="preconnect" href="https://fonts.googleapis.com" />
 <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
 <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
 </head>
 <body>{children}</body>
 </html>
 );
}

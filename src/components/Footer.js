"use client";

import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  // Do not show the public footer on admin pages
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer style={{
      padding: '2rem', 
      backgroundColor: '#F8FAFC', 
      color: 'var(--text-muted)',
      fontSize: '0.95rem',
      borderTop: '1px solid var(--border-color)'
    }}>
      <div className="container" style={{padding: 0}}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{fontWeight: '700', color: 'var(--primary-color)', fontSize: '1.1rem'}}>Dr. Mohamed Shaaban</div>
            <div style={{fontSize: '0.9rem'}}>General Dentist</div>
          </div>
          <div style={{display: 'flex', gap: '1.5rem'}}>
            <a href="mailto:avatarmohammedy@gmail.com" style={{color: 'var(--secondary-color)', textDecoration: 'none', fontWeight: '500'}}>Email</a>
            <a href="tel:01553911135" style={{color: 'var(--secondary-color)', textDecoration: 'none', fontWeight: '500'}}>Phone</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={{color: 'var(--secondary-color)', textDecoration: 'none', fontWeight: '500'}}>LinkedIn</a>
          </div>
        </div>
        <div style={{ textAlign: 'center', borderTop: '1px solid #E2E8F0', paddingTop: '1.5rem', fontSize: '0.85rem' }}>
          &copy; {new Date().getFullYear()} Dr. Mohamed Shaaban. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

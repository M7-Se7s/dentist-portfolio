"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();
  const [profile, setProfile] = useState(null);

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const docRef = doc(db, "content", "profile");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      } catch (err) {
        console.error("Failed to load profile for navbar", err);
      }
    }
    fetchProfile();
  }, []);

  // Do not show the public navbar on admin pages
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const name = profile?.name || "Dr. Mohamed Shaaban";

  return (
    <nav className={`${styles.navbar} glass animate-fadeIn`}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.brand} onClick={() => setMenuOpen(false)}>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <span>Dr. Mohamed Shaaban</span>
            <span style={{fontSize: '0.8rem', fontWeight: '400', color: 'var(--text-muted)'}}>General Dentist</span>
          </div>
        </Link>
        
        <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        <div className={`${styles.overlay} ${menuOpen ? styles.overlayOpen : ''}`} onClick={() => setMenuOpen(false)}></div>

        <div className={`${styles.navLinks} ${menuOpen ? styles.navLinksOpen : ''}`}>
          <Link href="/" className={pathname === '/' ? styles.active : ''} onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/about" className={pathname === '/about' ? styles.active : ''} onClick={() => setMenuOpen(false)}>About</Link>
          <Link href="/cases" className={pathname === '/cases' ? styles.active : ''} onClick={() => setMenuOpen(false)}>Cases</Link>
          <Link href="/cv" className={pathname === '/cv' ? styles.active : ''} onClick={() => setMenuOpen(false)}>CV</Link>
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className={styles.contactBtnMobile} onClick={() => setMenuOpen(false)}>
            Download CV
          </a>
        </div>
        
        <div className={styles.desktopContact}>
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className={styles.contactBtn}>
            Download CV
          </a>
        </div>
      </div>
    </nav>
  );
}

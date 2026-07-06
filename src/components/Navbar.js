"use client";

import { useState, useEffect } from 'react';
import { Link, usePathname, useRouter } from '../i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('Navigation');
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

  const toggleLanguage = () => {
    const nextLocale = locale === 'en' ? 'ar' : 'en';
    router.replace(pathname, {locale: nextLocale});
    setMenuOpen(false);
  };

  return (
    <>
      <div className={styles.navbarSpacer}></div>
      <nav className={`${styles.navbar} glass animate-fadeIn`}>
        <div className={styles.navContainer}>
        <Link href="/" className={styles.brand} onClick={() => setMenuOpen(false)}>
          <img src="/logo.png?v=2" alt="Dr. Mohamed Shaaban Logo" className={styles.logoImage} />
        </Link>
        
        <div className={`${styles.navLinks} ${menuOpen ? styles.navLinksOpen : ''}`}>
          <Link href="/" className={`${styles.navLink} ${pathname === '/' ? styles.active : ''}`} onClick={() => setMenuOpen(false)}>{t('home')}</Link>
          <Link href="/profile" className={`${styles.navLink} ${pathname === '/profile' ? styles.active : ''}`} onClick={() => setMenuOpen(false)}>{t('profile')}</Link>
          <Link href="/cases" className={`${styles.navLink} ${pathname === '/cases' ? styles.active : ''}`} onClick={() => setMenuOpen(false)}>{t('cases')}</Link>
          <Link href="/cv" className={`${styles.navLink} ${pathname === '/cv' ? styles.active : ''}`} onClick={() => setMenuOpen(false)}>{t('cv')}</Link>

          <div className={styles.mobileLangContainer}>
            <button className={styles.mobileLangBtn} aria-label="Change Language" onClick={toggleLanguage}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              <span>{locale === 'en' ? 'العربية' : 'English'}</span>
            </button>
          </div>
        </div>

        <div className={styles.rightActions}>
          <button className={styles.desktopLangBtn} onClick={toggleLanguage} aria-label="Change Language" title="Change Language">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            <span style={{marginLeft: '8px', fontSize: '14px', fontWeight: '500'}}>{locale === 'en' ? 'AR' : 'EN'}</span>
          </button>
          <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? (
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        <div className={`${styles.overlay} ${menuOpen ? styles.overlayOpen : ''}`} onClick={() => setMenuOpen(false)}></div>
      </div>
    </nav>
    </>
  );
}

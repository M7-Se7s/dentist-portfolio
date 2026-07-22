"use client";

import { useState, useEffect } from 'react';
import { Link, usePathname, useRouter } from '../i18n/routing';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('Navigation');
  const tHero = useTranslations('Hero');

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Update HTML dir and lang attributes dynamically during client-side navigation
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;

    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleEsc = (e) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen, locale]);

  // Do not show the public navbar on admin pages
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const toggleLanguage = () => {
    const nextLocale = locale === 'en' ? 'ar' : 'en';
    router.replace(pathname, { locale: nextLocale });
    setMenuOpen(false);
  };

  return (
    <>
      <div className={styles.navbarSpacer}></div>
      <nav className={`${styles.navbar} glass animate-fadeIn`}>
        <div className={styles.navContainer}>
          <Link href="/" className={styles.brand}>
            <Image 
              src="/logo.png" 
              alt={tHero('title')} 
              className={styles.logoImage} 
              width={200} 
              height={60} 
            />
          </Link>

          <div className={`${styles.navLinks} ${menuOpen ? styles.navLinksOpen : ''}`}>
            {/* Mobile Drawer Header */}
            <div className={styles.drawerHeader}>
              <span className={styles.drawerName}>{tHero('title')}</span>
              <button className={styles.closeDrawerBtn} onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <Link href="/" className={`${styles.navLink} ${pathname === '/' ? styles.active : ''}`} onClick={() => setMenuOpen(false)}>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className={styles.navIcon}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
              {t('home')}
            </Link>
            <Link href="/profile" className={`${styles.navLink} ${pathname === '/profile' ? styles.active : ''}`} onClick={() => setMenuOpen(false)}>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className={styles.navIcon}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              {t('profile')}
            </Link>
            <Link href="/cases" className={`${styles.navLink} ${pathname === '/cases' ? styles.active : ''}`} onClick={() => setMenuOpen(false)}>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className={styles.navIcon}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
              {t('cases')}
            </Link>
            <Link href="/cv" className={`${styles.navLink} ${pathname === '/cv' ? styles.active : ''}`} onClick={() => setMenuOpen(false)}>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className={styles.navIcon}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              {t('cv')}
            </Link>
          </div>

          <div className={styles.rightActions}>
            <button className={styles.desktopLangBtn} onClick={toggleLanguage} aria-label="Change Language" title="Change Language">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              <span style={{ fontSize: '14px', fontWeight: '500' }}>{locale === 'en' ? 'AR' : 'EN'}</span>
            </button>
            {!menuOpen && (
              <button className={styles.hamburger} onClick={() => setMenuOpen(true)} aria-label="Open menu">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
          </div>

          <div 
            className={`${styles.overlay} ${menuOpen ? styles.overlayOpen : ''}`} 
            onClick={() => setMenuOpen(false)}
            onTouchMove={(e) => e.preventDefault()}
          ></div>
        </div>
      </nav>
    </>
  );
}

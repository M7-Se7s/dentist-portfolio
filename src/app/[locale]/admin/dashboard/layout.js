"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from '@/i18n/routing';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Link } from '@/i18n/routing';
import styles from '../admin.module.css';
import Image from 'next/image';

import { UploadProvider } from '@/lib/contexts/UploadContext';

export default function DashboardLayout({ children }) {
  const [loading, setLoading] = useState(true);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/admin/login');
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Close drawer on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobileDrawerOpen(false);
  }, [pathname]);

  // Close drawer on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isMobileDrawerOpen) {
        setIsMobileDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isMobileDrawerOpen]);

  const handleLogout = async () => {
    document.cookie = "admin_session=; path=/; max-age=0";
    await signOut(auth);
    router.push('/admin/login');
  };

  const toggleDrawer = () => {
    setIsMobileDrawerOpen(!isMobileDrawerOpen);
  };

  if (loading) {
    return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>Loading Secure Dashboard...</div>;
  }

  const getLinkClass = (path) => {
    return pathname === path ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink;
  };

  return (
    <UploadProvider>
      <div className={styles.adminLayout}>
        {/* Drawer Overlay */}
        {isMobileDrawerOpen && (
          <div className={styles.drawerOverlay} onClick={toggleDrawer}></div>
        )}

        {/* Left Sidebar */}
        <aside className={`${styles.sidebar} ${isMobileDrawerOpen ? styles.sidebarOpen : ''} ${isDesktopSidebarCollapsed ? styles.sidebarCollapsed : ''} animate-fadeIn`}>
          <div className={styles.logoContainer}>
            <div className={styles.logoAvatar} style={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
              <Image src="/logo.png" alt="Logo" width={48} height={48} style={{ objectFit: 'contain' }} priority />
            </div>
            <div>
              <h2 className={styles.sidebarTitle} style={{marginBottom: 0, paddingBottom: 0, borderBottom: 'none'}}>Dr. Mohamed<br/>Shaaban</h2>
              <p className={styles.sidebarRole} style={{marginTop: '0.25rem', opacity: 0.8, fontSize: '0.85rem', color: '#fff'}}>Clinical Specialist</p>
            </div>
          </div>
          
          <nav className={styles.sidebarNav}>
            <Link href="/admin/dashboard" className={getLinkClass('/admin/dashboard')}>
              <svg className={styles.navIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
              <span className={styles.navText}>Dashboard</span>
            </Link>
            <Link href="/admin/dashboard/cases" className={getLinkClass('/admin/dashboard/cases')}>
              <svg className={styles.navIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              <span className={styles.navText}>Case Management</span>
            </Link>
            <Link href="/admin/dashboard/cv" className={getLinkClass('/admin/dashboard/cv')}>
              <svg className={styles.navIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
              <span className={styles.navText}>CV Editor</span>
            </Link>
            <Link href="/admin/dashboard/profile" className={getLinkClass('/admin/dashboard/profile')}>
              <svg className={styles.navIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              <span className={styles.navText}>Profile Editor</span>
            </Link>
            <Link href="/admin/dashboard/settings" className={getLinkClass('/admin/dashboard/settings')}>
              <svg className={styles.navIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              <span className={styles.navText}>Settings</span>
            </Link>
          </nav>
          
          {/* Desktop Collapse Toggle */}
          <button 
            className={styles.collapseToggleBtn} 
            onClick={() => setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed)}
            title={isDesktopSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isDesktopSidebarCollapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"}></path>
            </svg>
          </button>
          
          <div className={styles.sidebarProfile}>
            <div className={styles.profileInfo}>
              <div className={styles.profileAvatar}>
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </div>
              <div className={styles.profileDetails}>
                <span className={styles.profileName}>Dr. M. Shaaban</span>
                <span className={styles.profileRole}>Admin</span>
              </div>
            </div>
            <button onClick={handleLogout} className={styles.profileLogoutBtn} title="Logout">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className={styles.adminMain}>
          {/* Topbar */}
          <header className={styles.topbar}>
            <div className={styles.topbarLeft}>
              <button className={styles.menuBtn} onClick={toggleDrawer}>
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              </button>
            </div>

          </header>

          {/* Dashboard Content */}
          <main className={`${styles.adminContent} animate-fadeIn stagger-1`}>
            {children}
          </main>
        </div>
      </div>
    </UploadProvider>
  );
}

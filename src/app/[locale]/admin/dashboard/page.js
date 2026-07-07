"use client";

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import styles from '../admin.module.css';

export default function DashboardPage() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  


  async function fetchCases() {
    try {
      const querySnapshot = await getDocs(collection(db, "cases"));
      const casesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort by latest first
      casesList.sort((a, b) => b.createdAt - a.createdAt);
      setCases(casesList);
    } catch (error) {
      console.error("Error fetching cases: ", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCases();
  }, []);



  const publishedCases = cases.filter(c => !c.isDraft).length; // Assuming no draft logic yet, but this is a placeholder

  return (
    <>
      <div className={`${styles.dashboardMainColumn} animate-slideUp stagger-1`}>
        <div className={styles.pageWelcomeSection}>
          <h1 style={{fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '0.25rem'}}>Welcome back, Dr. Shaaban 👋</h1>
          <p style={{color: 'var(--text-muted)'}}>Here is what&apos;s happening with your clinic today.</p>
        </div>

        {/* Stat Cards */}
        <div className={styles.statCardsContainer}>
          <div className={styles.statCard}>
            <div className={`${styles.statCardIcon} ${styles.blue}`}>
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
            <div className={styles.statCardHeader}>
              <span className={styles.statCardTitle}>TOTAL CASES</span>
              <span className={styles.statCardTrend}>+12% this month</span>
            </div>
            <div className={styles.statCardValue}>{loading ? '-' : cases.length}</div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statCardIcon} ${styles.lightBlue}`}>
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div className={styles.statCardHeader}>
              <span className={styles.statCardTitle}>PUBLISHED CASES</span>
              <span className={styles.statCardTrend}>+5 this week</span>
            </div>
            <div className={styles.statCardValue}>{loading ? '-' : cases.length}</div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statCardIcon} ${styles.blue}`}>
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
            </div>
            <div className={styles.statCardHeader}>
              <span className={styles.statCardTitle}>PROFILE VIEWS</span>
              <span className={styles.statCardTrend}>Top 5% in Region</span>
            </div>
            <div className={styles.statCardValue}>2,481</div>
          </div>
        </div>

        {/* Dashboard Widgets (CV Edit & Analytics) */}
        <div className={styles.dashboardWidgetsRow}>
          {/* CV Quick Edit Card */}
          <div className={styles.cvQuickEditCard}>
            <div className={styles.cvQuickEditHeader}>
              <h3>CV Quick Edit</h3>
              <button className={styles.editIconBtn}>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
              </button>
            </div>
            <div className={styles.cvCardSubtitle}>LATEST ENTRY: CLINICAL EXPERIENCE</div>
            <div className={styles.cvCardTitle}>Senior Implantologist</div>
            <div className={styles.cvCardCompany}>Metropolitan Dental Group</div>
            <div className={styles.cvCardDate}>Jan 2020 — Present • New York, NY</div>
            <ul className={styles.cvCardList}>
              <li>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Led a team of 4 clinical associates in complex oral surgery cases.
              </li>
              <li>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Implemented a new digital workflow reducing patient chair time by 15%.
              </li>
            </ul>
            <button className={styles.cvUpdateBtn}>Update Experience</button>
          </div>

          {/* Profile Edit Card */}
          <div className={styles.cvQuickEditCard}>
            <div className={styles.cvQuickEditHeader}>
              <h3>Professional Profile</h3>
              <Link href="/admin/dashboard/profile" className={styles.editIconBtn}>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
              </Link>
            </div>
            <div className={styles.cvCardSubtitle}>PUBLIC BIOGRAPHY</div>
            <p style={{fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5', marginTop: '0.5rem', marginBottom: '1.5rem'}}>
              Update your main biography and philosophy quote displayed on the Professional Profile page.
            </p>
            <Link href="/admin/dashboard/profile" className={styles.cvUpdateBtn} style={{display: 'inline-block', textAlign: 'center', textDecoration: 'none'}}>
              Edit Profile
            </Link>
          </div>

          {/* Analytics Card */}
          <div className={styles.analyticsCard}>
            <div className={styles.analyticsIcon}>
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            </div>
            <h4 className={styles.analyticsTitle}>Detailed Analytics Preview</h4>
            <p className={styles.analyticsDesc}>Your monthly patient satisfaction score and clinical performance metrics are being compiled. Check back in 2 days for the full report.</p>
            <button className={styles.analyticsBtnPrimary}>Enable Auto-Sync</button>
            <button className={styles.analyticsBtnSecondary}>Generate PDF</button>
          </div>
        </div>


      </div>




    </>
  );
}

import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Link } from '@/i18n/routing';
import styles from '../admin.module.css';
import CloudinaryTracker from './CloudinaryTracker';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  let cases = [];
  let profileViews = 0;

  try {
    const querySnapshot = await getDocs(collection(db, "cases"));
    cases = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Sort by latest first
    cases.sort((a, b) => {
      let dateA = 0;
      let dateB = 0;
      if (a.createdAt) {
        const dateStrA = typeof a.createdAt === 'string' ? a.createdAt.replace(' ', 'T') : a.createdAt;
        dateA = typeof a.createdAt.toMillis === 'function' ? a.createdAt.toMillis() : new Date(dateStrA).getTime();
      }
      if (b.createdAt) {
        const dateStrB = typeof b.createdAt === 'string' ? b.createdAt.replace(' ', 'T') : b.createdAt;
        dateB = typeof b.createdAt.toMillis === 'function' ? b.createdAt.toMillis() : new Date(dateStrB).getTime();
      }
      return (dateB || 0) - (dateA || 0);
    });

    // Fetch Profile Views
    const viewsRef = doc(db, "analytics", "visits");
    const viewsSnap = await getDoc(viewsRef);
    if (viewsSnap.exists()) {
      profileViews = viewsSnap.data().count || 0;
    }
  } catch (error) {
    console.error("Error fetching dashboard stats: ", error);
  }

  return (
    <>
      <div className={`${styles.dashboardMainColumn} animate-slideUp stagger-1`}>
        <div className={styles.pageWelcomeSection}>
          <h1 style={{fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '0.25rem'}}>Welcome back, Dr. Shabaan 👋</h1>
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
            <div className={styles.statCardValue}>{cases.length}</div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statCardIcon} ${styles.lightBlue}`}>
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div className={styles.statCardHeader}>
              <span className={styles.statCardTitle}>PUBLISHED CASES</span>
              <span className={styles.statCardTrend}>+5 this week</span>
            </div>
            <div className={styles.statCardValue}>{cases.length}</div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statCardIcon} ${styles.blue}`}>
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
            </div>
            <div className={styles.statCardHeader}>
              <span className={styles.statCardTitle}>PROFILE VIEWS</span>
              <span className={styles.statCardTrend}>Top 5% in Region</span>
            </div>
            <div className={styles.statCardValue}>{profileViews.toLocaleString()}</div>
          </div>
        </div>

        {/* Analytics & Media Storage Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', marginTop: '2rem' }}>
          
          <CloudinaryTracker />

          {/* Top Performing Cases */}
          <div className={styles.formSection} style={{ marginBottom: 0 }}>
            <div className={styles.formSectionTitle}>Top Performing Cases</div>
            <div className={styles.caseTableWrapper}>
              <table className={styles.caseTable}>
                <thead>
                  <tr>
                    <th>Case Title</th>
                    <th>Category</th>
                    <th>Total Views</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cases.length === 0 ? (
                    <tr><td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No cases yet</td></tr>
                  ) : (
                    [...cases].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5).map(c => (
                      <tr key={c.id}>
                        <td style={{ fontWeight: 600 }}>{c.title}</td>
                        <td>{c.categories?.length > 0 ? c.categories.join(', ') : c.category || 'Uncategorized'}</td>
                        <td style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>{c.views || 0}</td>
                        <td>
                          <Link href={`/admin/dashboard/edit-case/${c.id}`} style={{ color: 'var(--primary-color)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </>
  );
}

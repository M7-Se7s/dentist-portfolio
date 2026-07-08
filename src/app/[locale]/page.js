"use client";

import { useEffect, useState } from 'react';
import { Link } from '../../i18n/routing';
import Image from 'next/image';
import { doc, getDoc, collection, getDocs, setDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import dynamic from 'next/dynamic';
import styles from './page.module.css';
import { useTranslations, useLocale } from 'next-intl';

const ImageSlider = dynamic(() => import('@/components/ImageSlider'), { ssr: false });
const DownloadCvButton = dynamic(() => import('@/components/DownloadCvButton'), { ssr: false });

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [cvData, setCvData] = useState(null);
  const [settings, setSettings] = useState(null);
  const [recentCases, setRecentCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const locale = useLocale();

  const tHero = useTranslations('Hero');
  const tProfile = useTranslations('Profile');
  const tCases = useTranslations('Cases');
  const tContact = useTranslations('Contact');

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch Profile for the Hero Image
        const profileRef = doc(db, "content", "profile");
        const profileSnap = await getDoc(profileRef);
        if (profileSnap.exists()) {
          setProfile(profileSnap.data());
        }

        // Fetch CV for the PDF URLs
        const cvRef = doc(db, "content", "cv");
        const cvSnap = await getDoc(cvRef);
        if (cvSnap.exists()) {
          setCvData(cvSnap.data());
        }

        // Fetch Settings for Contact Info
        const settingsRef = doc(db, "settings", "global");
        const settingsSnap = await getDoc(settingsRef);
        if (settingsSnap.exists()) {
          setSettings(settingsSnap.data());
        }

        // Fetch Featured Cases (limit to 3 for homepage)
        const casesSnapshot = await getDocs(collection(db, "cases"));
        let casesList = casesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                                          .filter(c => c.isDraft !== true && c.featured === true);
        casesList.sort((a, b) => {
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

        setRecentCases(casesList.slice(0, 3));

        // Track profile visit (only once per session)
        if (typeof window !== 'undefined' && !sessionStorage.getItem('hasVisitedProfile')) {
          sessionStorage.setItem('hasVisitedProfile', 'true');
          try {
            const analyticsRef = doc(db, "analytics", "visits");
            await setDoc(analyticsRef, { count: increment(1) }, { merge: true });
          } catch (analyticsError) {
            console.error("Error tracking visit:", analyticsError);
          }
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  return (
    <main>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroContainer}`}>
          <div className={styles.heroText}>
            <div className={`${styles.badge} animate-slideUp stagger-1`}>{tHero('badge')}</div>
            <h1 className="animate-slideUp stagger-2">{tHero('title')}</h1>
            <h2 className={`${styles.heroSubtitle} animate-slideUp stagger-3`}>
              {tHero('subtitle')}
            </h2>
            <p className={`${styles.heroBio} animate-slideUp stagger-4`}>
              {tHero('description')}
            </p>
            <div className={`${styles.heroActions} animate-slideUp stagger-4`}>
              <Link href="/cases" className="btn-primary">
                {tHero('viewWork')}
              </Link>
              <Link href="/cv" className="btn-secondary">
                {tHero('viewCV')}
              </Link>
              <DownloadCvButton 
                pdfUrl={cvData?.pdfUrl} 
                pdfUrlAr={cvData?.pdfUrlAr} 
                className="btn-secondary" 
                label={tHero('downloadCV')} 
              />
            </div>
          </div>
          <div className={styles.heroImageWrapper}>
            {profile?.homeImageUrl ? (
              <Image 
                src={profile.homeImageUrl} 
                alt={tHero('title')} 
                fill 
                sizes="(max-width: 768px) 100vw, 50vw"
                className={styles.heroImage} 
                priority
              />
            ) : (
              <div className={styles.heroPlaceholder}>
                <span>{tHero('professionalPhoto')}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Profile Preview */}
      <section className={styles.section} style={{backgroundColor: 'var(--white)'}}>
        <div className="container" style={{maxWidth: '800px', textAlign: 'center'}}>
          <h2 style={{fontSize: '2rem', color: 'var(--primary-color)', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)'}}>
            {tProfile('title')}
          </h2>
          <p style={{fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '2rem'}}>
            {locale === 'ar' 
              ? (profile?.biographyAr ? profile.biographyAr.split('\n')[0] : tProfile('biography').split('\n')[0])
              : (profile?.biography ? profile.biography.split('\n')[0] : tProfile('biography').split('\n')[0])}
          </p>
          <Link href="/profile" style={{color: 'var(--secondary-color)', fontWeight: '600', textDecoration: 'none', fontSize: '1.1rem'}}>
            {tProfile('viewProfile')}
          </Link>
        </div>
      </section>

      {/* Featured Cases */}
      {recentCases.length > 0 && (
        <section className={styles.section} style={{backgroundColor: '#F8FAFC'}}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2>{tCases('title')}</h2>
              <div className={styles.divider}></div>
            </div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}>
              {recentCases.map(caseItem => (
                <div key={caseItem.id} className="card" style={{padding: '0', overflow: 'hidden', width: '100%', maxWidth: '300px'}}>
                  <div style={{position: 'relative', height: '200px', backgroundColor: '#E2E8F0'}} onClick={(e) => e.preventDefault()}>
                    <ImageSlider 
                      beforeImage={caseItem.beforeImage || caseItem.beforeImageUrl} 
                      afterImage={caseItem.afterImage || caseItem.afterImageUrl} 
                    />
                  </div>
                  <div className={styles.caseCardContent} style={{padding: '1.5rem'}}>
                    <h3 style={{marginBottom: '1rem', color: 'var(--primary-color)'}}>{caseItem.title}</h3>
                    <Link href={`/cases/${caseItem.id}`} style={{color: 'var(--secondary-color)', fontWeight: '600', textDecoration: 'none'}}>
                      {tCases('viewCase')}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div style={{textAlign: 'center', marginTop: '3rem'}}>
              <Link href="/cases" className="btn-primary">{tCases('viewAll')}</Link>
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section id="contact" className={styles.section} style={{backgroundColor: 'var(--primary-color)', color: 'var(--white)', textAlign: 'center'}}>
        <div className="container">
          <h2 style={{fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '2rem', color: 'var(--white)', fontFamily: 'var(--font-heading)'}}>
            {tContact('title')}
          </h2>
          <div style={{display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap'}}>

            {(() => {
              const waNumber = settings?.whatsapp || settings?.phone || '01553911135';
              return (
                <a 
                  href={`https://wa.me/${waNumber.replace(/[^0-9]/g, '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-primary" 
                  style={{backgroundColor: 'var(--secondary-color)', color: 'var(--white)'}}
                >
                  {tContact('contactMe')}
                </a>
              );
            })()}
          </div>
        </div>
      </section>
    </main>
  );
}

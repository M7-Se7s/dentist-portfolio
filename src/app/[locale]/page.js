"use client";

import { useEffect, useState } from 'react';
import { Link } from '../../i18n/routing';
import Image from 'next/image';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ImageSlider from '@/components/ImageSlider';
import styles from './page.module.css';
import { useTranslations, useLocale } from 'next-intl';

export default function Home() {
  const [profile, setProfile] = useState(null);
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

        // Fetch Featured Cases (limit to 3 for homepage)
        const casesSnapshot = await getDocs(collection(db, "cases"));
        let casesList = casesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                                          .filter(c => c.isDraft !== true && c.featured === true);
        casesList.sort((a, b) => b.createdAt - a.createdAt);

        setRecentCases(casesList.slice(0, 3));

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  if (loading) {
    return <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Loading Portfolio...</div>;
  }

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
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="btn-secondary">
                {tHero('downloadCV')}
              </a>
            </div>
          </div>
          <div className={styles.heroImageWrapper}>
            {profile?.homeImageUrl ? (
              <Image 
                src={profile.homeImageUrl} 
                alt={tHero('title')} 
                fill 
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
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{backgroundColor: 'var(--white)', color: 'var(--primary-color)'}}>
              {tContact('downloadCV')}
            </a>
            <a href="mailto:avatarmohammedy@gmail.com" className="btn-primary" style={{backgroundColor: 'var(--secondary-color)', color: 'var(--white)'}}>
              {tContact('contactMe')}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

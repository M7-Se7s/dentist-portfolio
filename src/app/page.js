"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { doc, getDoc, collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db } from '../lib/firebase';
import ImageSlider from '../components/ImageSlider';
import styles from './page.module.css';

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [recentCases, setRecentCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch Profile for the Hero Image
        const profileRef = doc(db, "content", "profile");
        const profileSnap = await getDoc(profileRef);
        if (profileSnap.exists()) {
          setProfile(profileSnap.data());
        }

        // Fetch Recent Cases (limit to 3 for homepage)
        const casesSnapshot = await getDocs(collection(db, "cases"));
        let casesList = casesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
            <div className={`${styles.badge} animate-slideUp stagger-1`}>General Dentist</div>
            <h1 className="animate-slideUp stagger-2">Dr. Mohamed Shaaban</h1>
            <h2 className={`${styles.heroSubtitle} animate-slideUp stagger-3`}>
              Committed to evidence-based care, continuous learning, and high-quality restorative dentistry.
            </h2>
            <p className={`${styles.heroBio} animate-slideUp stagger-4`}>
              Dedicated to evidence-based dentistry with a focus on restorative care and continuous clinical development.
            </p>
            <div className={`${styles.heroActions} animate-slideUp stagger-4`}>
              <Link href="/cases" className="btn-primary">
                View My Work
              </Link>
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="btn-secondary">
                Download CV
              </a>
            </div>
          </div>
          <div className={styles.heroImageWrapper}>
            {profile?.homeImageUrl ? (
              <Image 
                src={profile.homeImageUrl} 
                alt="Dr. Mohamed Shaaban" 
                fill 
                className={styles.heroImage} 
                priority
              />
            ) : (
              <div className={styles.heroPlaceholder}>
                <span>Professional Photo</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Profile Preview */}
      <section className={styles.section} style={{backgroundColor: 'var(--white)'}}>
        <div className="container" style={{maxWidth: '800px', textAlign: 'center'}}>
          <h2 style={{fontSize: '2rem', color: 'var(--primary-color)', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)'}}>
            Professional Profile
          </h2>
          <p style={{fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '2rem'}}>
            {profile?.biography ? profile.biography.split('\n')[0] : 'I am Dr. Mohamed El Sayed Mohamed Shabaan, a General Dentist with more than two years of post-internship clinical experience, providing comprehensive dental care across multiple private dental clinics in Egypt.'}
          </p>
          <Link href="/profile" style={{color: 'var(--secondary-color)', fontWeight: '600', textDecoration: 'none', fontSize: '1.1rem'}}>
            View Full Profile &rarr;
          </Link>
        </div>
      </section>

      {/* Featured Cases */}
      {recentCases.length > 0 && (
        <section className={styles.section} style={{backgroundColor: '#F8FAFC'}}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2>Featured Cases</h2>
              <div className={styles.divider}></div>
            </div>
            
            <div className="grid" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))'}}>
              {recentCases.map(caseItem => (
                <div key={caseItem.id} className="card" style={{padding: '0', overflow: 'hidden'}}>
                  <div style={{position: 'relative', height: '200px', backgroundColor: '#E2E8F0'}} onClick={(e) => e.preventDefault()}>
                    <ImageSlider 
                      beforeImage={caseItem.beforeImageUrl} 
                      afterImage={caseItem.afterImageUrl} 
                    />
                  </div>
                  <div className={styles.caseCardContent} style={{padding: '1.5rem'}}>
                    <h3 style={{marginBottom: '1rem', color: 'var(--primary-color)'}}>{caseItem.title}</h3>
                    <Link href={`/cases/${caseItem.id}`} style={{color: 'var(--secondary-color)', fontWeight: '600', textDecoration: 'none'}}>
                      View Case &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div style={{textAlign: 'center', marginTop: '3rem'}}>
              <Link href="/cases" className="btn-primary">View All Cases &rarr;</Link>
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section id="contact" className={styles.section} style={{backgroundColor: 'var(--primary-color)', color: 'var(--white)', textAlign: 'center'}}>
        <div className="container">
          <h2 style={{fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '2rem', color: 'var(--white)', fontFamily: 'var(--font-heading)'}}>
            Interested in working together?
          </h2>
          <div style={{display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap'}}>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{backgroundColor: 'var(--white)', color: 'var(--primary-color)'}}>
              Download CV
            </a>
            <a href="mailto:avatarmohammedy@gmail.com" className="btn-primary" style={{backgroundColor: 'var(--secondary-color)', color: 'var(--white)'}}>
              Contact Me
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

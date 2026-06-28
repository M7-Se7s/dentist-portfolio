"use client";

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Image from 'next/image';
import styles from './about.module.css';

export default function AboutPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profileRef = doc(db, "content", "profile");
        const profileSnap = await getDoc(profileRef);
        let profileInfo = {
          name: 'Dr. Mohamed Shaaban',
          heroImageUrl: null
        };
        if (profileSnap.exists()) {
          setProfile({ ...profileInfo, ...profileSnap.data() });
        } else {
          setProfile(profileInfo);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) return <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Loading...</div>;

  return (
    <main style={{backgroundColor: '#F8FAFC', minHeight: 'calc(100vh - 80px)', padding: '5rem 0'}}>
      <div className="container" style={{maxWidth: '1000px'}}>
        
        {/* 1. About Me */}
        <section className={styles.aboutSection}>
          <div className={styles.aboutGrid}>
            <div className={styles.imageContainer}>
              {profile?.heroImageUrl ? (
                <div className={styles.imageWrapper}>
                  <Image src={profile.heroImageUrl} alt={profile.name} fill style={{objectFit: 'cover'}} />
                </div>
              ) : (
                <div className={styles.imagePlaceholder}>Professional Photo</div>
              )}
            </div>
            <div className={styles.textContent}>
              <h1>About Me</h1>
              <p>
                Hello, I am Dr. Mohamed Shaaban, a dedicated General Dentist with a strong foundation in evidence-based practice and clinical excellence. My journey in dentistry is driven by a commitment to providing high-quality, patient-centered care in a collaborative environment.
              </p>
              <p>
                I thrive on continuously updating my skills and adapting to the latest dental advancements. By combining a meticulous eye for aesthetic detail with modern restorative techniques, I strive to deliver treatments that function flawlessly and look completely natural.
              </p>
            </div>
          </div>
        </section>

        <hr className={styles.divider} />

        {/* 2. Professional Summary */}
        <section className={styles.section}>
          <h2>Professional Summary</h2>
          <ul className={styles.summaryList}>
            <li>General Dentist</li>
            <li>Focused on restorative dentistry</li>
            <li>Evidence-based practice</li>
            <li>Strong attention to detail</li>
            <li>Continuous learner</li>
          </ul>
        </section>

        <hr className={styles.divider} />

        {/* 3. Education */}
        <section className={styles.section}>
          <h2>Education</h2>
          <div className="card" style={{maxWidth: '500px'}}>
            <h3 style={{color: 'var(--primary-color)', fontSize: '1.25rem', marginBottom: '0.25rem'}}>Bachelor of Dental Surgery</h3>
            <p style={{color: 'var(--text-dark)', fontWeight: '500', marginBottom: '0.5rem'}}>University Name</p>
            <p style={{color: 'var(--text-muted)'}}>2026</p>
          </div>
        </section>

        <hr className={styles.divider} />

        {/* 4. Clinical Skills */}
        <section className={styles.section}>
          <h2>Clinical Skills</h2>
          <div className={styles.skillsContainer}>
            <span className={styles.skillChip}>Composite Restorations</span>
            <span className={styles.skillChip}>Endodontics</span>
            <span className={styles.skillChip}>Prosthodontics</span>
            <span className={styles.skillChip}>Diagnosis</span>
            <span className={styles.skillChip}>Treatment Planning</span>
            <span className={styles.skillChip}>Patient Communication</span>
            <span className={styles.skillChip}>Dental Photography</span>
          </div>
        </section>

        <hr className={styles.divider} />

        {/* 6. Professional Philosophy */}
        <section className={styles.section}>
          <h2>Professional Philosophy</h2>
          <div className="card" style={{backgroundColor: 'var(--white)', borderLeft: '4px solid var(--secondary-color)'}}>
            <p style={{fontSize: '1.1rem', color: 'var(--text-dark)', lineHeight: '1.8'}}>
              I believe that exceptional dental care goes far beyond clinical mechanics; it is deeply rooted in empathy, clear communication, and a profound respect for the patient's well-being. My approach is fundamentally conservative and evidence-based, ensuring that every treatment decision prioritizes the preservation of healthy tooth structure while achieving optimal long-term outcomes. As a clinician, I am committed to a path of lifelong learning, continuously refining my techniques and expanding my knowledge to become a well-rounded, dependable provider my patients can trust unconditionally.
            </p>
          </div>
        </section>

      </div>
    </main>
  );
}

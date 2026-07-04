"use client";

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Image from 'next/image';
import styles from './profile.module.css';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // The default text provided by the user, converted to first-person
  const defaultBiography = `I am Dr. Mohamed El Sayed Mohamed Shabaan, a General Dentist with more than two years of post-internship clinical experience, providing comprehensive dental care across multiple private dental clinics in Egypt.

I successfully passed the Saudi Prometric Examination and obtained the Saudi Commission for Health Specialties (SCFHS) Professional Classification.

Throughout my clinical practice, I have developed strong experience in endodontics, oral surgery, fixed and removable prosthodontics, pediatric dentistry, and esthetic restorative dentistry. My clinical interests include comprehensive treatment planning, full-mouth rehabilitation, management of impacted wisdom teeth, coronectomy, apicoectomy, and advanced restorative procedures.

I am experienced in performing routine and advanced dental procedures, including anterior and posterior root canal treatment using various rotary systems, endodontic retreatment, crown and bridge rehabilitation, porcelain veneers, complete and removable dentures, pediatric pulpotomy and pulpectomy, stainless steel crowns, and surgical dental extractions.

Committed to continuous professional development, I actively attend advanced training courses in endodontics and oral surgery and continuously work on improving my clinical and digital dentistry skills.

I believe that successful dentistry is achieved through accurate diagnosis, evidence-based treatment planning, and delivering high-quality patient-centered care with the highest standards of infection control and professionalism.`;

  const defaultQuote = "Every case presented in this portfolio reflects my commitment to conservative treatment principles, functional rehabilitation, esthetic excellence, and continuous professional development.";

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profileRef = doc(db, "content", "profile");
        const profileSnap = await getDoc(profileRef);
        let profileInfo = {
          name: 'Dr. Mohamed Shaaban',
          homeImageUrl: null,
          profileImageUrl: null,
          biography: defaultBiography,
          quote: defaultQuote
        };
        if (profileSnap.exists()) {
          const data = profileSnap.data();
          setProfile({
            ...profileInfo,
            ...data,
            // Only overwrite if they actually exist in the db to avoid wiping the default before it's saved
            biography: data.biography || defaultBiography,
            quote: data.quote || defaultQuote
          });
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

  if (loading) return <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Loading Profile...</div>;

  return (
    <main style={{backgroundColor: '#F8FAFC', minHeight: 'calc(100vh - 80px)', padding: '5rem 0'}}>
      <div className="container" style={{maxWidth: '1100px'}}>
        
        <section className={styles.profileSection}>
          <div className={styles.profileGrid}>
            <div className={styles.imageContainer}>
              {profile?.profileImageUrl ? (
                <div className={styles.imageWrapper}>
                  <Image src={profile.profileImageUrl} alt={profile.name} fill style={{objectFit: 'cover'}} priority />
                </div>
              ) : (
                <div className={styles.imagePlaceholder}>Professional Photo</div>
              )}
            </div>
            <div className={styles.textContent}>
              <h1>Professional Profile</h1>
              
              {/* Render biography paragraphs */}
              {profile?.biography?.split('\n').map((paragraph, index) => {
                if (!paragraph.trim()) return null; // skip empty lines
                return (
                  <p key={index} className={styles.bioParagraph}>
                    {paragraph}
                  </p>
                );
              })}

              <div className={styles.philosophyQuote}>
                "{profile?.quote}"
              </div>
              
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}

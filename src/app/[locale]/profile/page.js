"use client";

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';
import styles from './profile.module.css';
import { useTranslations, useLocale } from 'next-intl';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const tProfile = useTranslations('Profile');
  const locale = useLocale();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profileRef = doc(db, "content", "profile");
        const profileSnap = await getDoc(profileRef);
        let profileInfo = {
          name: 'Dr. Mohamed Shaaban',
          homeImageUrl: null,
          profileImageUrl: null,
          biography: tProfile('biography'),
          quote: tProfile('quote')
        };
        if (profileSnap.exists()) {
          const data = profileSnap.data();
          setProfile({
            ...profileInfo,
            ...data,
            biography: locale === 'ar' ? (data.biographyAr || tProfile('biography')) : (data.biography || tProfile('biography')),
            quote: locale === 'ar' ? (data.quoteAr || tProfile('quote')) : (data.quote || tProfile('quote'))
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
  }, [locale, tProfile]);

  return (
    <main style={{backgroundColor: '#F8FAFC', minHeight: 'calc(100vh - 80px)', padding: '5rem 0'}}>
      <div className="container">
        
        <section className={styles.profileSection}>
          <div className={styles.profileGrid}>
            <div className={styles.imageContainer}>
              {profile?.profileImageUrl ? (
                <div className={styles.imageWrapper}>
                  <Image src={profile.profileImageUrl} alt={profile.name} fill sizes="(max-width: 768px) 100vw, 33vw" style={{objectFit: 'cover'}} priority />
                </div>
              ) : (
                <div className={styles.imagePlaceholder}>{tProfile('title')}</div>
              )}
            </div>
            <div className={styles.textContent}>
              <h1>{tProfile('title')}</h1>
              
              {/* Render biography paragraphs */}
              {(profile?.biography || tProfile('biography')).split('\n').map((paragraph, index) => {
                if (!paragraph.trim()) return null; // skip empty lines
                return (
                  <p key={index} className={styles.bioParagraph}>
                    {paragraph}
                  </p>
                );
              })}

              <div className={styles.philosophyQuote}>
                &quot;{profile?.quote || tProfile('quote')}&quot;
              </div>
              
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}

"use client";

import { usePathname } from '../i18n/routing';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useTranslations } from 'next-intl';
import styles from './Footer.module.css';

export default function Footer() {
  const pathname = usePathname();
  const t = useTranslations('Footer');
  const [email, setEmail] = useState('avatarmohammedy@gmail.com');
  const [phone, setPhone] = useState('01553911135');

  useEffect(() => {
    async function fetchContactInfo() {
      try {
        const cvRef = doc(db, "content", "cv");
        const cvSnap = await getDoc(cvRef);
        if (cvSnap.exists()) {
          const data = cvSnap.data();
          if (data?.basicInfo?.email) setEmail(data.basicInfo.email);
          if (data?.basicInfo?.phone) setPhone(data.basicInfo.phone);
        }
      } catch (err) {
        console.error("Failed to load contact info for footer", err);
      }
    }
    fetchContactInfo();
  }, []);

  // Do not show the public footer on admin pages
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerContent}>
          <div className={styles.footerRow}>
            <div className={styles.footerInfo}>
              <span className={styles.footerName}>{t('name')}</span>
              <span className={styles.footerTitle}>{t('title')}</span>
            </div>
            <div className={styles.footerIcons}>
              <a href={`mailto:${email}`} className={styles.footerIconLink} aria-label="Email">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span className={styles.iconText}>{t('email')}</span>
              </a>
              <a href={`tel:${phone}`} className={styles.footerIconLink} aria-label="Phone">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span className={styles.iconText}>{t('phone')}</span>
              </a>
            </div>
          </div>
          <div className={styles.footerCopyright}>
            <div>&copy; {new Date().getFullYear()} {t('copyright')}</div>
            <div className={styles.developerCredit}>{t('developedBy')}</div>
          </div>
        </div>
      </div>
    </footer>
  );
}

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
  const [contact, setContact] = useState({
    email: 'avatarmohammedy@gmail.com',
    phone: '01553911135',
    whatsapp: '',
    linkedin: '',
    instagram: '',
    facebook: ''
  });

  useEffect(() => {
    async function fetchContactInfo() {
      try {
        const docRef = doc(db, "settings", "global");
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setContact(prev => ({ ...prev, ...snap.data() }));
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
              {contact.whatsapp && (
                <a href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className={styles.footerIconLink} aria-label="WhatsApp">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                  <span className={styles.iconText}>WhatsApp</span>
                </a>
              )}
              {contact.linkedin && (
                <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className={styles.footerIconLink} aria-label="LinkedIn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
              )}
              {contact.instagram && (
                <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className={styles.footerIconLink} aria-label="Instagram">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              )}
              {contact.facebook && (
                <a href={contact.facebook} target="_blank" rel="noopener noreferrer" className={styles.footerIconLink} aria-label="Facebook">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                  <span className={styles.iconText}>Facebook</span>
                </a>
              )}
              {contact.email && (
                <a href={`mailto:${contact.email}`} className={styles.footerIconLink} aria-label="Email">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <span className={styles.iconText}>{t('email')}</span>
                </a>
              )}
              {contact.phone && (
                <a href={`tel:${contact.phone}`} className={styles.footerIconLink} aria-label="Phone">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <span className={styles.iconText}>{t('phone')}</span>
                </a>
              )}
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

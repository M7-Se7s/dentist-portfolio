"use client";

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import styles from '../admin.module.css';

export default function CloudinaryTracker() {
  const [cloudinaryUsage, setCloudinaryUsage] = useState(null);

  useEffect(() => {
    async function fetchCloudinaryUsage() {
      try {
        const idToken = await auth.currentUser?.getIdToken();
        if (!idToken) return;

        const res = await fetch('/api/cloudinary/usage', {
          headers: { 'Authorization': `Bearer ${idToken}` }
        });
        const data = await res.json();
        if (data && data.storage) {
          setCloudinaryUsage({
            used: data.storage.usage,
            limit: data.storage.limit || 26843545600 // Default 25GB if not specified
          });
        }
      } catch (e) {
        console.error("Error fetching Cloudinary usage:", e);
      }
    }

    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        fetchCloudinaryUsage();
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className={styles.formSection} style={{ marginBottom: 0 }}>
      <div className={styles.formSectionTitle}>Cloudinary Media Storage</div>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
        Track how much image and video storage you are using out of your monthly quota.
      </p>
      {cloudinaryUsage ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
            <span>{(cloudinaryUsage.used / (1024 * 1024 * 1024)).toFixed(2)} GB Used</span>
            <span>{(cloudinaryUsage.limit / (1024 * 1024 * 1024)).toFixed(0)} GB Quota</span>
          </div>
          <div style={{ width: '100%', background: '#E2E8F0', borderRadius: '999px', height: '12px', overflow: 'hidden' }}>
            <div 
              style={{ 
                height: '100%', 
                background: (cloudinaryUsage.used / cloudinaryUsage.limit) > 0.85 ? '#EF4444' : '#10B981',
                width: `${Math.min((cloudinaryUsage.used / cloudinaryUsage.limit) * 100, 100)}%`,
                transition: 'width 1s ease-out'
              }}
            ></div>
          </div>
        </div>
      ) : (
        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Loading storage stats...</div>
      )}
    </div>
  );
}

"use client";

import { useEffect } from 'react';
import { doc, setDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function ViewTracker() {
  useEffect(() => {
    // Track profile visit (only once per session)
    if (typeof window !== 'undefined' && !sessionStorage.getItem('hasVisitedProfile')) {
      sessionStorage.setItem('hasVisitedProfile', 'true');
      const trackVisit = async () => {
        try {
          const analyticsRef = doc(db, "analytics", "visits");
          await setDoc(analyticsRef, { count: increment(1) }, { merge: true });
        } catch (analyticsError) {
          console.error("Error tracking visit:", analyticsError);
        }
      };
      trackVisit();
    }
  }, []);

  return null;
}

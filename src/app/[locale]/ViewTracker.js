"use client";

import { useEffect } from 'react';

export default function ViewTracker() {
  useEffect(() => {
    // Track profile visit (only once per session)
    if (typeof window !== 'undefined' && !sessionStorage.getItem('hasVisitedProfile')) {
      sessionStorage.setItem('hasVisitedProfile', 'true');
      const trackVisit = async () => {
        try {
          // Lazy-load Firebase to avoid blocking the main thread during hydration
          const [{ doc, setDoc, increment }, { db }] = await Promise.all([
            import('firebase/firestore'),
            import('@/lib/firebase')
          ]);
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

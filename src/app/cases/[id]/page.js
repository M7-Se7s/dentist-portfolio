"use client";

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import ImageSlider from '../../../components/ImageSlider';
import styles from './detail.module.css';

export default function CaseDetail({ params }) {
  // In Next 15+ App Router, params must be awaited if we destructure it directly inside the component, 
  // or we can use `React.use()` to unwrap it if it's passed as a promise.
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCase() {
      try {
        const docRef = doc(db, "cases", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setCaseData({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("Case not found.");
        }
      } catch (err) {
        console.error("Error fetching case: ", err);
        setError("Failed to load case details.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchCase();
    }
  }, [id]);

  if (loading) {
    return <div className={styles.loading}>Loading case details...</div>;
  }

  if (error || !caseData) {
    return (
      <div className={styles.error}>
        <p>{error || "Case not found."}</p>
        <Link href="/cases" className="btn-primary" style={{marginTop: '1rem'}}>Back to Cases</Link>
      </div>
    );
  }

  return (
    <main>
      <div className={styles.detailHeader}>
        <div className="container">
          <Link href="/cases" className={styles.backLink}>
            &larr; Back to Gallery
          </Link>
          <h1 className={styles.title}>{caseData.title}</h1>
        </div>
      </div>

      <section className={styles.contentSection}>
        <div className="container">
          <div className={styles.splitView}>
            
            {/* Left: Images */}
            <div className={styles.comparisonBox}>
              <ImageSlider 
                beforeImage={caseData.beforeImageUrl} 
                afterImage={caseData.afterImageUrl} 
              />
            </div>

            {/* Right: Info */}
            <div className={styles.infoBox}>
              <div className={styles.infoBlock}>
                <h3>Case Description</h3>
                <p>{caseData.description || "No description provided."}</p>
              </div>

              {caseData.treatmentDetails && (
                <div className={styles.infoBlock} style={{marginTop: '2rem'}}>
                  <h3>Treatment Details</h3>
                  <div 
                    className="rich-text-content" 
                    dangerouslySetInnerHTML={{ __html: caseData.treatmentDetails }} 
                  />
                </div>
              )}
            </div>
          </div>

          {/* Gallery Section */}
          {caseData.galleryImages && caseData.galleryImages.length > 0 && (
            <div style={{marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid var(--border-color)'}}>
              <h3 style={{fontSize: '1.5rem', marginBottom: '2rem', color: 'var(--text-dark)'}}>Case Gallery</h3>
              <div style={{
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                gap: '1.5rem'
              }}>
                {caseData.galleryImages.map((img, idx) => (
                  <div key={idx} style={{
                    position: 'relative', 
                    aspectRatio: '1', 
                    borderRadius: '12px', 
                    overflow: 'hidden',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                    border: '1px solid var(--border-color)'
                  }}>
                    <img 
                      src={img.url} 
                      alt={`Gallery image ${idx + 1}`} 
                      style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

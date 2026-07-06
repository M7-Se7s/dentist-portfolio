"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ImageSlider from '@/components/ImageSlider';
import styles from './page.module.css';

const CATEGORIES = [
  "All",
  "Composite",
  "Endodontics",
  "Prosthodontics",
  "Esthetic",
  "Posterior Restorations"
];



export default function CasesGallery() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [visibleCount, setVisibleCount] = useState(9);

  useEffect(() => {
    async function fetchCases() {
      try {
        const q = query(collection(db, "cases"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        let fetchedCases = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })).filter(caseItem => caseItem.isDraft !== true);
        
        setCases(fetchedCases);
      } catch (error) {
        console.error("Error fetching cases: ", error);
        setCases([]); 
      } finally {
        setLoading(false);
      }
    }

    fetchCases();
  }, []);

  const filteredCases = cases.filter(caseItem => {
    if (activeFilter === "All") return true;
    // Handle both old schema (category string) and new schema (categories array)
    if (caseItem.categories && Array.isArray(caseItem.categories)) {
      return caseItem.categories.includes(activeFilter);
    }
    return caseItem.category === activeFilter;
  });

  const visibleCases = filteredCases.slice(0, visibleCount);
  const hasMore = visibleCount < filteredCases.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 9);
  };

  return (
    <main style={{backgroundColor: 'var(--background)'}}>
      {/* 1. Small Hero Section */}
      <div className={styles.pageHeader}>
        <div className="container">
          <h1>Clinical Cases</h1>
          <p>A curated collection of documented clinical cases demonstrating diagnosis, treatment planning, and restorative outcomes.</p>
        </div>
      </div>

      {/* 2. Filter Bar */}
      <div className="container">
        <div className={styles.filterBar}>
          {CATEGORIES.map(category => (
            <button 
              key={category}
              className={`${styles.filterBtn} ${activeFilter === category ? styles.filterBtnActive : ''}`}
              onClick={() => {
                setActiveFilter(category);
                setVisibleCount(9); // Reset pagination on filter change
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Clinical Case Grid */}
      <section className={styles.gallerySection}>
        <div className="container">
          {loading ? (
            <div className={styles.loading}>Loading clinical cases...</div>
          ) : visibleCases.length === 0 ? (
            <div className={styles.loading}>No cases found for this category.</div>
          ) : (
            <>
              <div className={styles.grid}>
                {visibleCases.map((caseItem) => (
                  <div key={caseItem.id} className={styles.caseCard}>
                    <div className={styles.imageWrapper}>
                      <ImageSlider 
                        beforeImage={caseItem.beforeImage || caseItem.beforeImageUrl} 
                        afterImage={caseItem.afterImage || caseItem.afterImageUrl} 
                      />
                    </div>
                    <div className={styles.caseInfo}>
                      {/* 4. Category Badge & Title */}
                      <span className={styles.caseCategory}>
                        {caseItem.categories && caseItem.categories.length > 0 ? caseItem.categories[0] : (caseItem.category || "General")}
                      </span>
                      <Link href={`/cases/${caseItem.id}`} style={{textDecoration: 'none', display: 'inline-block'}}>
                        <h3 className={styles.caseTitle}>{caseItem.title}</h3>
                      </Link>
                      <p className={styles.caseDesc}>
                        {caseItem.description?.substring(0, 80)}
                        {caseItem.description?.length > 80 ? '...' : ''}
                      </p>
                      <Link href={`/cases/${caseItem.id}`} style={{textDecoration: 'none'}}>
                        <span className={styles.viewBtn}>View Case &rarr;</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* 5. Pagination / Load More */}
              {hasMore && (
                <div className={styles.loadMoreContainer}>
                  <button onClick={handleLoadMore} className={styles.loadMoreBtn}>
                    Load More Cases
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}

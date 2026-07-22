"use client";

import { useState, useRef, useEffect, useTransition } from 'react';
import { Link } from '@/i18n/routing';
import dynamic from 'next/dynamic';
import { useTranslations, useLocale } from 'next-intl';
import styles from './page.module.css';
import ImageSlider from '@/components/ImageSlider';
import ImageCarousel from '@/components/ImageCarousel';

export default function CasesClient({ initialCases, dbCategories }) {
  const [activeCategory, setActiveCategory] = useState("Full Mouth Rehabilitation Cases");
  const [visibleCount, setVisibleCount] = useState(9);
  const [isPending, startTransition] = useTransition();

  const t = useTranslations('Cases');
  const locale = useLocale();

  const filteredCases = initialCases.filter(caseItem => {
    const normalize = (str) => (str || "").trim().toLowerCase();
    const activeNormalized = normalize(activeCategory);

    if (caseItem.categories && Array.isArray(caseItem.categories)) {
      return caseItem.categories.some(cat => normalize(cat) === activeNormalized);
    }
    return normalize(caseItem.category) === activeNormalized;
  });

  const visibleCases = filteredCases.slice(0, visibleCount);
  const hasMore = visibleCount < filteredCases.length;

  const handleLoadMore = () => {
    startTransition(() => {
      setVisibleCount(prev => prev + 9);
    });
  };

  const categoryIcons = {
    "All": <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
    "Full Mouth Rehabilitation Cases": <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>,
    "Composite": <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>,
    "Endodontics": <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2"></path><path d="M4 10h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10z"></path><path d="M12 14v4"></path><path d="M9 14v4"></path><path d="M15 14v4"></path></svg>,
    "Prosthodontics": <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>,
    "Esthetic": <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>,
    "Posterior Restorations": <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>,
    "General": <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
  };
  const defaultIcon = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;

  return (
    <>
      {/* Filter Bar */}
      <div className="container">
        <div className={styles.categoryTabBarWrapper}>
          <div className={styles.categoryTabBar}>
            {dbCategories.map(cat => {
              const isActive = activeCategory === cat.nameEn;
              const displayName = locale === 'ar' && cat.nameAr ? cat.nameAr : cat.nameEn;
              const icon = categoryIcons[cat.nameEn] || defaultIcon;
              
              return (
                <button
                  key={cat.nameEn}
                  type="button"
                  className={`${styles.categoryTab} ${isActive ? styles.categoryTabActive : ''}`}
                  onClick={() => {
                    startTransition(() => {
                      setActiveCategory(cat.nameEn);
                      setVisibleCount(9);
                    });
                  }}
                >
                  <span className={styles.categoryTabIcon}>{icon}</span>
                  <span>{displayName}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Clinical Case Grid */}
      <section className={styles.gallerySection}>
        <div className="container">
          {visibleCases.length === 0 ? (
            <div className={styles.loading}>{t('noCases')}</div>
          ) : (
            <>
              <div className={styles.grid} style={{ opacity: isPending ? 0.7 : 1, transition: 'opacity 0.15s ease' }}>
                {visibleCases.map((caseItem) => {
                  const description = locale === 'ar' ? (caseItem.descriptionAr || caseItem.description) : caseItem.description;
                  
                  // Use category as alt text since title is removed
                  const altText = caseItem.category || caseItem.categories?.[0] || 'Case Image';
                  const allCategories = caseItem.categories && caseItem.categories.length > 0 
                    ? caseItem.categories 
                    : (caseItem.category ? [caseItem.category] : ["All"]);

                  // Use caseType to determine behavior, with backwards compatibility for old cases
                  const isDetailed = caseItem.caseType === 'detailed' || 
                    (!caseItem.caseType && (() => {
                      const normalize = (str) => (str || "").trim().toLowerCase();
                      if (caseItem.categories && Array.isArray(caseItem.categories)) {
                        return caseItem.categories.some(cat => normalize(cat) === "full mouth rehabilitation cases");
                      }
                      return normalize(caseItem.category) === "full mouth rehabilitation cases";
                    })());

                  // For simple cases, collect all available images for the carousel
                  let simpleImages = [];
                  if (!isDetailed) {
                    if (caseItem.coverImage) simpleImages.push(caseItem.coverImage);
                    if (caseItem.images && Array.isArray(caseItem.images)) {
                      const urls = caseItem.images.map(img => typeof img === 'string' ? img : (img.url || '')).filter(Boolean);
                      simpleImages = [...simpleImages, ...urls];
                    }
                    simpleImages = [...new Set(simpleImages)]; // deduplicate
                  }

                  return (
                  <div key={caseItem.id} className={`${styles.caseCard} ${!isDetailed ? styles.simpleCard : ''}`}>
                    <div className={styles.imageWrapper}>
                      {isDetailed ? (
                        (!caseItem.beforeImage && !caseItem.beforeImageUrl && caseItem.coverImage) ? (
                          <img 
                            src={caseItem.coverImage || '/images/placeholder.jpg'} 
                            alt={altText} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          />
                        ) : (
                          <ImageSlider 
                            beforeImage={caseItem.beforeImage || caseItem.beforeImageUrl} 
                            afterImage={caseItem.afterImage || caseItem.afterImageUrl} 
                          />
                        )
                      ) : (
                        simpleImages.length > 1 ? (
                          <ImageCarousel images={simpleImages} alt={altText} />
                        ) : (
                          <img 
                            src={simpleImages[0] || '/images/placeholder.jpg'} 
                            alt={altText} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          />
                        )
                      )}
                    </div>
                    <div className={`${styles.caseInfo} ${!isDetailed ? styles.simpleCardInfo : ''}`}>
                      <div className={styles.categoriesWrapper}>
                        {allCategories.map(cat => {
                          const catObj = dbCategories.find(c => c.nameEn === cat);
                          const displayName = locale === 'ar' && catObj?.nameAr ? catObj.nameAr : cat;
                          return (
                            <span key={cat} className={styles.caseCategory}>
                              {displayName}
                            </span>
                          );
                        })}
                      </div>
                      <p className={isDetailed ? styles.caseDesc : styles.simpleCardDesc}>
                        {isDetailed ? (
                          <>
                            {description?.substring(0, 80)}
                            {description?.length > 80 ? '...' : ''}
                          </>
                        ) : (
                          description
                        )}
                      </p>
                      {isDetailed && (
                        <Link href={`/cases/${caseItem.id}`} className={styles.viewDetailsBtn}>
                          {t('viewCase')}
                        </Link>
                      )}
                    </div>
                  </div>
                  );
                })}
              </div>

              {/* Pagination / Load More */}
              {hasMore && (
                <div className={styles.loadMoreContainer}>
                  <button onClick={handleLoadMore} className={styles.loadMoreBtn}>
                    {t('loadMore')}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}

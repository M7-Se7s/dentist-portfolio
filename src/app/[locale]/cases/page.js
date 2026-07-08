"use client";

import { useEffect, useState, useRef } from 'react';
import { Link } from '@/i18n/routing';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import dynamic from 'next/dynamic';
const ImageSlider = dynamic(() => import('@/components/ImageSlider'), { ssr: false });
import { useTranslations, useLocale } from 'next-intl';
import styles from './page.module.css';


export default function CasesGallery() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const [visibleCount, setVisibleCount] = useState(9);

  const t = useTranslations('Cases');
  const locale = useLocale();

  const [dbCategories, setDbCategories] = useState([]);

  useEffect(() => {
    async function fetchCats() {
      try {
        const q = query(collection(db, "categories"), orderBy("nameEn", "asc"));
        const snap = await getDocs(q);
        const fetched = snap.docs.map(d => d.data());
        setDbCategories([{ nameEn: "All", nameAr: "الكل" }, ...fetched]);
      } catch(e) {
        console.error("Failed to fetch categories:", e);
        setDbCategories([
          { nameEn: "All", nameAr: "الكل" },
          { nameEn: "Composite", nameAr: "كومبوزيت" },
          { nameEn: "Endodontics", nameAr: "علاج الجذور" },
          { nameEn: "Prosthodontics", nameAr: "تركيبات أسنان" },
          { nameEn: "Esthetic", nameAr: "تجميل الأسنان" },
          { nameEn: "Posterior Restorations", nameAr: "حشوات خلفية" }
        ]);
      }
    }
    fetchCats();
  }, []);

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
    if (activeFilters.length === 0) return true;
    
    // Handle both old schema (category string) and new schema (categories array)
    if (caseItem.categories && Array.isArray(caseItem.categories)) {
      // Return true if ANY active filter matches
      return activeFilters.some(filter => caseItem.categories.includes(filter));
    }
    return activeFilters.includes(caseItem.category);
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
          <h1>{t('title')}</h1>
          <p>{t('description')}</p>
        </div>
      </div>

      {/* 2. Filter Bar */}
      <div className="container">
        <div className={styles.filterDropdownContainer}>
          <div className={styles.customSelectWrapper} ref={dropdownRef}>
            <button 
              type="button"
              className={styles.customSelectBtn} 
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className={styles.selectedTags}>
                {activeFilters.length === 0 ? (
                  <span className={styles.placeholderText}>
                    {locale === 'ar' ? 'جميع الفئات' : 'All Categories'}
                  </span>
                ) : (
                  activeFilters.map(filter => {
                    const catObj = dbCategories.find(c => c.nameEn === filter);
                    const displayName = locale === 'ar' && catObj?.nameAr ? catObj.nameAr : filter;
                    return (
                      <span key={filter} className={styles.selectedTag}>
                        {displayName}
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                             onClick={(e) => {
                               e.stopPropagation();
                               setActiveFilters(prev => prev.filter(c => c !== filter));
                             }}
                             style={{cursor: 'pointer', marginLeft: '4px'}}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </span>
                    )
                  })
                )}
              </div>
              <div className={styles.selectIcon}>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" 
                     style={{transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease'}}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </button>

            {dropdownOpen && (
              <div className={styles.dropdownMenu}>
                {dbCategories.map(cat => {
                  const isSelected = cat.nameEn === "All" ? activeFilters.length === 0 : activeFilters.includes(cat.nameEn);
                  const displayName = locale === 'ar' && cat.nameAr ? cat.nameAr : cat.nameEn;
                  
                  return (
                    <div 
                      key={cat.nameEn} 
                      className={`${styles.dropdownItem} ${isSelected ? styles.dropdownItemActive : ''}`}
                      onClick={() => {
                        if (cat.nameEn === "All") {
                          setActiveFilters([]);
                        } else {
                          setActiveFilters(prev => 
                            prev.includes(cat.nameEn) 
                              ? prev.filter(c => c !== cat.nameEn)
                              : [...prev, cat.nameEn]
                          );
                        }
                        setVisibleCount(9);
                      }}
                    >
                      <div className={styles.checkbox}>
                        {isSelected && <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>}
                      </div>
                      <span>{displayName}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Clinical Case Grid */}
      <section className={styles.gallerySection}>
        <div className="container">
          {loading ? (
            <div className={styles.loading}>{t('loading')}</div>
          ) : visibleCases.length === 0 ? (
            <div className={styles.loading}>{t('noCases')}</div>
          ) : (
            <>
              <div className={styles.grid}>
                {visibleCases.map((caseItem) => {
                  const title = locale === 'ar' ? (caseItem.titleAr || caseItem.title) : caseItem.title;
                  const description = locale === 'ar' ? (caseItem.descriptionAr || caseItem.description) : caseItem.description;
                  const allCategories = caseItem.categories && caseItem.categories.length > 0 
                    ? caseItem.categories 
                    : (caseItem.category ? [caseItem.category] : ["All"]);

                  return (
                  <div key={caseItem.id} className={styles.caseCard}>
                    <div className={styles.imageWrapper}>
                      <ImageSlider 
                        beforeImage={caseItem.beforeImage || caseItem.beforeImageUrl} 
                        afterImage={caseItem.afterImage || caseItem.afterImageUrl} 
                      />
                    </div>
                    <div className={styles.caseInfo}>
                      {/* 4. Category Badges & Title */}
                      <div className={styles.categoriesWrapper}>
                        {allCategories.map(cat => (
                          <span key={cat} className={styles.caseCategory}>
                            {t(`Categories.${cat}`)}
                          </span>
                        ))}
                      </div>
                      <Link href={`/cases/${caseItem.id}`} style={{textDecoration: 'none', display: 'inline-block'}}>
                        <h3 className={styles.caseTitle}>{title}</h3>
                      </Link>
                      <p className={styles.caseDesc}>
                        {description?.substring(0, 80)}
                        {description?.length > 80 ? '...' : ''}
                      </p>
                      <Link href={`/cases/${caseItem.id}`} style={{textDecoration: 'none'}}>
                        <span className={styles.viewBtn}>{t('viewCase')}</span>
                      </Link>
                    </div>
                  </div>
                  );
                })}
              </div>

              {/* 5. Pagination / Load More */}
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
    </main>
  );
}

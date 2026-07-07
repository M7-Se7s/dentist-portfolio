/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState, use } from 'react';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ImageSlider from '@/components/ImageSlider';
import { useTranslations, useLocale } from 'next-intl';
import styles from './detail.module.css';

export default function CaseDetail({ params }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const t = useTranslations('CaseDetail');
  const locale = useLocale();

  useEffect(() => {
    async function fetchCase() {
      try {
        const docRef = doc(db, "cases", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setCaseData({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError(t('notFound'));
        }
      } catch (err) {
        console.error("Error fetching case: ", err);
        setError(t('notFound'));
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchCase();
    }
  }, [id, t]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') setLightboxIndex(prev => (prev + 1) % lightboxImages.length);
      if (e.key === 'ArrowLeft') setLightboxIndex(prev => (prev - 1 + lightboxImages.length) % lightboxImages.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, lightboxImages]);

  const openLightbox = (imagesList, startIndex) => {
    const urls = imagesList.map(img => typeof img === 'string' ? img : (img.url || ''));
    setLightboxImages(urls);
    setLightboxIndex(startIndex);
    setLightboxOpen(true);
  };

  if (loading) {
    return <div className={styles.loading}>{t('loading')}</div>;
  }

  if (error || !caseData) {
    return (
      <div className={styles.error}>
        <p>{error || t('notFound')}</p>
        <Link href="/cases" className="btn-primary" style={{marginTop: '1rem'}}>{t('backToCases')}</Link>
      </div>
    );
  }

  const title = locale === 'ar' ? (caseData.titleAr || caseData.title) : caseData.title;
  const description = locale === 'ar' ? (caseData.descriptionAr || caseData.description) : caseData.description;
  const treatmentPlan = locale === 'ar' ? (caseData.treatmentPlanAr || caseData.treatmentPlan || caseData.treatmentDetails) : (caseData.treatmentPlan || caseData.treatmentDetails);

  return (
    <main>
      <div className={styles.detailHeader}>
        <div className={`container ${styles.headerContainer}`}>
          <Link 
            href="/cases" 
            className={`${styles.backLink} ${locale === 'ar' ? styles.backLinkAr : styles.backLinkEn}`} 
            aria-label="Back to Gallery"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={locale === 'ar' ? styles.iconAr : ''}>
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </Link>
          <h1 className={styles.pageTitle}>{title}</h1>
        </div>
      </div>

      <section className={styles.contentSection}>
        <div className="container">
          <div className={styles.splitView}>
            
            {/* Left: Images */}
            <div className={styles.imageColumn}>
              <div className={styles.comparisonBox}>
                <ImageSlider 
                  beforeImage={caseData.beforeImage || caseData.beforeImageUrl} 
                  afterImage={caseData.afterImage || caseData.afterImageUrl} 
                  priority={true}
                />
              </div>
              <div className={styles.viewFullImagesWrapper}>
                <button 
                  onClick={() => openLightbox(
                    [caseData.beforeImage || caseData.beforeImageUrl, caseData.afterImage || caseData.afterImageUrl].filter(Boolean), 
                    0
                  )}
                  className={styles.viewFullImagesBtn}
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
                  </svg>
                  {t('viewFullImages')}
                </button>
              </div>
            </div>

            {/* Right: Info */}
            <div className={styles.infoBox}>
              <div className={styles.infoBlock}>
                <h3>{t('caseDescription')}</h3>
                <p>{description || t('noDescription')}</p>
              </div>

              {treatmentPlan && (
                <div className={`${styles.infoBlock} ${styles.treatmentPlanBlock}`}>
                  <h3>{t('fullCaseReport')}</h3>
                  <div 
                    className="rich-text-content" 
                    dangerouslySetInnerHTML={{ __html: treatmentPlan }} 
                  />
                </div>
              )}
            </div>
          </div>

          {/* Treatment Process Steps */}
          {caseData.steps && caseData.steps.length > 0 && (
            <div className={styles.processStepsSection}>
              <h3 className={styles.sectionHeading}>{t('treatmentProcessSteps')}</h3>
              <div className={styles.stepsList}>
                {caseData.steps.map((step, index) => {
                  const stepTitle = locale === 'ar' ? (step.titleAr || step.title) : step.title;
                  const stepDesc = locale === 'ar' ? (step.descriptionAr || step.description) : step.description;
                  return (
                  <div key={index} className={styles.stepCard}>
                    <h4 className={styles.stepTitle}>
                      {t('step')} {index + 1}: {stepTitle}
                    </h4>
                    {stepDesc && (
                      <p className={styles.stepDesc}>{stepDesc}</p>
                    )}
                    
                    {step.images && step.images.length > 0 && (
                      <div className={styles.stepImageGrid}>
                        {step.images.map((imgUrl, imgIdx) => (
                          <div key={imgIdx} className={styles.gallerySquare} onClick={() => openLightbox(step.images, imgIdx)}>
                            <Image 
                              src={imgUrl} 
                              alt={`${stepTitle} image ${imgIdx + 1}`} 
                              fill
                              sizes="(max-width: 768px) 50vw, 33vw"
                              className={styles.galleryImage}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )})}
              </div>
            </div>
          )}

          {/* Gallery Section */}
          {(caseData.images || caseData.galleryImages) && (caseData.images || caseData.galleryImages).length > 0 && (
            <div className={styles.gallerySection}>
              <h3 className={styles.sectionHeading}>{t('caseGallery')}</h3>
              <div className={styles.galleryGrid}>
                {(caseData.images || caseData.galleryImages).map((img, idx) => {
                  const imagesArray = caseData.images || caseData.galleryImages;
                  return (
                    <div key={idx} className={styles.gallerySquareLg} onClick={() => openLightbox(imagesArray, idx)}>
                      <Image 
                        src={img.url || img} 
                        alt={`Gallery image ${idx + 1}`} 
                        fill
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className={styles.galleryImage}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Overlay */}
      {lightboxOpen && lightboxImages.length > 0 && (
        <div className={styles.lightboxOverlay}>
          {/* Close Button */}
          <button 
            autoFocus
            onClick={() => setLightboxOpen(false)}
            className={styles.lightboxCloseBtn}
          >&times;</button>

          {/* Main Image */}
          <div className={styles.lightboxContainer}>
            {lightboxImages.length > 1 && (
              <button 
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(prev => (prev - 1 + lightboxImages.length) % lightboxImages.length); }}
                className={styles.lightboxPrevBtn}
              >&#10094;</button>
            )}
            
            <Image 
              src={lightboxImages[lightboxIndex]} 
              alt="Expanded view" 
              fill
              sizes="100vw"
              className={styles.lightboxImage}
            />

            {lightboxImages.length > 1 && (
              <button 
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(prev => (prev + 1) % lightboxImages.length); }}
                className={styles.lightboxNextBtn}
              >&#10095;</button>
            )}
          </div>
          
          {/* Image Counter */}
          {lightboxImages.length > 1 && (
            <div className={styles.lightboxCounter}>
              {lightboxIndex + 1} / {lightboxImages.length}
            </div>
          )}
        </div>
      )}
    </main>
  );
}

/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from 'react';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ImageSlider from '@/components/ImageSlider';
import Collapsible from '@/components/Collapsible';
import { useTranslations, useLocale } from 'next-intl';
import styles from './detail.module.css';

export default function CaseClient({ caseData, id, initialError }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  
  // Touch swipe state for Lightbox
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) {
      // Swiped left (Next)
      setLightboxIndex(prev => (prev + 1) % lightboxImages.length);
    }
    if (distance < -50) {
      // Swiped right (Prev)
      setLightboxIndex(prev => (prev - 1 + lightboxImages.length) % lightboxImages.length);
    }
  };
  
  const previousFocusRef = React.useRef(null);

  const t = useTranslations('CaseDetail');
  const locale = useLocale();

  // Track case view on client-side
  useEffect(() => {
    if (caseData && id) {
      const viewedKey = `viewed_case_${id}`;
      if (!sessionStorage.getItem(viewedKey)) {
        sessionStorage.setItem(viewedKey, 'true');
        const trackView = async () => {
          try {
            const docRef = doc(db, "cases", id);
            await updateDoc(docRef, { views: increment(1) });
          } catch (trackErr) {
            console.error("Failed to track case view", trackErr);
          }
        };
        trackView();
      }
    }
  }, [caseData, id]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') setLightboxIndex(prev => (prev + 1) % lightboxImages.length);
      if (e.key === 'ArrowLeft') setLightboxIndex(prev => (prev - 1 + lightboxImages.length) % lightboxImages.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, lightboxImages]);

  const closeLightbox = () => {
    setLightboxOpen(false);
    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
  };

  const openLightbox = (imagesList, startIndex) => {
    previousFocusRef.current = document.activeElement;
    const urls = imagesList.map(img => typeof img === 'string' ? img : (img.url || ''));
    setLightboxImages(urls);
    setLightboxIndex(startIndex);
    setLightboxOpen(true);
  };

  if (initialError || !caseData) {
    return (
      <div className={styles.error}>
        <p>{initialError === 'notFound' ? t('notFound') : (initialError || t('notFound'))}</p>
        <Link href="/cases" className="btn-primary" style={{marginTop: '1rem'}}>{t('backToCases')}</Link>
      </div>
    );
  }

  const title = locale === 'ar' ? (caseData.titleAr || caseData.title) : caseData.title;
  const description = locale === 'ar' ? (caseData.descriptionAr || caseData.description) : caseData.description;
  const treatmentPlan = locale === 'ar' ? (caseData.treatmentPlanAr || caseData.treatmentPlan || caseData.treatmentDetails) : (caseData.treatmentPlan || caseData.treatmentDetails);
  
  const chiefComplaint = locale === 'ar' ? (caseData.chiefComplaintAr || caseData.chiefComplaint) : caseData.chiefComplaint;
  const diagnosis = locale === 'ar' ? (caseData.diagnosisAr || caseData.diagnosis) : caseData.diagnosis;
  const treatmentPerformed = locale === 'ar' ? (caseData.treatmentPerformedAr || caseData.treatmentPerformed) : caseData.treatmentPerformed;
  const techniques = locale === 'ar' ? (caseData.techniquesAr || caseData.techniques) : caseData.techniques;
  const challenges = locale === 'ar' ? (caseData.challengesAr || caseData.challenges) : caseData.challenges;
  const result = locale === 'ar' ? (caseData.resultAr || caseData.result) : caseData.result;
  const keyTakeaways = locale === 'ar' ? (caseData.keyTakeawaysAr || caseData.keyTakeaways) : caseData.keyTakeaways;

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
              <div className={styles.contentCard}>
                <div className={styles.comparisonBox} style={{ border: 'none', boxShadow: 'none', padding: 0 }}>
                  {caseData.caseType === 'light' || (!caseData.beforeImage && !caseData.beforeImageUrl && caseData.coverImage) ? (
                    <div style={{ position: 'relative', width: '100%', paddingTop: '66.66%' }}>
                      <Image 
                        src={caseData.coverImage || '/images/placeholder.jpg'} 
                        alt={title} 
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        style={{ objectFit: 'cover', borderRadius: '12px' }}
                        priority={true}
                      />
                    </div>
                  ) : (
                    <ImageSlider 
                      beforeImage={caseData.beforeImage || caseData.beforeImageUrl} 
                      afterImage={caseData.afterImage || caseData.afterImageUrl} 
                      priority={true}
                    />
                  )}
                </div>
                <div className={styles.viewFullImagesWrapper} style={{ marginTop: '1.5rem' }}>
                  <button 
                    onClick={() => openLightbox(
                      caseData.caseType === 'light' || (!caseData.beforeImage && !caseData.beforeImageUrl && caseData.coverImage)
                        ? [caseData.coverImage].filter(Boolean)
                        : [caseData.beforeImage || caseData.beforeImageUrl, caseData.afterImage || caseData.afterImageUrl].filter(Boolean), 
                      0
                    )}
                    className={styles.viewFullImagesBtn}
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
                    </svg>
                    {t('viewFullImages') || 'View Full Images'}
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Info */}
            <div className={styles.infoBox}>
              <div className={styles.contentCard}>
                <div className={styles.infoBlock}>
                  <h3>{t('caseDescription') || 'Case Overview'}</h3>
                  <p>{description || t('noDescription')}</p>
                </div>

                {/* Clinical Summary Grid */}
                <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
                  <div className={styles.summaryGrid}>
                  {caseData.duration && (
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>{t('duration')}</span>
                      <span className={styles.summaryValue}>{caseData.duration}</span>
                    </div>
                  )}
                  {caseData.year && (
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>{t('year')}</span>
                      <span className={styles.summaryValue}>{caseData.year}</span>
                    </div>
                  )}
                  {caseData.difficulty && (
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>{t('difficulty')}</span>
                      <span className={styles.summaryValue}>{caseData.difficulty}</span>
                    </div>
                  )}
                </div>
                </div>
                
                {caseData.materials && caseData.materials.length > 0 && (
                  <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                    <span className={styles.summaryLabel} style={{ display: 'block', marginBottom: '0.75rem' }}>{t('materialsUsed')}</span>
                    <div className={styles.materialsList}>
                      {caseData.materials.map((mat) => (
                        <span key={mat} className={styles.materialTag}>{mat}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Clinical Story (Narrative) */}
          {(diagnosis || treatmentPerformed || chiefComplaint || techniques || challenges || result || keyTakeaways) && (
            <div className={styles.clinicalStory}>
              <Collapsible titleElement={<h3 className={styles.sectionHeading} style={{margin: 0}}>{t('clinicalNarrative')}</h3>}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {chiefComplaint && (
                  <div className={styles.storyBlock}>
                    <h4 style={{margin: 0}}>{t('chiefComplaint')}</h4>
                    <p style={{marginTop: '1rem'}}>{chiefComplaint}</p>
                  </div>
                )}
                
                {diagnosis && (
                  <div className={styles.storyBlock}>
                    <h4 style={{margin: 0}}>{t('diagnosis')}</h4>
                    <p style={{marginTop: '1rem'}}>{diagnosis}</p>
                  </div>
                )}
                
                {treatmentPerformed && (
                  <div className={styles.storyBlock}>
                    <h4 style={{margin: 0}}>{t('treatmentPerformed')}</h4>
                    <p style={{marginTop: '1rem'}}>{treatmentPerformed}</p>
                  </div>
                )}
                
                {techniques && (
                  <div className={styles.storyBlock}>
                    <h4 style={{margin: 0}}>{t('techniquesWorkflow')}</h4>
                    <p style={{marginTop: '1rem'}}>{techniques}</p>
                  </div>
                )}

                {challenges && (
                  <div className={styles.storyBlock}>
                    <h4 style={{margin: 0}}>{t('challenges')}</h4>
                    <p style={{marginTop: '1rem'}}>{challenges}</p>
                  </div>
                )}

                {result && (
                  <div className={styles.storyBlock}>
                    <h4 style={{margin: 0}}>{t('outcome')}</h4>
                    <p style={{marginTop: '1rem'}}>{result}</p>
                  </div>
                )}

                {keyTakeaways && (
                  <div className={styles.storyBlock}>
                    <h4 style={{margin: 0}}>{t('keyTakeaways')}</h4>
                    <p style={{marginTop: '1rem'}}>{keyTakeaways}</p>
                  </div>
                )}
              </div>
              </Collapsible>
            </div>
          )}

          {/* Legacy Treatment Plan (Fallback) */}
          {treatmentPlan && !caseData.treatmentPerformed && (
            <div className={`${styles.infoBlock} ${styles.treatmentPlanBlock}`} style={{ marginTop: '3rem' }}>
              <h3 className={styles.sectionHeading}>{t('fullCaseReport')}</h3>
              <div 
                className="rich-text-content" 
                dangerouslySetInnerHTML={{ __html: treatmentPlan }} 
              />
            </div>
          )}

          {/* Treatment Process Steps */}
          {caseData.steps && caseData.steps.length > 0 && (
            <div className={styles.processStepsSection}>
              <Collapsible titleElement={<h3 className={styles.sectionHeading} style={{margin: 0}}>{t('treatmentProcessSteps')}</h3>}>
              <div className={styles.stepsList}>
                {caseData.steps.map((step, index) => {
                  const stepTitle = locale === 'ar' ? (step.titleAr || step.title) : step.title;
                  const stepDesc = locale === 'ar' ? (step.descriptionAr || step.description) : step.description;
                  return (
                  <div key={index} className={styles.stepCard}>
                    <h4 className={styles.stepTitle} style={{margin: 0, marginBottom: '1rem'}}>
                      {t('step')} {index + 1}: {stepTitle}
                    </h4>
                    <div>
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
                  </div>
                )})}
              </div>
              </Collapsible>
            </div>
          )}

          {/* Gallery Section */}
          {(caseData.images || caseData.galleryImages) && (caseData.images || caseData.galleryImages).length > 0 && (
            <div className={styles.gallerySection}>
              <Collapsible titleElement={<h3 className={styles.sectionHeading} style={{margin: 0}}>{t('procedureGallery')}</h3>} defaultOpen={true}>
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
              </Collapsible>
            </div>
          )}

          {/* X-Rays Section */}
          {caseData.xrays && caseData.xrays.length > 0 && (
            <div className={styles.gallerySection}>
              <h3 className={styles.sectionHeading}>{t('xraysRadiographs')}</h3>
              <div className={styles.galleryGrid}>
                {caseData.xrays.map((img, idx) => {
                  return (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div className={styles.gallerySquareLg} onClick={() => openLightbox(caseData.xrays, idx)}>
                        <Image 
                          src={img.url || img} 
                          alt={img.label || `X-ray ${idx + 1}`} 
                          fill
                          sizes="(max-width: 768px) 50vw, 33vw"
                          className={styles.galleryImage}
                        />
                      </div>
                      {img.label && (
                        <span style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>
                          {img.label}
                        </span>
                      )}
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
        <div 
          className={styles.lightboxOverlay}
          onKeyDown={(e) => {
            if (e.key === 'Escape') closeLightbox();
          }}
          tabIndex={-1}
          ref={(el) => { if (el) el.focus(); }}
        >
          {/* Close Button */}
          <button 
            autoFocus
            onClick={closeLightbox}
            className={styles.lightboxCloseBtn}
            aria-label="Close Lightbox"
          >&times;</button>

          {/* Main Image */}
          <div 
            className={styles.lightboxContainer}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEndHandler}
          >
            {lightboxImages.length > 1 && (
              <button 
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(prev => (prev - 1 + lightboxImages.length) % lightboxImages.length); }}
                className={styles.lightboxPrevBtn}
                aria-label="Previous Image"
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
                aria-label="Next Image"
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

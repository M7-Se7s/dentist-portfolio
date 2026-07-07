/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState, use } from 'react';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ImageSlider from '@/components/ImageSlider';
import Collapsible from '@/components/Collapsible';
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
              <div className={styles.contentCard}>
                <div className={styles.comparisonBox} style={{ border: 'none', boxShadow: 'none', padding: 0 }}>
                  <ImageSlider 
                    beforeImage={caseData.beforeImage || caseData.beforeImageUrl} 
                    afterImage={caseData.afterImage || caseData.afterImageUrl} 
                    priority={true}
                  />
                </div>
                <div className={styles.viewFullImagesWrapper} style={{ marginTop: '1.5rem' }}>
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
                      <span className={styles.summaryLabel}>Duration</span>
                      <span className={styles.summaryValue}>{caseData.duration}</span>
                    </div>
                  )}
                  {caseData.year && (
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Year</span>
                      <span className={styles.summaryValue}>{caseData.year}</span>
                    </div>
                  )}
                  {caseData.difficulty && (
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Difficulty</span>
                      <span className={styles.summaryValue}>{caseData.difficulty}</span>
                    </div>
                  )}
                </div>
                </div>
                
                {caseData.materials && caseData.materials.length > 0 && (
                  <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                    <span className={styles.summaryLabel} style={{ display: 'block', marginBottom: '0.75rem' }}>Materials Used</span>
                    <div className={styles.materialsList}>
                      {caseData.materials.map((mat, i) => (
                        <span key={i} className={styles.materialTag}>{mat}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Clinical Story (Narrative) */}
          {(caseData.diagnosis || caseData.treatmentPerformed || caseData.chiefComplaint || caseData.techniques || caseData.challenges || caseData.result || caseData.keyTakeaways) && (
            <div className={styles.clinicalStory}>
              <Collapsible titleElement={<h3 className={styles.sectionHeading} style={{margin: 0}}>Clinical Narrative</h3>}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {caseData.chiefComplaint && (
                  <div className={styles.storyBlock}>
                    <Collapsible titleElement={<h4 style={{margin: 0}}>Chief Complaint</h4>}>
                      <p style={{marginTop: '1rem'}}>{caseData.chiefComplaint}</p>
                    </Collapsible>
                  </div>
                )}
                
                {caseData.diagnosis && (
                  <div className={styles.storyBlock}>
                    <Collapsible titleElement={<h4 style={{margin: 0}}>Diagnosis</h4>}>
                      <p style={{marginTop: '1rem'}}>{caseData.diagnosis}</p>
                    </Collapsible>
                  </div>
                )}
                
                {caseData.treatmentPerformed && (
                  <div className={styles.storyBlock}>
                    <Collapsible titleElement={<h4 style={{margin: 0}}>Treatment Performed</h4>}>
                      <p style={{marginTop: '1rem'}}>{caseData.treatmentPerformed}</p>
                    </Collapsible>
                  </div>
                )}
                
                {caseData.techniques && (
                  <div className={styles.storyBlock}>
                    <Collapsible titleElement={<h4 style={{margin: 0}}>Techniques & Workflow</h4>}>
                      <p style={{marginTop: '1rem'}}>{caseData.techniques}</p>
                    </Collapsible>
                  </div>
                )}

                {caseData.challenges && (
                  <div className={styles.storyBlock}>
                    <Collapsible titleElement={<h4 style={{margin: 0}}>Challenges</h4>}>
                      <p style={{marginTop: '1rem'}}>{caseData.challenges}</p>
                    </Collapsible>
                  </div>
                )}

                {caseData.result && (
                  <div className={styles.storyBlock}>
                    <Collapsible titleElement={<h4 style={{margin: 0}}>Outcome</h4>}>
                      <p style={{marginTop: '1rem'}}>{caseData.result}</p>
                    </Collapsible>
                  </div>
                )}

                {caseData.keyTakeaways && (
                  <div className={styles.storyBlock}>
                    <Collapsible titleElement={<h4 style={{margin: 0}}>Key Takeaways</h4>}>
                      <p style={{marginTop: '1rem'}}>{caseData.keyTakeaways}</p>
                    </Collapsible>
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
                    <Collapsible titleElement={
                      <h4 className={styles.stepTitle} style={{margin: 0}}>
                        {t('step')} {index + 1}: {stepTitle}
                      </h4>
                    }>
                      <div style={{ paddingTop: '1rem' }}>
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
                    </Collapsible>
                  </div>
                )})}
              </div>
              </Collapsible>
            </div>
          )}

          {/* Gallery Section */}
          {(caseData.images || caseData.galleryImages) && (caseData.images || caseData.galleryImages).length > 0 && (
            <div className={styles.gallerySection}>
              <Collapsible titleElement={<h3 className={styles.sectionHeading} style={{margin: 0}}>Procedure Gallery</h3>}>
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
              <h3 className={styles.sectionHeading}>X-Rays & Radiographs</h3>
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
            if (e.key === 'Escape') setLightboxOpen(false);
          }}
          tabIndex={-1}
          ref={(el) => { if (el) el.focus(); }}
        >
          {/* Close Button */}
          <button 
            autoFocus
            onClick={() => setLightboxOpen(false)}
            className={styles.lightboxCloseBtn}
            aria-label="Close Lightbox"
          >&times;</button>

          {/* Main Image */}
          <div className={styles.lightboxContainer}>
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

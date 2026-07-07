"use client";

import { useEffect, useState, use } from 'react';
import { Link } from '@/i18n/routing';
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
        <div className="container" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '40px' }}>
          <Link href="/cases" className={styles.backLink} aria-label="Back to Gallery" style={{ position: 'absolute', left: locale === 'ar' ? 'auto' : '15px', right: locale === 'ar' ? '15px' : 'auto', top: '50%', transform: 'translateY(-50%)', margin: 0, padding: '10px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{transform: locale === 'ar' ? 'rotate(180deg)' : 'none'}}>
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </Link>
          <h1 className={styles.title} style={{ margin: 0, padding: '0 50px', textAlign: 'center', fontSize: '1.8rem' }}>{title}</h1>
        </div>
      </div>

      <section className={styles.contentSection}>
        <div className="container">
          <div className={styles.splitView}>
            
            {/* Left: Images */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 0 }}>
              <div className={styles.comparisonBox}>
                <ImageSlider 
                  beforeImage={caseData.beforeImage || caseData.beforeImageUrl} 
                  afterImage={caseData.afterImage || caseData.afterImageUrl} 
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button 
                  onClick={() => openLightbox(
                    [caseData.beforeImage || caseData.beforeImageUrl, caseData.afterImage || caseData.afterImageUrl].filter(Boolean), 
                    0
                  )}
                  style={{
                    background: 'none',
                    border: '1px solid var(--primary-color)',
                    color: 'var(--primary-color)',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'var(--primary-color)';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'none';
                    e.currentTarget.style.color = 'var(--primary-color)';
                  }}
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
                <div className={styles.infoBlock} style={{marginTop: '2rem'}}>
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
            <div style={{marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid var(--border-color)'}}>
              <h3 style={{fontSize: '1.5rem', marginBottom: '2rem', color: 'var(--text-dark)'}}>{t('treatmentProcessSteps')}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {caseData.steps.map((step, index) => {
                  const stepTitle = locale === 'ar' ? (step.titleAr || step.title) : step.title;
                  const stepDesc = locale === 'ar' ? (step.descriptionAr || step.description) : step.description;
                  return (
                  <div key={index} className={styles.stepCard}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary-color)', fontSize: '1.2rem' }}>
                      {t('step')} {index + 1}: {stepTitle}
                    </h4>
                    {stepDesc && (
                      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{stepDesc}</p>
                    )}
                    
                    {step.images && step.images.length > 0 && (
                      <div style={{
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
                        gap: '1rem'
                      }}>
                        {step.images.map((imgUrl, imgIdx) => (
                          <div key={imgIdx} style={{
                            aspectRatio: '1', 
                            borderRadius: '8px', 
                            overflow: 'hidden',
                            border: '1px solid var(--border-color)',
                            cursor: 'pointer'
                          }} onClick={() => openLightbox(step.images, imgIdx)}>
                            <img 
                              src={imgUrl} 
                              alt={`${stepTitle} image ${imgIdx + 1}`} 
                              style={{width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease'}}
                              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
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
            <div style={{marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid var(--border-color)'}}>
              <h3 style={{fontSize: '1.5rem', marginBottom: '2rem', color: 'var(--text-dark)'}}>{t('caseGallery')}</h3>
              <div style={{
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                gap: '1.5rem'
              }}>
                {(caseData.images || caseData.galleryImages).map((img, idx) => {
                  const imagesArray = caseData.images || caseData.galleryImages;
                  return (
                    <div key={idx} style={{
                      position: 'relative', 
                      aspectRatio: '1', 
                      borderRadius: '12px', 
                      overflow: 'hidden',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                      border: '1px solid var(--border-color)',
                      cursor: 'pointer'
                    }} onClick={() => openLightbox(imagesArray, idx)}>
                      <img 
                        src={img.url || img} 
                        alt={`Gallery image ${idx + 1}`} 
                        style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s ease'}}
                        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
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
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
          backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 9999,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
          {/* Close Button */}
          <button 
            onClick={() => setLightboxOpen(false)}
            style={{ position: 'absolute', top: '20px', right: '30px', background: 'none', border: 'none', color: 'white', fontSize: '2rem', cursor: 'pointer', zIndex: 10000 }}
          >&times;</button>

          {/* Main Image */}
          <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {lightboxImages.length > 1 && (
              <button 
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(prev => (prev - 1 + lightboxImages.length) % lightboxImages.length); }}
                style={{ position: 'absolute', left: '-50px', background: 'none', border: 'none', color: 'white', fontSize: '3rem', cursor: 'pointer', padding: '1rem' }}
              >&#10094;</button>
            )}
            
            <img 
              src={lightboxImages[lightboxIndex]} 
              alt="Expanded view" 
              style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '4px' }} 
            />

            {lightboxImages.length > 1 && (
              <button 
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(prev => (prev + 1) % lightboxImages.length); }}
                style={{ position: 'absolute', right: '-50px', background: 'none', border: 'none', color: 'white', fontSize: '3rem', cursor: 'pointer', padding: '1rem' }}
              >&#10095;</button>
            )}
          </div>
          
          {/* Image Counter */}
          {lightboxImages.length > 1 && (
            <div style={{ color: 'white', marginTop: '1rem', fontSize: '1rem' }}>
              {lightboxIndex + 1} / {lightboxImages.length}
            </div>
          )}
        </div>
      )}
    </main>
  );
}

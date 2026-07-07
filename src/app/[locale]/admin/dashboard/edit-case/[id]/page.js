/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { casesService } from '@/lib/services/casesService';
import styles from '../../../admin.module.css';
import { useUploads } from '@/lib/contexts/UploadContext';

import BasicInfoSection from '../../cases/components/BasicInfoSection';
import TreatmentDetailsSection from '../../cases/components/TreatmentDetailsSection';
import ImageUploadSection from '../../cases/components/ImageUploadSection';

export default function EditCasePage({ params }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const caseId = unwrappedParams.id;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [beforeImage, setBeforeImage] = useState(null);
  const [beforePreview, setBeforePreview] = useState(null);
  const [afterImage, setAfterImage] = useState(null);
  const [afterPreview, setAfterPreview] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    categories: [],
    patientAge: '',
    patientGender: '',
    description: '',
    treatmentPlan: '',
    procedureNotes: '',
    featured: false,
    isDraft: false,
    images: [],
    steps: []
  });

  // Load Case Data
  useEffect(() => {
    let isMounted = true;
    
    const loadCase = async () => {
      try {
        const caseData = await casesService.getCaseById(caseId);
        if (caseData && isMounted) {
          // Normalize existing arrays and fields for the form
          setFormData({ 
            ...caseData,
            categories: caseData.categories || [],
            images: (caseData.images || []).map(img => ({ ...img, id: img.id || Math.random().toString(36).substr(2, 9) })),
            steps: (caseData.steps || []).map(step => ({ 
              ...step, 
              id: step.id || Math.random().toString(36).substr(2, 9), 
              files: [], 
              previews: [],
              existingImages: step.images || []
            }))
          });
        } else if (isMounted) {
          // Fallback if not found
          setFormData(prev => ({ ...prev, title: `New Case ${caseId}`, isDraft: true }));
        }
      } catch (error) {
        console.error("Failed to fetch case", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    
    loadCase();
    
    return () => {
      isMounted = false;
    };
  }, [caseId]);

  const { startCaseUpload } = useUploads();

  const handleSave = async (e, asDraft = false) => {
    e?.preventDefault();
    setIsSaving(true);
    const payload = {
      mode: 'edit',
      caseId,
      formData: {
        ...formData,
        isDraft: asDraft
      },
      beforeImageFile: beforeImage,
      afterImageFile: afterImage,
      treatmentSteps: formData.steps,
      galleryItems: formData.images
    };

    startCaseUpload(payload);
    setSaveSuccess(true);
    setTimeout(() => {
      router.push('/admin/dashboard/cases');
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh'}}>
        <div className={styles.spinner} style={{width: '40px', height: '40px', border: '3px solid rgba(var(--primary-rgb), 0.2)', borderTopColor: 'var(--primary-color)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '1rem'}}></div>
        <p style={{color: 'var(--text-muted)'}}>Loading clinical case data...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Adapter setters
  const setTitle = (val) => setFormData(p => ({ ...p, title: val }));
  const setCategories = (val) => setFormData(p => ({ ...p, categories: val }));
  const setDescription = (val) => setFormData(p => ({ ...p, description: val }));
  const setFeatured = (val) => setFormData(p => ({ ...p, featured: val }));
  const setPatientAge = (val) => setFormData(p => ({ ...p, patientAge: val }));
  const setPatientGender = (val) => setFormData(p => ({ ...p, patientGender: val }));
  
  const setTreatmentDetails = (val) => setFormData(p => ({ ...p, treatmentPlan: val }));
  const setTreatmentSteps = (updaterOrValue) => {
    setFormData(p => ({
      ...p,
      steps: typeof updaterOrValue === 'function' ? updaterOrValue(p.steps) : updaterOrValue
    }));
  };
  
  const setGalleryItems = (updaterOrValue) => {
    setFormData(p => ({
      ...p,
      images: typeof updaterOrValue === 'function' ? updaterOrValue(p.images) : updaterOrValue
    }));
  };

  return (
    <div className="animate-slideUp">
      {/* Header Area */}
      <div className={styles.editCaseHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <Link href="/admin/dashboard/cases" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center' }}>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{marginRight: '0.5rem'}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Cases
        </Link>
        <div className={styles.headerActions} style={{ display: 'flex', gap: '1rem' }}>
          <button 
            className="btn-secondary"
            onClick={(e) => handleSave(e, true)}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save as Draft'}
          </button>
          <button 
            className="btn-primary"
            onClick={(e) => handleSave(e, false)}
            disabled={isSaving}
          >
            {isSaving ? 'Publishing...' : 'Publish Case'}
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className={styles.successBanner} style={{ background: '#ECFDF5', color: '#065F46', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', display: 'flex', alignItems: 'center', fontWeight: '500', border: '1px solid #A7F3D0' }}>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{marginRight: '0.5rem'}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          Case successfully updated! Saving in background...
        </div>
      )}

      {/* Main Form Layout */}
      <form onSubmit={(e) => handleSave(e, false)}>
        <BasicInfoSection 
          title={formData.title} setTitle={setTitle}
          categories={formData.categories} setCategories={setCategories}
          description={formData.description} setDescription={setDescription}
          featured={formData.featured} setFeatured={setFeatured}
          patientAge={formData.patientAge} setPatientAge={setPatientAge}
          patientGender={formData.patientGender} setPatientGender={setPatientGender}
          styles={styles}
        />

        {/* Procedure Notes specific to Edit Page */}
        <div className={styles.formSection}>
          <div className={styles.formSectionTitle}>Internal Procedure Notes</div>
          <div className={styles.formGroup}>
            <label>Procedure Notes (Not visible to patients)</label>
            <textarea 
              value={formData.procedureNotes || ''} 
              onChange={(e) => setFormData(p => ({ ...p, procedureNotes: e.target.value }))}
              placeholder="Detail the materials used, internal technique, billing notes, etc."
              style={{ width: '100%', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', fontFamily: 'var(--font-primary)', resize: 'vertical', minHeight: '120px' }}
            />
          </div>
        </div>

        <TreatmentDetailsSection 
          treatmentDetails={formData.treatmentPlan} setTreatmentDetails={setTreatmentDetails}
          treatmentSteps={formData.steps} setTreatmentSteps={setTreatmentSteps}
          styles={styles}
        />

        <ImageUploadSection 
          beforePreview={beforePreview || formData.beforeImageUrl || formData.beforeImage} 
          setBeforePreview={setBeforePreview} 
          setBeforeImage={setBeforeImage}
          afterPreview={afterPreview || formData.afterImageUrl || formData.afterImage} 
          setAfterPreview={setAfterPreview} 
          setAfterImage={setAfterImage}
          galleryItems={formData.images} 
          setGalleryItems={setGalleryItems}
          styles={styles}
        />
      </form>
    </div>
  );
}

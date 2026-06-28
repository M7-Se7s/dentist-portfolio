"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../../../admin.module.css';

import { casesService } from '../../../../../lib/services/casesService';

const AVAILABLE_CATEGORIES = [
  'General', 'Esthetic', 'Composite', 'Prosthodontics', 'Endodontics', 'Surgery', 'Orthodontics', 'Periodontics', 'Pediatric'
];

export default function EditCasePage({ params }) {
  const router = useRouter();
  // Using React 19 / Next 15 `use` to unwrap params
  const unwrappedParams = use(params);
  const caseId = unwrappedParams.id;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    categories: [],
    patientAge: '',
    patientGender: '',
    description: '',
    treatmentPlan: '',
    procedureNotes: '',
    isDraft: false,
    images: []
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
            images: caseData.images || []
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleCategory = (category) => {
    setFormData(prev => {
      const cats = prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category];
      return { ...prev, categories: cats };
    });
  };

  const handleSave = async (asDraft = false) => {
    setIsSaving(true);
    
    try {
      const updatedData = { ...formData, isDraft: asDraft };
      await casesService.updateCase(caseId, updatedData);
      setFormData(updatedData);
      
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        router.push('/admin/dashboard/cases');
      }, 1500);
    } catch (error) {
      console.error("Failed to save case", error);
      alert("Failed to save case. Check console for errors.");
    } finally {
      setIsSaving(false);
    }
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

  return (
    <div className="animate-slideUp">
      {/* Header Area */}
      <div className={styles.editCaseHeader}>
        <Link href="/admin/dashboard/cases" className={styles.backBtn}>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{marginRight: '0.5rem'}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Cases
        </Link>
        <div className={styles.headerActions}>
          <button 
            className={`btn-secondary ${styles.draftBtn}`} 
            onClick={() => handleSave(true)}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save as Draft'}
          </button>
          <button 
            className={`btn-primary ${styles.saveBtn}`} 
            onClick={() => handleSave(false)}
            disabled={isSaving}
          >
            {isSaving ? 'Publishing...' : 'Publish Case'}
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className={styles.successBanner}>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{marginRight: '0.5rem'}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          Case successfully updated! Redirecting...
        </div>
      )}

      {/* Main Form Layout */}
      <div className={styles.editCaseLayout}>
        {/* Left Column: Basic Info & Details */}
        <div className={styles.editCaseMainCol}>
          <div className={styles.formCard}>
            <h2 className={styles.formCardTitle}>Basic Information</h2>
            
            <div className={styles.formGroup}>
              <label>Case Title</label>
              <input 
                type="text" 
                name="title" 
                value={formData.title} 
                onChange={handleInputChange}
                className={styles.formInput}
                placeholder="e.g., Anterior Composite Restoration"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Categories (Select Multiple)</label>
              <div className={styles.categoryChipsGrid}>
                {AVAILABLE_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`${styles.categoryChip} ${formData.categories.includes(cat) ? styles.categoryChipActive : ''}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Patient Age</label>
                <input 
                  type="number" 
                  name="patientAge" 
                  value={formData.patientAge} 
                  onChange={handleInputChange}
                  className={styles.formInput}
                  placeholder="e.g., 34"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Patient Gender</label>
                <select 
                  name="patientGender" 
                  value={formData.patientGender} 
                  onChange={handleInputChange}
                  className={styles.styledNativeSelect}
                >
                  <option value="">Select...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className={styles.formCard}>
            <h2 className={styles.formCardTitle}>Clinical Details</h2>
            
            <div className={styles.formGroup}>
              <label>Description</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange}
                className={styles.formTextarea}
                rows="4"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Treatment Plan</label>
              <textarea 
                name="treatmentPlan" 
                value={formData.treatmentPlan} 
                onChange={handleInputChange}
                className={styles.formTextarea}
                rows="5"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Procedure Notes</label>
              <textarea 
                name="procedureNotes" 
                value={formData.procedureNotes} 
                onChange={handleInputChange}
                className={styles.formTextarea}
                rows="8"
                placeholder="Detail the materials used, technique, etc."
              />
            </div>
          </div>
        </div>

        {/* Right Column: Media Gallery */}
        <div className={styles.editCaseSideCol}>
          <div className={styles.formCard}>
            <h2 className={styles.formCardTitle}>Media Gallery</h2>
            <p className={styles.formCardSub}>Upload Before and After photos for this case.</p>
            
            <div className={styles.formGroup}>
              <label>Before Image</label>
              <div className={styles.uploadArea}>
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{marginBottom: '0.5rem', color: 'var(--primary-color)'}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                <p style={{fontWeight: 500, fontSize: '0.9rem', marginBottom: '0.25rem'}}>Drag Before Image</p>
                <button className={styles.uploadBtn} style={{padding: '0.25rem 0.75rem', fontSize: '0.8rem'}}>Browse</button>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>After Image</label>
              <div className={styles.uploadArea}>
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{marginBottom: '0.5rem', color: 'var(--primary-color)'}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                <p style={{fontWeight: 500, fontSize: '0.9rem', marginBottom: '0.25rem'}}>Drag After Image</p>
                <button className={styles.uploadBtn} style={{padding: '0.25rem 0.75rem', fontSize: '0.8rem'}}>Browse</button>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Additional Media Gallery</label>
              <p className={styles.formCardSub} style={{marginTop: '-0.5rem', marginBottom: '1rem'}}>Upload any other procedure photos, x-rays, or documentation.</p>
              <div className={styles.uploadArea}>
                <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{marginBottom: '0.5rem', color: 'var(--primary-color)'}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                <p style={{fontWeight: 500, marginBottom: '0.25rem'}}>Drag additional images here</p>
                <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem'}}>PNG, JPG up to 10MB</p>
                <button className={styles.uploadBtn}>Browse Files</button>
              </div>
            </div>

            {formData.images.length > 0 && (
              <div className={styles.imageGrid}>
                {formData.images.map(img => (
                  <div key={img.id} className={styles.imageCard}>
                    <img src={img.url} alt={img.label} className={styles.mockImage} />
                    <div className={styles.imageMeta}>
                      <span className={styles.imageLabel}>{img.label}</span>
                      <button className={styles.imageDeleteBtn}>
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

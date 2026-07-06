"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { casesService } from '@/lib/services/casesService';
import imageCompression from 'browser-image-compression';
import styles from '../../../admin.module.css';
import { useUploads } from '@/lib/contexts/UploadContext';

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
            images: caseData.images || [],
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

  const handleBeforeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBeforeImage(file);
      setBeforePreview(URL.createObjectURL(file));
    }
  };

  const handleAfterChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAfterImage(file);
      setAfterPreview(URL.createObjectURL(file));
    }
  };

  // Step Handlers
  const handleAddStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, { id: Math.random().toString(36).substr(2, 9), title: '', description: '', files: [], previews: [], existingImages: [] }]
    }));
  };

  const handleRemoveStep = (id) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.filter(step => step.id !== id)
    }));
  };

  const handleStepChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map(step => step.id === id ? { ...step, [field]: value } : step)
    }));
  };

  const handleStepImageChange = (id, e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;
    
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map(step => {
        if (step.id === id) {
          const newPreviews = files.map(file => URL.createObjectURL(file));
          return {
            ...step,
            files: [...(step.files || []), ...files],
            previews: [...(step.previews || []), ...newPreviews]
          };
        }
        return step;
      })
    }));
  };

  const handleRemoveStepNewImage = (stepId, indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map(step => {
        if (step.id === stepId) {
          return {
            ...step,
            files: step.files.filter((_, i) => i !== indexToRemove),
            previews: step.previews.filter((_, i) => i !== indexToRemove)
          };
        }
        return step;
      })
    }));
  };
  
  const handleRemoveStepExistingImage = (stepId, indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map(step => {
        if (step.id === stepId) {
          return {
            ...step,
            existingImages: step.existingImages.filter((_, i) => i !== indexToRemove)
          };
        }
        return step;
      })
    }));
  };

  const { startCaseUpload } = useUploads();

  const handleSave = async (asDraft = false) => {
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
    router.push('/admin/dashboard/cases');
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
            
            <div className={styles.formGroup} style={{marginTop: '1.5rem'}}>
              <label>Featured Case</label>
              <div className={styles.toggleWrapper}>
                <label className={styles.toggleSwitch}>
                  <input 
                    type="checkbox" 
                    checked={formData.featured || false} 
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))} 
                  />
                  <span className={styles.toggleSlider}></span>
                </label>
                <span style={{color: 'var(--text-muted)'}}>Show this case on the homepage</span>
              </div>
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

          <div className={styles.formCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 className={styles.formCardTitle} style={{ margin: 0 }}>Treatment Process Steps</h2>
              <button type="button" onClick={handleAddStep} className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                + Add Step
              </button>
            </div>
            
            {formData.steps.map((step, index) => (
              <div key={step.id} className={styles.stepContainer}>
                <div className={styles.stepHeader}>
                  <div className={styles.stepTitle}>Step {index + 1}</div>
                  <button type="button" className={styles.removeStepBtn} onClick={() => handleRemoveStep(step.id)}>
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    Remove
                  </button>
                </div>
                
                <div className={styles.formGroup}>
                  <label>Step Title *</label>
                  <input 
                    type="text" 
                    value={step.title} 
                    onChange={(e) => handleStepChange(step.id, 'title', e.target.value)} 
                    className={styles.formInput}
                    placeholder="e.g. Tooth Preparation"
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Description</label>
                  <textarea 
                    rows="3" 
                    value={step.description} 
                    onChange={(e) => handleStepChange(step.id, 'description', e.target.value)} 
                    className={styles.formTextarea}
                    placeholder="Describe what was done in this step..."
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Step Images</label>
                  <div className={styles.imageDropzone} style={{ padding: '1rem', minHeight: '80px', marginBottom: '1rem' }}>
                    <input type="file" accept="image/*" multiple onChange={(e) => handleStepImageChange(step.id, e)} style={{position:'absolute', top:0, left:0, width:'100%', height:'100%', opacity:0, cursor:'pointer', zIndex:2}} />
                    <div style={{color: 'var(--primary-color)', fontWeight: '600'}}>
                      + Add Step Images
                    </div>
                  </div>
                  
                  {(step.existingImages?.length > 0 || step.previews?.length > 0) && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '1rem' }}>
                      {/* Existing Images */}
                      {step.existingImages?.map((url, idx) => (
                        <div key={`existing-${idx}`} style={{ position: 'relative', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                          <img src={url} alt="Step image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button 
                            type="button" 
                            onClick={() => handleRemoveStepExistingImage(step.id, idx)}
                            style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(255,0,0,0.8)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}
                          >
                            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                          </button>
                        </div>
                      ))}
                      
                      {/* New Previews */}
                      {step.previews?.map((preview, idx) => (
                        <div key={`new-${idx}`} style={{ position: 'relative', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--primary-light)' }}>
                          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, border: '2px solid var(--primary-color)', borderRadius: '8px', pointerEvents: 'none', zIndex: 1 }} />
                          <img src={preview} alt="New step preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button 
                            type="button" 
                            onClick={() => handleRemoveStepNewImage(step.id, idx)}
                            style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(255,0,0,0.8)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}
                          >
                            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {formData.steps.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem', border: '1px dashed var(--border-color)', borderRadius: '8px', color: 'var(--text-muted)' }}>
                No process steps added. Click "+ Add Step" to document the treatment sequence.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Media Gallery */}
        <div className={styles.editCaseSideCol}>
          <div className={styles.formCard}>
            <h2 className={styles.formCardTitle}>Media Gallery</h2>
            <p className={styles.formCardSub}>Upload Before and After photos for this case.</p>
            
            <div className={styles.formGroup}>
              <label>Before Image</label>
              <div className={styles.imageDropzone} style={{ padding: '1rem', minHeight: '150px', position: 'relative' }}>
                <input type="file" accept="image/*" onChange={handleBeforeChange} style={{position:'absolute', top:0, left:0, width:'100%', height:'100%', opacity:0, cursor:'pointer', zIndex:2}} />
                {beforePreview || formData.beforeImage ? (
                  <img src={beforePreview || formData.beforeImage} alt="Before preview" style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', position: 'relative', zIndex: 1}} />
                ) : (
                  <div style={{color: 'var(--primary-color)', textAlign: 'center'}}>
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{marginBottom: '0.5rem'}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                    <p style={{fontWeight: 500, fontSize: '0.9rem', marginBottom: '0.25rem'}}>Drag Before Image</p>
                    <button type="button" className={styles.uploadBtn} style={{padding: '0.25rem 0.75rem', fontSize: '0.8rem', pointerEvents: 'none'}}>Browse</button>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>After Image</label>
              <div className={styles.imageDropzone} style={{ padding: '1rem', minHeight: '150px', position: 'relative' }}>
                <input type="file" accept="image/*" onChange={handleAfterChange} style={{position:'absolute', top:0, left:0, width:'100%', height:'100%', opacity:0, cursor:'pointer', zIndex:2}} />
                {afterPreview || formData.afterImage ? (
                  <img src={afterPreview || formData.afterImage} alt="After preview" style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', position: 'relative', zIndex: 1}} />
                ) : (
                  <div style={{color: 'var(--primary-color)', textAlign: 'center'}}>
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{marginBottom: '0.5rem'}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                    <p style={{fontWeight: 500, fontSize: '0.9rem', marginBottom: '0.25rem'}}>Drag After Image</p>
                    <button type="button" className={styles.uploadBtn} style={{padding: '0.25rem 0.75rem', fontSize: '0.8rem', pointerEvents: 'none'}}>Browse</button>
                  </div>
                )}
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
                {formData.images.map((img, index) => (
                  <div key={img.url || index} className={styles.imageCard}>
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

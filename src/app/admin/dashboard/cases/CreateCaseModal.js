"use client";

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from '../../admin.module.css';
import SortableGallery from '../../../../components/SortableGallery';
import { casesService } from '../../../../lib/services/casesService';
import imageCompression from 'browser-image-compression';

export default function CreateCaseModal({ onClose, onSuccess }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const categoryDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Basic Info
  const [title, setTitle] = useState('');
  const [categories, setCategories] = useState([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [description, setDescription] = useState('');
  
  // Treatment Details (Rich Text)
  const [treatmentDetails, setTreatmentDetails] = useState('');
  
  // Treatment Process Steps
  const [treatmentSteps, setTreatmentSteps] = useState([]);
  
  // Featured Toggle
  const [featured, setFeatured] = useState(false);

  // Images
  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);
  const [beforePreview, setBeforePreview] = useState(null);
  const [afterPreview, setAfterPreview] = useState(null);
  
  // Gallery Images State
  const [galleryItems, setGalleryItems] = useState([]);

  const [uploading, setUploading] = useState(false);

  // Step Handlers
  const handleAddStep = () => {
    setTreatmentSteps(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), title: '', description: '', files: [], previews: [] }]);
  };

  const handleRemoveStep = (id) => {
    setTreatmentSteps(prev => prev.filter(step => step.id !== id));
  };

  const handleStepChange = (id, field, value) => {
    setTreatmentSteps(prev => prev.map(step => step.id === id ? { ...step, [field]: value } : step));
  };

  const handleStepImageChange = (id, e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;
    
    setTreatmentSteps(prev => prev.map(step => {
      if (step.id === id) {
        const newPreviews = files.map(file => URL.createObjectURL(file));
        return {
          ...step,
          files: [...step.files, ...files],
          previews: [...step.previews, ...newPreviews]
        };
      }
      return step;
    }));
  };

  const handleRemoveStepImage = (stepId, indexToRemove) => {
    setTreatmentSteps(prev => prev.map(step => {
      if (step.id === stepId) {
        return {
          ...step,
          files: step.files.filter((_, i) => i !== indexToRemove),
          previews: step.previews.filter((_, i) => i !== indexToRemove)
        };
      }
      return step;
    }));
  };

  // File Handlers
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

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;
    
    const newItems = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9), // temp id for sortable
      file,
      url: URL.createObjectURL(file)
    }));
    
    setGalleryItems(prev => [...prev, ...newItems]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || categories.length === 0) {
      alert("Please fill all required fields (Title, Categories)");
      return;
    }

    setUploading(true);

    const uploadImage = async (file) => {
      if (!file) return null;
      
      let fileToUpload = file;
      try {
        const options = {
          maxSizeMB: 8,
          maxWidthOrHeight: 2048,
          useWebWorker: true,
        };
        fileToUpload = await imageCompression(file, options);
      } catch (error) {
        console.warn('Compression failed, using original', error);
      }

      const formData = new FormData();
      formData.append('file', fileToUpload);
      
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Upload API returned an error:', res.status, errorText);
        throw new Error(`Upload failed (${res.status}): ${errorText}`);
      }
      const data = await res.json();
      return data.url;
    };

    try {
      // Upload images to Cloudinary
      const beforeImageUrl = beforeImage ? await uploadImage(beforeImage) : '';
      const afterImageUrl = afterImage ? await uploadImage(afterImage) : '';
      
      const uploadedGalleryItems = [];
      for (const item of galleryItems) {
        if (item.file) {
          const url = await uploadImage(item.file);
          if (url) {
            uploadedGalleryItems.push({ url, label: item.label || '' });
          }
        } else if (item.url) {
          uploadedGalleryItems.push({ url: item.url, label: item.label || '' });
        }
      }

      // Upload step images
      const uploadedSteps = [];
      for (const step of treatmentSteps) {
        const stepImages = [];
        for (const file of step.files) {
          const url = await uploadImage(file);
          if (url) stepImages.push(url);
        }
        uploadedSteps.push({
          title: step.title,
          description: step.description,
          images: stepImages
        });
      }

      const newCaseData = {
        title,
        categories,
        description,
        isDraft: true, // New cases start as draft until fully filled in
        featured,
        treatmentPlan: treatmentDetails,
        steps: uploadedSteps,
        beforeImage: beforeImageUrl,
        afterImage: afterImageUrl,
        images: uploadedGalleryItems
      };
      
      await casesService.createCase(newCaseData);
      
      if (onSuccess) onSuccess();
      onClose(); // Close modal on success
    } catch (error) {
      console.error("Failed to create case", error);
      alert("Failed to create case");
    } finally {
      setUploading(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div className={styles.modalOverlay} onClick={onClose} style={{ zIndex: 2000 }}>
      <div className={styles.modalContentLarge} onClick={e => e.stopPropagation()} style={{ padding: '2rem' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 className={styles.modalTitle} style={{ marginBottom: '0.25rem' }}>Create New Case</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Upload clinical photos and document treatment details.</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          
          {/* Section 1: Basic Info */}
          <div className={styles.formSection}>
            <div className={styles.formSectionTitle}>Basic Information</div>
            <div className={styles.formGroup}>
              <label>Case Title *</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="e.g. Anterior Composite Restoration"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Categories *</label>
              <div ref={categoryDropdownRef} style={{ position: 'relative', width: '100%' }}>
                <div 
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  style={{
                    width: '100%',
                    minHeight: '48px',
                    padding: '0.5rem 1rem',
                    border: isCategoryOpen ? '1px solid var(--primary-color)' : '1px solid var(--border-color)',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-color)',
                    fontFamily: 'var(--font-primary)',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: isCategoryOpen ? '0 0 0 3px rgba(14, 116, 144, 0.1)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', flex: 1 }}>
                    {categories.length === 0 ? (
                      <span style={{ color: 'var(--text-muted)', fontSize: '1rem', padding: '0.35rem 0' }}>Select categories...</span>
                    ) : (
                      categories.map(cat => (
                        <span key={cat} style={{
                          backgroundColor: 'var(--primary-color)',
                          color: 'var(--white)',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '16px',
                          fontSize: '0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          {cat}
                          <svg 
                            onClick={(e) => {
                              e.stopPropagation();
                              setCategories(categories.filter(c => c !== cat));
                            }}
                            width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" 
                            style={{ cursor: 'pointer' }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </span>
                      ))
                    )}
                  </div>
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ transform: isCategoryOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', color: 'var(--text-muted)', flexShrink: 0, marginLeft: '0.5rem' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
                
                {isCategoryOpen && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: 0,
                    right: 0,
                    backgroundColor: 'var(--white)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                    zIndex: 3000,
                    overflow: 'hidden',
                    animation: 'modalFadeIn 0.2s ease-out'
                  }}>
                    {['Composite', 'Endodontics', 'Prosthodontics', 'Esthetic', 'Posterior Restorations'].map((cat, index) => {
                      const isSelected = categories.includes(cat);
                      return (
                        <div 
                          key={cat}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isSelected) {
                              setCategories(categories.filter(c => c !== cat));
                            } else {
                              setCategories([...categories, cat]);
                            }
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(14, 116, 144, 0.05)';
                            e.currentTarget.style.color = 'var(--primary-color)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = isSelected ? 'rgba(14, 116, 144, 0.1)' : 'transparent';
                            e.currentTarget.style.color = isSelected ? 'var(--primary-color)' : 'var(--text-dark)';
                          }}
                          style={{
                            padding: '12px 16px',
                            cursor: 'pointer',
                            backgroundColor: isSelected ? 'rgba(14, 116, 144, 0.1)' : 'transparent',
                            color: isSelected ? 'var(--primary-color)' : 'var(--text-dark)',
                            fontWeight: isSelected ? '600' : '400',
                            borderBottom: index < 4 ? '1px solid #f1f5f9' : 'none',
                            transition: 'all 0.15s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                        >
                          {cat}
                          {isSelected ? (
                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                            </svg>
                          ) : (
                            <div style={{ width: '18px', height: '18px', borderRadius: '4px', border: '1px solid #cbd5e1' }}></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>Short Description (Displays on cards)</label>
              <textarea 
                rows="2" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief overview of the case..."
              ></textarea>
            </div>
            
            <div className={styles.formGroup} style={{marginTop: '1.5rem'}}>
              <label>Featured Case</label>
              <div className={styles.toggleWrapper}>
                <label className={styles.toggleSwitch}>
                  <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
                  <span className={styles.toggleSlider}></span>
                </label>
                <span style={{color: 'var(--text-muted)'}}>Show this case on the homepage</span>
              </div>
            </div>
          </div>

          {/* Section 2: Treatment Details */}
          <div className={styles.formSection}>
            <div className={styles.formSectionTitle}>Treatment Details</div>
            <div className={styles.formGroup}>
              <label>Full Case Report (Optional)</label>
              <div className={styles.quillWrapper} style={{ border: 'none', background: 'transparent' }}>
                <textarea 
                  rows="5"
                  value={treatmentDetails} 
                  onChange={(e) => setTreatmentDetails(e.target.value)} 
                  placeholder="Write the full clinical details, materials used, steps taken..."
                  style={{ 
                    width: '100%', 
                    padding: '1rem', 
                    border: '1px solid var(--border-color)', 
                    borderRadius: '8px', 
                    fontSize: '1rem', 
                    fontFamily: 'var(--font-primary)', 
                    resize: 'vertical',
                    minHeight: '120px'
                  }}
                />
              </div>
            </div>
            
            <div style={{ marginTop: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <label style={{ margin: 0 }}>Treatment Process Steps</label>
                <button type="button" onClick={handleAddStep} className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                  + Add Step
                </button>
              </div>
              
              {treatmentSteps.map((step, index) => (
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
                      placeholder="Describe what was done in this step..."
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label>Step Images</label>
                    <div className={styles.imageDropzone} style={{ padding: '1rem', minHeight: '100px' }}>
                      <input type="file" accept="image/*" multiple onChange={(e) => handleStepImageChange(step.id, e)} style={{position:'absolute', top:0, left:0, width:'100%', height:'100%', opacity:0, cursor:'pointer', zIndex:2}} />
                      <div style={{color: 'var(--primary-color)', fontWeight: '600'}}>
                        + Add Step Images
                      </div>
                    </div>
                    
                    {step.previews.length > 0 && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                        {step.previews.map((preview, idx) => (
                          <div key={idx} style={{ position: 'relative', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                            <img src={preview} alt="Step preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <button 
                              type="button" 
                              onClick={() => handleRemoveStepImage(step.id, idx)}
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
              
              {treatmentSteps.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem', border: '1px dashed var(--border-color)', borderRadius: '8px', color: 'var(--text-muted)' }}>
                  No process steps added. Click "+ Add Step" to document the treatment sequence.
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Before / After Images */}
          <div className={styles.formSection}>
            <div className={styles.formSectionTitle}>Before / After Comparison *</div>
            <p style={{color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem'}}>These images are used for the interactive slider.</p>
            <div className={styles.splitImages}>
              
              <div className={styles.formGroup}>
                <label>Before Image *</label>
                <div className={styles.imageDropzone} style={{ padding: '1rem', minHeight: '150px' }}>
                  <input type="file" accept="image/*" onChange={handleBeforeChange} style={{position:'absolute', top:0, left:0, width:'100%', height:'100%', opacity:0, cursor:'pointer', zIndex:2}} required />
                  {beforePreview ? (
                    <img src={beforePreview} alt="Preview" style={{width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px'}} />
                  ) : (
                    <div style={{color: 'var(--text-muted)', paddingTop: '1rem'}}>
                      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{margin: '0 auto 0.25rem'}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      <p style={{ fontSize: '0.85rem' }}>Upload</p>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>After Image *</label>
                <div className={styles.imageDropzone} style={{ padding: '1rem', minHeight: '150px' }}>
                  <input type="file" accept="image/*" onChange={handleAfterChange} style={{position:'absolute', top:0, left:0, width:'100%', height:'100%', opacity:0, cursor:'pointer', zIndex:2}} required />
                  {afterPreview ? (
                    <img src={afterPreview} alt="Preview" style={{width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px'}} />
                  ) : (
                    <div style={{color: 'var(--text-muted)', paddingTop: '1rem'}}>
                      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{margin: '0 auto 0.25rem'}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      <p style={{ fontSize: '0.85rem' }}>Upload</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Section 4: Gallery */}
          <div className={styles.formSection}>
            <div className={styles.formSectionTitle}>Case Gallery (Optional)</div>
            <p style={{color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem'}}>Upload additional images (e.g. X-rays, prep stages, mockups).</p>
            
            <div className={styles.formGroup}>
              <div className={styles.imageDropzone} style={{padding: '1rem', minHeight: '80px'}}>
                <input type="file" accept="image/*" multiple onChange={handleGalleryChange} style={{position:'absolute', top:0, left:0, width:'100%', height:'100%', opacity:0, cursor:'pointer', zIndex:2}} />
                <div style={{color: 'var(--primary-color)', fontWeight: '600'}}>
                  + Add Images
                </div>
              </div>
            </div>

            {galleryItems.length > 0 && (
              <SortableGallery images={galleryItems} setImages={setGalleryItems} />
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose} disabled={uploading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={uploading}>
              {uploading ? 'Saving Case...' : 'Publish Case'}
            </button>
          </div>

        </form>
      </div>
    </div>,
    document.body
  );
}

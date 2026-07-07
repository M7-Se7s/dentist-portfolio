/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from '../../admin.module.css';
import { useUploads } from '@/lib/contexts/UploadContext';

import BasicInfoSection from './components/BasicInfoSection';
import TreatmentDetailsSection from './components/TreatmentDetailsSection';
import ImageUploadSection from './components/ImageUploadSection';

export default function CreateCaseModal({ onClose, onSuccess }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Basic Info
  const [title, setTitle] = useState('');
  const [categories, setCategories] = useState([]);
  const [description, setDescription] = useState('');
  const [featured, setFeatured] = useState(false);

  // Treatment Details
  const [treatmentDetails, setTreatmentDetails] = useState('');
  const [treatmentSteps, setTreatmentSteps] = useState([]);
  const [isDraftSubmit, setIsDraftSubmit] = useState(false);

  // Images
  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);
  const [beforePreview, setBeforePreview] = useState(null);
  const [afterPreview, setAfterPreview] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);

  // eslint-disable-next-line no-unused-vars
  const [uploading, setUploading] = useState(false);

  const { startCaseUpload } = useUploads();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || categories.length === 0) {
      alert("Please fill all required fields (Title, Categories)");
      return;
    }
    if (!beforeImage || !afterImage) {
      alert("Please upload both before and after images.");
      return;
    }

    const payload = {
      mode: 'create',
      formData: {
        title,
        category: categories[0] || 'General',
        categories,
        description,
        isDraft: isDraftSubmit,
        featured,
        treatmentPlan: treatmentDetails,
        createdAt: new Date().toISOString()
      },
      beforeImageFile: beforeImage,
      afterImageFile: afterImage,
      galleryItems,
      treatmentSteps
    };

    startCaseUpload(payload);
    onSuccess();
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
          
          <BasicInfoSection 
            title={title} setTitle={setTitle}
            categories={categories} setCategories={setCategories}
            description={description} setDescription={setDescription}
            featured={featured} setFeatured={setFeatured}
            styles={styles}
          />

          <TreatmentDetailsSection 
            treatmentDetails={treatmentDetails} setTreatmentDetails={setTreatmentDetails}
            treatmentSteps={treatmentSteps} setTreatmentSteps={setTreatmentSteps}
            styles={styles}
          />

          <ImageUploadSection 
            beforePreview={beforePreview} setBeforePreview={setBeforePreview} setBeforeImage={setBeforeImage}
            afterPreview={afterPreview} setAfterPreview={setAfterPreview} setAfterImage={setAfterImage}
            galleryItems={galleryItems} setGalleryItems={setGalleryItems}
            styles={styles}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose} disabled={uploading}>
              Cancel
            </button>
            <button type="submit" className="btn-secondary" disabled={uploading} onClick={() => setIsDraftSubmit(true)}>
              Save as Draft
            </button>
            <button type="submit" className="btn-primary" disabled={uploading} onClick={() => setIsDraftSubmit(false)}>
              {uploading ? (
                <span style={{display: 'flex', alignItems: 'center'}}>
                  <svg style={{marginRight: '0.5rem', height: '1.25rem', width: '1.25rem', color: 'white', display: 'inline-block', animation: 'spin 1s linear infinite'}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                    <circle style={{opacity: 0.25}} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path style={{opacity: 0.75}} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving Case...
                </span>
              ) : 'Publish Case'}
            </button>
          </div>

        </form>
      </div>
    </div>,
    document.body
  );
}

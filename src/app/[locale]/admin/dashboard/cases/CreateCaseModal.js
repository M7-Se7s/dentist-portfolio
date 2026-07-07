/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from '../../admin.module.css';
import { useUploads } from '@/lib/contexts/UploadContext';
import Spinner from '@/components/Spinner';

import BasicInfoSection from './components/BasicInfoSection';
import TreatmentDetailsSection from './components/TreatmentDetailsSection';
import ImageUploadSection from './components/ImageUploadSection';

import ClinicalAssessmentSection from './components/ClinicalAssessmentSection';
import CaseDetailsSection from './components/CaseDetailsSection';
import OutcomeSection from './components/OutcomeSection';

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

  // Clinical Assessment
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatmentPerformed, setTreatmentPerformed] = useState('');
  const [techniques, setTechniques] = useState('');
  const [materials, setMaterials] = useState([]);

  // Treatment Details (Steps)
  const [treatmentDetails, setTreatmentDetails] = useState(''); // Keep for backward compatibility if needed, but mostly superseded by treatmentPerformed
  const [treatmentSteps, setTreatmentSteps] = useState([]);
  const [isDraftSubmit, setIsDraftSubmit] = useState(false);

  // Case Details
  const [duration, setDuration] = useState('');
  const [year, setYear] = useState('');
  const [difficulty, setDifficulty] = useState('');

  // Outcome
  const [challenges, setChallenges] = useState('');
  const [result, setResult] = useState('');
  const [keyTakeaways, setKeyTakeaways] = useState('');

  // Images
  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);
  const [beforePreview, setBeforePreview] = useState(null);
  const [afterPreview, setAfterPreview] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  const [xrayItems, setXrayItems] = useState([]);

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
        treatmentPlan: treatmentDetails, // legacy
        chiefComplaint,
        diagnosis,
        treatmentPerformed,
        techniques,
        materials,
        duration,
        year,
        difficulty,
        challenges,
        result,
        keyTakeaways,
        createdAt: new Date().toISOString()
      },
      beforeImageFile: beforeImage,
      afterImageFile: afterImage,
      galleryItems,
      xrayItems,
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

          <ClinicalAssessmentSection 
            chiefComplaint={chiefComplaint} setChiefComplaint={setChiefComplaint}
            diagnosis={diagnosis} setDiagnosis={setDiagnosis}
            treatmentPerformed={treatmentPerformed} setTreatmentPerformed={setTreatmentPerformed}
            techniques={techniques} setTechniques={setTechniques}
            materials={materials} setMaterials={setMaterials}
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
            xrayItems={xrayItems} setXrayItems={setXrayItems}
            styles={styles}
          />

          <CaseDetailsSection 
            duration={duration} setDuration={setDuration}
            year={year} setYear={setYear}
            difficulty={difficulty} setDifficulty={setDifficulty}
            styles={styles}
          />

          <OutcomeSection 
            challenges={challenges} setChallenges={setChallenges}
            result={result} setResult={setResult}
            keyTakeaways={keyTakeaways} setKeyTakeaways={setKeyTakeaways}
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
                <span style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                  <Spinner size={18} />
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

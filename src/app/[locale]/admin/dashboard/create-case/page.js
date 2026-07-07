/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import styles from '../../admin.module.css';
import { useUploads } from '@/lib/contexts/UploadContext';

import BasicInfoSection from '../cases/components/BasicInfoSection';
import TreatmentDetailsSection from '../cases/components/TreatmentDetailsSection';
import ImageUploadSection from '../cases/components/ImageUploadSection';
import ClinicalAssessmentSection from '../cases/components/ClinicalAssessmentSection';
import CaseDetailsSection from '../cases/components/CaseDetailsSection';
import OutcomeSection from '../cases/components/OutcomeSection';

export default function CreateCasePage() {
  const router = useRouter();
  
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
    chiefComplaint: '',
    diagnosis: '',
    treatmentPerformed: '',
    techniques: '',
    materials: [],
    duration: '',
    year: '',
    difficulty: '',
    challenges: '',
    result: '',
    keyTakeaways: '',
    procedureNotes: '',
    featured: false,
    isDraft: false,
    images: [],
    xrays: [],
    steps: []
  });

  const { startCaseUpload } = useUploads();

  const handleSave = async (e, asDraft = false) => {
    e?.preventDefault();
    if (!formData.title || formData.categories.length === 0) {
      alert("Please fill all required fields (Title, Categories)");
      return;
    }
    if (!beforeImage || !afterImage) {
      alert("Please upload both before and after images.");
      return;
    }

    setIsSaving(true);
    const payload = {
      mode: 'create',
      formData: {
        ...formData,
        category: formData.categories[0] || 'General',
        isDraft: asDraft,
        createdAt: new Date().toISOString()
      },
      beforeImageFile: beforeImage,
      afterImageFile: afterImage,
      treatmentSteps: formData.steps,
      galleryItems: formData.images,
      xrayItems: formData.xrays
    };

    startCaseUpload(payload);
    setSaveSuccess(true);
    setTimeout(() => {
      router.push('/admin/dashboard/cases');
    }, 1500);
  };

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

  const setChiefComplaint = (val) => setFormData(p => ({ ...p, chiefComplaint: val }));
  const setDiagnosis = (val) => setFormData(p => ({ ...p, diagnosis: val }));
  const setTreatmentPerformed = (val) => setFormData(p => ({ ...p, treatmentPerformed: val }));
  const setTechniques = (val) => setFormData(p => ({ ...p, techniques: val }));
  const setMaterials = (val) => setFormData(p => ({ ...p, materials: val }));
  
  const setDuration = (val) => setFormData(p => ({ ...p, duration: val }));
  const setYear = (val) => setFormData(p => ({ ...p, year: val }));
  const setDifficulty = (val) => setFormData(p => ({ ...p, difficulty: val }));
  
  const setChallenges = (val) => setFormData(p => ({ ...p, challenges: val }));
  const setResult = (val) => setFormData(p => ({ ...p, result: val }));
  const setKeyTakeaways = (val) => setFormData(p => ({ ...p, keyTakeaways: val }));

  const setXrayItems = (updaterOrValue) => {
    setFormData(p => ({
      ...p,
      xrays: typeof updaterOrValue === 'function' ? updaterOrValue(p.xrays) : updaterOrValue
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
            type="button" 
            className="btn-secondary" 
            onClick={(e) => handleSave(e, true)}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save as Draft'}
          </button>
          <button 
            type="button" 
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
          Case successfully created! Saving in background...
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

        <ClinicalAssessmentSection 
          chiefComplaint={formData.chiefComplaint} setChiefComplaint={setChiefComplaint}
          diagnosis={formData.diagnosis} setDiagnosis={setDiagnosis}
          treatmentPerformed={formData.treatmentPerformed} setTreatmentPerformed={setTreatmentPerformed}
          techniques={formData.techniques} setTechniques={setTechniques}
          materials={formData.materials} setMaterials={setMaterials}
          styles={styles}
        />

        <TreatmentDetailsSection 
          treatmentDetails={formData.treatmentPlan} setTreatmentDetails={setTreatmentDetails}
          treatmentSteps={formData.steps} setTreatmentSteps={setTreatmentSteps}
          styles={styles}
        />

        <ImageUploadSection 
          beforePreview={beforePreview} 
          setBeforePreview={setBeforePreview} 
          setBeforeImage={setBeforeImage}
          afterPreview={afterPreview} 
          setAfterPreview={setAfterPreview} 
          setAfterImage={setAfterImage}
          galleryItems={formData.images} 
          setGalleryItems={setGalleryItems}
          xrayItems={formData.xrays}
          setXrayItems={setXrayItems}
          styles={styles}
        />

        <CaseDetailsSection 
          duration={formData.duration} setDuration={setDuration}
          year={formData.year} setYear={setYear}
          difficulty={formData.difficulty} setDifficulty={setDifficulty}
          styles={styles}
        />

        <OutcomeSection 
          challenges={formData.challenges} setChallenges={setChallenges}
          result={formData.result} setResult={setResult}
          keyTakeaways={formData.keyTakeaways} setKeyTakeaways={setKeyTakeaways}
          styles={styles}
        />
      </form>
    </div>
  );
}

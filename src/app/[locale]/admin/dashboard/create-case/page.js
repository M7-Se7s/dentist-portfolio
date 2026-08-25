"use client";

import { useState, useEffect, Suspense } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import styles from '../../admin.module.css';
import { useUploads } from '@/lib/contexts/UploadContext';

import BasicInfoSection from '../cases/components/BasicInfoSection';
import TreatmentDetailsSection from '../cases/components/TreatmentDetailsSection';
import ImageUploadSection from '../cases/components/ImageUploadSection';
import ClinicalAssessmentSection from '../cases/components/ClinicalAssessmentSection';
import CaseDetailsSection from '../cases/components/CaseDetailsSection';
import OutcomeSection from '../cases/components/OutcomeSection';

function CreateCaseForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const caseType = searchParams.get('type') || 'detailed';
  
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.matchMedia('(max-width: 1024px)').matches);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [imageMode, setImageMode] = useState('beforeAfter');
  
  const [beforeImage, setBeforeImage] = useState(null);
  const [beforePreview, setBeforePreview] = useState(null);
  const [afterImage, setAfterImage] = useState(null);
  const [afterPreview, setAfterPreview] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    categories: [],
    patientAge: '',
    patientGender: '',
    description: '',
    descriptionAr: '',
    treatmentPlan: '',
    treatmentPlanAr: '',
    chiefComplaint: '',
    chiefComplaintAr: '',
    diagnosis: '',
    diagnosisAr: '',
    treatmentPerformed: '',
    treatmentPerformedAr: '',
    techniques: '',
    techniquesAr: '',
    materials: [],
    duration: '',
    year: '',
    difficulty: '',
    challenges: '',
    challengesAr: '',
    result: '',
    resultAr: '',
    keyTakeaways: '',
    keyTakeawaysAr: '',
    procedureNotes: '',
    featured: false,
    isDraft: false,
    images: [],
    xrays: [],
    steps: []
  });

  const { startCaseUpload } = useUploads();

  const [activeTab, setActiveTab] = useState('basic');
  const [isTranslatingAll, setIsTranslatingAll] = useState(false);
  const [showSaveMenu, setShowSaveMenu] = useState(false);

  const handleAutoTranslateAll = async () => {
    setIsTranslatingAll(true);
    const fieldsToTranslate = [
      { en: formData.description, setKey: 'descriptionAr' },
      { en: formData.treatmentPlan, setKey: 'treatmentPlanAr' },
      { en: formData.chiefComplaint, setKey: 'chiefComplaintAr' },
      { en: formData.diagnosis, setKey: 'diagnosisAr' },
      { en: formData.treatmentPerformed, setKey: 'treatmentPerformedAr' },
      { en: formData.techniques, setKey: 'techniquesAr' },
      { en: formData.challenges, setKey: 'challengesAr' },
      { en: formData.result, setKey: 'resultAr' },
      { en: formData.keyTakeaways, setKey: 'keyTakeawaysAr' },
    ];

    try {
      const updates = {};
      
      // Run sequentially to avoid Google Translate 429 Too Many Requests
      for (const { en, setKey } of fieldsToTranslate) {
        if (!en) continue;
        
        try {
          const res = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: en, target: 'ar' })
          });
          
          if (!res.ok) {
            console.error(`Translation failed for ${setKey} with status: ${res.status}`);
            continue;
          }
          
          const data = await res.json();
          if (data.translatedText) {
            updates[setKey] = data.translatedText;
          }
          
          // Small delay to prevent rate limiting
          await new Promise(resolve => setTimeout(resolve, 250));
        } catch (err) {
          console.error(`Error translating ${setKey}:`, err);
        }
      }

      // Translate Steps sequentially
      const translatedSteps = [...formData.steps];
      for (let index = 0; index < translatedSteps.length; index++) {
        const step = translatedSteps[index];
        try {
          if (step.title) {
            const res = await fetch('/api/translate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text: step.title, target: 'ar' })
            });
            if (res.ok) {
              const data = await res.json();
              if (data.translatedText) translatedSteps[index].titleAr = data.translatedText;
            }
            await new Promise(resolve => setTimeout(resolve, 250));
          }
          
          if (step.description) {
            const res = await fetch('/api/translate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text: step.description, target: 'ar' })
            });
            if (res.ok) {
              const data = await res.json();
              if (data.translatedText) translatedSteps[index].descriptionAr = data.translatedText;
            }
            await new Promise(resolve => setTimeout(resolve, 250));
          }
        } catch (err) {
          console.error(`Error translating step ${index}:`, err);
        }
      }
      
      setFormData(prev => ({
        ...prev,
        ...updates,
        steps: translatedSteps
      }));

    } catch (e) {
      console.error(e);
      alert('Failed to translate some fields');
    } finally {
      setIsTranslatingAll(false);
    }
  };

  const handleSave = async (e, asDraft = false) => {
    e?.preventDefault();
    if (!asDraft) {
      if (formData.categories.length === 0) {
        alert("Please select a Category.");
        return;
      }
      if (caseType === 'detailed') {
        if (imageMode === 'beforeAfter' && (!beforeImage || !afterImage)) {
          alert("Please upload both before and after images.");
          return;
        } else if (imageMode === 'coverOnly' && !coverImage) {
          alert("Please upload a cover image.");
          return;
        }
      } else {
        if (!coverImage) {
          alert("Please upload a cover image.");
          return;
        }
      }
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
      caseType,
      coverImageFile: coverImage,
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
  const setCategories = (val) => setFormData(p => ({ ...p, categories: val }));
  const setDescription = (val) => setFormData(p => ({ ...p, description: val }));
  const setDescriptionAr = (val) => setFormData(p => ({ ...p, descriptionAr: val }));
  const setFeatured = (val) => setFormData(p => ({ ...p, featured: val }));
  const setPatientAge = (val) => setFormData(p => ({ ...p, patientAge: val }));
  const setPatientGender = (val) => setFormData(p => ({ ...p, patientGender: val }));
  
  const setTreatmentDetails = (val) => setFormData(p => ({ ...p, treatmentPlan: val }));
  const setTreatmentDetailsAr = (val) => setFormData(p => ({ ...p, treatmentPlanAr: val }));
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
  const setChiefComplaintAr = (val) => setFormData(p => ({ ...p, chiefComplaintAr: val }));
  const setDiagnosis = (val) => setFormData(p => ({ ...p, diagnosis: val }));
  const setDiagnosisAr = (val) => setFormData(p => ({ ...p, diagnosisAr: val }));
  const setTreatmentPerformed = (val) => setFormData(p => ({ ...p, treatmentPerformed: val }));
  const setTreatmentPerformedAr = (val) => setFormData(p => ({ ...p, treatmentPerformedAr: val }));
  const setTechniques = (val) => setFormData(p => ({ ...p, techniques: val }));
  const setTechniquesAr = (val) => setFormData(p => ({ ...p, techniquesAr: val }));
  const setMaterials = (val) => setFormData(p => ({ ...p, materials: val }));
  
  const setDuration = (val) => setFormData(p => ({ ...p, duration: val }));
  const setYear = (val) => setFormData(p => ({ ...p, year: val }));
  const setDifficulty = (val) => setFormData(p => ({ ...p, difficulty: val }));
  
  const setChallenges = (val) => setFormData(p => ({ ...p, challenges: val }));
  const setChallengesAr = (val) => setFormData(p => ({ ...p, challengesAr: val }));
  const setResult = (val) => setFormData(p => ({ ...p, result: val }));
  const setResultAr = (val) => setFormData(p => ({ ...p, resultAr: val }));
  const setKeyTakeaways = (val) => setFormData(p => ({ ...p, keyTakeaways: val }));
  const setKeyTakeawaysAr = (val) => setFormData(p => ({ ...p, keyTakeawaysAr: val }));

  const setXrayItems = (updaterOrValue) => {
    setFormData(p => ({
      ...p,
      xrays: typeof updaterOrValue === 'function' ? updaterOrValue(p.xrays) : updaterOrValue
    }));
  };

  const actionButtonsNode = (
    <div className={styles.headerActionButtons}>
      <button 
        type="button" 
        className="btn-secondary" 
        onClick={handleAutoTranslateAll}
        disabled={isTranslatingAll}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          backgroundColor: 'rgba(var(--primary-rgb), 0.05)',
          borderColor: 'rgba(var(--primary-rgb), 0.2)',
          color: 'var(--primary-color)'
        }}
      >
        {isTranslatingAll ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="animate-spin">
            <circle cx="12" cy="12" r="10" strokeWidth="4" stroke="rgba(0,0,0,0.1)"></circle>
            <path d="M12 2a10 10 0 0110 10" strokeWidth="4" stroke="currentColor"></path>
          </svg>
        ) : (
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
          </svg>
        )}
        <span className={styles.fabText}>{isTranslatingAll ? 'Translating...' : 'Auto-Translate'}</span>
      </button>
      
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        {/* Speed Dial Menu Items */}
        <div className={`${styles.speedDialMenu} ${showSaveMenu ? styles.open : ''}`}>
          <button 
            type="button" 
            className={`btn-secondary ${styles.speedDialItem}`}
            onClick={(e) => { setShowSaveMenu(false); handleSave(e, true); }}
          >
            <span className={styles.speedDialLabel}>Save as Draft</span>
            <span className={styles.fabIconWrapper}>
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
              </svg>
            </span>
          </button>
          
          <button 
            type="button" 
            className={`btn-primary ${styles.speedDialItem}`}
            onClick={(e) => { setShowSaveMenu(false); handleSave(e, false); }}
          >
            <span className={styles.speedDialLabel}>Publish</span>
            <span className={styles.fabIconWrapper}>
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </span>
          </button>
        </div>

        {/* Speed Dial Main Trigger */}
        <button 
          type="button" 
          className={`btn-primary ${styles.fabTrigger} ${showSaveMenu ? styles.active : ''}`}
          onClick={() => setShowSaveMenu(!showSaveMenu)}
          disabled={isSaving}
        >
          <div style={{ position: 'relative', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} className={styles.fabIconWrapper}>
            {/* Checkmark icon (default) */}
            <svg className={styles.iconDefault} width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {/* Close (X) icon (active) */}
            <svg className={styles.iconActive} width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <span className={styles.fabText}>{isSaving ? 'Saving...' : 'Save Options'}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="animate-slideUp">
      {/* Header Area */}
      <div className={styles.editCaseHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/admin/dashboard/cases" className={`btn-secondary ${styles.backBtn}`} style={{ display: 'inline-flex', alignItems: 'center' }}>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{marginRight: '0.5rem'}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          <span className={styles.hideOnMobile}>Back to Cases</span></Link>
        
        {mounted && isMobile ? createPortal(actionButtonsNode, document.body) : actionButtonsNode}
      </div>

      {saveSuccess && (
        <div className={styles.successBanner} style={{ background: '#ECFDF5', color: '#065F46', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', display: 'flex', alignItems: 'center', fontWeight: '500', border: '1px solid #A7F3D0' }}>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{marginRight: '0.5rem'}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          Case successfully created! Saving in background...
        </div>
      )}

      {/* Main Form Layout */}
      <form onSubmit={(e) => handleSave(e, false)}>
        <div className={styles.tabsContainer}>
          <button type="button" onClick={() => setActiveTab('basic')} className={activeTab === 'basic' ? styles.tabActive : styles.tabInactive}>Basic Info</button>
          {caseType === 'detailed' && (
            <>
              <button type="button" onClick={() => setActiveTab('clinical')} className={activeTab === 'clinical' ? styles.tabActive : styles.tabInactive}>Clinical Assessment</button>
              <button type="button" onClick={() => setActiveTab('steps')} className={activeTab === 'steps' ? styles.tabActive : styles.tabInactive}>Treatment Steps</button>
              <button type="button" onClick={() => setActiveTab('outcome')} className={activeTab === 'outcome' ? styles.tabActive : styles.tabInactive}>Outcome</button>
            </>
          )}
          <button type="button" onClick={() => setActiveTab('media')} className={activeTab === 'media' ? styles.tabActive : styles.tabInactive}>Media & Images</button>
        </div>

        <div style={{ display: activeTab === 'basic' ? 'block' : 'none' }}>
          <BasicInfoSection 
            caseType={caseType}
            categories={formData.categories} setCategories={setCategories}
            description={formData.description} setDescription={setDescription}
            descriptionAr={formData.descriptionAr} setDescriptionAr={setDescriptionAr}
            featured={formData.featured} setFeatured={setFeatured}
            patientAge={formData.patientAge} setPatientAge={setPatientAge}
            patientGender={formData.patientGender} setPatientGender={setPatientGender}
            styles={styles}
          />
          <CaseDetailsSection 
            duration={formData.duration} setDuration={setDuration}
            year={formData.year} setYear={setYear}
            difficulty={formData.difficulty} setDifficulty={setDifficulty}
            styles={styles}
          />
        </div>

        <div style={{ display: activeTab === 'clinical' ? 'block' : 'none' }}>
          <ClinicalAssessmentSection 
            chiefComplaint={formData.chiefComplaint} setChiefComplaint={setChiefComplaint}
            chiefComplaintAr={formData.chiefComplaintAr} setChiefComplaintAr={setChiefComplaintAr}
            diagnosis={formData.diagnosis} setDiagnosis={setDiagnosis}
            diagnosisAr={formData.diagnosisAr} setDiagnosisAr={setDiagnosisAr}
            treatmentPerformed={formData.treatmentPerformed} setTreatmentPerformed={setTreatmentPerformed}
            treatmentPerformedAr={formData.treatmentPerformedAr} setTreatmentPerformedAr={setTreatmentPerformedAr}
            techniques={formData.techniques} setTechniques={setTechniques}
            techniquesAr={formData.techniquesAr} setTechniquesAr={setTechniquesAr}
            materials={formData.materials} setMaterials={setMaterials}
            styles={styles}
          />
        </div>

        <div style={{ display: activeTab === 'steps' ? 'block' : 'none' }}>
          <TreatmentDetailsSection 
            treatmentDetails={formData.treatmentPlan} setTreatmentDetails={setTreatmentDetails}
            treatmentDetailsAr={formData.treatmentPlanAr} setTreatmentDetailsAr={setTreatmentDetailsAr}
            treatmentSteps={formData.steps} setTreatmentSteps={setTreatmentSteps}
            styles={styles}
          />
        </div>

        <div style={{ display: activeTab === 'outcome' ? 'block' : 'none' }}>
          <OutcomeSection 
            challenges={formData.challenges} setChallenges={setChallenges}
            challengesAr={formData.challengesAr} setChallengesAr={setChallengesAr}
            result={formData.result} setResult={setResult}
            resultAr={formData.resultAr} setResultAr={setResultAr}
            keyTakeaways={formData.keyTakeaways} setKeyTakeaways={setKeyTakeaways}
            keyTakeawaysAr={formData.keyTakeawaysAr} setKeyTakeawaysAr={setKeyTakeawaysAr}
            styles={styles}
          />
        </div>

        <div style={{ display: activeTab === 'media' ? 'block' : 'none' }}>
          <ImageUploadSection 
            caseType={caseType}
            imageMode={imageMode}
            onImageModeChange={setImageMode}
            coverPreview={coverPreview}
            setCoverPreview={setCoverPreview}
            setCoverImage={setCoverImage}
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
        </div>
        </form>
    </div>
  );
}

export default function CreateCasePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateCaseForm />
    </Suspense>
  );
}




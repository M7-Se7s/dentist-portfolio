"use client";

import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import styles from '../../admin.module.css';

import BasicInfoEditor from './components/BasicInfoEditor';
import ExperienceEditor from './components/ExperienceEditor';
import EducationEditor from './components/EducationEditor';
import SkillsTextEditor from './components/SkillsTextEditor';
import PdfUploadSection from './components/PdfUploadSection';

export default function CVEditorPage() {
  const [basicInfo, setBasicInfo] = useState({
    name: 'Dr. Mohamed El Sayed Mohamed Shabaan',
    title: 'General Dentist | SCFHS Professionally Classified',
    location: 'Giza, Egypt',
    phone: '+20 1553911135',
    email: 'avatarmohammedy@gmail.com',
    linkedin: ''
  });

  const [summary, setSummary] = useState('Dedicated General Dentist with over two years of post-internship clinical experience providing comprehensive dental care. Successfully passed the Saudi Prometric Examination and obtained the Saudi Commission for Health Specialties (SCFHS) Professional Classification.\nExperienced in restorative dentistry, endodontics, fixed and removable prosthodontics, oral surgery, pediatric dentistry, esthetic restorative procedures, and comprehensive treatment planning. Skilled in managing a wide range of routine and advanced dental cases while maintaining high standards of patient care, infection control, and clinical excellence.');
  
  const [coreCompetencies, setCoreCompetencies] = useState('Comprehensive Dental Care\nComprehensive Treatment Planning\nEndodontics\nFixed Prosthodontics\nRemovable Prosthodontics\nOral Surgery\nPediatric Dentistry\nEsthetic Restorative Dentistry\nEmergency Dental Care\nPatient Communication\nInfection Prevention & Control');
  
  const [education, setEducation] = useState([{ degree: 'Bachelor of Dental Surgery (BDS)', institution: 'Faculty of Dental Medicine\nAl-Azhar University – Egypt', year: 'Graduated: 2023' }]);
  
  const [licensure, setLicensure] = useState('Saudi Prometric Examination — Passed\nSaudi Commission for Health Specialties (SCFHS) — Professionally Classified');
  
  const [experiences, setExperiences] = useState([
    { id: 1, role: 'General Dentist', clinic: 'Dr. Ahmed Saleh Dental Clinic', period: 'October 2023 – July 2024', responsibilities: 'Comprehensive diagnosis and treatment planning.\nRestorative dentistry.\nRoot canal treatment.\nFixed prosthodontics.\nSimple and surgical extractions.' },
    { id: 2, role: 'General Dentist', clinic: 'Dr. Ali Naguib Dental Clinic', period: 'July 2024 – January 2025', responsibilities: 'Comprehensive restorative procedures.\nEndodontic treatment.\nCrown & Bridge procedures.\nPediatric dentistry.\nEmergency dental management.' },
    { id: 3, role: 'General Dentist', clinic: 'Dr. Mostafa Yehia Dental Clinic', period: 'October 2024 – Present', responsibilities: 'Comprehensive dental treatment.\nOral surgery.\nFull-mouth rehabilitation.\nVeneer cases.\nSurgical management of impacted wisdom teeth.' },
    { id: 4, role: 'General Dentist', clinic: 'Dr. Gamal Saad El-Din Dental Clinic', period: 'January 2025 – Present', responsibilities: 'Restorative dentistry.\nFixed and removable prosthodontics.\nEndodontic retreatment.\nMinor oral surgery.' }
  ]);

  const [clinicalSkills, setClinicalSkills] = useState('**Endodontics**\nAnterior & Posterior Root Canal Treatment\nRotary Endodontics (Multiple Rotary Systems)\nEndodontic Retreatment\nManagement of Separated Instrument Cases (Bypassing)\n\n**Fixed Prosthodontics**\nCrown & Bridge\nFull Mouth Rehabilitation\nFull Arch Crown Rehabilitation\nPorcelain Veneers\n\n**Removable Prosthodontics**\nComplete Dentures\nRemovable Partial Dentures\n\n**Oral Surgery**\nSimple Dental Extractions\nSurgical Extractions\nSurgical Removal of Impacted Wisdom Teeth\nCoronectomy\nApicoectomy\n\n**Pediatric Dentistry**\nPediatric Restorative Dentistry\nPulpotomy for Primary Teeth\nPulpectomy for Primary Teeth\nStainless Steel Crowns (SSC)\n\n**Restorative Dentistry**\nDirect Composite Restorations\nEsthetic Restorative Procedures\nComprehensive Treatment Planning\n\n**Preventive Dentistry**\nScaling & Root Planing\nOral Hygiene Instructions\n\n**Additional Skills**\nEmergency Dental Care\nAssisting in Dental Implant Surgery\nInfection Prevention & Control');
  
  const [courses, setCourses] = useState('Online Endodontic Courses\nOral Surgery Courses\nContinuous Professional Development in General Dentistry');
  
  const [languages, setLanguages] = useState('Arabic: Native\nEnglish: Intermediate');
  const [references, setReferences] = useState('Available upon request.');
  
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchCV() {
      try {
        const docRef = doc(db, "content", "cv");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.basicInfo) setBasicInfo(data.basicInfo);
          if (data.summary) setSummary(data.summary);
          if (data.coreCompetencies) setCoreCompetencies(data.coreCompetencies.join('\n'));
          if (data.education) setEducation(data.education);
          if (data.licensure) setLicensure(data.licensure.join('\n'));
          if (data.experiences) setExperiences(data.experiences);
          if (data.clinicalSkills) setClinicalSkills(data.clinicalSkills);
          if (data.courses) setCourses(data.courses.join('\n'));
          if (data.languages) setLanguages(data.languages.join('\n'));
          if (data.references) setReferences(data.references);
          if (data.pdfUrl) setPdfUrl(data.pdfUrl);
        }
      } catch (err) {
        console.error("Error fetching CV data:", err);
      }
    }
    fetchCV();
  }, []);

  const uploadPdfToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
    
    const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload PDF to Cloudinary');
    }
    
    const data = await response.json();
    return data.secure_url;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');
    try {
      let finalPdfUrl = pdfUrl;

      if (pdfFile) {
        finalPdfUrl = await uploadPdfToCloudinary(pdfFile);
        setPdfUrl(finalPdfUrl);
      }

      const docRef = doc(db, "content", "cv");
      await setDoc(docRef, {
        basicInfo,
        summary,
        coreCompetencies: coreCompetencies.split('\n').filter(s => s.trim() !== ''),
        education,
        licensure: licensure.split('\n').filter(s => s.trim() !== ''),
        experiences,
        clinicalSkills,
        courses: courses.split('\n').filter(s => s.trim() !== ''),
        languages: languages.split('\n').filter(s => s.trim() !== ''),
        references,
        pdfUrl: finalPdfUrl
      }, { merge: true });
      
      setMessage('CV updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error("Error saving CV", err);
      setMessage('Error updating CV. Check console.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="animate-slideUp stagger-1">
      <div className={styles.caseManagementHeader} style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-dark)'}}>CV Editor</h1>
          <p style={{color: 'var(--text-muted)'}}>Manage your Curriculum Vitae data directly synced to your website.</p>
        </div>
      </div>

      {message && (
        <div style={{
          padding: '1rem', 
          marginBottom: '1rem', 
          backgroundColor: message.includes('Error') ? '#FEE2E2' : '#DCFCE7',
          color: message.includes('Error') ? '#991B1B' : '#166534',
          borderRadius: '8px',
          fontWeight: '600'
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSave}>
        
        <PdfUploadSection pdfFile={pdfFile} setPdfFile={setPdfFile} pdfUrl={pdfUrl} setPdfUrl={setPdfUrl} styles={styles} />
        
        <BasicInfoEditor basicInfo={basicInfo} setBasicInfo={setBasicInfo} summary={summary} setSummary={setSummary} styles={styles} />
        
        <SkillsTextEditor 
          coreCompetencies={coreCompetencies} setCoreCompetencies={setCoreCompetencies}
          licensure={licensure} setLicensure={setLicensure}
          clinicalSkills={clinicalSkills} setClinicalSkills={setClinicalSkills}
          courses={courses} setCourses={setCourses}
          languages={languages} setLanguages={setLanguages}
          references={references} setReferences={setReferences}
          styles={styles}
        />
        
        <EducationEditor education={education} setEducation={setEducation} styles={styles} />
        
        <ExperienceEditor experiences={experiences} setExperiences={setExperiences} styles={styles} />

        {/* Sticky Action Bar */}
        <div className={styles.stickyActionBar}>
          <button type="submit" className="btn-primary" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save CV Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}

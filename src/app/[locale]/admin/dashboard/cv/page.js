"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Spinner from '@/components/Spinner';
import styles from '../../admin.module.css';

import BasicInfoEditor from './components/BasicInfoEditor';
import ExperienceEditor from './components/ExperienceEditor';
import EducationEditor from './components/EducationEditor';
import SkillsTextEditor from './components/SkillsTextEditor';
import PdfUploadSection from './components/PdfUploadSection';

export default function CVEditorPage() {
  const [activeTab, setActiveTab] = useState('basic');

  const [basicInfo, setBasicInfo] = useState({
    name: 'Dr. Mohamed El Sayed Mohamed Shabaan',
    title: 'General Dentist | SCFHS Professionally Classified',
    location: 'Giza, Egypt',
    phone: '+20 1553911135',
    email: 'avatarmohammedy@gmail.com',
    linkedin: ''
  });
  const [basicInfoAr, setBasicInfoAr] = useState({ name: '', title: '', location: '' });

  const [summary, setSummary] = useState('Dedicated General Dentist with over two years of post-internship clinical experience providing comprehensive dental care. Successfully passed the Saudi Prometric Examination and obtained the Saudi Commission for Health Specialties (SCFHS) Professional Classification.\nExperienced in restorative dentistry, endodontics, fixed and removable prosthodontics, oral surgery, pediatric dentistry, esthetic restorative procedures, and comprehensive treatment planning. Skilled in managing a wide range of routine and advanced dental cases while maintaining high standards of patient care, infection control, and clinical excellence.');
  const [summaryAr, setSummaryAr] = useState('');
  
  const [coreCompetencies, setCoreCompetencies] = useState([
    'Comprehensive Dental Care', 'Comprehensive Treatment Planning', 'Endodontics', 
    'Fixed Prosthodontics', 'Removable Prosthodontics', 'Oral Surgery', 
    'Pediatric Dentistry', 'Esthetic Restorative Dentistry', 'Emergency Dental Care', 
    'Patient Communication', 'Infection Prevention & Control'
  ]);
  const [coreCompetenciesAr, setCoreCompetenciesAr] = useState([]);
  
  const [education, setEducation] = useState([{ degree: 'Bachelor of Dental Surgery (BDS)', institution: 'Faculty of Dental Medicine\nAl-Azhar University – Egypt', year: 'Graduated: 2023' }]);
  
  const [licensure, setLicensure] = useState(['Saudi Prometric Examination — Passed', 'Saudi Commission for Health Specialties (SCFHS) — Professionally Classified']);
  const [licensureAr, setLicensureAr] = useState([]);
  
  const [experiences, setExperiences] = useState([
    { id: 1, role: 'General Dentist', clinic: 'Dr. Ahmed Saleh Dental Clinic', period: 'October 2023 – July 2024', responsibilities: 'Comprehensive diagnosis and treatment planning.\nRestorative dentistry.\nRoot canal treatment.\nFixed prosthodontics.\nSimple and surgical extractions.' },
    { id: 2, role: 'General Dentist', clinic: 'Dr. Ali Naguib Dental Clinic', period: 'July 2024 – January 2025', responsibilities: 'Comprehensive restorative procedures.\nEndodontic treatment.\nCrown & Bridge procedures.\nPediatric dentistry.\nEmergency dental management.' },
    { id: 3, role: 'General Dentist', clinic: 'Dr. Mostafa Yehia Dental Clinic', period: 'October 2024 – Present', responsibilities: 'Comprehensive dental treatment.\nOral surgery.\nFull-mouth rehabilitation.\nVeneer cases.\nSurgical management of impacted wisdom teeth.' },
    { id: 4, role: 'General Dentist', clinic: 'Dr. Gamal Saad El-Din Dental Clinic', period: 'January 2025 – Present', responsibilities: 'Restorative dentistry.\nFixed and removable prosthodontics.\nEndodontic retreatment.\nMinor oral surgery.' }
  ]);

  const defaultClinicalSkillsStr = '**Endodontics**\nAnterior & Posterior Root Canal Treatment\nRotary Endodontics (Multiple Rotary Systems)\nEndodontic Retreatment\nManagement of Separated Instrument Cases (Bypassing)\n\n**Fixed Prosthodontics**\nCrown & Bridge\nFull Mouth Rehabilitation\nFull Arch Crown Rehabilitation\nPorcelain Veneers\n\n**Removable Prosthodontics**\nComplete Dentures\nRemovable Partial Dentures\n\n**Oral Surgery**\nSimple Dental Extractions\nSurgical Extractions\nSurgical Removal of Impacted Wisdom Teeth\nCoronectomy\nApicoectomy\n\n**Pediatric Dentistry**\nPediatric Restorative Dentistry\nPulpotomy for Primary Teeth\nPulpectomy for Primary Teeth\nStainless Steel Crowns (SSC)\n\n**Restorative Dentistry**\nDirect Composite Restorations\nEsthetic Restorative Procedures\nComprehensive Treatment Planning\n\n**Preventive Dentistry**\nScaling & Root Planing\nOral Hygiene Instructions\n\n**Additional Skills**\nEmergency Dental Care\nAssisting in Dental Implant Surgery\nInfection Prevention & Control';
  
  const parseMarkdownToCategories = (text) => {
    if (!text) return [];
    const lines = text.split('\n');
    const categories = [];
    let currentCategory = null;

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;

      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        currentCategory = { category: trimmed.slice(2, -2), skills: [] };
        categories.push(currentCategory);
      } else {
        const skillName = trimmed.replace(/^- /, '').trim();
        if (currentCategory) {
          currentCategory.skills.push(skillName);
        } else {
          currentCategory = { category: 'General', skills: [skillName] };
          categories.push(currentCategory);
        }
      }
    });
    return categories;
  };

  const [clinicalSkills, setClinicalSkills] = useState(parseMarkdownToCategories(defaultClinicalSkillsStr));
  const [clinicalSkillsAr, setClinicalSkillsAr] = useState([]);
  
  const [courses, setCourses] = useState(['Online Endodontic Courses', 'Oral Surgery Courses', 'Continuous Professional Development in General Dentistry']);
  const [coursesAr, setCoursesAr] = useState([]);
  
  const [languages, setLanguages] = useState(['Arabic: Native', 'English: Intermediate']);
  const [languagesAr, setLanguagesAr] = useState([]);

  const [references, setReferences] = useState('Available upon request.');
  const [referencesAr, setReferencesAr] = useState('');
  
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfUrlAr, setPdfUrlAr] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [isAutoTranslating, setIsAutoTranslating] = useState(false);

  useEffect(() => {
    async function fetchCV() {
      try {
        const docRef = doc(db, "content", "cv");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.basicInfo) setBasicInfo(data.basicInfo);
          if (data.basicInfoAr) setBasicInfoAr(data.basicInfoAr);
          if (data.summary) setSummary(data.summary);
          if (data.summaryAr) setSummaryAr(data.summaryAr);
          if (data.coreCompetencies) setCoreCompetencies(data.coreCompetencies);
          if (data.coreCompetenciesAr) setCoreCompetenciesAr(data.coreCompetenciesAr);
          if (data.education) setEducation(data.education);
          if (data.licensure) setLicensure(data.licensure);
          if (data.licensureAr) setLicensureAr(data.licensureAr);
          if (data.experiences) setExperiences(data.experiences);
          if (data.clinicalSkills) setClinicalSkills(parseMarkdownToCategories(data.clinicalSkills));
          if (data.clinicalSkillsAr) setClinicalSkillsAr(parseMarkdownToCategories(data.clinicalSkillsAr));
          if (data.courses) setCourses(data.courses);
          if (data.coursesAr) setCoursesAr(data.coursesAr);
          if (data.languages) setLanguages(data.languages);
          if (data.languagesAr) setLanguagesAr(data.languagesAr);
          if (data.referencesAr) setReferencesAr(data.referencesAr);
          if (data.pdfUrl) setPdfUrl(data.pdfUrl);
          if (data.pdfUrlAr) setPdfUrlAr(data.pdfUrlAr);
        }
      } catch (err) {
        console.error("Error fetching CV data:", err);
      }
    }
    fetchCV();
  }, []);

  // Cloudinary PDF upload logic removed in favor of Google Drive links

  const handleAutoTranslate = async () => {
    if (!confirm('This will auto-translate all English fields into Arabic. Existing Arabic text may be overwritten. Continue?')) return;
    
    setIsAutoTranslating(true);
    setMessage('Translating CV... This might take a moment.');
    
    try {
      const translateText = async (text) => {
        if (!text) return '';
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, target: 'ar' })
        });
        const data = await res.json();
        return data.translatedText || text;
      };

      // 1. Basic Info
      const nameAr = await translateText(basicInfo.name);
      const titleAr = await translateText(basicInfo.title);
      const locationAr = await translateText(basicInfo.location);
      setBasicInfoAr({ name: nameAr, title: titleAr, location: locationAr });

      // 2. Simple Strings
      setSummaryAr(await translateText(summary));
      setReferencesAr(await translateText(references));

      // 3. Array Strings (Dynamic Lists)
      const translateArray = async (arr) => {
        if (!arr || !Array.isArray(arr)) return [];
        return await Promise.all(arr.map(item => translateText(item)));
      };
      
      setCoreCompetenciesAr(await translateArray(coreCompetencies));
      setLicensureAr(await translateArray(licensure));
      setCoursesAr(await translateArray(courses));
      setLanguagesAr(await translateArray(languages));

      // 4. Clinical Skills Categories
      const newClinicalSkills = [];
      for (const cat of clinicalSkills) {
        newClinicalSkills.push({
          category: await translateText(cat.category),
          skills: await translateArray(cat.skills)
        });
      }
      setClinicalSkillsAr(newClinicalSkills);

      // 5. Object Arrays
      const newExperiences = [];
      for (const exp of experiences) {
        newExperiences.push({
          ...exp,
          roleAr: await translateText(exp.role),
          clinicAr: await translateText(exp.clinic),
          periodAr: await translateText(exp.period),
          responsibilitiesAr: await translateText(exp.responsibilities)
        });
      }
      setExperiences(newExperiences);

      const newEducation = [];
      for (const edu of education) {
        newEducation.push({
          ...edu,
          degreeAr: await translateText(edu.degree),
          institutionAr: await translateText(edu.institution),
          yearAr: await translateText(edu.year)
        });
      }
      setEducation(newEducation);

      setMessage('Translation complete! Please review the Arabic fields and hit Save.');
      setTimeout(() => setMessage(''), 4000);
    } catch (e) {
      console.error(e);
      setMessage('Error during translation.');
    } finally {
      setIsAutoTranslating(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');
    try {
      const formatClinicalSkills = (list) => {
        if (!list || !Array.isArray(list)) return '';
        return list.filter(cat => cat.category?.trim() !== '').map(cat => {
          return `**${cat.category}**\n${cat.skills.filter(s => s?.trim() !== '').join('\n')}`;
        }).join('\n\n');
      };

      const docRef = doc(db, "content", "cv");
      await setDoc(docRef, {
        basicInfo,
        basicInfoAr,
        summary,
        summaryAr,
        coreCompetencies: coreCompetencies.filter(s => s?.trim() !== ''),
        coreCompetenciesAr: coreCompetenciesAr.filter(s => s?.trim() !== ''),
        education,
        licensure: licensure.filter(s => s?.trim() !== ''),
        licensureAr: licensureAr.filter(s => s?.trim() !== ''),
        experiences,
        clinicalSkills: formatClinicalSkills(clinicalSkills),
        clinicalSkillsAr: formatClinicalSkills(clinicalSkillsAr),
        courses: courses.filter(s => s?.trim() !== ''),
        coursesAr: coursesAr.filter(s => s?.trim() !== ''),
        languages: languages.filter(s => s?.trim() !== ''),
        languagesAr: languagesAr.filter(s => s?.trim() !== ''),
        references,
        referencesAr,
        pdfUrl: pdfUrl,
        pdfUrlAr: pdfUrlAr
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
    <form onSubmit={handleSave} className="animate-slideUp stagger-1" id="cv-form">
      <div style={{ 
        position: 'sticky', 
        top: '-1rem',
        zIndex: 100, 
        backgroundColor: '#F8FAFC',
        margin: '-1rem -3rem 2rem -3rem',
        padding: '1.5rem 3rem',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid #E2E8F0',
        boxShadow: '0 4px 10px -4px rgba(0,0,0,0.05)'
      }}>
        <div>
          <h1 style={{fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-dark)', margin: 0}}>CV Editor</h1>
          <p style={{color: 'var(--text-muted)', margin: 0, marginTop: '0.25rem'}}>Manage your Curriculum Vitae data directly synced to your website.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            type="button" 
            onClick={handleAutoTranslate} 
            disabled={isAutoTranslating}
            className="btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem' }}
          >
            {isAutoTranslating ? 'Translating...' : (
              <>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path></svg>
                Auto-Translate Arabic
              </>
            )}
          </button>
          
          <button type="submit" className="btn-primary" disabled={isSaving} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}>
            {isSaving ? (
              <>
                <Spinner size={18} />
                Saving...
              </>
            ) : 'Save CV Profile'}
          </button>
        </div>
      </div>

      {message && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 1000,
          padding: '1rem 1.5rem', 
          backgroundColor: message.includes('Error') ? '#FEE2E2' : '#DCFCE7',
          color: message.includes('Error') ? '#991B1B' : '#166534',
          borderRadius: '8px',
          fontWeight: '600',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
          animation: 'slideUp 0.3s ease-out',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          {!message.includes('Error') && !message.includes('Translating') ? (
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          ) : message.includes('Translating') ? (
            <Spinner size={20} />
          ) : null}
          {message}
        </div>
      )}

      <div className={styles.tabsContainer}>
        <button type="button" onClick={() => setActiveTab('basic')} className={activeTab === 'basic' ? styles.tabActive : styles.tabInactive}>Basic Info</button>
        <button type="button" onClick={() => setActiveTab('experience')} className={activeTab === 'experience' ? styles.tabActive : styles.tabInactive}>Experience & Education</button>
        <button type="button" onClick={() => setActiveTab('skills')} className={activeTab === 'skills' ? styles.tabActive : styles.tabInactive}>Skills & Languages</button>
        <button type="button" onClick={() => setActiveTab('media')} className={activeTab === 'media' ? styles.tabActive : styles.tabInactive}>PDF Resume</button>
      </div>

      <div style={{ display: activeTab === 'basic' ? 'block' : 'none' }}>
        <BasicInfoEditor 
          basicInfo={basicInfo} setBasicInfo={setBasicInfo} 
          basicInfoAr={basicInfoAr} setBasicInfoAr={setBasicInfoAr} 
          summary={summary} setSummary={setSummary} 
          summaryAr={summaryAr} setSummaryAr={setSummaryAr} 
          styles={styles} 
        />
      </div>

      <div style={{ display: activeTab === 'experience' ? 'block' : 'none' }}>
        <ExperienceEditor experiences={experiences} setExperiences={setExperiences} styles={styles} />
        <EducationEditor education={education} setEducation={setEducation} styles={styles} />
      </div>

      <div style={{ display: activeTab === 'skills' ? 'block' : 'none' }}>
        <SkillsTextEditor 
          coreCompetencies={coreCompetencies} setCoreCompetencies={setCoreCompetencies}
          coreCompetenciesAr={coreCompetenciesAr} setCoreCompetenciesAr={setCoreCompetenciesAr}
          licensure={licensure} setLicensure={setLicensure}
          licensureAr={licensureAr} setLicensureAr={setLicensureAr}
          clinicalSkills={clinicalSkills} setClinicalSkills={setClinicalSkills}
          clinicalSkillsAr={clinicalSkillsAr} setClinicalSkillsAr={setClinicalSkillsAr}
          courses={courses} setCourses={setCourses}
          coursesAr={coursesAr} setCoursesAr={setCoursesAr}
          languages={languages} setLanguages={setLanguages}
          languagesAr={languagesAr} setLanguagesAr={setLanguagesAr}
          references={references} setReferences={setReferences}
          referencesAr={referencesAr} setReferencesAr={setReferencesAr}
          styles={styles}
        />
      </div>

      <div style={{ display: activeTab === 'media' ? 'block' : 'none' }}>
        <PdfUploadSection 
          pdfUrl={pdfUrl} 
          setPdfUrl={setPdfUrl}
          pdfUrlAr={pdfUrlAr} 
          setPdfUrlAr={setPdfUrlAr}
          styles={styles} 
        />
      </div>
    </form>
  );
}

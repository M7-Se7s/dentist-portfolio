"use client";

import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import styles from '../../admin.module.css';

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

  // Fetch existing data
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
    
    // Auto resource type for non-image files like PDFs
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

  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo(prev => ({ ...prev, [name]: value }));
  };

  // Experience Handlers
  const addExperience = () => {
    setExperiences([{ id: Date.now(), role: '', clinic: '', period: '', responsibilities: '' }, ...experiences]);
  };
  const updateExperience = (id, field, value) => {
    setExperiences(experiences.map(exp => exp.id === id ? { ...exp, [field]: value } : exp));
  };
  const removeExperience = (id) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
  };

  // Education Handlers
  const addEducation = () => {
    setEducation([...education, { degree: '', institution: '', year: '' }]);
  };
  const updateEducation = (index, field, value) => {
    const newEdu = [...education];
    newEdu[index][field] = value;
    setEducation(newEdu);
  };
  const removeEducation = (index) => {
    setEducation(education.filter((_, i) => i !== index));
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
        
        {/* PDF Upload */}
        <div className={styles.formSection}>
          <div className={styles.formSectionTitle}>Downloadable PDF</div>
          <div className={styles.formGroup}>
            <label>Upload Static PDF (Optional)</label>
            <p style={{fontSize: '0.85rem', color: '#64748B', marginBottom: '0.5rem'}}>Upload the beautifully designed PDF file you want users to download when they click "Download PDF".</p>
            <input 
              type="file" 
              accept="application/pdf"
              onChange={(e) => setPdfFile(e.target.files[0])}
              style={{padding: '0.5rem', border: '1px solid #CBD5E1', borderRadius: '6px', width: '100%'}}
            />
            {pdfUrl && (
              <div style={{marginTop: '0.5rem'}}>
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer" style={{color: 'var(--secondary-color)', fontSize: '0.9rem', fontWeight: '500'}}>View Current PDF</a>
                <button type="button" onClick={() => setPdfUrl('')} style={{marginLeft: '1rem', color: '#EF4444', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500'}}>Remove PDF</button>
              </div>
            )}
          </div>
        </div>

        {/* Basic Information */}
        <div className={styles.formSection}>
          <div className={styles.formSectionTitle}>Basic Profile</div>
          
          <div className={styles.splitImages}>
            <div className={styles.formGroup}>
              <label>Full Name *</label>
              <input type="text" name="name" value={basicInfo.name} onChange={handleBasicInfoChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>Professional Title *</label>
              <input type="text" name="title" value={basicInfo.title} onChange={handleBasicInfoChange} required />
            </div>
          </div>

          <div className={styles.splitImages}>
            <div className={styles.formGroup}>
              <label>Email Address</label>
              <input type="email" name="email" value={basicInfo.email} onChange={handleBasicInfoChange} />
            </div>
            <div className={styles.formGroup}>
              <label>Phone Number</label>
              <input type="text" name="phone" value={basicInfo.phone} onChange={handleBasicInfoChange} />
            </div>
          </div>

          <div className={styles.splitImages}>
            <div className={styles.formGroup}>
              <label>Location</label>
              <input type="text" name="location" value={basicInfo.location} onChange={handleBasicInfoChange} placeholder="e.g. Giza, Egypt" />
            </div>
            <div className={styles.formGroup}>
              <label>LinkedIn URL</label>
              <input type="url" name="linkedin" value={basicInfo.linkedin} onChange={handleBasicInfoChange} placeholder="https://linkedin.com/in/..." />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Professional Summary</label>
            <textarea rows="4" value={summary} onChange={(e) => setSummary(e.target.value)}></textarea>
          </div>
        </div>

        {/* Competencies & Licensure */}
        <div className={styles.formSection}>
          <div className={styles.splitImages}>
            <div className={styles.formGroup}>
              <label>Core Competencies (One per line)</label>
              <textarea rows="6" value={coreCompetencies} onChange={(e) => setCoreCompetencies(e.target.value)} placeholder="Comprehensive Treatment Planning\nEndodontics\nOral Surgery..."></textarea>
            </div>
            <div className={styles.formGroup}>
              <label>Professional Licensure (One per line)</label>
              <textarea rows="6" value={licensure} onChange={(e) => setLicensure(e.target.value)} placeholder="Saudi Prometric Examination — Passed\nSCFHS — Professionally Classified"></textarea>
            </div>
          </div>
        </div>

        {/* Education */}
        <div className={styles.formSection}>
          <div className={styles.formSectionTitle} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <span>Education</span>
            <button type="button" onClick={addEducation} className="btn-secondary" style={{fontSize: '0.85rem', padding: '0.4rem 0.8rem'}}>+ Add Education</button>
          </div>
          
          {education.map((edu, index) => (
            <div key={index} style={{border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', position: 'relative'}}>
              <button type="button" onClick={() => removeEducation(index)} style={{position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer'}}>Remove</button>
              <div className={styles.splitImages}>
                <div className={styles.formGroup}><label>Degree</label><input type="text" value={edu.degree} onChange={(e) => updateEducation(index, 'degree', e.target.value)} placeholder="Bachelor of Dental Surgery (BDS)" /></div>
                <div className={styles.formGroup}><label>Institution</label><input type="text" value={edu.institution} onChange={(e) => updateEducation(index, 'institution', e.target.value)} placeholder="Al-Azhar University" /></div>
              </div>
              <div className={styles.formGroup} style={{width: '50%'}}><label>Year/Status</label><input type="text" value={edu.year} onChange={(e) => updateEducation(index, 'year', e.target.value)} placeholder="Graduated: 2023" /></div>
            </div>
          ))}
        </div>

        {/* Experience */}
        <div className={styles.formSection}>
          <div className={styles.formSectionTitle} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <span>Clinical Experience</span>
            <button type="button" onClick={addExperience} className="btn-secondary" style={{fontSize: '0.85rem', padding: '0.4rem 0.8rem'}}>+ Add Experience</button>
          </div>
          
          {experiences.map((exp, index) => (
            <div key={exp.id || index} style={{border: '1px solid var(--border-color)', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', position: 'relative'}}>
              <button type="button" onClick={() => removeExperience(exp.id)} style={{position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer'}}>Remove</button>
              
              <div className={styles.splitImages}>
                <div className={styles.formGroup}><label>Role</label><input type="text" value={exp.role} onChange={(e) => updateExperience(exp.id, 'role', e.target.value)} placeholder="General Dentist" /></div>
                <div className={styles.formGroup}><label>Clinic</label><input type="text" value={exp.clinic} onChange={(e) => updateExperience(exp.id, 'clinic', e.target.value)} /></div>
              </div>
              <div className={styles.formGroup} style={{width: '50%'}}><label>Period</label><input type="text" value={exp.period} onChange={(e) => updateExperience(exp.id, 'period', e.target.value)} placeholder="October 2023 – July 2024" /></div>
              <div className={styles.formGroup}>
                <label>Responsibilities (One per line)</label>
                <textarea rows="4" value={exp.responsibilities} onChange={(e) => updateExperience(exp.id, 'responsibilities', e.target.value)} placeholder="Restorative dentistry.\nRoot canal treatment."></textarea>
              </div>
            </div>
          ))}
        </div>

        {/* Clinical Skills */}
        <div className={styles.formSection}>
          <div className={styles.formSectionTitle}>Clinical Skills</div>
          <p style={{fontSize: '0.85rem', color: '#64748B', marginBottom: '1rem'}}>
            Use Markdown-like syntax. Use <strong>**Bold**</strong> for categories, and start new lines for skills.
            <br/>Example:
            <br/>**Endodontics**
            <br/>Anterior & Posterior RCT
            <br/>**Oral Surgery**
            <br/>Simple Extractions
          </p>
          <div className={styles.formGroup}>
            <textarea rows="10" value={clinicalSkills} onChange={(e) => setClinicalSkills(e.target.value)}></textarea>
          </div>
        </div>

        {/* Courses, Languages, References */}
        <div className={styles.formSection}>
          <div className={styles.splitImages}>
            <div className={styles.formGroup}>
              <label>Professional Courses (One per line)</label>
              <textarea rows="4" value={courses} onChange={(e) => setCourses(e.target.value)}></textarea>
            </div>
            <div className={styles.formGroup}>
              <label>Languages (One per line)</label>
              <textarea rows="4" value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder="Arabic: Native\nEnglish: Intermediate"></textarea>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>References</label>
            <input type="text" value={references} onChange={(e) => setReferences(e.target.value)} placeholder="Available upon request." />
          </div>
        </div>

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

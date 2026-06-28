"use client";

import { useState } from 'react';
import styles from '../../admin.module.css';

export default function CVEditorPage() {
  const [basicInfo, setBasicInfo] = useState({
    name: 'Dr. Mohamed Shaaban',
    title: 'Senior Implantologist & Clinical Specialist',
    email: 'contact@drshaaban.com',
    phone: '+1 (555) 123-4567',
    bio: 'Dedicated dental professional with over 10 years of experience in complex oral surgery and full arch rehabilitations. Passionate about digital dentistry and minimally invasive procedures.'
  });

  const [experiences, setExperiences] = useState([
    {
      id: 1,
      role: 'Senior Implantologist',
      clinic: 'Metropolitan Dental Group',
      location: 'New York, NY',
      startDate: '2020-01',
      endDate: '',
      current: true,
      description: 'Led a team of 4 clinical associates. Implemented new digital workflows that reduced patient chair time by 15%.'
    },
    {
      id: 2,
      role: 'Associate Dentist',
      clinic: 'Premier Smiles Care',
      location: 'Boston, MA',
      startDate: '2016-06',
      endDate: '2019-12',
      current: false,
      description: 'Handled complex restorative cases and full mouth rehabilitations. Mentored junior staff.'
    }
  ]);

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    // Mock save delay
    setTimeout(() => {
      setIsSaving(false);
      alert('CV details saved successfully (mock)!');
    }, 1000);
  };

  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo(prev => ({ ...prev, [name]: value }));
  };

  const removeExperience = (id) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
  };

  return (
    <div className="animate-slideUp stagger-1">
      <div className={styles.caseManagementHeader} style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-dark)'}}>CV & Profile Editor</h1>
          <p style={{color: 'var(--text-muted)'}}>Update your professional background, experience, and credentials.</p>
        </div>
      </div>

      <form onSubmit={handleSave}>
        {/* Basic Information */}
        <div className={styles.formSection}>
          <div className={styles.formSectionTitle}>Basic Profile</div>
          
          <div className={styles.splitImages}>
            <div className={styles.formGroup}>
              <label>Full Name *</label>
              <input 
                type="text" 
                name="name"
                value={basicInfo.name} 
                onChange={handleBasicInfoChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Professional Title *</label>
              <input 
                type="text" 
                name="title"
                value={basicInfo.title} 
                onChange={handleBasicInfoChange}
                required
              />
            </div>
          </div>

          <div className={styles.splitImages}>
            <div className={styles.formGroup}>
              <label>Email Address</label>
              <input 
                type="email" 
                name="email"
                value={basicInfo.email} 
                onChange={handleBasicInfoChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Phone Number</label>
              <input 
                type="text" 
                name="phone"
                value={basicInfo.phone} 
                onChange={handleBasicInfoChange}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Professional Summary</label>
            <textarea 
              name="bio"
              rows="4" 
              value={basicInfo.bio} 
              onChange={handleBasicInfoChange}
            ></textarea>
          </div>
        </div>

        {/* Clinical Experience */}
        <div className={styles.formSection}>
          <div className={styles.formSectionTitle} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <span>Clinical Experience</span>
            <button type="button" className="btn-secondary" style={{fontSize: '0.85rem', padding: '0.4rem 0.8rem'}}>
              + Add Experience
            </button>
          </div>
          
          {experiences.map((exp, index) => (
            <div key={exp.id} style={{
              border: '1px solid var(--border-color)', 
              padding: '1.5rem', 
              borderRadius: '8px',
              marginBottom: '1.5rem',
              position: 'relative'
            }}>
              <button 
                type="button" 
                onClick={() => removeExperience(exp.id)}
                style={{
                  position: 'absolute', top: '1rem', right: '1rem', 
                  background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer'
                }}
                title="Remove Experience"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>

              <div className={styles.splitImages}>
                <div className={styles.formGroup}>
                  <label>Role / Position</label>
                  <input type="text" value={exp.role} readOnly />
                </div>
                <div className={styles.formGroup}>
                  <label>Clinic / Hospital</label>
                  <input type="text" value={exp.clinic} readOnly />
                </div>
              </div>
              
              <div className={styles.splitImages}>
                <div className={styles.formGroup}>
                  <label>Start Date</label>
                  <input type="month" value={exp.startDate} readOnly />
                </div>
                <div className={styles.formGroup}>
                  <label>End Date</label>
                  <input type="month" value={exp.endDate} readOnly disabled={exp.current} />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Key Responsibilities & Achievements</label>
                <textarea rows="3" value={exp.description} readOnly></textarea>
              </div>
            </div>
          ))}
        </div>

        {/* Sticky Action Bar */}
        <div className={styles.stickyActionBar}>
          <button type="button" className="btn-secondary">Discard Changes</button>
          <button type="submit" className="btn-primary" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save CV Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}

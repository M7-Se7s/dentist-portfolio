import AccordionSection from './AccordionSection';

export default function ExperienceEditor({ experiences, setExperiences, styles }) {
  const addExperience = () => {
    setExperiences([{ id: Date.now(), role: '', roleAr: '', clinic: '', clinicAr: '', period: '', periodAr: '', responsibilities: '', responsibilitiesAr: '' }, ...experiences]);
  };
  
  const updateExperience = (id, field, value) => {
    setExperiences(experiences.map(exp => exp.id === id ? { ...exp, [field]: value } : exp));
  };
  
  const removeExperience = (id) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
  };

  const updateExperienceFields = (id, updates) => {
    setExperiences(experiences.map(exp => exp.id === id ? { ...exp, ...updates } : exp));
  };

  const icon = <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>;

  return (
    <AccordionSection title="Clinical Experience" icon={icon} defaultOpen={false} styles={styles}>
      <button type="button" onClick={addExperience} className={styles.btnDashed} style={{ marginBottom: '1.5rem' }}>
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
        Add New Experience
      </button>
      
      {experiences.map((exp, index) => (
        <div key={exp.id || index} className={styles.cvSubCard}>
          <button type="button" onClick={() => removeExperience(exp.id)} className={styles.iconButtonRemove} title="Remove Experience">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
          
          <div className={styles.splitImages}>
            <div className={styles.formGroup}><label>Role (EN)</label><input type="text" value={exp.role || ''} onChange={(e) => updateExperience(exp.id, 'role', e.target.value)} placeholder="General Dentist" /></div>
            <div className={styles.formGroup}><label>Role (AR)</label><input type="text" value={exp.roleAr || ''} onChange={(e) => updateExperience(exp.id, 'roleAr', e.target.value)} dir="rtl" style={{ fontFamily: 'var(--font-arabic)' }} /></div>
          </div>
          <div className={styles.splitImages}>
            <div className={styles.formGroup}><label>Clinic (EN)</label><input type="text" value={exp.clinic || ''} onChange={(e) => updateExperience(exp.id, 'clinic', e.target.value)} /></div>
            <div className={styles.formGroup}><label>Clinic (AR)</label><input type="text" value={exp.clinicAr || ''} onChange={(e) => updateExperience(exp.id, 'clinicAr', e.target.value)} dir="rtl" style={{ fontFamily: 'var(--font-arabic)' }} /></div>
          </div>
          <div className={styles.splitImages}>
            <div className={styles.formGroup}><label>Period (EN)</label><input type="text" value={exp.period || ''} onChange={(e) => updateExperience(exp.id, 'period', e.target.value)} placeholder="October 2023 – July 2024" /></div>
            <div className={styles.formGroup}><label>Period (AR)</label><input type="text" value={exp.periodAr || ''} onChange={(e) => updateExperience(exp.id, 'periodAr', e.target.value)} dir="rtl" style={{ fontFamily: 'var(--font-arabic)' }} /></div>
          </div>
          <DynamicResponsibilitiesList exp={exp} updateExperienceFields={updateExperienceFields} styles={styles} />
        </div>
      ))}
    </AccordionSection>
  );
}

const DynamicResponsibilitiesList = ({ exp, updateExperienceFields, styles }) => {
  const itemsEN = exp.responsibilities ? exp.responsibilities.split('\n').filter(s => s.trim() !== '') : [];
  const itemsAR = exp.responsibilitiesAr ? exp.responsibilitiesAr.split('\n').filter(s => s.trim() !== '') : [];

  const maxLen = Math.max(itemsEN.length, itemsAR.length);
  const safeEN = Array.from({ length: maxLen }, (_, i) => itemsEN[i] || '');
  const safeAR = Array.from({ length: maxLen }, (_, i) => itemsAR[i] || '');

  const handleAdd = () => {
    updateExperienceFields(exp.id, {
      responsibilities: [...safeEN, ''].join('\n'),
      responsibilitiesAr: [...safeAR, ''].join('\n')
    });
  };

  const handleRemove = (index) => {
    const newEN = [...safeEN];
    newEN.splice(index, 1);
    const newAR = [...safeAR];
    newAR.splice(index, 1);

    updateExperienceFields(exp.id, {
      responsibilities: newEN.join('\n'),
      responsibilitiesAr: newAR.join('\n')
    });
  };

  const handleChangeEN = (index, value) => {
    const newEN = [...safeEN];
    newEN[index] = value;
    updateExperienceFields(exp.id, { responsibilities: newEN.join('\n') });
  };

  const handleChangeAR = (index, value) => {
    const newAR = [...safeAR];
    newAR[index] = value;
    updateExperienceFields(exp.id, { responsibilitiesAr: newAR.join('\n') });
  };

  return (
    <div style={{ marginTop: '1rem', borderTop: '1px solid #E2E8F0', paddingTop: '1rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ fontWeight: '600', color: 'var(--text-dark)', marginBottom: 0 }}>Responsibilities (EN) / (AR)</label>
      </div>
      
      {safeEN.length === 0 && (
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '1rem' }}>No responsibilities added yet. Click "+ Add Responsibility" below.</p>
      )}

      {safeEN.map((_, index) => (
        <div key={index} style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem', alignItems: 'center', backgroundColor: '#F8FAFC', padding: '0.5rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <div style={{ flex: 1 }}>
            <input type="text" value={safeEN[index] || ''} onChange={(e) => handleChangeEN(index, e.target.value)} placeholder="Responsibility in English" style={{ width: '100%', padding: '0.5rem', border: '1px solid #CBD5E1', borderRadius: '4px' }} />
          </div>
          <div style={{ flex: 1 }}>
            <input type="text" value={safeAR[index] || ''} onChange={(e) => handleChangeAR(index, e.target.value)} dir="rtl" placeholder="المسؤولية بالعربية" style={{ fontFamily: 'var(--font-arabic)', width: '100%', padding: '0.5rem', border: '1px solid #CBD5E1', borderRadius: '4px' }} />
          </div>
          <button type="button" onClick={() => handleRemove(index)} style={{ padding: '0.25rem', background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }} title="Remove">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </div>
      ))}
      
      <button type="button" onClick={handleAdd} className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem', marginTop: '0.5rem' }}>+ Add Responsibility</button>
    </div>
  );
}

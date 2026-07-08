import AccordionSection from './AccordionSection';

export default function EducationEditor({ education, setEducation, styles }) {
  const addEducation = () => {
    setEducation([{ degree: '', degreeAr: '', institution: '', institutionAr: '', year: '', yearAr: '' }, ...education]);
  };
  
  const updateEducation = (index, field, value) => {
    const newEdu = [...education];
    newEdu[index][field] = value;
    setEducation(newEdu);
  };
  
  const removeEducation = (index) => {
    const newEdu = [...education];
    newEdu.splice(index, 1);
    setEducation(newEdu);
  };

  const icon = <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path></svg>;

  return (
    <AccordionSection title="Education" icon={icon} defaultOpen={false} styles={styles}>
      <button type="button" onClick={addEducation} className={styles.btnDashed} style={{ marginBottom: '1.5rem' }}>
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
        Add New Education
      </button>
      
      {education.map((edu, index) => (
        <div key={index} className={styles.cvSubCard}>
          <button type="button" onClick={() => removeEducation(index)} className={styles.iconButtonRemove} title="Remove Education">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
          <div className={styles.splitImages}>
            <div className={styles.formGroup}><label>Degree (EN)</label><input type="text" value={edu.degree || ''} onChange={(e) => updateEducation(index, 'degree', e.target.value)} placeholder="Bachelor of Dental Surgery (BDS)" /></div>
            <div className={styles.formGroup}><label>Degree (AR)</label><input type="text" value={edu.degreeAr || ''} onChange={(e) => updateEducation(index, 'degreeAr', e.target.value)} dir="rtl" style={{ fontFamily: 'var(--font-arabic)' }} /></div>
          </div>
          <div className={styles.splitImages}>
            <div className={styles.formGroup}><label>Institution (EN)</label><input type="text" value={edu.institution || ''} onChange={(e) => updateEducation(index, 'institution', e.target.value)} placeholder="Al-Azhar University" /></div>
            <div className={styles.formGroup}><label>Institution (AR)</label><input type="text" value={edu.institutionAr || ''} onChange={(e) => updateEducation(index, 'institutionAr', e.target.value)} dir="rtl" style={{ fontFamily: 'var(--font-arabic)' }} /></div>
          </div>
          <div className={styles.splitImages}>
            <div className={styles.formGroup}><label>Year/Status (EN)</label><input type="text" value={edu.year || ''} onChange={(e) => updateEducation(index, 'year', e.target.value)} placeholder="Graduated: 2023" /></div>
            <div className={styles.formGroup}><label>Year/Status (AR)</label><input type="text" value={edu.yearAr || ''} onChange={(e) => updateEducation(index, 'yearAr', e.target.value)} dir="rtl" style={{ fontFamily: 'var(--font-arabic)' }} /></div>
          </div>
        </div>
      ))}
    </AccordionSection>
  );
}

export default function EducationEditor({ education, setEducation, styles }) {
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
  );
}

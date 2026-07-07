export default function ExperienceEditor({ experiences, setExperiences, styles }) {
  const addExperience = () => {
    setExperiences([{ id: Date.now(), role: '', clinic: '', period: '', responsibilities: '' }, ...experiences]);
  };
  
  const updateExperience = (id, field, value) => {
    setExperiences(experiences.map(exp => exp.id === id ? { ...exp, [field]: value } : exp));
  };
  
  const removeExperience = (id) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
  };

  return (
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
  );
}

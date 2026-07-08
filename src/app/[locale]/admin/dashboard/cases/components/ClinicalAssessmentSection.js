import { useState } from 'react';

export default function ClinicalAssessmentSection({
  chiefComplaint, setChiefComplaint,
  chiefComplaintAr, setChiefComplaintAr,
  diagnosis, setDiagnosis,
  diagnosisAr, setDiagnosisAr,
  treatmentPerformed, setTreatmentPerformed,
  treatmentPerformedAr, setTreatmentPerformedAr,
  techniques, setTechniques,
  techniquesAr, setTechniquesAr,
  materials, setMaterials,
  styles
}) {
  const [materialInput, setMaterialInput] = useState('');


  const handleAddMaterial = (e) => {
    e.preventDefault();
    if (materialInput.trim() && !materials.includes(materialInput.trim())) {
      setMaterials([...materials, materialInput.trim()]);
      setMaterialInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddMaterial(e);
    }
  };

  const removeMaterial = (materialToRemove) => {
    setMaterials(materials.filter(m => m !== materialToRemove));
  };

  const renderField = (label, enValue, enSetter, arValue, arSetter, fieldKey, rows = 2, placeholder = '') => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
      <div className={styles.formGroup} style={{ marginBottom: 0 }}>
        <label>{label} (EN)</label>
        <textarea 
          rows={rows} 
          value={enValue || ''} 
          onChange={(e) => enSetter(e.target.value)}
          placeholder={placeholder}
          className={styles.treatmentTextArea}
        ></textarea>
      </div>
      <div className={styles.formGroup} style={{ marginBottom: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label>{label} (AR)</label>
        </div>
        <textarea 
          rows={rows} 
          value={arValue || ''} 
          onChange={(e) => arSetter(e.target.value)}
          placeholder={`Arabic ${label}`}
          dir="rtl"
          className={styles.treatmentTextArea}
          style={{ fontFamily: 'var(--font-arabic)' }}
        ></textarea>
      </div>
    </div>
  );

  return (
    <div className={styles.formSection}>
      <div className={styles.formSectionTitle}>Clinical Assessment</div>
      
      {renderField('Chief Complaint', chiefComplaint, setChiefComplaint, chiefComplaintAr, setChiefComplaintAr, 'chiefComplaint', 2, 'e.g., Patient presented with pain...')}
      {renderField('Diagnosis', diagnosis, setDiagnosis, diagnosisAr, setDiagnosisAr, 'diagnosis', 2, 'e.g., Irreversible pulpitis on #14...')}
      {renderField('Treatment Performed', treatmentPerformed, setTreatmentPerformed, treatmentPerformedAr, setTreatmentPerformedAr, 'treatmentPerformed', 3, 'e.g., Root canal treatment and...')}
      {renderField('Techniques / Workflow', techniques, setTechniques, techniquesAr, setTechniquesAr, 'techniques', 3, 'e.g., Rubber dam isolation...')}

      <div className={styles.formGroup}>
        <label>Materials Used</label>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'stretch' }}>
          <input 
            type="text" 
            value={materialInput}
            onChange={(e) => setMaterialInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type material and press Enter"
            style={{ flex: 1, padding: '0.85rem 1rem', border: '1px solid var(--border-color)', borderRadius: '8px', fontFamily: 'var(--font-primary)', margin: 0 }}
          />
          <button 
            type="button" 
            onClick={handleAddMaterial}
            className="btn-secondary"
            style={{ height: '100%', margin: 0 }}
          >
            Add
          </button>
        </div>
        <div className={styles.categoryChips} style={{ marginTop: '0.5rem' }}>
          {materials.length === 0 ? (
            <span className={styles.categoryPlaceholder}>No materials added...</span>
          ) : (
            materials.map(material => (
              <span key={material} className={styles.categoryChip}>
                {material}
                <svg 
                  onClick={() => removeMaterial(material)}
                  width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" 
                  style={{ cursor: 'pointer' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

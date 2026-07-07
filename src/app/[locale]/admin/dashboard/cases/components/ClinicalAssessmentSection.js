import { useState } from 'react';

export default function ClinicalAssessmentSection({
  chiefComplaint, setChiefComplaint,
  diagnosis, setDiagnosis,
  treatmentPerformed, setTreatmentPerformed,
  techniques, setTechniques,
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

  return (
    <div className={styles.formSection}>
      <div className={styles.formSectionTitle}>Clinical Assessment</div>
      
      <div className={styles.formGroup}>
        <label>Chief Complaint</label>
        <textarea 
          rows="2" 
          value={chiefComplaint} 
          onChange={(e) => setChiefComplaint(e.target.value)}
          placeholder="e.g., Patient presented with pain in upper right quadrant..."
          className={styles.treatmentTextArea}
        ></textarea>
      </div>

      <div className={styles.formGroup}>
        <label>Diagnosis</label>
        <textarea 
          rows="2" 
          value={diagnosis} 
          onChange={(e) => setDiagnosis(e.target.value)}
          placeholder="e.g., Irreversible pulpitis on #14..."
          className={styles.treatmentTextArea}
        ></textarea>
      </div>

      <div className={styles.formGroup}>
        <label>Treatment Performed</label>
        <textarea 
          rows="3" 
          value={treatmentPerformed} 
          onChange={(e) => setTreatmentPerformed(e.target.value)}
          placeholder="e.g., Root canal treatment and composite restoration..."
          className={styles.treatmentTextArea}
        ></textarea>
      </div>

      <div className={styles.formGroup}>
        <label>Techniques / Workflow</label>
        <textarea 
          rows="3" 
          value={techniques} 
          onChange={(e) => setTechniques(e.target.value)}
          placeholder="e.g., Rubber dam isolation, warm vertical compaction..."
          className={styles.treatmentTextArea}
        ></textarea>
      </div>

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

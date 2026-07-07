import React from 'react';

export default function TreatmentDetailsSection({
  treatmentDetails, setTreatmentDetails,
  treatmentSteps, setTreatmentSteps,
  styles
}) {
  
  const handleAddStep = () => {
    setTreatmentSteps(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), title: '', description: '', files: [], previews: [], existingImages: [] }]);
  };

  const handleRemoveStep = (id) => {
    setTreatmentSteps(prev => prev.filter(step => step.id !== id));
  };

  const handleStepChange = (id, field, value) => {
    setTreatmentSteps(prev => prev.map(step => step.id === id ? { ...step, [field]: value } : step));
  };

  const handleStepImageChange = (id, e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;
    
    setTreatmentSteps(prev => prev.map(step => {
      if (step.id === id) {
        const newPreviews = files.map(file => URL.createObjectURL(file));
        return {
          ...step,
          files: [...(step.files || []), ...files],
          previews: [...(step.previews || []), ...newPreviews]
        };
      }
      return step;
    }));
  };

  const handleRemoveStepNewImage = (stepId, indexToRemove) => {
    setTreatmentSteps(prev => prev.map(step => {
      if (step.id === stepId) {
        return {
          ...step,
          files: step.files.filter((_, i) => i !== indexToRemove),
          previews: step.previews.filter((_, i) => i !== indexToRemove)
        };
      }
      return step;
    }));
  };

  const handleRemoveStepExistingImage = (stepId, indexToRemove) => {
    setTreatmentSteps(prev => prev.map(step => {
      if (step.id === stepId) {
        return {
          ...step,
          existingImages: step.existingImages.filter((_, i) => i !== indexToRemove)
        };
      }
      return step;
    }));
  };

  return (
    <div className={styles.formSection}>
      <div className={styles.formSectionTitle}>Treatment Details</div>
      <div className={styles.formGroup}>
        <label>Full Case Report (Optional)</label>
        <div className={styles.quillWrapper}>
          <textarea 
            rows="5"
            value={treatmentDetails} 
            onChange={(e) => setTreatmentDetails(e.target.value)} 
            placeholder="Write the full clinical details, materials used, steps taken..."
            className={styles.treatmentTextArea}
          />
        </div>
      </div>
      
      <div className={styles.treatmentStepsContainer}>
        <div className={styles.treatmentStepsHeader}>
          <label>Treatment Process Steps</label>
          <button type="button" onClick={handleAddStep} className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
            + Add Step
          </button>
        </div>
        
        {treatmentSteps.map((step, index) => (
          <div key={step.id} className={styles.stepContainer}>
            <div className={styles.stepHeader}>
              <div className={styles.stepTitle}>Step {index + 1}</div>
              <button type="button" className={styles.removeStepBtn} onClick={() => handleRemoveStep(step.id)}>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                Remove
              </button>
            </div>
            
            <div className={styles.formGroup}>
              <label>Step Title *</label>
              <input 
                type="text" 
                value={step.title} 
                onChange={(e) => handleStepChange(step.id, 'title', e.target.value)} 
                placeholder="e.g. Tooth Preparation"
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Description</label>
              <textarea 
                rows="3" 
                value={step.description} 
                onChange={(e) => handleStepChange(step.id, 'description', e.target.value)} 
                placeholder="Describe what was done in this step..."
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Step Images</label>
              <div className={styles.imageDropzoneStep}>
                <input type="file" accept="image/*" multiple onChange={(e) => handleStepImageChange(step.id, e)} className={styles.hiddenFileInput} />
                <div className={styles.dropzoneText}>
                  + Add Step Images
                </div>
              </div>
              
              {(step.existingImages?.length > 0 || step.previews?.length > 0) && (
                <div className={styles.stepImageGrid}>
                  {/* Existing Images */}
                  {step.existingImages?.map((url, idx) => (
                    <div key={`existing-${idx}`} className={styles.stepImageWrapper}>
                      <img src={url} alt="Existing step image" className={styles.stepImagePreview} />
                      <button 
                        type="button" 
                        onClick={() => handleRemoveStepExistingImage(step.id, idx)}
                        className={styles.removeStepImageBtn}
                      >
                        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                  ))}
                  
                  {/* New Previews */}
                  {step.previews?.map((preview, idx) => (
                    <div key={`new-${idx}`} className={styles.stepImageWrapper} style={{ border: '1px solid var(--primary-light)' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, border: '2px solid var(--primary-color)', borderRadius: '8px', pointerEvents: 'none', zIndex: 1 }} />
                      <img src={preview} alt="New step preview" className={styles.stepImagePreview} />
                      <button 
                        type="button" 
                        onClick={() => handleRemoveStepNewImage(step.id, idx)}
                        className={styles.removeStepImageBtn}
                      >
                        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {treatmentSteps.length === 0 && (
          <div className={styles.emptyStepsState}>
            No process steps added. Click &quot;+ Add Step&quot; to document the treatment sequence.
          </div>
        )}
      </div>
    </div>
  );
}

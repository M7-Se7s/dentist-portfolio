import { useState, useRef, useEffect } from 'react';

export default function BasicInfoSection({
  title, setTitle,
  categories, setCategories,
  description, setDescription,
  featured, setFeatured,
  patientAge, setPatientAge,
  patientGender, setPatientGender,
  styles
}) {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.formSection}>
      <div className={styles.formSectionTitle}>Basic Information</div>
      <div className={styles.formGroup}>
        <label>Case Title *</label>
        <input 
          autoFocus
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="e.g. Anterior Composite Restoration"
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label>Categories *</label>
        <div ref={categoryDropdownRef} className={styles.categoryDropdownWrapper}>
          <div 
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className={`${styles.categorySelectBox} ${isCategoryOpen ? styles.categorySelectBoxOpen : styles.categorySelectBoxClosed}`}
          >
            <div className={styles.categoryChips}>
              {categories.length === 0 ? (
                <span className={styles.categoryPlaceholder}>Select categories...</span>
              ) : (
                categories.map(cat => (
                  <span key={cat} className={styles.categoryChip}>
                    {cat}
                    <svg 
                      onClick={(e) => {
                        e.stopPropagation();
                        setCategories(categories.filter(c => c !== cat));
                      }}
                      width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" 
                      style={{ cursor: 'pointer' }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </span>
                ))
              )}
            </div>
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className={`${styles.categoryIcon} ${isCategoryOpen ? styles.categoryIconOpen : ''}`}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
          
          {isCategoryOpen && (
            <div className={styles.categoryMenu}>
              {['General', 'Esthetic', 'Composite', 'Prosthodontics', 'Endodontics', 'Surgery', 'Orthodontics', 'Periodontics', 'Pediatric', 'Posterior Restorations'].map((cat, index) => {
                const isSelected = categories.includes(cat);
                return (
                  <div 
                    key={cat}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isSelected) {
                        setCategories(categories.filter(c => c !== cat));
                      } else {
                        setCategories([...categories, cat]);
                      }
                    }}
                    className={`${styles.categoryItem} ${isSelected ? styles.categoryItemActive : styles.categoryItemInactive}`}
                    style={{ borderBottom: index < 9 ? '1px solid #f1f5f9' : 'none' }}
                  >
                    {cat}
                    {isSelected ? (
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                      </svg>
                    ) : (
                      <div className={styles.categoryItemUnchecked}></div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {setPatientAge && setPatientGender && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className={styles.formGroup} style={{ marginBottom: 0 }}>
            <label>Patient Age</label>
            <input 
              type="number" 
              value={patientAge} 
              onChange={(e) => setPatientAge(e.target.value)} 
              placeholder="e.g., 34"
              style={{ width: '100%', padding: '0.85rem 1rem', border: '1px solid var(--border-color)', borderRadius: '8px', fontFamily: 'var(--font-primary)' }}
            />
          </div>
          <div className={styles.formGroup} style={{ marginBottom: 0 }}>
            <label>Patient Gender</label>
            <select 
              value={patientGender} 
              onChange={(e) => setPatientGender(e.target.value)}
              className={styles.styledNativeSelect}
            >
              <option value="">Select...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      )}

      <div className={styles.formGroup}>
        <label>Short Description (Displays on cards)</label>
        <textarea 
          rows="2" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief overview of the case..."
          style={{ width: '100%', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', fontFamily: 'var(--font-primary)', resize: 'vertical' }}
        ></textarea>
      </div>
      
      <div className={styles.formGroup} style={{marginTop: '1.5rem'}}>
        <label>Featured Case</label>
        <div className={styles.toggleWrapper}>
          <label className={styles.toggleSwitch}>
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
            <span className={styles.toggleSlider}></span>
          </label>
          <span style={{color: 'var(--text-muted)'}}>Show this case on the homepage</span>
        </div>
      </div>
    </div>
  );
}

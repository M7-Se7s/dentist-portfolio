import { useState, useRef, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Link } from '@/i18n/routing';

export default function BasicInfoSection({
  caseType = 'detailed',
  title, setTitle,
  titleAr, setTitleAr,
  categories, setCategories,
  description, setDescription,
  descriptionAr, setDescriptionAr,
  featured, setFeatured,
  patientAge, setPatientAge,
  patientGender, setPatientGender,
  styles
}) {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryDropdownRef = useRef(null);
  const [availableCategories, setAvailableCategories] = useState([]);

  useEffect(() => {
    async function fetchCats() {
      try {
        const q = query(collection(db, "categories"), orderBy("nameEn", "asc"));
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map(doc => doc.data().nameEn);
        if (fetched.length > 0) {
          setAvailableCategories(fetched);
        } else {
          setAvailableCategories(['General', 'Esthetic', 'Composite', 'Prosthodontics', 'Endodontics', 'Surgery', 'Orthodontics', 'Periodontics', 'Pediatric', 'Posterior Restorations']);
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
        setAvailableCategories(['General', 'Esthetic', 'Composite', 'Prosthodontics', 'Endodontics', 'Surgery', 'Orthodontics', 'Periodontics', 'Pediatric', 'Posterior Restorations']);
      }
    }
    fetchCats();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (caseType === 'detailed') return;
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
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className={styles.formGroup} style={{ marginBottom: 0 }}>
          <label>Case Title (EN) *</label>
          <input 
            autoFocus
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="e.g. Anterior Composite Restoration"
            required
            style={{ width: '100%', padding: '0.85rem 1rem', border: '1px solid var(--border-color)', borderRadius: '8px', fontFamily: 'var(--font-primary)' }}
          />
        </div>
        <div className={styles.formGroup} style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label>Case Title (AR)</label>
          </div>
          <input 
            type="text" 
            value={titleAr || ''} 
            onChange={(e) => setTitleAr(e.target.value)} 
            placeholder="Arabic Title"
            dir="rtl"
            style={{ width: '100%', padding: '0.85rem 1rem', border: '1px solid var(--border-color)', borderRadius: '8px', fontFamily: 'var(--font-arabic)' }}
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label>Categories *</label>
          <Link href="/admin/dashboard/categories" style={{ fontSize: '0.8rem', color: 'var(--primary-color)', textDecoration: 'none' }}>
            Manage Categories
          </Link>
        </div>
        <div ref={categoryDropdownRef} className={styles.categoryDropdownWrapper}>
          <div 
            onClick={() => {
              if (caseType !== 'detailed') setIsCategoryOpen(!isCategoryOpen);
            }}
            className={`${styles.categorySelectBox} ${isCategoryOpen ? styles.categorySelectBoxOpen : styles.categorySelectBoxClosed}`}
            style={{ cursor: caseType === 'detailed' ? 'not-allowed' : 'pointer', backgroundColor: caseType === 'detailed' ? 'var(--bg-secondary)' : 'transparent' }}
          >
            <div className={styles.categoryChips}>
              {categories.length === 0 ? (
                <span className={styles.categoryPlaceholder}>Select categories...</span>
              ) : (
                categories.map(cat => (
                  <span key={cat} className={styles.categoryChip}>
                    {cat}
                    {caseType !== 'detailed' && (
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
                    )}
                  </span>
                ))
              )}
            </div>
            {caseType !== 'detailed' && (
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className={`${styles.categoryIcon} ${isCategoryOpen ? styles.categoryIconOpen : ''}`}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            )}
          </div>
          
          {isCategoryOpen && caseType !== 'detailed' && (
            <div className={styles.categoryMenu}>
              {availableCategories.map((cat, index) => {
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
                    style={{ borderBottom: index < availableCategories.length - 1 ? '1px solid #f1f5f9' : 'none' }}
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className={styles.formGroup} style={{ marginBottom: 0 }}>
          <label>Short Description (EN)</label>
          <textarea 
            rows="3" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief overview of the case..."
            style={{ width: '100%', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', fontFamily: 'var(--font-primary)', resize: 'vertical' }}
          ></textarea>
        </div>
        <div className={styles.formGroup} style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label>Short Description (AR)</label>
          </div>
          <textarea 
            rows="3" 
            value={descriptionAr || ''} 
            onChange={(e) => setDescriptionAr(e.target.value)}
            placeholder="Arabic Description"
            dir="rtl"
            style={{ width: '100%', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', fontFamily: 'var(--font-arabic)', resize: 'vertical' }}
          ></textarea>
        </div>
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

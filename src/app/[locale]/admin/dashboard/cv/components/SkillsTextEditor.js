const DynamicList = ({ titleEN, titleAR, itemsEN, setItemsEN, itemsAR, setItemsAR, placeholderEN, styles }) => {
  const maxLen = Math.max(itemsEN.length, itemsAR.length);
  const safeEN = Array.from({ length: maxLen }, (_, i) => itemsEN[i] || '');
  const safeAR = Array.from({ length: maxLen }, (_, i) => itemsAR[i] || '');

  const handleAdd = () => {
    setItemsEN([...safeEN, '']);
    setItemsAR([...safeAR, '']);
  };

  const handleRemove = (index) => {
    const newEN = [...safeEN];
    newEN.splice(index, 1);
    setItemsEN(newEN);

    const newAR = [...safeAR];
    newAR.splice(index, 1);
    setItemsAR(newAR);
  };

  const handleChangeEN = (index, value) => {
    const newEN = [...safeEN];
    newEN[index] = value;
    setItemsEN(newEN);
  };

  const handleChangeAR = (index, value) => {
    const newAR = [...safeAR];
    newAR[index] = value;
    setItemsAR(newAR);
  };

  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontWeight: '600', color: 'var(--text-dark)', marginBottom: 0 }}>{titleEN} / {titleAR}</label>
      </div>
      
      {safeEN.length === 0 && (
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '16px' }}>No items added yet. Click "+ Add Item".</p>
      )}

      {safeEN.map((_, index) => (
        <div key={index} className={styles.bilingualRowDynamic} style={{ marginBottom: '12px', alignItems: 'center', backgroundColor: '#F8FAFC', padding: '8px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <div style={{ flex: 1 }}>
            <input type="text" value={safeEN[index] || ''} onChange={(e) => handleChangeEN(index, e.target.value)} placeholder={placeholderEN} style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '4px', margin: 0 }} />
          </div>
          <div style={{ flex: 1 }}>
            <input type="text" value={safeAR[index] || ''} onChange={(e) => handleChangeAR(index, e.target.value)} dir="rtl" style={{ fontFamily: 'var(--font-arabic)', width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '4px', margin: 0 }} />
          </div>
          <button type="button" onClick={() => handleRemove(index)} style={{ padding: '4px', background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }} title="Remove">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </div>
      ))}
      
      <button type="button" onClick={handleAdd} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '14px', marginTop: '8px' }}>+ Add Item</button>
    </div>
  );
};

const ClinicalSkillsEditor = ({ clinicalSkills, setClinicalSkills, clinicalSkillsAr, setClinicalSkillsAr, styles }) => {
  const handleAddCategory = () => {
    setClinicalSkills([...clinicalSkills, { category: '', skills: [] }]);
    setClinicalSkillsAr([...clinicalSkillsAr, { category: '', skills: [] }]);
  };

  const handleRemoveCategory = (index) => {
    const newEN = [...clinicalSkills];
    newEN.splice(index, 1);
    setClinicalSkills(newEN);
    
    const newAR = [...clinicalSkillsAr];
    newAR.splice(index, 1);
    setClinicalSkillsAr(newAR);
  };

  const handleChangeCategoryTitle = (index, isAr, value) => {
    if (isAr) {
      const newAR = [...clinicalSkillsAr];
      newAR[index].category = value;
      setClinicalSkillsAr(newAR);
    } else {
      const newEN = [...clinicalSkills];
      newEN[index].category = value;
      setClinicalSkills(newEN);
    }
  };

  const handleAddSkill = (catIndex) => {
    const newEN = [...clinicalSkills];
    if (!newEN[catIndex].skills) newEN[catIndex].skills = [];
    newEN[catIndex].skills.push('');
    setClinicalSkills(newEN);

    const newAR = [...clinicalSkillsAr];
    if (!newAR[catIndex].skills) newAR[catIndex].skills = [];
    newAR[catIndex].skills.push('');
    setClinicalSkillsAr(newAR);
  };

  const handleRemoveSkill = (catIndex, skillIndex) => {
    const newEN = [...clinicalSkills];
    if (newEN[catIndex].skills) {
      newEN[catIndex].skills.splice(skillIndex, 1);
    }
    setClinicalSkills(newEN);

    const newAR = [...clinicalSkillsAr];
    if (newAR[catIndex].skills) {
      newAR[catIndex].skills.splice(skillIndex, 1);
    }
    setClinicalSkillsAr(newAR);
  };

  const handleChangeSkill = (catIndex, skillIndex, isAr, value) => {
    if (isAr) {
      const newAR = [...clinicalSkillsAr];
      newAR[catIndex].skills[skillIndex] = value;
      setClinicalSkillsAr(newAR);
    } else {
      const newEN = [...clinicalSkills];
      newEN[catIndex].skills[skillIndex] = value;
      setClinicalSkills(newEN);
    }
  };

  return (
    <div style={{ marginBottom: '24px' }}>
      {clinicalSkills.length === 0 && (
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '16px' }}>No categories added yet. Click "+ Add Category".</p>
      )}

      <div className={styles.cardsCarousel}>
      {clinicalSkills.map((cat, catIndex) => (
        <div key={catIndex} className={styles.cvSubCard}>
          <div className={styles.bilingualRowDynamic} style={{ marginBottom: '16px', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Category Title (EN)</label>
              <input type="text" value={cat.category || ''} onChange={(e) => handleChangeCategoryTitle(catIndex, false, e.target.value)} placeholder="e.g. Endodontics" style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '4px', fontWeight: 'bold', margin: 0 }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Category Title (AR)</label>
              <input type="text" value={clinicalSkillsAr[catIndex]?.category || ''} onChange={(e) => handleChangeCategoryTitle(catIndex, true, e.target.value)} dir="rtl" style={{ width: '100%', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '4px', fontWeight: 'bold', fontFamily: 'var(--font-arabic)', margin: 0 }} />
            </div>
            <button type="button" onClick={() => handleRemoveCategory(catIndex)} style={{ padding: '8px', background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', marginBottom: '2px' }} title="Remove Category">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
          </div>

          {/* Skills Rows */}
          <div style={{ paddingLeft: '16px', borderLeft: '2px solid #CBD5E1' }}>
            {cat.skills.map((skill, skillIndex) => (
              <div key={skillIndex} className={styles.bilingualRowDynamic} style={{ marginBottom: '8px', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <input type="text" value={skill || ''} onChange={(e) => handleChangeSkill(catIndex, skillIndex, false, e.target.value)} placeholder="Skill (EN)" style={{ width: '100%', padding: '6px', border: '1px solid #E2E8F0', borderRadius: '4px', fontSize: '14px', margin: 0 }} />
                </div>
                <div style={{ flex: 1 }}>
                  <input type="text" value={clinicalSkillsAr[catIndex]?.skills[skillIndex] || ''} onChange={(e) => handleChangeSkill(catIndex, skillIndex, true, e.target.value)} dir="rtl" placeholder="Skill (AR)" style={{ width: '100%', padding: '6px', border: '1px solid #E2E8F0', borderRadius: '4px', fontSize: '14px', fontFamily: 'var(--font-arabic)', margin: 0 }} />
                </div>
                <button type="button" onClick={() => handleRemoveSkill(catIndex, skillIndex)} style={{ padding: '4px', background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }} title="Remove Skill">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            ))}
            <button type="button" onClick={() => handleAddSkill(catIndex)} style={{ background: 'none', border: 'none', color: 'var(--secondary-color)', fontSize: '14px', cursor: 'pointer', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' }}>
              + Add Skill
            </button>
          </div>

        </div>
      ))}
      </div>

      <button type="button" onClick={handleAddCategory} className="btn-primary" style={{ padding: '8px 16px', fontSize: '14px' }}>
        + Add New Category
      </button>
    </div>
  );
};

export default function SkillsTextEditor({ 
  coreCompetencies, setCoreCompetencies,
  coreCompetenciesAr, setCoreCompetenciesAr,
  clinicalSkills, setClinicalSkills,
  clinicalSkillsAr, setClinicalSkillsAr,
  languages, setLanguages,
  languagesAr, setLanguagesAr,
  references, setReferences,
  referencesAr, setReferencesAr,
  styles 
}) {
  return (
    <>
      {/* Core Competencies */}
      <div className={styles.flatBasicInfoCard}>
        <div className={styles.flatCardHeader}>
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          <h2>Core Competencies</h2>
        </div>
        <DynamicList 
          titleEN="Core Competencies (EN)" 
          titleAR="Core Competencies (AR)" 
          itemsEN={coreCompetencies} setItemsEN={setCoreCompetencies}
          itemsAR={coreCompetenciesAr} setItemsAR={setCoreCompetenciesAr}
          placeholderEN="e.g. Comprehensive Treatment Planning"
          styles={styles}
        />
      </div>

      {/* Clinical Skills */}
      <div className={styles.flatBasicInfoCard}>
        <div className={styles.flatCardHeader}>
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
          <h2>Clinical Skills</h2>
        </div>
        <ClinicalSkillsEditor 
          clinicalSkills={clinicalSkills} setClinicalSkills={setClinicalSkills}
          clinicalSkillsAr={clinicalSkillsAr} setClinicalSkillsAr={setClinicalSkillsAr}
          styles={styles}
        />
      </div>

      {/* Languages & References */}
      <div className={styles.flatBasicInfoCard}>
        <div className={styles.flatCardHeader}>
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path></svg>
          <h2>Languages & References</h2>
        </div>
        <DynamicList 
          titleEN="Languages (EN)" 
          titleAR="Languages (AR)" 
          itemsEN={languages} setItemsEN={setLanguages}
          itemsAR={languagesAr} setItemsAR={setLanguagesAr}
          placeholderEN="e.g. English: Fluent"
          styles={styles}
        />

        <div className={styles.bilingualRow}>
          <div className={styles.formGroup}>
            <label>References (EN)</label>
            <input type="text" value={references || ''} onChange={(e) => setReferences(e.target.value)} placeholder="Available upon request." />
          </div>
          <div className={styles.formGroup}>
            <label>References (AR)</label>
            <input type="text" value={referencesAr || ''} onChange={(e) => setReferencesAr(e.target.value)} dir="rtl" style={{ fontFamily: 'var(--font-arabic)' }} />
          </div>
        </div>
      </div>
    </>
  );
}




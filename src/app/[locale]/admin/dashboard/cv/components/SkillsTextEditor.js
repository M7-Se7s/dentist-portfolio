const DynamicList = ({ titleEN, titleAR, itemsEN = [], setItemsEN, itemsAR = [], setItemsAR, styles, placeholderEN = "English text" }) => {
  const handleAdd = () => {
    setItemsEN([...itemsEN, '']);
    setItemsAR([...itemsAR, '']);
  };

  const handleRemove = (index) => {
    const newEN = [...itemsEN];
    newEN.splice(index, 1);
    setItemsEN(newEN);
    
    const newAR = [...itemsAR];
    newAR.splice(index, 1);
    setItemsAR(newAR);
  };

  const handleChangeEN = (index, value) => {
    const newEN = [...itemsEN];
    newEN[index] = value;
    setItemsEN(newEN);
  };

  const handleChangeAR = (index, value) => {
    const newAR = [...itemsAR];
    newAR[index] = value;
    setItemsAR(newAR);
  };

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ fontWeight: '600', color: 'var(--text-dark)', marginBottom: 0 }}>{titleEN} / {titleAR}</label>
      </div>
      
      {itemsEN.length === 0 && (
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No items added yet. Click "+ Add Item" below.</p>
      )}

      {itemsEN.map((_, index) => (
        <div key={index} className={styles.splitImages} style={{ alignItems: 'center', marginBottom: '0.75rem', padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', gap: '1rem' }}>
          <div className={styles.formGroup} style={{ flex: 1, marginBottom: 0 }}>
            <input type="text" value={itemsEN[index] || ''} onChange={(e) => handleChangeEN(index, e.target.value)} placeholder={placeholderEN} style={{ width: '100%', padding: '0.5rem', border: '1px solid #CBD5E1', borderRadius: '4px' }} />
          </div>
          <div className={styles.formGroup} style={{ flex: 1, marginBottom: 0 }}>
            <input type="text" value={itemsAR[index] || ''} onChange={(e) => handleChangeAR(index, e.target.value)} dir="rtl" style={{ fontFamily: 'var(--font-arabic)', width: '100%', padding: '0.5rem', border: '1px solid #CBD5E1', borderRadius: '4px' }} placeholder="النص بالعربية" />
          </div>
          <button type="button" onClick={() => handleRemove(index)} style={{ padding: '0.5rem', background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Remove Item">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </div>
      ))}

      <button type="button" onClick={handleAdd} className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem', marginTop: '0.5rem' }}>+ Add Item</button>
    </div>
  );
};

const ClinicalSkillsEditor = ({ clinicalSkills = [], setClinicalSkills, clinicalSkillsAr = [], setClinicalSkillsAr, styles }) => {
  const handleAddCategory = () => {
    setClinicalSkills([...clinicalSkills, { category: '', skills: [] }]);
    setClinicalSkillsAr([...clinicalSkillsAr, { category: '', skills: [] }]);
  };

  const handleRemoveCategory = (catIndex) => {
    const newEN = [...clinicalSkills];
    newEN.splice(catIndex, 1);
    setClinicalSkills(newEN);
    
    const newAR = [...clinicalSkillsAr];
    newAR.splice(catIndex, 1);
    setClinicalSkillsAr(newAR);
  };

  const handleChangeCategoryTitle = (catIndex, isAr, value) => {
    if (isAr) {
      const newAR = [...clinicalSkillsAr];
      newAR[catIndex].category = value;
      setClinicalSkillsAr(newAR);
    } else {
      const newEN = [...clinicalSkills];
      newEN[catIndex].category = value;
      setClinicalSkills(newEN);
    }
  };

  const handleAddSkill = (catIndex) => {
    const newEN = [...clinicalSkills];
    newEN[catIndex].skills.push('');
    setClinicalSkills(newEN);

    const newAR = [...clinicalSkillsAr];
    if (!newAR[catIndex]) newAR[catIndex] = { category: '', skills: [] };
    if (!newAR[catIndex].skills) newAR[catIndex].skills = [];
    newAR[catIndex].skills.push('');
    setClinicalSkillsAr(newAR);
  };

  const handleRemoveSkill = (catIndex, skillIndex) => {
    const newEN = [...clinicalSkills];
    newEN[catIndex].skills.splice(skillIndex, 1);
    setClinicalSkills(newEN);

    const newAR = [...clinicalSkillsAr];
    if (newAR[catIndex] && newAR[catIndex].skills) {
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
    <div style={{ marginBottom: '1.5rem' }}>
      {clinicalSkills.length === 0 && (
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '1rem' }}>No categories added yet. Click "+ Add Category".</p>
      )}

      {clinicalSkills.map((cat, catIndex) => (
        <div key={catIndex} style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#F1F5F9', borderRadius: '8px', border: '1px solid #CBD5E1' }}>
          
          {/* Category Header Row */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Category Title (EN)</label>
              <input type="text" value={cat.category || ''} onChange={(e) => handleChangeCategoryTitle(catIndex, false, e.target.value)} placeholder="e.g. Endodontics" style={{ width: '100%', padding: '0.5rem', border: '1px solid #CBD5E1', borderRadius: '4px', fontWeight: 'bold' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Category Title (AR)</label>
              <input type="text" value={clinicalSkillsAr[catIndex]?.category || ''} onChange={(e) => handleChangeCategoryTitle(catIndex, true, e.target.value)} dir="rtl" placeholder="عنوان الفئة" style={{ width: '100%', padding: '0.5rem', border: '1px solid #CBD5E1', borderRadius: '4px', fontWeight: 'bold', fontFamily: 'var(--font-arabic)' }} />
            </div>
            <button type="button" onClick={() => handleRemoveCategory(catIndex)} style={{ marginTop: '1.25rem', padding: '0.5rem', background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }} title="Remove Category">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
          </div>

          {/* Skills Rows */}
          <div style={{ paddingLeft: '1rem', borderLeft: '2px solid #CBD5E1' }}>
            {cat.skills.map((skill, skillIndex) => (
              <div key={skillIndex} style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <input type="text" value={skill || ''} onChange={(e) => handleChangeSkill(catIndex, skillIndex, false, e.target.value)} placeholder="Skill (EN)" style={{ width: '100%', padding: '0.4rem', border: '1px solid #E2E8F0', borderRadius: '4px', fontSize: '0.9rem' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <input type="text" value={clinicalSkillsAr[catIndex]?.skills[skillIndex] || ''} onChange={(e) => handleChangeSkill(catIndex, skillIndex, true, e.target.value)} dir="rtl" placeholder="المهارة (AR)" style={{ width: '100%', padding: '0.4rem', border: '1px solid #E2E8F0', borderRadius: '4px', fontSize: '0.9rem', fontFamily: 'var(--font-arabic)' }} />
                </div>
                <button type="button" onClick={() => handleRemoveSkill(catIndex, skillIndex)} style={{ padding: '0.25rem', background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }} title="Remove Skill">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            ))}
            <button type="button" onClick={() => handleAddSkill(catIndex)} style={{ background: 'none', border: 'none', color: 'var(--secondary-color)', fontSize: '0.85rem', cursor: 'pointer', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 'bold' }}>
              + Add Skill
            </button>
          </div>

        </div>
      ))}

      <button type="button" onClick={handleAddCategory} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
        + Add New Category
      </button>
    </div>
  );
};

import AccordionSection from './AccordionSection';

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
      <AccordionSection 
        title="Core Competencies" 
        icon={<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>} 
        defaultOpen={true} 
        styles={styles}
      >
        <DynamicList 
          titleEN="Core Competencies (EN)" 
          titleAR="Core Competencies (AR)" 
          itemsEN={coreCompetencies} setItemsEN={setCoreCompetencies}
          itemsAR={coreCompetenciesAr} setItemsAR={setCoreCompetenciesAr}
          placeholderEN="e.g. Comprehensive Treatment Planning"
          styles={styles}
        />
      </AccordionSection>

      {/* Clinical Skills */}
      <AccordionSection 
        title="Clinical Skills" 
        icon={<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>}
        defaultOpen={false} 
        styles={styles}
      >
        <ClinicalSkillsEditor 
          clinicalSkills={clinicalSkills} setClinicalSkills={setClinicalSkills}
          clinicalSkillsAr={clinicalSkillsAr} setClinicalSkillsAr={setClinicalSkillsAr}
          styles={styles}
        />
      </AccordionSection>

      {/* Languages & References */}
      <AccordionSection 
        title="Languages & References" 
        icon={<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path></svg>}
        defaultOpen={false} 
        styles={styles}
      >
        <DynamicList 
          titleEN="Languages (EN)" 
          titleAR="Languages (AR)" 
          itemsEN={languages} setItemsEN={setLanguages}
          itemsAR={languagesAr} setItemsAR={setLanguagesAr}
          placeholderEN="e.g. English: Fluent"
          styles={styles}
        />

        <div className={styles.splitImages}>
          <div className={styles.formGroup}>
            <label>References (EN)</label>
            <input type="text" value={references || ''} onChange={(e) => setReferences(e.target.value)} placeholder="Available upon request." />
          </div>
          <div className={styles.formGroup}>
            <label>References (AR)</label>
            <input type="text" value={referencesAr || ''} onChange={(e) => setReferencesAr(e.target.value)} dir="rtl" style={{ fontFamily: 'var(--font-arabic)' }} />
          </div>
        </div>
      </AccordionSection>
    </>
  );
}

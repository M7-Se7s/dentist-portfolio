import AccordionSection from './AccordionSection';

export default function LicensureEditor({ licensure, setLicensure, styles }) {
  const addLicensure = () => {
    setLicensure([{ id: Date.now(), name: '', nameAr: '', details: '', detailsAr: '' }, ...licensure]);
  };
  
  const updateLicensure = (index, field, value) => {
    const newLicensure = [...licensure];
    newLicensure[index][field] = value;
    setLicensure(newLicensure);
  };
  
  const removeLicensure = (index) => {
    const newLicensure = [...licensure];
    newLicensure.splice(index, 1);
    setLicensure(newLicensure);
  };

  const icon = <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>;

  return (
    <AccordionSection title="Professional Licensure" icon={icon} defaultOpen={false} styles={styles}>
      <button type="button" onClick={addLicensure} className={styles.btnDashed} style={{ marginBottom: '1.5rem' }}>
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
        Add New Licensure
      </button>
      
      {licensure.map((item, index) => (
        <div key={item.id || index} className={styles.cvSubCard}>
          <button type="button" onClick={() => removeLicensure(index)} className={styles.iconButtonRemove} title="Remove Licensure">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
          <div className={styles.splitImages}>
            <div className={styles.formGroup}><label>Licensure Name (EN)</label><input type="text" value={item.name || ''} onChange={(e) => updateLicensure(index, 'name', e.target.value)} placeholder="e.g. Saudi Prometric Examination" /></div>
            <div className={styles.formGroup}><label>Licensure Name (AR)</label><input type="text" value={item.nameAr || ''} onChange={(e) => updateLicensure(index, 'nameAr', e.target.value)} dir="rtl" style={{ fontFamily: 'var(--font-arabic)' }} /></div>
          </div>
          <div className={styles.splitImages}>
            <div className={styles.formGroup}><label>Details (EN)</label><input type="text" value={item.details || ''} onChange={(e) => updateLicensure(index, 'details', e.target.value)} placeholder="e.g. Passed" /></div>
            <div className={styles.formGroup}><label>Details (AR)</label><input type="text" value={item.detailsAr || ''} onChange={(e) => updateLicensure(index, 'detailsAr', e.target.value)} dir="rtl" style={{ fontFamily: 'var(--font-arabic)' }} /></div>
          </div>
        </div>
      ))}
    </AccordionSection>
  );
}

import AccordionSection from './AccordionSection';

export default function BasicInfoEditor({ 
  basicInfo, setBasicInfo, 
  basicInfoAr, setBasicInfoAr,
  summary, setSummary, 
  summaryAr, setSummaryAr,
  styles 
}) {
  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleBasicInfoArChange = (e) => {
    const { name, value } = e.target;
    setBasicInfoAr(prev => ({ ...prev, [name]: value }));
  };

  const icon = <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>;

  return (
    <AccordionSection title="Basic Profile" icon={icon} defaultOpen={true} styles={styles}>
      <div className={styles.splitImages}>
        <div className={styles.formGroup}>
          <label>Full Name (EN) *</label>
          <input type="text" name="name" value={basicInfo.name || ''} onChange={handleBasicInfoChange} required />
        </div>
        <div className={styles.formGroup}>
          <label>Full Name (AR)</label>
          <input type="text" name="name" value={basicInfoAr?.name || ''} onChange={handleBasicInfoArChange} dir="rtl" style={{ fontFamily: 'var(--font-arabic)' }} />
        </div>
      </div>

      <div className={styles.splitImages}>
        <div className={styles.formGroup}>
          <label>Professional Title (EN) *</label>
          <input type="text" name="title" value={basicInfo.title || ''} onChange={handleBasicInfoChange} required />
        </div>
        <div className={styles.formGroup}>
          <label>Professional Title (AR)</label>
          <input type="text" name="title" value={basicInfoAr?.title || ''} onChange={handleBasicInfoArChange} dir="rtl" style={{ fontFamily: 'var(--font-arabic)' }} />
        </div>
      </div>

      <div className={styles.splitImages}>
        <div className={styles.formGroup}>
          <label>Email Address</label>
          <input type="email" name="email" value={basicInfo.email || ''} onChange={handleBasicInfoChange} />
        </div>
        <div className={styles.formGroup}>
          <label>Phone Number</label>
          <input type="text" name="phone" value={basicInfo.phone || ''} onChange={handleBasicInfoChange} />
        </div>
      </div>

      <div className={styles.splitImages}>
        <div className={styles.formGroup}>
          <label>Location (EN)</label>
          <input type="text" name="location" value={basicInfo.location || ''} onChange={handleBasicInfoChange} placeholder="e.g. Giza, Egypt" />
        </div>
        <div className={styles.formGroup}>
          <label>Location (AR)</label>
          <input type="text" name="location" value={basicInfoAr?.location || ''} onChange={handleBasicInfoArChange} dir="rtl" style={{ fontFamily: 'var(--font-arabic)' }} />
        </div>
      </div>
      
      <div className={styles.formGroup}>
        <label>LinkedIn URL</label>
        <input type="url" name="linkedin" value={basicInfo.linkedin || ''} onChange={handleBasicInfoChange} placeholder="https://linkedin.com/in/..." />
      </div>

      <div className={styles.splitImages}>
        <div className={styles.formGroup}>
          <label>Professional Summary (EN)</label>
          <textarea rows="6" value={summary || ''} onChange={(e) => setSummary(e.target.value)}></textarea>
        </div>
        <div className={styles.formGroup}>
          <label>Professional Summary (AR)</label>
          <textarea rows="6" value={summaryAr || ''} onChange={(e) => setSummaryAr(e.target.value)} dir="rtl" style={{ fontFamily: 'var(--font-arabic)' }}></textarea>
        </div>
      </div>
    </AccordionSection>
  );
}

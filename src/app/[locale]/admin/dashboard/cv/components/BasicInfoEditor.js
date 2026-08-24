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

  return (
    <div className={styles.flatBasicInfoCard}>
      <div className={styles.bilingualRow}>
        <div className={styles.formGroup}>
          <label>Full Name (EN) *</label>
          <input type="text" name="name" value={basicInfo.name || ''} onChange={handleBasicInfoChange} required />
        </div>
        <div className={styles.formGroup}>
          <label>Full Name (AR)</label>
          <input type="text" name="name" value={basicInfoAr?.name || ''} onChange={handleBasicInfoArChange} dir="rtl" style={{ fontFamily: 'var(--font-arabic)' }} />
        </div>
      </div>

      <div className={styles.bilingualRow}>
        <div className={styles.formGroup}>
          <label>Professional Title (EN) *</label>
          <input type="text" name="title" value={basicInfo.title || ''} onChange={handleBasicInfoChange} required />
        </div>
        <div className={styles.formGroup}>
          <label>Professional Title (AR)</label>
          <input type="text" name="title" value={basicInfoAr?.title || ''} onChange={handleBasicInfoArChange} dir="rtl" style={{ fontFamily: 'var(--font-arabic)' }} />
        </div>
      </div>

      <div className={styles.bilingualRow}>
        <div className={styles.formGroup}>
          <label>Location (EN)</label>
          <input type="text" name="location" value={basicInfo.location || ''} onChange={handleBasicInfoChange} placeholder="e.g. Giza, Egypt" />
        </div>
        <div className={styles.formGroup}>
          <label>Location (AR)</label>
          <input type="text" name="location" value={basicInfoAr?.location || ''} onChange={handleBasicInfoArChange} dir="rtl" style={{ fontFamily: 'var(--font-arabic)' }} />
        </div>
      </div>
      
      <div className={styles.infoAlert}>
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <span>Your Contact Info (Email, Phone, LinkedIn) is automatically synced from your global Settings page.</span>
      </div>

      <div className={styles.bilingualRow}>
        <div className={styles.formGroup}>
          <label>Professional Summary (EN)</label>
          <textarea rows="6" value={summary || ''} onChange={(e) => setSummary(e.target.value)}></textarea>
        </div>
        <div className={styles.formGroup}>
          <label>Professional Summary (AR)</label>
          <textarea rows="6" value={summaryAr || ''} onChange={(e) => setSummaryAr(e.target.value)} dir="rtl" style={{ fontFamily: 'var(--font-arabic)' }}></textarea>
        </div>
      </div>
    </div>
  );
}


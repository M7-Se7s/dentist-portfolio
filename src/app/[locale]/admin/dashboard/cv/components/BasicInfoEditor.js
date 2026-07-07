export default function BasicInfoEditor({ basicInfo, setBasicInfo, summary, setSummary, styles }) {
  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className={styles.formSection}>
      <div className={styles.formSectionTitle}>Basic Profile</div>
      
      <div className={styles.splitImages}>
        <div className={styles.formGroup}>
          <label>Full Name *</label>
          <input type="text" name="name" value={basicInfo.name} onChange={handleBasicInfoChange} required />
        </div>
        <div className={styles.formGroup}>
          <label>Professional Title *</label>
          <input type="text" name="title" value={basicInfo.title} onChange={handleBasicInfoChange} required />
        </div>
      </div>

      <div className={styles.splitImages}>
        <div className={styles.formGroup}>
          <label>Email Address</label>
          <input type="email" name="email" value={basicInfo.email} onChange={handleBasicInfoChange} />
        </div>
        <div className={styles.formGroup}>
          <label>Phone Number</label>
          <input type="text" name="phone" value={basicInfo.phone} onChange={handleBasicInfoChange} />
        </div>
      </div>

      <div className={styles.splitImages}>
        <div className={styles.formGroup}>
          <label>Location</label>
          <input type="text" name="location" value={basicInfo.location} onChange={handleBasicInfoChange} placeholder="e.g. Giza, Egypt" />
        </div>
        <div className={styles.formGroup}>
          <label>LinkedIn URL</label>
          <input type="url" name="linkedin" value={basicInfo.linkedin} onChange={handleBasicInfoChange} placeholder="https://linkedin.com/in/..." />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label>Professional Summary</label>
        <textarea rows="4" value={summary} onChange={(e) => setSummary(e.target.value)}></textarea>
      </div>
    </div>
  );
}

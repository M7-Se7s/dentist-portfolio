export default function CaseDetailsSection({
  duration, setDuration,
  year, setYear,
  difficulty, setDifficulty,
  styles
}) {
  return (
    <div className={styles.formSection}>
      <div className={styles.formSectionTitle}>Case Details</div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className={styles.formGroup} style={{ marginBottom: 0 }}>
          <label>Duration</label>
          <input 
            type="text" 
            value={duration} 
            onChange={(e) => setDuration(e.target.value)} 
            placeholder="e.g., 3 weeks, 2 visits"
            style={{ width: '100%', padding: '0.85rem 1rem', border: '1px solid var(--border-color)', borderRadius: '8px', fontFamily: 'var(--font-primary)' }}
          />
        </div>
        
        <div className={styles.formGroup} style={{ marginBottom: 0 }}>
          <label>Year</label>
          <input 
            type="number" 
            value={year} 
            onChange={(e) => setYear(e.target.value)} 
            placeholder="e.g., 2024"
            min="1990"
            max="2099"
            style={{ width: '100%', padding: '0.85rem 1rem', border: '1px solid var(--border-color)', borderRadius: '8px', fontFamily: 'var(--font-primary)' }}
          />
        </div>
        
        <div className={styles.formGroup} style={{ marginBottom: 0 }}>
          <label>Difficulty</label>
          <select 
            value={difficulty} 
            onChange={(e) => setDifficulty(e.target.value)}
            className={styles.styledNativeSelect}
          >
            <option value="">Select...</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Complex">Complex</option>
          </select>
        </div>
      </div>
    </div>
  );
}

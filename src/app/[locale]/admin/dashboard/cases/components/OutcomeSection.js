export default function OutcomeSection({
  challenges, setChallenges,
  result, setResult,
  keyTakeaways, setKeyTakeaways,
  styles
}) {
  return (
    <div className={styles.formSection}>
      <div className={styles.formSectionTitle}>Outcome</div>
      
      <div className={styles.formGroup}>
        <label>Challenges Encountered</label>
        <textarea 
          rows="2" 
          value={challenges} 
          onChange={(e) => setChallenges(e.target.value)}
          placeholder="e.g., Difficult isolation due to subgingival margin..."
          className={styles.treatmentTextArea}
        ></textarea>
      </div>

      <div className={styles.formGroup}>
        <label>Final Result / Outcome</label>
        <textarea 
          rows="2" 
          value={result} 
          onChange={(e) => setResult(e.target.value)}
          placeholder="e.g., Excellent marginal adaptation, patient satisfied with esthetics..."
          className={styles.treatmentTextArea}
        ></textarea>
      </div>

      <div className={styles.formGroup}>
        <label>Key Takeaways</label>
        <textarea 
          rows="2" 
          value={keyTakeaways} 
          onChange={(e) => setKeyTakeaways(e.target.value)}
          placeholder="e.g., Proper matrix selection was crucial for this contact..."
          className={styles.treatmentTextArea}
        ></textarea>
      </div>
    </div>
  );
}

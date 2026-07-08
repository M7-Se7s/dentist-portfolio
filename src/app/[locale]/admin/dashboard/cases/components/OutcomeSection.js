import { useState } from 'react';

export default function OutcomeSection({
  challenges, setChallenges,
  challengesAr, setChallengesAr,
  result, setResult,
  resultAr, setResultAr,
  keyTakeaways, setKeyTakeaways,
  keyTakeawaysAr, setKeyTakeawaysAr,
  styles
}) {


  const renderField = (label, enValue, enSetter, arValue, arSetter, fieldKey, rows = 2, placeholder = '') => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
      <div className={styles.formGroup} style={{ marginBottom: 0 }}>
        <label>{label} (EN)</label>
        <textarea 
          rows={rows} 
          value={enValue || ''} 
          onChange={(e) => enSetter(e.target.value)}
          placeholder={placeholder}
          className={styles.treatmentTextArea}
        ></textarea>
      </div>
      <div className={styles.formGroup} style={{ marginBottom: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label>{label} (AR)</label>
        </div>
        <textarea 
          rows={rows} 
          value={arValue || ''} 
          onChange={(e) => arSetter(e.target.value)}
          placeholder={`Arabic ${label}`}
          dir="rtl"
          className={styles.treatmentTextArea}
          style={{ fontFamily: 'var(--font-arabic)' }}
        ></textarea>
      </div>
    </div>
  );

  return (
    <div className={styles.formSection}>
      <div className={styles.formSectionTitle}>Outcome</div>
      
      {renderField('Challenges Encountered', challenges, setChallenges, challengesAr, setChallengesAr, 'challenges', 2, 'e.g., Difficult isolation due to...')}
      {renderField('Final Result / Outcome', result, setResult, resultAr, setResultAr, 'result', 2, 'e.g., Excellent marginal adaptation...')}
      {renderField('Key Takeaways', keyTakeaways, setKeyTakeaways, keyTakeawaysAr, setKeyTakeawaysAr, 'keyTakeaways', 2, 'e.g., Proper matrix selection was crucial...')}
    </div>
  );
}

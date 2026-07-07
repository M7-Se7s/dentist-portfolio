export default function SkillsTextEditor({ 
  coreCompetencies, setCoreCompetencies,
  licensure, setLicensure,
  clinicalSkills, setClinicalSkills,
  courses, setCourses,
  languages, setLanguages,
  references, setReferences,
  styles 
}) {
  return (
    <>
      {/* Competencies & Licensure */}
      <div className={styles.formSection}>
        <div className={styles.splitImages}>
          <div className={styles.formGroup}>
            <label>Core Competencies (One per line)</label>
            <textarea rows="6" value={coreCompetencies} onChange={(e) => setCoreCompetencies(e.target.value)} placeholder="Comprehensive Treatment Planning\nEndodontics\nOral Surgery..."></textarea>
          </div>
          <div className={styles.formGroup}>
            <label>Professional Licensure (One per line)</label>
            <textarea rows="6" value={licensure} onChange={(e) => setLicensure(e.target.value)} placeholder="Saudi Prometric Examination — Passed\nSCFHS — Professionally Classified"></textarea>
          </div>
        </div>
      </div>

      {/* Clinical Skills */}
      <div className={styles.formSection}>
        <div className={styles.formSectionTitle}>Clinical Skills</div>
        <p style={{fontSize: '0.85rem', color: '#64748B', marginBottom: '1rem'}}>
          Use Markdown-like syntax. Use <strong>**Bold**</strong> for categories, and start new lines for skills.
          <br/>Example:
          <br/>**Endodontics**
          <br/>Anterior & Posterior RCT
          <br/>**Oral Surgery**
          <br/>Simple Extractions
        </p>
        <div className={styles.formGroup}>
          <textarea rows="10" value={clinicalSkills} onChange={(e) => setClinicalSkills(e.target.value)}></textarea>
        </div>
      </div>

      {/* Courses, Languages, References */}
      <div className={styles.formSection}>
        <div className={styles.splitImages}>
          <div className={styles.formGroup}>
            <label>Professional Courses (One per line)</label>
            <textarea rows="4" value={courses} onChange={(e) => setCourses(e.target.value)}></textarea>
          </div>
          <div className={styles.formGroup}>
            <label>Languages (One per line)</label>
            <textarea rows="4" value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder="Arabic: Native\nEnglish: Intermediate"></textarea>
          </div>
        </div>
        <div className={styles.formGroup}>
          <label>References</label>
          <input type="text" value={references} onChange={(e) => setReferences(e.target.value)} placeholder="Available upon request." />
        </div>
      </div>
    </>
  );
}

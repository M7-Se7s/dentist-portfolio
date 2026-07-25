import AccordionSection from './AccordionSection';

export default function CoursesEditor({ courses, setCourses, styles }) {
  const addCourse = () => {
    setCourses([{ id: Date.now(), name: '', nameAr: '', details: '', detailsAr: '' }, ...courses]);
  };
  
  const updateCourse = (index, field, value) => {
    const newCourses = [...courses];
    newCourses[index][field] = value;
    setCourses(newCourses);
  };
  
  const removeCourse = (index) => {
    const newCourses = [...courses];
    newCourses.splice(index, 1);
    setCourses(newCourses);
  };

  const icon = <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>;

  return (
    <AccordionSection title="Professional Courses" icon={icon} defaultOpen={false} styles={styles}>
      <button type="button" onClick={addCourse} className={styles.btnDashed} style={{ marginBottom: '1.5rem' }}>
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
        Add New Course
      </button>
      
      {courses.map((course, index) => (
        <div key={course.id || index} className={styles.cvSubCard}>
          <button type="button" onClick={() => removeCourse(index)} className={styles.iconButtonRemove} title="Remove Course">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
          <div className={styles.splitImages}>
            <div className={styles.formGroup}><label>Course Name (EN)</label><input type="text" value={course.name || ''} onChange={(e) => updateCourse(index, 'name', e.target.value)} placeholder="e.g. Comprehensive Endodontic Course" /></div>
            <div className={styles.formGroup}><label>Course Name (AR)</label><input type="text" value={course.nameAr || ''} onChange={(e) => updateCourse(index, 'nameAr', e.target.value)} dir="rtl" style={{ fontFamily: 'var(--font-arabic)' }} /></div>
          </div>
          <div className={styles.splitImages}>
            <div className={styles.formGroup}><label>Course Details (EN)</label><input type="text" value={course.details || ''} onChange={(e) => updateCourse(index, 'details', e.target.value)} placeholder="e.g. Dr. Nebras AlDahash" /></div>
            <div className={styles.formGroup}><label>Course Details (AR)</label><input type="text" value={course.detailsAr || ''} onChange={(e) => updateCourse(index, 'detailsAr', e.target.value)} dir="rtl" style={{ fontFamily: 'var(--font-arabic)' }} /></div>
          </div>
        </div>
      ))}
    </AccordionSection>
  );
}

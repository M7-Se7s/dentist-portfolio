import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getTranslations } from 'next-intl/server';

export const revalidate = 0; // Ensure fresh data on request

export default async function CVPage({ params }) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;
  const isAr = locale === 'ar';
  const t = await getTranslations({ locale, namespace: 'CV' });

  let cvData = null;
  let settingsData = null;

  try {
    const cvRef = doc(db, "content", "cv");
    const cvSnap = await getDoc(cvRef);
    if (cvSnap.exists()) {
      cvData = cvSnap.data();
    }

    const settingsRef = doc(db, "settings", "global");
    const settingsSnap = await getDoc(settingsRef);
    if (settingsSnap.exists()) {
      settingsData = settingsSnap.data();
    }
  } catch (error) {
    console.error("Error fetching CV on server:", error);
  }

  const {
    basicInfo = {},
    basicInfoAr = {},
    summary = "",
    summaryAr = "",
    coreCompetencies = [],
    coreCompetenciesAr = [],
    education = [],
    licensure = [],
    licensureAr = [],
    experiences = [],
    clinicalSkills = "",
    clinicalSkillsAr = "",
    courses = [],
    coursesAr = [],
    languages = [],
    languagesAr = [],
    references = "",
    referencesAr = "",
    pdfUrl = ""
  } = cvData || {};

  const nameToUse = isAr && basicInfoAr?.name ? basicInfoAr.name : basicInfo.name;
  const titleToUse = isAr && basicInfoAr?.title ? basicInfoAr.title : basicInfo.title;
  const locationToUse = isAr && basicInfoAr?.location ? basicInfoAr.location : basicInfo.location;
  const summaryToUse = isAr && summaryAr ? summaryAr : summary;
  const coreCompetenciesToUse = isAr && coreCompetenciesAr?.length ? coreCompetenciesAr : coreCompetencies;
  const licensureToUse = isAr && licensureAr?.length ? licensureAr : licensure;
  const clinicalSkillsToUse = isAr && clinicalSkillsAr ? clinicalSkillsAr : clinicalSkills;
  const coursesToUse = isAr && coursesAr?.length ? coursesAr : courses;
  const languagesToUse = isAr && languagesAr?.length ? languagesAr : languages;
  const referencesToUse = isAr && referencesAr ? referencesAr : references;

  const parseMarkdown = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, index) => {
      if (!line.trim()) return <br key={index} />;
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <div key={index} style={{ marginBottom: '0.4rem', lineHeight: '1.5', color: 'var(--text-dark)' }}>
          {parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={i} style={{ color: 'var(--primary-color)', fontSize: '1.05rem', display: 'block', marginTop: '1rem', marginBottom: '0.2rem' }}>{part.slice(2, -2)}</strong>;
            }
            return part ? <span key={i} style={{ paddingLeft: part.trim().startsWith('-') ? '0' : '1rem', display: 'inline-block' }}><span style={{ color: 'var(--secondary-color)', marginRight: '0.5rem' }}>•</span> {part.replace(/^- /, '')}</span> : null;
          })}
        </div>
      );
    });
  };

  const parseClinicalSkills = (text) => {
    if (!text) return [];
    const lines = text.split('\n');
    const categories = [];
    let currentCategory = null;

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;

      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        currentCategory = {
          title: trimmed.slice(2, -2),
          skills: []
        };
        categories.push(currentCategory);
      } else {
        const skillName = trimmed.replace(/^- /, '').trim();
        if (currentCategory) {
          currentCategory.skills.push(skillName);
        } else {
          currentCategory = { title: 'General', skills: [skillName] };
          categories.push(currentCategory);
        }
      }
    });

    return categories;
  };

  return (
    <main className="cv-main">
      <div className="container">
        <div className="cv-container">



          {/* Header Section */}
          <header className="cv-header">
            <div>
              <h1 style={{ color: 'var(--primary-color)', fontSize: 'clamp(1.5rem, 5vw, 2.25rem)', fontFamily: 'var(--font-heading)', marginBottom: '0.25rem', lineHeight: '1.2', letterSpacing: '-0.5px' }}>
                {nameToUse || "Dr. Mohamed Shabaan"}
              </h1>
              <p style={{ color: 'var(--secondary-color)', fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', fontWeight: '500', marginBottom: '1.5rem' }}>
                {titleToUse || "General Dentist"}
              </p>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {locationToUse && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--secondary-color)" style={{ flexShrink: 0 }}>
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    <span>{locationToUse}</span>
                  </div>
                )}
                {settingsData?.email && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--secondary-color)" style={{ flexShrink: 0 }}>
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                    <span>{settingsData.email}</span>
                  </div>
                )}
                {settingsData?.linkedin && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--secondary-color)" style={{ flexShrink: 0 }}>
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    <span><a href={settingsData.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>{settingsData.linkedin.replace(/^https?:\/\//, '')}</a></span>
                  </div>
                )}
              </div>
            </div>


          </header>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem' }}>

            {/* Summary */}
            {summaryToUse && (
              <section>
                <h2 style={{ color: 'var(--primary-color)', fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px', paddingBottom: '0.5rem', marginBottom: '1rem' }}>{t('professionalSummary')}</h2>
                <p style={{ color: 'var(--text-dark)', lineHeight: '1.8', fontSize: '1.1rem', textAlign: 'justify' }}>{summaryToUse}</p>
              </section>
            )}

            <div className="core-licensure-grid">
              {/* Core Competencies */}
              {coreCompetenciesToUse.length > 0 && (
                <section>
                  <h2 style={{ color: 'var(--primary-color)', fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>{t('coreCompetencies')}</h2>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'flex-start' }}>
                    {(() => {
                      const estimateWidth = (str) => {
                        let w = 0;
                        for (let i = 0; i < str.length; i++) {
                          const c = str[i];
                          if (/[mwMW]/.test(c)) w += 1.5;
                          else if (/[ijl1Iftr]/.test(c)) w += 0.5;
                          else if (/[A-Z]/.test(c)) w += 1.2;
                          else w += 1;
                        }
                        return w + 4; // Account for tag padding
                      };

                      const sorted = [...coreCompetenciesToUse].sort((a, b) => estimateWidth(b) - estimateWidth(a));
                      const pairs = [];
                      let left = 0;
                      let right = sorted.length - 1;
                      while (left <= right) {
                        if (left === right) {
                          pairs.push([sorted[left]]);
                        } else {
                          pairs.push([sorted[left], sorted[right]]);
                        }
                        left++;
                        right--;
                      }

                      pairs.sort((pairA, pairB) => {
                        const lenA = pairA.reduce((sum, str) => sum + estimateWidth(str), 0);
                        const lenB = pairB.reduce((sum, str) => sum + estimateWidth(str), 0);
                        return lenB - lenA;
                      });

                      return pairs.flat();
                    })().map((item, idx) => (
                      <span key={idx} className="competency-tag">
                        {item}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Professional Licensure */}
              {licensureToUse.length > 0 && (
                <section>
                  <h2 style={{ color: 'var(--primary-color)', fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>{t('professionalLicensure')}</h2>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {licensureToUse.map((item, idx) => {
                      const isObject = typeof item === 'object' && item !== null;
                      const name = isObject ? (isAr && item.nameAr ? item.nameAr : item.name) : item;
                      const details = isObject ? (isAr && item.detailsAr ? item.detailsAr : item.details) : '';

                      return (
                        <li key={idx} className="licensure-item">
                          <div className="licensure-icon-wrapper" style={{ marginTop: details ? '0.2rem' : '0' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                              <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <span style={{ lineHeight: '1.5', fontWeight: '700', color: 'var(--primary-color)', fontSize: 'clamp(0.95rem, 2vw, 1.05rem)' }}>{name}</span>
                            {details && (
                              <div style={{ fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)', color: 'var(--text-muted)', lineHeight: '1.4', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                                {details.split(/[|\n]/).map((line, lIdx) => (
                                  <span key={lIdx}>{line.trim()}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              )}
            </div>

            {/* Experience */}
            {experiences.length > 0 && (
              <section style={{ marginTop: '2rem' }}>
                <h2 style={{ color: 'var(--primary-color)', fontSize: '1.5rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', letterSpacing: '-0.5px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--primary-color)">
                    <path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4zm5 11h-2v2h-2v-2H9v-2h2v-2h2v2h2v2z" />
                  </svg>
                  {t('clinicalExperience')}
                </h2>
                <div className="timeline-container">
                  {experiences.map((exp, idx) => {
                    const roleToUse = isAr && exp.roleAr ? exp.roleAr : exp.role;
                    const periodToUse = isAr && exp.periodAr ? exp.periodAr : exp.period;
                    const clinicToUse = isAr && exp.clinicAr ? exp.clinicAr : exp.clinic;
                    const respsToUse = isAr && exp.responsibilitiesAr ? exp.responsibilitiesAr : exp.responsibilities;
                    return (
                    <div key={idx} className="timeline-item">
                      <div className="timeline-header">
                        <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-color)', fontWeight: '700', margin: 0 }}>{roleToUse}</h3>
                        <span style={{ color: 'var(--secondary-color)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{periodToUse}</span>
                      </div>
                      <p style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '1.25rem', marginTop: 0 }}>{clinicToUse}</p>
                      {respsToUse && (
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          {respsToUse.split('\n').filter(r => r.trim()).map((req, rIdx) => (
                            <li key={rIdx} style={{ color: 'var(--text-dark)', display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.95rem' }}>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '0.1rem' }}>
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                              </svg>
                              <span style={{ lineHeight: '1.6' }}>{req}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )})}
                </div>
              </section>
            )}

            {/* Education */}
            {education.length > 0 && (
              <section>
                <h2 style={{ color: 'var(--primary-color)', fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>{t('education')}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '1.5rem' }}>
                  {education.map((edu, idx) => {
                    const degreeToUse = isAr && edu.degreeAr ? edu.degreeAr : edu.degree;
                    const instToUse = isAr && edu.institutionAr ? edu.institutionAr : edu.institution;
                    const yearToUse = isAr && edu.yearAr ? edu.yearAr : edu.year;
                    return (
                    <div key={idx} className="education-card">
                      <div className="edu-icon-wrapper">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                          <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                        </svg>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <h3 className="edu-degree" style={{ color: 'var(--primary-color)', fontWeight: '700', margin: 0, lineHeight: '1.3' }}>{degreeToUse}</h3>
                          <span className="edu-year" style={{ color: 'var(--secondary-color)', fontWeight: '700', whiteSpace: 'nowrap', backgroundColor: 'rgba(192, 154, 107, 0.1)', padding: '0.2rem 0.75rem', borderRadius: '50px' }}>{yearToUse}</span>
                        </div>
                        <p className="edu-inst" style={{ color: 'var(--text-dark)', fontWeight: '500', margin: 0, lineHeight: '1.5' }}>{instToUse}</p>
                      </div>
                    </div>
                  )})}
                </div>
              </section>
            )}

            {/* Clinical Skills */}
            {clinicalSkillsToUse && (
              <section style={{ marginTop: '2rem' }}>
                <h2 style={{ color: 'var(--primary-color)', fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', letterSpacing: '-0.5px' }}>
                  {t('clinicalSkills')}
                </h2>
                <div className="skills-grid">
                  {parseClinicalSkills(clinicalSkillsToUse).map((cat, idx) => (
                    <div key={idx} className="skill-card">
                      <h3 style={{
                        color: 'var(--primary-color)',
                        fontSize: '1.15rem',
                        fontWeight: '600',
                        marginBottom: '1rem',
                        borderBottom: '1px solid #F1F5F9',
                        paddingBottom: '0.75rem'
                      }}>
                        {cat.title}
                      </h3>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {cat.skills.map((skill, sIdx) => (
                          <li key={sIdx} style={{ color: 'var(--text-dark)', fontSize: '0.95rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                            <svg className="skill-bullet" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                              <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                            <span style={{ lineHeight: '1.4' }}>{skill}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div className="two-col-grid">
              {/* Courses */}
              {(() => {
                const flattenItems = (items) => {
                  if (!items) return [];
                  const arr = Array.isArray(items) ? items : [items];
                  return arr.flatMap(item => {
                    if (typeof item === 'string') {
                      return item.split(/[,|\n]/).map(s => s.trim()).filter(Boolean);
                    }
                    return item;
                  });
                };
                const flatCourses = flattenItems(coursesToUse);
                const flatLanguages = flattenItems(languagesToUse);

                return (
                  <>
                    {flatCourses.length > 0 && (
                      <section>
                        <h2 style={{ color: 'var(--primary-color)', fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>{t('professionalCourses')}</h2>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          {flatCourses.map((item, idx) => {
                            const isObject = typeof item === 'object' && item !== null;
                            const name = isObject ? (isAr && item.nameAr ? item.nameAr : item.name) : item;
                            const details = isObject ? (isAr && item.detailsAr ? item.detailsAr : item.details) : '';
                            
                            return (
                              <li key={idx} className="licensure-item">
                                <div className="licensure-icon-wrapper" style={{ marginTop: details ? '0.2rem' : '0' }}>
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                                  </svg>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                  <span style={{ lineHeight: '1.5', fontWeight: '700', color: 'var(--primary-color)', fontSize: 'clamp(0.95rem, 2vw, 1.05rem)' }}>{name}</span>
                                  {details && (
                                    <div style={{ fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)', color: 'var(--text-muted)', lineHeight: '1.4', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                                      {details.split(/[|\n]/).map((line, lIdx) => (
                                        <span key={lIdx}>{line.trim()}</span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </section>
                    )}

                    {/* Languages */}
                    {flatLanguages.length > 0 && (
                      <section>
                        <h2 style={{ color: 'var(--primary-color)', fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>{t('languages')}</h2>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          {flatLanguages.map((item, idx) => (
                            <li key={idx} className="licensure-item">
                              <div className="licensure-icon-wrapper">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="12" cy="12" r="10"></circle>
                                  <line x1="2" y1="12" x2="22" y2="12"></line>
                                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                                </svg>
                              </div>
                              <span style={{ lineHeight: '1.5' }}>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}
                  </>
                );
              })()}
            </div>

            {/* References */}
            {referencesToUse && (
              <section>
                <h2 style={{ color: 'var(--primary-color)', fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px', paddingBottom: '0.5rem', marginBottom: '1rem' }}>{t('references')}</h2>
                <p style={{ color: 'var(--text-dark)', fontStyle: 'italic' }}>{referencesToUse}</p>
              </section>
            )}

          </div>
        </div>
      </div>

      {/* Print-specific styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .cv-main {
          background-color: var(--background);
          min-height: 100vh;
          padding-top: clamp(2rem, 5vw, 4rem);
          padding-bottom: clamp(2rem, 5vw, 4rem);
          box-sizing: border-box;
          width: 100%;
          overflow-x: hidden;
        }
        .cv-container {
          background-color: var(--surface);
          padding: 3rem;
          border-radius: 16px;
          box-shadow: var(--shadow-md);
          box-sizing: border-box;
          width: 100%;
        }
        .cv-container h2 {
          font-size: clamp(1.15rem, 3vw, 1.25rem) !important;
        }
        .cv-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding-bottom: 1rem;
          margin-bottom: 2rem;
          gap: 1.5rem;
        }
        .two-col-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
        }
        .core-licensure-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
        }
        @media (max-width: 1200px) {
          .core-licensure-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 767px) {
          .cv-main {
            padding-top: 2rem;
            padding-bottom: 2rem;
          }
          .cv-container {
            padding: 1.5rem 0;
            background-color: transparent;
            box-shadow: none;
            border-radius: 0;
          }
          .cv-header {
            flex-direction: column;
          }
          .two-col-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .timeline-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
          }
          .timeline-container {
            padding-left: clamp(0.8rem, 3vw, 1.2rem);
          }
          .timeline-item {
            padding: clamp(0.8rem, 3vw, 1rem);
            background-color: #FFFFFF;
            border: 1px solid #E2E8F0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.02);
            margin-bottom: 1.5rem;
          }
          .timeline-item::before {
            left: calc(-1.3rem - 9px);
          }
          .timeline-item:hover {
            box-shadow: none;
            transform: none;
          }
          .education-card {
            gap: clamp(0.6rem, 2vw, 1rem);
            padding: clamp(0.8rem, 2.5vw, 1rem) clamp(0.6rem, 2vw, 1rem);
          }
          .edu-degree {
            font-size: clamp(0.9rem, 3vw, 1rem) !important;
          }
          .edu-year {
            font-size: clamp(0.65rem, 2vw, 0.75rem) !important;
          }
          .edu-inst {
            font-size: clamp(0.65rem, 2vw, 0.75rem) !important;
          }
          .skills-grid {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            gap: 1rem;
            padding-bottom: 1rem;
            -webkit-overflow-scrolling: touch;
            /* Hide scrollbar for cleaner look */
            scrollbar-width: none; 
          }
          .skills-grid::-webkit-scrollbar {
            display: none;
          }
          .skills-grid > * {
            min-width: 85vw;
            scroll-snap-align: start;
            flex-shrink: 0;
          }
        }

        @media print {
          body { background-color: #fff !important; }
          .no-print { display: none !important; }
          .cv-container { box-shadow: none !important; padding: 0 !important; margin: 0 !important; max-width: 100% !important; }
          main { padding: 0 !important; background-color: #fff !important; }
          * { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
        }
        .timeline-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 0.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .timeline-container {
          position: relative;
          padding-left: 1.5rem;
          margin-top: 1rem;
        }
        .timeline-container::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 2px;
          background-color: #E2E8F0;
        }
        .timeline-item {
          position: relative;
          background-color: #FFFFFF;
          border: 1px solid #E2E8F0;
          padding: 1.3rem;
          margin-bottom: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
          transition: all 0.3s ease;
        }
        .timeline-item:hover {
          box-shadow: 0 10px 25px rgba(0,0,0,0.06);
          transform: translateY(-4px);
          border-color: var(--primary-color);
        }
        .timeline-item::before {
          content: '';
          position: absolute;
          left: calc(-1.5rem - 9px);
          top: 2.15rem;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background-color: var(--primary-color);
          border: 3px solid #FFFFFF;
          transition: background-color 0.3s ease;
        }
        .timeline-item:hover::before {
          background-color: var(--secondary-color);
        }
        .timeline-item:last-child {
          margin-bottom: 0;
        }
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
          gap: 1.5rem;
        }
        .skill-card {
          background-color: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
          transition: all 0.3s ease;
        }
        .skill-card:hover {
          box-shadow: 0 10px 25px rgba(0,0,0,0.06);
          transform: translateY(-4px);
          border-color: var(--primary-color);
        }
        .skill-bullet {
          color: #94A3B8;
          flex-shrink: 0;
          margin-top: 0.15rem;
          transition: color 0.3s ease;
        }
        .skill-card:hover .skill-bullet {
          color: var(--secondary-color);
        }
        .competency-tag {
          background-color: var(--primary-light);
          color: var(--primary-color);
          padding: 0.5rem 0.5rem;
          border-radius: 50px;
          font-size: clamp(0.64rem, 2vw, 1rem);
          font-weight: 500;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
        }
        .competency-tag:hover {
          background-color: var(--primary-color);
          color: #FFFFFF;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
          border-color: var(--primary-color);
        }
        .licensure-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          color: var(--text-dark);
          font-size: clamp(0.75rem, 2vw, 1.15rem) !important;
          padding: 1rem 0.6rem;
          border-radius: 8px;
          background-color: #FFFFFF;
          border: 1px solid #E2E8F0;
          transition: all 0.3s ease;
        }
        .licensure-item:hover {
          border-color: var(--secondary-color);
          box-shadow: 0 4px 15px rgba(0,0,0,0.03);
          transform: translateX(4px);
        }
        .licensure-icon-wrapper {
          color: var(--success);
          flex-shrink: 0;
          margin-top: 0.1rem;
          transition: transform 0.3s ease;
        }
        .licensure-item:hover .licensure-icon-wrapper {
          transform: scale(1.1);
        }
        .education-card {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          background-color: #FFFFFF;
          border: 1px solid #E2E8F0;
          padding: 1rem;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        .education-card:hover {
          border-color: var(--primary-color);
          box-shadow: 0 10px 25px rgba(0,0,0,0.06);
          transform: translateY(-4px);
        }
        .edu-degree {
          font-size: 1.15rem;
        }
        .edu-year {
          font-size: 0.85rem;
        }
        .edu-inst {
          font-size: 1rem;
        }
        .edu-icon-wrapper {
          background-color: #F8FAFC;
          color: var(--primary-color);
          padding: 0.75rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        .education-card:hover .edu-icon-wrapper {
          background-color: var(--primary-color);
          color: #FFFFFF;
          transform: rotate(-5deg) scale(1.1);
        }
      `}} />
    </main>
  );
}

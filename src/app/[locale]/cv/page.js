"use client";

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function CVPage() {
  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [siteUrl, setSiteUrl] = useState('');

  useEffect(() => {
    async function fetchCV() {
      try {
        const cvRef = doc(db, "content", "cv");
        const cvSnap = await getDoc(cvRef);
        if (cvSnap.exists()) {
          setCvData(cvSnap.data());
        }
      } catch (error) {
        console.error("Error fetching CV:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCV();
  }, []);

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAFAFA' }}>
      <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Loading Professional CV...</span>
    </div>;
  }

  const {
    basicInfo = {},
    summary = "",
    coreCompetencies = [],
    education = [],
    licensure = [],
    experiences = [],
    clinicalSkills = "",
    courses = [],
    languages = [],
    references = "",
    pdfUrl = ""
  } = cvData || {};

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
              <h1 style={{ color: 'var(--primary-color)', fontSize: 'clamp(2rem, 5vw, 2.5rem)', fontFamily: 'var(--font-heading)', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>
                {basicInfo.name || "Dr. Mohamed Shaaban"}
              </h1>
              <p style={{ color: 'var(--secondary-color)', fontSize: 'clamp(1.1rem, 2vw, 1.25rem)', fontWeight: '500', marginBottom: '1rem' }}>
                {basicInfo.title || "General Dentist"}
              </p>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {basicInfo.location && <span>📍 {basicInfo.location}</span>}
                {basicInfo.phone && <span>📱 {basicInfo.phone}</span>}
                {basicInfo.email && <span>📧 {basicInfo.email}</span>}
                {basicInfo.linkedin && <span>🔗 <a href={basicInfo.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>{basicInfo.linkedin.replace(/^https?:\/\//, '')}</a></span>}
              </div>
            </div>


          </header>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem' }}>

            {/* Summary */}
            {summary && (
              <section>
                <h2 style={{ color: 'var(--primary-color)', fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Professional Summary</h2>
                <p style={{ color: 'var(--text-dark)', lineHeight: '1.8', fontSize: '1rem', textAlign: 'justify' }}>{summary}</p>
              </section>
            )}

            <div className="core-licensure-grid">
              {/* Core Competencies */}
              {coreCompetencies.length > 0 && (
                <section>
                  <h2 style={{ color: 'var(--primary-color)', fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>Core Competencies</h2>
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

                      const sorted = [...coreCompetencies].sort((a, b) => estimateWidth(b) - estimateWidth(a));
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
              {licensure.length > 0 && (
                <section>
                  <h2 style={{ color: 'var(--primary-color)', fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>Professional Licensure</h2>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {licensure.map((item, idx) => (
                      <li key={idx} className="licensure-item">
                        <div className="licensure-icon-wrapper">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                          </svg>
                        </div>
                        <span style={{ lineHeight: '1.5' }}>{item}</span>
                      </li>
                    ))}
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
                  Clinical Experience
                </h2>
                <div className="timeline-container">
                  {experiences.map((exp, idx) => (
                    <div key={idx} className="timeline-item">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                        <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-color)', fontWeight: '700', margin: 0 }}>{exp.role}</h3>
                        <span style={{ color: 'var(--secondary-color)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{exp.period}</span>
                      </div>
                      <p style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '1.25rem', marginTop: 0 }}>{exp.clinic}</p>
                      {exp.responsibilities && (
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          {exp.responsibilities.split('\n').filter(r => r.trim()).map((req, rIdx) => (
                            <li key={rIdx} style={{ color: 'var(--text-dark)', display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.95rem' }}>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--secondary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '0.1rem' }}>
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                              </svg>
                              <span style={{ lineHeight: '1.6' }}>{req}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {education.length > 0 && (
              <section>
                <h2 style={{ color: 'var(--primary-color)', fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Education</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '1.5rem' }}>
                  {education.map((edu, idx) => (
                    <div key={idx} className="education-card">
                      <div className="edu-icon-wrapper">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                          <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                        </svg>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-color)', fontWeight: '700', margin: 0, lineHeight: '1.3' }}>{edu.degree}</h3>
                          <span style={{ color: 'var(--secondary-color)', fontSize: '0.85rem', fontWeight: '700', whiteSpace: 'nowrap', backgroundColor: 'rgba(192, 154, 107, 0.1)', padding: '0.2rem 0.75rem', borderRadius: '50px' }}>{edu.year}</span>
                        </div>
                        <p style={{ fontSize: '1rem', color: 'var(--text-dark)', fontWeight: '500', margin: 0, lineHeight: '1.5' }}>{edu.institution}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Clinical Skills */}
            {clinicalSkills && (
              <section style={{ marginTop: '2rem' }}>
                <h2 style={{ color: 'var(--primary-color)', fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', letterSpacing: '-0.5px' }}>
                  Clinical Skills
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '1.5rem' }}>
                  {parseClinicalSkills(clinicalSkills).map((cat, idx) => (
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
                const flatCourses = flattenItems(courses);
                const flatLanguages = flattenItems(languages);

                return (
                  <>
                    {flatCourses.length > 0 && (
                      <section>
                        <h2 style={{ color: 'var(--primary-color)', fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>Professional Courses</h2>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          {flatCourses.map((item, idx) => (
                            <li key={idx} className="licensure-item">
                              <div className="licensure-icon-wrapper">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                                </svg>
                              </div>
                              <span style={{ lineHeight: '1.5' }}>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}

                    {/* Languages */}
                    {flatLanguages.length > 0 && (
                      <section>
                        <h2 style={{ color: 'var(--primary-color)', fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>Languages</h2>
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
            {references && (
              <section>
                <h2 style={{ color: 'var(--primary-color)', fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem', marginBottom: '1rem' }}>References</h2>
                <p style={{ color: 'var(--text-dark)', fontStyle: 'italic' }}>{references}</p>
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
          padding: 4rem;
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
          border-bottom: 2px solid #F1F5F9;
          padding-bottom: 2rem;
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
          .cv-container {
            padding: 2.5rem;
          }
          .cv-header {
            flex-direction: column;
          }
          .two-col-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }
        @media (max-width: 480px) {
          .cv-container {
            padding: 1.5rem;
          }
        }
        @media print {
          body { background-color: #fff !important; }
          .no-print { display: none !important; }
          .cv-container { box-shadow: none !important; padding: 0 !important; margin: 0 !important; max-width: 100% !important; }
          main { padding: 0 !important; background-color: #fff !important; }
          * { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
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
          padding: 2rem;
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
          left: -1.9rem;
          top: 2.2rem;
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
          background-color: #F8FAFC;
          color: var(--primary-color);
          padding: 0.5rem 1rem;
          border-radius: 50px;
          font-size: clamp(0.85rem, 1.5vw, 1rem);
          font-weight: 500;
          border: 1px solid #E2E8F0;
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
          font-size: clamp(0.9rem, 1.5vw, 1.05rem) !important;
          padding: 1rem;
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
          color: var(--secondary-color);
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
          gap: 1.25rem;
          background-color: #FFFFFF;
          border: 1px solid #E2E8F0;
          padding: 1.5rem;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        .education-card:hover {
          border-color: var(--primary-color);
          box-shadow: 0 10px 25px rgba(0,0,0,0.06);
          transform: translateY(-4px);
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

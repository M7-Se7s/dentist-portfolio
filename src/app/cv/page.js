"use client";

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

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
    return <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAFAFA'}}>
      <span style={{fontSize: '1.2rem', color: 'var(--text-muted)'}}>Loading Professional CV...</span>
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
            return part ? <span key={i} style={{paddingLeft: part.trim().startsWith('-') ? '0' : '1rem', display: 'inline-block'}}><span style={{color: 'var(--secondary-color)', marginRight: '0.5rem'}}>•</span> {part.replace(/^- /, '')}</span> : null;
          })}
        </div>
      );
    });
  };

  return (
    <main style={{backgroundColor: '#FAFAFA', minHeight: '100vh', padding: '4rem 1rem'}}>
      <div style={{maxWidth: '900px', margin: '0 auto', backgroundColor: '#FFFFFF', padding: '4rem', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.03)'}} className="cv-container">
        
        {/* Actions Bar (Hidden on Print) */}
        <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem'}} className="no-print">
          {pdfUrl ? (
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{display: 'inline-flex', alignItems: 'center', gap: '0.5rem'}}>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              Download PDF
            </a>
          ) : (
            <button onClick={() => window.print()} className="btn-primary" style={{display: 'inline-flex', alignItems: 'center', gap: '0.5rem'}}>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
              Print CV
            </button>
          )}
        </div>

        {/* Header Section */}
        <header style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #F1F5F9', paddingBottom: '2rem', marginBottom: '2rem'}}>
          <div>
            <h1 style={{color: 'var(--primary-color)', fontSize: '2.5rem', fontFamily: 'var(--font-heading)', marginBottom: '0.5rem', letterSpacing: '-0.5px'}}>
              {basicInfo.name || "Dr. Mohamed Shaaban"}
            </h1>
            <p style={{color: 'var(--secondary-color)', fontSize: '1.25rem', fontWeight: '500', marginBottom: '1rem'}}>
              {basicInfo.title || "General Dentist"}
            </p>
            <div style={{color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
              {basicInfo.location && <span>📍 {basicInfo.location}</span>}
              {basicInfo.phone && <span>📱 {basicInfo.phone}</span>}
              {basicInfo.email && <span>📧 {basicInfo.email}</span>}
              {basicInfo.linkedin && <span>🔗 <a href={basicInfo.linkedin} target="_blank" rel="noopener noreferrer" style={{color: 'inherit', textDecoration: 'none'}}>{basicInfo.linkedin.replace(/^https?:\/\//, '')}</a></span>}
            </div>
          </div>
          
          <div style={{textAlign: 'right'}}>
            <p style={{color: 'var(--primary-color)', fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem'}}>Professional Portfolio</p>
            <a href="/" style={{color: 'var(--secondary-color)', textDecoration: 'none', fontSize: '0.9rem'}}>{typeof window !== 'undefined' ? window.location.host : 'dr-shaaban.com'}</a>
          </div>
        </header>

        <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '3rem'}}>
          
          {/* Summary */}
          {summary && (
            <section>
              <h2 style={{color: 'var(--primary-color)', fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem', marginBottom: '1rem'}}>Professional Summary</h2>
              <p style={{color: 'var(--text-dark)', lineHeight: '1.8', fontSize: '1rem', textAlign: 'justify'}}>{summary}</p>
            </section>
          )}

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem'}}>
            {/* Core Competencies */}
            {coreCompetencies.length > 0 && (
              <section>
                <h2 style={{color: 'var(--primary-color)', fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem', marginBottom: '1rem'}}>Core Competencies</h2>
                <ul style={{listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.5rem'}}>
                  {coreCompetencies.map((item, idx) => (
                    <li key={idx} style={{color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                      <span style={{color: 'var(--secondary-color)'}}>•</span> {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Professional Licensure */}
            {licensure.length > 0 && (
              <section>
                <h2 style={{color: 'var(--primary-color)', fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem', marginBottom: '1rem'}}>Professional Licensure</h2>
                <ul style={{listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.5rem'}}>
                  {licensure.map((item, idx) => (
                    <li key={idx} style={{color: 'var(--text-dark)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem'}}>
                      <span style={{color: 'var(--secondary-color)', marginTop: '0.2rem'}}>•</span> <span style={{lineHeight: '1.4'}}>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Experience */}
          {experiences.length > 0 && (
            <section>
              <h2 style={{color: 'var(--primary-color)', fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem', marginBottom: '1.5rem'}}>Professional Experience</h2>
              <div style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
                {experiences.map((exp, idx) => (
                  <div key={idx}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem'}}>
                      <h3 style={{fontSize: '1.15rem', color: 'var(--primary-color)', fontWeight: '600'}}>{exp.role}</h3>
                      <span style={{color: 'var(--secondary-color)', fontSize: '0.9rem', fontWeight: '500'}}>{exp.period}</span>
                    </div>
                    <p style={{fontSize: '1rem', color: 'var(--text-muted)', fontWeight: '500', marginBottom: '0.5rem'}}>{exp.clinic}</p>
                    {exp.responsibilities && (
                      <ul style={{listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.4rem'}}>
                        {exp.responsibilities.split('\n').filter(r => r.trim()).map((req, rIdx) => (
                          <li key={rIdx} style={{color: 'var(--text-dark)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem'}}>
                            <span style={{color: '#94A3B8', marginTop: '0.1rem'}}>▹</span> <span style={{lineHeight: '1.5'}}>{req}</span>
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
              <h2 style={{color: 'var(--primary-color)', fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem', marginBottom: '1.5rem'}}>Education</h2>
              <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                {education.map((edu, idx) => (
                  <div key={idx}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem'}}>
                      <h3 style={{fontSize: '1.1rem', color: 'var(--primary-color)', fontWeight: '600'}}>{edu.degree}</h3>
                      <span style={{color: 'var(--secondary-color)', fontSize: '0.9rem', fontWeight: '500'}}>{edu.year}</span>
                    </div>
                    <p style={{fontSize: '1rem', color: 'var(--text-muted)', fontWeight: '500'}}>{edu.institution}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Clinical Skills */}
          {clinicalSkills && (
            <section>
              <h2 style={{color: 'var(--primary-color)', fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem', marginBottom: '0.5rem'}}>Clinical Skills</h2>
              <div style={{columnCount: 2, columnGap: '3rem'}}>
                {parseMarkdown(clinicalSkills)}
              </div>
            </section>
          )}

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem'}}>
            {/* Courses */}
            {courses.length > 0 && (
              <section>
                <h2 style={{color: 'var(--primary-color)', fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem', marginBottom: '1rem'}}>Professional Courses</h2>
                <ul style={{listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.5rem'}}>
                  {courses.map((item, idx) => (
                    <li key={idx} style={{color: 'var(--text-dark)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem'}}>
                      <span style={{color: 'var(--secondary-color)', marginTop: '0.2rem'}}>•</span> <span style={{lineHeight: '1.4'}}>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Languages */}
            {languages.length > 0 && (
              <section>
                <h2 style={{color: 'var(--primary-color)', fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem', marginBottom: '1rem'}}>Languages</h2>
                <ul style={{listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.5rem'}}>
                  {languages.map((item, idx) => (
                    <li key={idx} style={{color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                      <span style={{color: 'var(--secondary-color)'}}>•</span> {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* References */}
          {references && (
            <section>
              <h2 style={{color: 'var(--primary-color)', fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem', marginBottom: '1rem'}}>References</h2>
              <p style={{color: 'var(--text-dark)', fontStyle: 'italic'}}>{references}</p>
            </section>
          )}

        </div>
      </div>
      
      {/* Print-specific styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background-color: #fff !important; }
          .no-print { display: none !important; }
          .cv-container { box-shadow: none !important; padding: 0 !important; margin: 0 !important; max-width: 100% !important; }
          main { padding: 0 !important; background-color: #fff !important; }
          * { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
        }
      `}} />
    </main>
  );
}

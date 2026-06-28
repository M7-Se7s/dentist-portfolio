"use client";

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Link from 'next/link';

export default function CVPage() {
  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(true);

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
    return <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Loading CV...</div>;
  }

  return (
    <main style={{backgroundColor: '#F8FAFC', minHeight: 'calc(100vh - 80px)', padding: '5rem 0'}}>
      <div className="container" style={{maxWidth: '1000px'}}>
        
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', paddingBottom: '1rem', borderBottom: '2px solid var(--border-color)'}}>
          <div>
            <h1 style={{color: 'var(--primary-color)', fontSize: '3rem', fontFamily: 'var(--font-heading)', marginBottom: '0.5rem'}}>
              Curriculum Vitae
            </h1>
            <p style={{color: 'var(--text-muted)', fontSize: '1.2rem'}}>Dr. Mohamed Shaaban - General Dentist</p>
          </div>
          <div>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="btn-primary">
              Download PDF
            </a>
          </div>
        </div>

        <div className="grid">
          {/* Education */}
          <div className="card">
            <h3 style={{color: 'var(--primary-color)', fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem'}}>
              Education & Qualifications
            </h3>
            <ul style={{listStyle: 'none', padding: 0}}>
              {cvData?.education?.map((item, index) => (
                <li key={index} style={{marginBottom: '1rem', paddingLeft: '1.5rem', position: 'relative', fontSize: '1.1rem'}}>
                  <span style={{position: 'absolute', left: 0, color: 'var(--secondary-color)', fontSize: '1.5rem', top: '-4px'}}>•</span>
                  {item}
                </li>
              ))}
            </ul>
            {(!cvData?.education || cvData.education.length === 0) && <p style={{color: '#999'}}>No education listed.</p>}
          </div>

          {/* Competencies */}
          <div className="card">
            <h3 style={{color: 'var(--primary-color)', fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem'}}>
              Core Competencies
            </h3>
            <ul style={{listStyle: 'none', padding: 0}}>
              {cvData?.competencies?.map((item, index) => (
                <li key={index} style={{marginBottom: '1rem', paddingLeft: '1.5rem', position: 'relative', fontSize: '1.1rem'}}>
                  <span style={{position: 'absolute', left: 0, color: 'var(--secondary-color)', fontSize: '1.5rem', top: '-4px'}}>•</span>
                  {item}
                </li>
              ))}
            </ul>
            {(!cvData?.competencies || cvData.competencies.length === 0) && <p style={{color: '#999'}}>No competencies listed.</p>}
          </div>

          {/* Experience */}
          <div className="card" style={{gridColumn: '1 / -1'}}>
            <h3 style={{color: 'var(--primary-color)', fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem'}}>
              Clinical Experience
            </h3>
            <ul style={{listStyle: 'none', padding: 0}}>
              {cvData?.experience?.map((item, index) => (
                <li key={index} style={{marginBottom: '1rem', paddingLeft: '1.5rem', position: 'relative', fontSize: '1.1rem'}}>
                  <span style={{position: 'absolute', left: 0, color: 'var(--secondary-color)', fontSize: '1.5rem', top: '-4px'}}>•</span>
                  {item}
                </li>
              ))}
            </ul>
            {(!cvData?.experience || cvData.experience.length === 0) && <p style={{color: '#999'}}>No experience listed.</p>}
          </div>
        </div>

        <div style={{textAlign: 'center', marginTop: '4rem'}}>
          <Link href="/cases" className="btn-secondary" style={{marginRight: '1rem'}}>Browse Clinical Cases</Link>
          <a href="mailto:avatarmohammedy@gmail.com" className="btn-primary">Contact Me</a>
        </div>

      </div>
    </main>
  );
}

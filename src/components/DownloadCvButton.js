"use client";

import { useState, useRef, useEffect } from 'react';

export default function DownloadCvButton({ pdfUrl, pdfUrlAr, className, style, label }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const buttonLabel = label || 'Download CV';
  
  const hasBoth = pdfUrl && pdfUrlAr;
  const singleUrl = pdfUrl || pdfUrlAr;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!singleUrl) {
    // If neither exists, link to the static fallback
    return (
      <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className={className} style={style}>
        {buttonLabel}
      </a>
    );
  }

  if (!hasBoth) {
    // If only one exists, just link directly to it
    return (
      <a href={singleUrl} target="_blank" rel="noopener noreferrer" className={className} style={style}>
        {buttonLabel}
      </a>
    );
  }

  // If both exist, show the dropdown button
  return (
    <div style={{ position: 'relative', display: 'inline-block', zIndex: 50 }} ref={dropdownRef}>
      <button 
        type="button"
        className={className}
        style={{ ...style, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={buttonLabel}
      >
        {buttonLabel}
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 0.5rem)',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '8px',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
          minWidth: '200px',
          zIndex: 9999,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <a 
            href={pdfUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            onClick={() => setIsOpen(false)}
            style={{
              padding: '0.75rem 1rem',
              color: 'var(--text-dark)',
              textDecoration: 'none',
              fontWeight: '500',
              borderBottom: '1px solid #F1F5F9',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'background-color 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <span style={{ fontSize: '1.2rem' }}>🇬🇧</span> English Version
          </a>
          <a 
            href={pdfUrlAr} 
            target="_blank" 
            rel="noopener noreferrer" 
            onClick={() => setIsOpen(false)}
            style={{
              padding: '0.75rem 1rem',
              color: 'var(--text-dark)',
              textDecoration: 'none',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'background-color 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <span style={{ fontSize: '1.2rem' }}>🇸🇦</span> Arabic Version
          </a>
        </div>
      )}
    </div>
  );
}

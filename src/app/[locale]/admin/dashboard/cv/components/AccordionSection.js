import { useState, useRef } from 'react';

export default function AccordionSection({ title, icon, defaultOpen = false, children, styles }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const sectionRef = useRef(null);

  const handleClose = () => {
    setIsOpen(false);
    // Smooth scroll back to the top of this section when closing from the bottom
    if (sectionRef.current) {
      const yOffset = -40; 
      const element = sectionRef.current;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div ref={sectionRef} className={styles.formSection} style={{ padding: 0, overflow: 'hidden', transition: 'all 0.3s ease' }}>
      <button 
        type="button"
        onClick={handleToggle}
        style={{ 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '1.5rem 2rem', 
          background: isOpen ? '#F8FAFC' : 'transparent', 
          border: 'none', 
          cursor: 'pointer',
          borderBottom: isOpen ? '1px solid var(--border-color)' : 'none',
          transition: 'all 0.2s ease',
          outline: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary-color)' }}>
          {icon}
          {title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>
            {isOpen ? 'Close' : 'Edit'}
          </span>
          <svg 
            width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease', color: 'var(--text-muted)' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </button>
      
      {isOpen && (
        <div style={{ padding: '2rem', animation: 'fadeIn 0.3s ease-out' }}>
          {children}
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px dashed #CBD5E1' }}>
            <button 
              type="button" 
              onClick={handleClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                color: '#64748B',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#F1F5F9'; e.currentTarget.style.color = '#334155'; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#F8FAFC'; e.currentTarget.style.color = '#64748B'; }}
            >
              Close Section
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

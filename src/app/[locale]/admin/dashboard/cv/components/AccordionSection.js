import { useState, useRef } from 'react';

export default function AccordionSection({ title, icon, defaultOpen = false, collapsible = true, children, styles }) {
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
      {collapsible ? (
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
      ) : (
        <div 
          style={{ 
            width: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            padding: '1.5rem 2rem', 
            background: '#F8FAFC', 
            borderBottom: '1px solid var(--border-color)',
            gap: '0.75rem', 
            fontSize: '1.25rem', 
            fontWeight: '700', 
            color: 'var(--primary-color)' 
          }}
        >
          {icon}
          {title}
        </div>
      )}

      <div style={{ display: (!collapsible || isOpen) ? 'block' : 'none', padding: '2rem', animation: 'fadeIn 0.3s ease-out' }}>
        {children}
        
        {collapsible && (
          <div 
            style={{ 
              display: isOpen ? 'block' : 'none', 
              padding: '0 2rem 2rem 2rem',
              textAlign: 'center',
              borderTop: '1px solid rgba(0,0,0,0.05)',
              paddingTop: '1.5rem'
            }}
          >
            <button 
              type="button"
              onClick={handleClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg>
              Close Section
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

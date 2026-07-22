"use client";
import { useState, useEffect } from 'react';

export default function Collapsible({ title, children, defaultOpen = true, collapseOnMobile = false, customHeaderClass = "", titleElement = null }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  useEffect(() => {
    if (collapseOnMobile && window.innerWidth <= 768) {
      setIsOpen(false);
    }
  }, [collapseOnMobile]);

  return (
    <div style={{ width: '100%' }}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)} 
        className={customHeaderClass}
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          width: '100%', 
          cursor: 'pointer',
          background: 'none',
          border: 'none',
          textAlign: 'left',
          fontFamily: 'inherit',
          padding: 0
        }}
      >
        {titleElement || <span>{title}</span>}
        <svg 
          width="24" height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          style={{ 
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
            color: 'var(--primary-color)',
            flexShrink: 0,
            marginLeft: '1rem'
          }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <div 
        style={{ 
          display: isOpen ? 'block' : 'none',
          marginTop: isOpen ? '1.5rem' : '0',
          animation: 'fadeIn 0.3s ease-in-out'
        }}
      >
        {children}
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

import AccordionSection from './AccordionSection';

export default function PdfUploadSection({ 
  pdfUrl, setPdfUrl,
  pdfUrlAr, setPdfUrlAr,
  styles 
}) {
  const icon = <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>;

  return (
    <AccordionSection title="Downloadable CV Links" icon={icon} defaultOpen={false} styles={styles}>
      <p style={{fontSize: '0.85rem', color: '#64748B', marginBottom: '1.5rem'}}>
        Host your PDFs on Google Drive. Make sure the sharing setting is <b>&quot;Anyone with the link can view&quot;</b> and paste the links below.
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* English Link Input */}
        <div className={styles.formGroup} style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)', fontSize: '1.1rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.2rem' }}>🇬🇧</span> English CV Google Drive Link
          </label>
          <input 
            type="url" 
            placeholder="https://drive.google.com/file/d/.../view"
            value={pdfUrl || ''}
            onChange={(e) => setPdfUrl(e.target.value)}
            style={{padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '6px', width: '100%', fontSize: '0.95rem'}}
          />
          {pdfUrl && (
            <div style={{marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', padding: '0.75rem', borderRadius: '6px'}}>
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer" style={{color: 'var(--secondary-color)', fontSize: '0.9rem', fontWeight: '600', textDecoration: 'none'}}>Test English Link</a>
              <button type="button" onClick={() => setPdfUrl('')} style={{color: 'var(--error)', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500'}}>Clear</button>
            </div>
          )}
        </div>

        {/* Arabic Link Input */}
        <div className={styles.formGroup} style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)', fontSize: '1.1rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.2rem' }}>🇸🇦</span> Arabic CV Google Drive Link
          </label>
          <input 
            type="url" 
            placeholder="https://drive.google.com/file/d/.../view"
            value={pdfUrlAr || ''}
            onChange={(e) => setPdfUrlAr(e.target.value)}
            style={{padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '6px', width: '100%', fontSize: '0.95rem'}}
          />
          {pdfUrlAr && (
            <div style={{marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', padding: '0.75rem', borderRadius: '6px'}}>
              <a href={pdfUrlAr} target="_blank" rel="noopener noreferrer" style={{color: 'var(--secondary-color)', fontSize: '0.9rem', fontWeight: '600', textDecoration: 'none'}}>Test Arabic Link</a>
              <button type="button" onClick={() => setPdfUrlAr('')} style={{color: 'var(--error)', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500'}}>Clear</button>
            </div>
          )}
        </div>

      </div>
    </AccordionSection>
  );
}

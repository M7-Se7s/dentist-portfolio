export default function PdfUploadSection({ pdfFile, setPdfFile, pdfUrl, setPdfUrl, styles }) {
  return (
    <div className={styles.formSection}>
      <div className={styles.formSectionTitle}>Downloadable PDF</div>
      <div className={styles.formGroup}>
        <label>Upload Static PDF (Optional)</label>
        <p style={{fontSize: '0.85rem', color: '#64748B', marginBottom: '0.5rem'}}>Upload the beautifully designed PDF file you want users to download when they click &quot;Download PDF&quot;.</p>
        <input 
          type="file" 
          accept="application/pdf"
          onChange={(e) => setPdfFile(e.target.files[0])}
          style={{padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '6px', width: '100%'}}
        />
        {pdfUrl && (
          <div style={{marginTop: '0.5rem'}}>
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer" style={{color: 'var(--secondary-color)', fontSize: '0.9rem', fontWeight: '500'}}>View Current PDF</a>
            <button type="button" onClick={() => setPdfUrl('')} style={{marginLeft: '1rem', color: 'var(--error)', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500'}}>Remove PDF</button>
          </div>
        )}
      </div>
    </div>
  );
}

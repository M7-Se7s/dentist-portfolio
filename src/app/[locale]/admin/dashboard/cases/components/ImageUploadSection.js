import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const SortableGallery = dynamic(() => import('@/components/SortableGallery'), { ssr: false });
const ImageAlignmentEditor = dynamic(() => import('@/components/ImageAlignmentEditor'), { ssr: false });

export default function ImageUploadSection({
  caseType = 'detailed',
  coverPreview, setCoverPreview, setCoverImage,
  beforePreview, setBeforePreview, setBeforeImage,
  afterPreview, setAfterPreview, setAfterImage,
  galleryItems, setGalleryItems,
  xrayItems, setXrayItems,
  styles
}) {

  // Alignment editor state
  const [showAlignmentEditor, setShowAlignmentEditor] = useState(false);
  const [pendingAfterFile, setPendingAfterFile] = useState(null);
  const [originalAfterFile, setOriginalAfterFile] = useState(null);

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleBeforeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBeforeImage(file);
      setBeforePreview(URL.createObjectURL(file));
    }
  };

  const handleAfterChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setOriginalAfterFile(file);
      // If a Before image already exists, open the alignment editor
      if (beforePreview) {
        setPendingAfterFile(file);
        setShowAlignmentEditor(true);
      } else {
        // No Before image yet — just set it directly
        setAfterImage(file);
        setAfterPreview(URL.createObjectURL(file));
      }
    }
  };

  const handleRealign = (e) => {
    e.preventDefault();
    if (originalAfterFile && beforePreview) {
      setPendingAfterFile(originalAfterFile);
      setShowAlignmentEditor(true);
    } else if (afterPreview && beforePreview) {
      setPendingAfterFile(afterPreview);
      setShowAlignmentEditor(true);
    }
  };

  // Alignment editor callbacks
  const handleAlignmentConfirm = (alignedFile) => {
    setAfterImage(alignedFile);
    setAfterPreview(URL.createObjectURL(alignedFile));
    setShowAlignmentEditor(false);
    setPendingAfterFile(null);
  };

  const handleAlignmentSkip = () => {
    // Use the original unaligned file
    if (pendingAfterFile) {
      setAfterImage(pendingAfterFile);
      setAfterPreview(URL.createObjectURL(pendingAfterFile));
    }
    setShowAlignmentEditor(false);
    setPendingAfterFile(null);
  };

  const handleAlignmentCancel = () => {
    // Close without setting any after image
    setShowAlignmentEditor(false);
    setPendingAfterFile(null);
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;
    
    const newItems = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      url: URL.createObjectURL(file),
      label: ''
    }));
    
    setGalleryItems(prev => [...prev, ...newItems]);
  };

  const handleXrayChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;
    
    const newItems = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      url: URL.createObjectURL(file),
      label: ''
    }));
    
    setXrayItems(prev => [...(prev || []), ...newItems]);
  };

  return (
    <>
      {/* Alignment Editor Modal */}
      {showAlignmentEditor && pendingAfterFile && beforePreview && (
        <ImageAlignmentEditor
          beforeSrc={beforePreview}
          afterFile={pendingAfterFile}
          onConfirm={handleAlignmentConfirm}
          onSkip={handleAlignmentSkip}
          onCancel={handleAlignmentCancel}
        />
      )}

      {caseType === 'detailed' ? (
        <div className={styles.formSection}>
          <div className={styles.formSectionTitle}>Before / After Comparison *</div>
          <p className={styles.sectionHint}>These images are used for the interactive slider.</p>
          <div className={styles.splitImages}>
            
            <div className={styles.formGroup}>
              <label>Before Image *</label>
              <div className={styles.imageDropzoneSplit}>
                <input type="file" accept="image/*" onChange={handleBeforeChange} className={styles.hiddenFileInput} required />
                {beforePreview ? (
                  <img src={beforePreview} alt="Preview" className={styles.imageDropzonePreview} />
                ) : (
                  <div className={styles.uploadPlaceholder}>
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" className={styles.uploadPlaceholderIcon}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <p className={styles.uploadPlaceholderText}>Upload</p>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>After Image *</label>
              <div className={styles.imageDropzoneSplit} style={{ position: 'relative' }}>
                <input type="file" accept="image/*" onChange={handleAfterChange} className={styles.hiddenFileInput} required />
                {afterPreview ? (
                  <>
                    <img src={afterPreview} alt="Preview" className={styles.imageDropzonePreview} />
                    {afterPreview && beforePreview && (
                      <button 
                        type="button" 
                        onClick={handleRealign}
                        style={{
                          position: 'absolute',
                          bottom: '8px',
                          right: '8px',
                          padding: '6px 12px',
                          background: 'rgba(0, 0, 0, 0.6)',
                          color: '#fff',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          zIndex: 5,
                          backdropFilter: 'blur(4px)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
                        Align
                      </button>
                    )}
                  </>
                ) : (
                  <div className={styles.uploadPlaceholder}>
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" className={styles.uploadPlaceholderIcon}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <p className={styles.uploadPlaceholderText}>Upload</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      ) : (
        <div className={styles.formSection}>
          <div className={styles.formSectionTitle}>Cover Image *</div>
          <p className={styles.sectionHint}>This image will be used as the primary display for the case.</p>
          <div className={styles.formGroup} style={{ maxWidth: '400px' }}>
            <div className={styles.imageDropzoneSplit} style={{ height: '300px' }}>
              <input type="file" accept="image/*" onChange={handleCoverChange} className={styles.hiddenFileInput} required />
              {coverPreview ? (
                <img src={coverPreview} alt="Cover Preview" className={styles.imageDropzonePreview} />
              ) : (
                <div className={styles.uploadPlaceholder}>
                  <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" className={styles.uploadPlaceholderIcon}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  <p className={styles.uploadPlaceholderText}>Upload Cover Image</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className={styles.formSection}>
        <div className={styles.formSectionTitle}>Case Gallery (Optional)</div>
        <p className={styles.sectionHint}>Upload additional procedure images.</p>
        
        <div className={styles.formGroup}>
          <div className={styles.imageDropzoneGallery}>
            <input type="file" accept="image/*" multiple onChange={handleGalleryChange} className={styles.hiddenFileInput} />
            <div className={styles.dropzoneText}>
              + Add Images
            </div>
          </div>
        </div>

        {galleryItems.length > 0 && (
          <SortableGallery images={galleryItems} setImages={setGalleryItems} showLabel={true} />
        )}
      </div>

      <div className={styles.formSection}>
        <div className={styles.formSectionTitle}>X-Rays (Optional)</div>
        <p className={styles.sectionHint}>Upload X-rays and provide labels (e.g. Pre-op Panoramic).</p>
        
        <div className={styles.formGroup}>
          <div className={styles.imageDropzoneGallery}>
            <input type="file" accept="image/*" multiple onChange={handleXrayChange} className={styles.hiddenFileInput} />
            <div className={styles.dropzoneText}>
              + Add X-Rays
            </div>
          </div>
        </div>

        {xrayItems && xrayItems.length > 0 && (
          <SortableGallery images={xrayItems} setImages={setXrayItems} showLabel={true} />
        )}
      </div>
    </>
  );
}

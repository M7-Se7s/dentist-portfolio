import React from 'react';
import dynamic from 'next/dynamic';

const SortableGallery = dynamic(() => import('@/components/SortableGallery'), { ssr: false });

export default function ImageUploadSection({
  beforePreview, setBeforePreview, setBeforeImage,
  afterPreview, setAfterPreview, setAfterImage,
  galleryItems, setGalleryItems,
  styles
}) {

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
      setAfterImage(file);
      setAfterPreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;
    
    const newItems = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      url: URL.createObjectURL(file)
    }));
    
    setGalleryItems(prev => [...prev, ...newItems]);
  };

  return (
    <>
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
            <div className={styles.imageDropzoneSplit}>
              <input type="file" accept="image/*" onChange={handleAfterChange} className={styles.hiddenFileInput} required />
              {afterPreview ? (
                <img src={afterPreview} alt="Preview" className={styles.imageDropzonePreview} />
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

      <div className={styles.formSection}>
        <div className={styles.formSectionTitle}>Case Gallery (Optional)</div>
        <p className={styles.sectionHint}>Upload additional images (e.g. X-rays, prep stages, mockups).</p>
        
        <div className={styles.formGroup}>
          <div className={styles.imageDropzoneGallery}>
            <input type="file" accept="image/*" multiple onChange={handleGalleryChange} className={styles.hiddenFileInput} />
            <div className={styles.dropzoneText}>
              + Add Images
            </div>
          </div>
        </div>

        {galleryItems.length > 0 && (
          <SortableGallery images={galleryItems} setImages={setGalleryItems} />
        )}
      </div>
    </>
  );
}

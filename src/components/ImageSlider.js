"use client";

import { useState } from 'react';
import Image from 'next/image';
import styles from './ImageSlider.module.css';

export default function ImageSlider({ beforeImage, afterImage, priority = false }) {
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSliderChange = (e) => {
    setSliderPosition(e.target.value);
  };

  if (!beforeImage || !afterImage) {
    return (
      <div className={styles.fallback} style={{ position: 'relative', overflow: 'hidden' }}>
        {afterImage || beforeImage ? (
          <>
            <Image src={afterImage || beforeImage} alt="" className={styles.imageBackground} fill sizes="(max-width: 768px) 100vw, 50vw" priority={priority} />
            <Image src={afterImage || beforeImage} alt="Case image" className={styles.imageForeground} fill sizes="(max-width: 768px) 100vw, 50vw" priority={priority} />
          </>
        ) : (
          <div className={styles.noImage}>No images available</div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.container} dir="ltr">
      {/* Before Image */}
      <div className={styles.imageWrapper}>
        {/* Blurred background to fill empty space */}
        <Image src={beforeImage} alt="" className={styles.imageBackground} fill sizes="(max-width: 768px) 100vw, 50vw" priority={priority} />
        {/* Actual image contained */}
        <Image src={beforeImage} alt="Before treatment" className={styles.imageForeground} fill sizes="(max-width: 768px) 100vw, 50vw" draggable="false" priority={priority} />
        <span className={styles.labelBefore} style={{ zIndex: 20 }}>Before</span>
      </div>

      {/* After Image (Clipped) */}
      <div 
        className={`${styles.imageWrapper} ${styles.afterImage}`}
        style={{ clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)` }}
      >
        {/* Blurred background to fill empty space */}
        <Image src={afterImage} alt="" className={styles.imageBackground} fill sizes="(max-width: 768px) 100vw, 50vw" priority={priority} />
        {/* Actual image contained */}
        <Image src={afterImage} alt="After treatment" className={styles.imageForeground} fill sizes="(max-width: 768px) 100vw, 50vw" draggable="false" priority={priority} />
        <span className={styles.labelAfter} style={{ zIndex: 20 }}>After</span>
      </div>

      {/* Visual Slider Line */}
      <div className={styles.sliderLine} style={{ left: `${sliderPosition}%` }}>
        <div className={styles.sliderHandle}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{transform: 'translateX(-3px)'}}/>
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{transform: 'translateX(3px)'}}/>
          </svg>
        </div>
      </div>

      {/* Invisible Range Input to control interaction */}
      <input 
        type="range" 
        min="0" 
        max="100" 
        value={sliderPosition} 
        onChange={handleSliderChange} 
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        className={styles.sliderInput}
        aria-label="Image comparison slider"
        aria-valuenow={sliderPosition}
      />
    </div>
  );
}

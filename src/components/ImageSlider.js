"use client";

import { useState } from 'react';
import styles from './ImageSlider.module.css';

export default function ImageSlider({ beforeImage, afterImage }) {
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSliderChange = (e) => {
    setSliderPosition(e.target.value);
  };

  if (!beforeImage || !afterImage) {
    return (
      <div className={styles.fallback}>
        {afterImage || beforeImage ? (
          <img src={afterImage || beforeImage} alt="Case image" />
        ) : (
          <div className={styles.noImage}>No images available</div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Before Image (Background) */}
      <div className={styles.imageWrapper}>
        <img src={beforeImage} alt="Before treatment" className={styles.image} draggable="false" />
        <span className={styles.labelBefore}>Before</span>
      </div>

      {/* After Image (Foreground, clipped) */}
      <div 
        className={`${styles.imageWrapper} ${styles.afterImage}`}
        style={{ clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)` }}
      >
        <img src={afterImage} alt="After treatment" className={styles.image} draggable="false" />
        <span className={styles.labelAfter}>After</span>
      </div>

      {/* Visual Slider Line */}
      <div className={styles.sliderLine} style={{ left: `${sliderPosition}%` }}>
        <div className={styles.sliderHandle}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{transform: 'translateX(6px)'}}/>
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
      />
    </div>
  );
}

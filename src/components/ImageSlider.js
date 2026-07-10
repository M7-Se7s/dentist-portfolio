"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import styles from './ImageSlider.module.css';

export default function ImageSlider({ beforeImage, afterImage, priority = false }) {
  const [sliderPosition, setSliderPosition] = useState(50);

  const sliderRef = useRef(null);

  const handleMove = (e) => {
    if (!sliderRef.current) return;
    
    // Support both Touch and Mouse coordinates
    let clientX;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
    } else if (e.clientX !== undefined) {
      clientX = e.clientX;
    }
    
    if (clientX !== undefined) {
      const rect = sliderRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(percentage);
    }
  };

  const handleInteraction = (e) => {
    // If it's a mouse event, ensure the primary button is pressed
    if (e.type.includes('mouse') && e.buttons !== 1) return;
    handleMove(e);
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
    <div 
      ref={sliderRef}
      className={styles.container} 
      dir="ltr"
      onMouseMove={handleInteraction}
      onMouseDown={handleInteraction}
      onTouchMove={handleMove}
      onTouchStart={handleMove}
      style={{ touchAction: 'none', userSelect: 'none', WebkitUserSelect: 'none', cursor: 'ew-resize' }}
    >
      {/* Before Image (Clipped to the left) */}
      <div 
        className={styles.imageWrapper}
        style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
      >
        <Image src={beforeImage} alt="" className={styles.imageBackground} fill sizes="(max-width: 768px) 100vw, 50vw" priority={priority} />
        <Image src={beforeImage} alt="Before treatment" className={styles.imageForeground} fill sizes="(max-width: 768px) 100vw, 50vw" draggable="false" priority={priority} />
        <span className={styles.labelBefore} style={{ zIndex: 20 }}>Before</span>
      </div>

      {/* After Image (Clipped) */}
      <div 
        className={`${styles.imageWrapper} ${styles.afterImage}`}
        style={{ clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)` }}
      >
        <Image src={afterImage} alt="" className={styles.imageBackground} fill sizes="(max-width: 768px) 100vw, 50vw" priority={priority} />
        <Image src={afterImage} alt="After treatment" className={styles.imageForeground} fill sizes="(max-width: 768px) 100vw, 50vw" draggable="false" priority={priority} />
        <span className={styles.labelAfter} style={{ zIndex: 20 }}>After</span>
      </div>

      <div className={styles.sliderLine} style={{ left: `${sliderPosition}%`, pointerEvents: 'none' }}>
        <div className={styles.sliderHandle}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{transform: 'translateX(-3px)'}}/>
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{transform: 'translateX(3px)'}}/>
          </svg>
        </div>
      </div>
    </div>
  );
}

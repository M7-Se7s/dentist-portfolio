"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import styles from './ImageCarousel.module.css';

export default function ImageCarousel({ images = [], alt = "Case image", priority = false }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className={styles.carouselWrapper}>
        <div className={styles.carouselSlide}>
          <img src="/images/placeholder.jpg" alt="Placeholder" className={styles.slideImage} />
        </div>
      </div>
    );
  }

  // Handle single image
  if (images.length === 1) {
    return (
      <div className={styles.carouselWrapper}>
        <div className={styles.carouselSlide}>
          <Image 
            src={images[0]} 
            alt={alt} 
            className={styles.slideImage} 
            fill 
            sizes="(max-width: 768px) 100vw, 50vw" 
            priority={priority} 
            unoptimized={true}
          />
        </div>
      </div>
    );
  }

  const goNext = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (currentIndex < images.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const goPrev = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches ? e.touches[0].clientX : e.clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentX = e.touches ? e.touches[0].clientX : e.clientX;
    const diff = currentX - startX;
    setCurrentTranslate(diff);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (currentTranslate < -50 && currentIndex < images.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (currentTranslate > 50 && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
    setCurrentTranslate(0);
  };

  return (
    <div className={styles.carouselWrapper}>
      <div 
        className={styles.carouselTrack}
        style={{ 
          transform: `translateX(calc(-${currentIndex * 100}% + ${currentTranslate}px))`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out'
        }}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onMouseLeave={() => isDragging && handleTouchEnd()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((img, idx) => (
          <div key={idx} className={styles.carouselSlide}>
             <Image 
                src={img} 
                alt={`${alt} - Image ${idx + 1}`} 
                className={styles.slideImage} 
                fill 
                sizes="(max-width: 768px) 100vw, 50vw" 
                priority={priority && idx === 0} 
                unoptimized={true}
              />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {currentIndex > 0 && (
        <button 
          className={`${styles.navButton} ${styles.prevButton}`} 
          onClick={goPrev}
          aria-label="Previous image"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
      )}
      
      {currentIndex < images.length - 1 && (
        <button 
          className={`${styles.navButton} ${styles.nextButton}`} 
          onClick={goNext}
          aria-label="Next image"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      )}

      {/* Pagination Dots */}
      <div className={styles.pagination}>
        {images.map((_, idx) => (
          <div 
            key={idx} 
            className={`${styles.dot} ${idx === currentIndex ? styles.dotActive : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setCurrentIndex(idx);
            }}
          />
        ))}
      </div>
    </div>
  );
}

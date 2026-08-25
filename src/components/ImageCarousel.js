"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import styles from "./ImageCarousel.module.css";

export default function ImageCarousel({
  images = [],
  alt = "Case image",
  priority = false,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const trackRef = useRef(null);

  if (!images || images.length === 0) {
    return (
      <div className={styles.carouselWrapper} dir="ltr">
        <div className={styles.carouselSlide}>
          <img
            src="/images/placeholder.jpg"
            alt="Placeholder"
            className={styles.slideImage}
          />
        </div>
      </div>
    );
  }

  // Handle single image
  if (images.length === 1) {
    return (
      <div className={styles.carouselWrapper} dir="ltr">
        <div className={styles.carouselSlide}>
          <Image
            src={images[0]}
            alt={alt}
            className={styles.slideImage}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={priority}
            unoptimized={true}
            style={{ objectFit: "contain", objectPosition: "center" }}
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
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const goPrev = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setIsScrolling(false);
    setStartX(e.touches ? e.touches[0].clientX : e.clientX);
    setStartY(e.touches ? e.touches[0].clientY : e.clientY);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;

    const currentX = e.touches ? e.touches[0].clientX : e.clientX;
    const currentY = e.touches ? e.touches[0].clientY : e.clientY;

    const diffX = currentX - startX;
    const diffY = currentY - startY;

    if (!isScrolling) {
      if (Math.abs(diffY) > Math.abs(diffX)) {
        setIsScrolling(true);
        setIsDragging(false);
        return;
      }
    }

    if (!isScrolling) {
      setCurrentTranslate(diffX);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    // Use a relative threshold based on track width (20%) so swipes work on different screen sizes
    let threshold = 50;
    try {
      const rect = trackRef.current && trackRef.current.getBoundingClientRect();
      if (rect && rect.width) threshold = rect.width * 0.2; // 20% of width
    } catch (err) {}

    if (currentTranslate < -threshold && currentIndex < images.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (currentTranslate > threshold && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
    setCurrentTranslate(0);
  };

  return (
    <div className={styles.carouselWrapper} dir="ltr">
      <div
        ref={trackRef}
        className={styles.carouselTrack}
        style={{
          transform: `translateX(calc(-${currentIndex * 100}% + ${currentTranslate}px))`,
          transition: isDragging ? "none" : "transform 0.3s ease-out",
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
              priority={idx === 0 && priority}
              unoptimized={true}
              style={{ objectFit: "contain", objectPosition: "center" }}
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
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}

      {currentIndex < images.length - 1 && (
        <button
          className={`${styles.navButton} ${styles.nextButton}`}
          onClick={goNext}
          aria-label="Next image"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}

      {/* Pagination Dots */}
      <div className={styles.pagination}>
        {images.map((_, idx) => (
          <div
            key={idx}
            className={`${styles.dot} ${idx === currentIndex ? styles.dotActive : ""}`}
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

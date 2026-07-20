"use client";

import { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './ImageAlignmentEditor.module.css';

/**
 * ImageAlignmentEditor — Ghost Overlay Alignment Tool
 * 
 * Allows the admin to align an "After" image against a semi-transparent
 * "Before" ghost overlay using drag and zoom. Exports the aligned result
 * as a File via the Canvas API.
 * 
 * Props:
 *   beforeSrc    - URL string for the "Before" reference image (blob or Cloudinary)
 *   afterFile    - File object for the "After" image to be aligned
 *   onConfirm    - (alignedFile: File) => void — called with the cropped aligned image
 *   onSkip       - () => void — called when user skips alignment (use original)
 *   onCancel     - () => void — called when user closes without saving
 */
export default function ImageAlignmentEditor({ beforeSrc, afterFile, onConfirm, onSkip, onCancel }) {
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [overlayOpacity, setOverlayOpacity] = useState(0.5);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  // Refs
  const canvasAreaRef = useRef(null);
  const hiddenCanvasRef = useRef(null);
  const afterImgRef = useRef(null);
  const beforeImgRef = useRef(null);
  
  // Drag state
  const dragState = useRef({ isDragging: false, startX: 0, startY: 0, startTx: 0, startTy: 0 });
  
  // Pinch state
  const pinchState = useRef({ isPinching: false, initialDistance: 0, initialScale: 1 });
  
  // After image as blob URL
  const [afterSrc, setAfterSrc] = useState(null);
  
  useEffect(() => {
    if (afterFile) {
      if (typeof afterFile === 'string') {
        setAfterSrc(afterFile);
      } else {
        const url = URL.createObjectURL(afterFile);
        setAfterSrc(url);
        return () => URL.revokeObjectURL(url);
      }
    }
  }, [afterFile]);

  // Prevent body scrolling while the editor is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // =====================
  // Mouse drag handlers
  // =====================
  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    dragState.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      startTx: translate.x,
      startTy: translate.y,
    };
  }, [translate]);

  const handleMouseMove = useCallback((e) => {
    if (!dragState.current.isDragging) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    setTranslate({
      x: dragState.current.startTx + dx,
      y: dragState.current.startTy + dy,
    });
  }, []);

  const handleMouseUp = useCallback(() => {
    dragState.current.isDragging = false;
  }, []);

  // =====================
  // Touch drag + pinch handlers
  // =====================
  const getTouchDistance = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    if (e.touches.length === 2) {
      // Pinch start
      pinchState.current = {
        isPinching: true,
        initialDistance: getTouchDistance(e.touches),
        initialScale: scale,
      };
    } else if (e.touches.length === 1) {
      // Drag start
      dragState.current = {
        isDragging: true,
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY,
        startTx: translate.x,
        startTy: translate.y,
      };
    }
  }, [translate, scale]);

  const handleTouchMove = useCallback((e) => {
    e.preventDefault();
    if (e.touches.length === 2 && pinchState.current.isPinching) {
      // Pinch zoom
      const dist = getTouchDistance(e.touches);
      const ratio = dist / pinchState.current.initialDistance;
      const newScale = Math.max(0.3, Math.min(3, pinchState.current.initialScale * ratio));
      setScale(newScale);
    } else if (e.touches.length === 1 && dragState.current.isDragging && !pinchState.current.isPinching) {
      // Drag move
      const dx = e.touches[0].clientX - dragState.current.startX;
      const dy = e.touches[0].clientY - dragState.current.startY;
      setTranslate({
        x: dragState.current.startTx + dx,
        y: dragState.current.startTy + dy,
      });
    }
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (e.touches.length < 2) {
      pinchState.current.isPinching = false;
    }
    if (e.touches.length === 0) {
      dragState.current.isDragging = false;
    }
  }, []);

  // =====================
  // Scroll wheel zoom
  // =====================
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    setScale(prev => Math.max(0.3, Math.min(3, prev + delta)));
  }, []);

  // =====================
  // Reset transforms
  // =====================
  const handleReset = () => {
    setTranslate({ x: 0, y: 0 });
    setScale(1);
  };

  // =====================
  // Export aligned image via Canvas
  // =====================
  const handleConfirm = useCallback(() => {
    const canvas = hiddenCanvasRef.current;
    const canvasArea = canvasAreaRef.current;
    const afterImg = afterImgRef.current;
    
    if (!canvas || !canvasArea || !afterImg) return;
    
    // Get the visible area dimensions
    const areaRect = canvasArea.getBoundingClientRect();
    const areaW = areaRect.width;
    const areaH = areaRect.height;
    
    // Set canvas size to match the visible area (at higher res for quality)
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = areaW * dpr;
    canvas.height = areaH * dpr;
    
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    
    // Calculate the after image's natural dimensions
    const imgNatW = afterImg.naturalWidth;
    const imgNatH = afterImg.naturalHeight;
    const imgAspect = imgNatW / imgNatH;
    
    // We render the after image based on CSS: width: 100%, height: auto
    // This means it fills the canvas area width, and its height scales proportionally.
    const drawW = areaW;
    const drawH = areaW / imgAspect;
    
    // Base position is top-left (0, 0)
    const drawX = 0;
    const drawY = 0;
    
    // Apply user transforms (translate + scale around center)
    const centerX = areaW / 2;
    const centerY = areaH / 2;
    
    ctx.save();
    ctx.translate(centerX + translate.x, centerY + translate.y);
    ctx.scale(scale, scale);
    ctx.translate(-centerX, -centerY);
    ctx.drawImage(afterImg, drawX, drawY, drawW, drawH);
    ctx.restore();
    
    // Export as blob
    canvas.toBlob((blob) => {
      if (blob) {
        const alignedFile = new File([blob], afterFile.name || 'aligned-after.jpg', { 
          type: 'image/jpeg',
          lastModified: Date.now()
        });
        onConfirm(alignedFile);
      }
    }, 'image/jpeg', 0.92);
  }, [translate, scale, afterFile, onConfirm]);

  // Compute transform style for the After image
  const afterStyle = {
    transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
    opacity: overlayOpacity,
  };

  if (!afterSrc) return null;

  if (!mounted) return null;

  return createPortal(
    <div className={styles.overlay}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
          </svg>
          Align After Image
          <span className={styles.headerHint}>Drag & zoom to match the Before image</span>
        </div>
        <button className={styles.closeBtn} onClick={onCancel} type="button" aria-label="Close">✕</button>
      </div>

      {/* Canvas Area wrapped in a flexible container */}
      <div className={styles.canvasContainer}>
        <div
          ref={canvasAreaRef}
          className={styles.canvasArea}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
        >
        <img
          ref={beforeImgRef}
          src={beforeSrc}
          alt="Before (ghost reference)"
          className={styles.ghostImage}
          draggable={false}
          crossOrigin="anonymous"
        />
        <span className={styles.ghostLabel}>Before (Ghost)</span>

        {/* Active (After) image */}
        <img
          ref={afterImgRef}
          src={afterSrc}
          alt="After (align this)"
          className={styles.activeImage}
          style={afterStyle}
          draggable={false}
          crossOrigin="anonymous"
        />

        {/* Crosshair guides */}
        <div className={styles.crosshairH}></div>
        <div className={styles.crosshairV}></div>
      </div>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        {/* Overlay Opacity */}
        <div className={styles.opacityRow}>
          <span className={styles.zoomLabel}>Opacity</span>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={overlayOpacity}
            onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
            className={styles.zoomSlider}
          />
          <span className={styles.zoomValue}>{Math.round(overlayOpacity * 100)}%</span>
        </div>

        {/* Zoom */}
        <div className={styles.zoomRow}>
          <span className={styles.zoomLabel}>Zoom</span>
          <input
            type="range"
            min="0.3"
            max="3"
            step="0.05"
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            className={styles.zoomSlider}
          />
          <span className={styles.zoomValue}>{Math.round(scale * 100)}%</span>
        </div>

        {/* Buttons */}
        <div className={styles.buttonRow}>
          <button className={`${styles.btn} ${styles.btnReset}`} onClick={handleReset} type="button">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Reset
          </button>
          <button className={`${styles.btn} ${styles.btnSkip}`} onClick={onSkip} type="button">
            Skip
          </button>
          <button className={`${styles.btn} ${styles.btnConfirm}`} onClick={handleConfirm} type="button">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Confirm Alignment
          </button>
        </div>
      </div>

      {/* Hidden canvas for export */}
      <canvas ref={hiddenCanvasRef} className={styles.hiddenCanvas}></canvas>
    </div>,
    document.body
  );
}

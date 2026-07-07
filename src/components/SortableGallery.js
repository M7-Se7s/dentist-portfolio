"use client";

import React from 'react';
import Image from 'next/image';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styles from '../app/[locale]/admin/admin.module.css';

// Sortable Item Component
function SortableItem(props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: transform ? 999 : 1, // bring to front while dragging
  };

  return (
    <div ref={setNodeRef} style={style} className={styles.galleryItem} {...attributes} {...listeners}>
      <Image src={props.url} alt="Gallery item" fill sizes="(max-width: 768px) 50vw, 25vw" style={{ objectFit: 'contain' }} draggable="false" />
      <button 
        className={styles.removeGalleryBtn} 
        onClick={(e) => {
          e.stopPropagation();
          props.onRemove(props.id);
        }}
        type="button"
      >
        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>
  );
}

// Main Sortable Gallery Component
export default function SortableGallery({ images, setImages }) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px drag distance before activating to allow clicks on buttons inside
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleRemove = (id) => {
    setImages(images.filter((img) => img.id !== id));
  };

  if (!images || images.length === 0) return null;

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext 
        items={images.map(img => img.id)}
        strategy={rectSortingStrategy}
      >
        <div className={styles.galleryGrid}>
          {images.map((img) => (
            <SortableItem 
              key={img.id} 
              id={img.id} 
              url={img.url} 
              onRemove={handleRemove} 
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

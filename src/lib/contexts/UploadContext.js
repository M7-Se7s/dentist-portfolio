"use client";

import { createContext, useContext, useState, useCallback } from 'react';
import imageCompression from 'browser-image-compression';
import { casesService } from '../services/casesService';
import { auth } from '../firebase';
import { triggerRevalidation } from '../actions/revalidate';

export const UploadContext = createContext();

export function useUploads() {
  return useContext(UploadContext);
}

export function UploadProvider({ children }) {
  const [activeUploads, setActiveUploads] = useState([]);

  const updateJob = useCallback((id, updates) => {
    setActiveUploads(prev => prev.map(job => job.id === id ? { ...job, ...updates } : job));
  }, []);

  const clearJob = useCallback((id) => {
    setActiveUploads(prev => prev.filter(job => job.id !== id));
  }, []);

  const uploadFile = async (file) => {
    if (!file) return null;
    let fileToUpload = file;
    try {
      const options = { maxSizeMB: 8, maxWidthOrHeight: 2048, useWebWorker: true };
      fileToUpload = await imageCompression(file, options);
    } catch (error) {
      console.warn('Compression failed, using original', error);
    }

    const formData = new FormData();
    formData.append('file', fileToUpload);
    
    let token = null;
    if (auth.currentUser) {
      token = await auth.currentUser.getIdToken();
    }

    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch('/api/upload', { 
      method: 'POST', 
      headers,
      body: formData 
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Upload failed (${res.status}): ${errorText}`);
    }
    const data = await res.json();
    return data.url;
  };

  // Process a chunk of promises with a concurrency limit
  const processInChunks = async (tasks, limit = 5, onProgress) => {
    const results = new Array(tasks.length);
    let index = 0;
    let completed = 0;

    const executeTask = async () => {
      while (index < tasks.length) {
        const currentIndex = index++;
        const task = tasks[currentIndex];
        
        try {
          results[currentIndex] = await task();
        } catch (error) {
          throw error; // Fail fast if any upload fails
        }
        
        completed++;
        if (onProgress) onProgress(completed, tasks.length);
      }
    };

    const workers = [];
    for (let i = 0; i < Math.min(limit, tasks.length); i++) {
      workers.push(executeTask());
    }

    await Promise.all(workers);
    return results;
  };

  const processJob = async (job) => {
    updateJob(job.id, { status: 'uploading', error: null, progress: 0 });
    
    try {
      const { 
        mode, // 'create' or 'edit'
        caseId, // if edit
        formData, 
        caseType,
        coverImageFile,
        beforeImageFile, 
        afterImageFile, 
        galleryItems,
        xrayItems,
        treatmentSteps 
      } = job.payload;

      // 1. Gather all required uploads into a flat list of tasks
      const uploadTasks = [];
      let totalFiles = 0;

      let finalBeforeUrl = formData.beforeImage || '';
      if (beforeImageFile) {
        totalFiles++;
        uploadTasks.push(async () => {
          finalBeforeUrl = await uploadFile(beforeImageFile);
        });
      }

      let finalAfterUrl = formData.afterImage || '';
      if (afterImageFile) {
        totalFiles++;
        uploadTasks.push(async () => {
          finalAfterUrl = await uploadFile(afterImageFile);
        });
      }

      let finalCoverUrl = formData.coverImage || '';
      if (coverImageFile) {
        totalFiles++;
        uploadTasks.push(async () => {
          finalCoverUrl = await uploadFile(coverImageFile);
        });
      }

      const finalGalleryItems = [];
      for (const item of galleryItems || []) {
        if (item.file) {
          totalFiles++;
          uploadTasks.push(async () => {
            const url = await uploadFile(item.file);
            if (url) finalGalleryItems.push({ url, label: item.label || '' });
          });
        } else if (item.url) {
          finalGalleryItems.push({ url: item.url, label: item.label || '' });
        }
      }

      const finalXrayItems = [];
      for (const item of xrayItems || []) {
        if (item.file) {
          totalFiles++;
          uploadTasks.push(async () => {
            const url = await uploadFile(item.file);
            if (url) finalXrayItems.push({ url, label: item.label || '' });
          });
        } else if (item.url) {
          finalXrayItems.push({ url: item.url, label: item.label || '' });
        }
      }

      const finalSteps = [];
      for (let i = 0; i < (treatmentSteps || []).length; i++) {
        const step = treatmentSteps[i];
        const stepImages = [...(step.existingImages || [])];
        
        finalSteps.push({
          title: step.title || '',
          titleAr: step.titleAr || '',
          description: step.description || '',
          descriptionAr: step.descriptionAr || '',
          images: stepImages
        });
        
        if (step.files && step.files.length > 0) {
          for (const file of step.files) {
            totalFiles++;
            uploadTasks.push(async () => {
              const url = await uploadFile(file);
              if (url) finalSteps[i].images.push(url);
            });
          }
        }
      }

      // If no files to upload, set progress to 100
      if (totalFiles === 0) {
        updateJob(job.id, { progress: 100 });
      } else {
        await processInChunks(uploadTasks, 5, (completed, total) => {
          const progress = Math.round((completed / total) * 100);
          updateJob(job.id, { progress });
        });
      }

      // 2. All uploads succeeded, construct final document
      const caseDoc = {
        ...formData,
        caseType: caseType || 'detailed',
        coverImage: finalCoverUrl,
        beforeImage: finalBeforeUrl,
        afterImage: finalAfterUrl,
        images: finalGalleryItems,
        xrays: finalXrayItems,
        steps: finalSteps,
      };

      // 3. Save to Firestore
      let finalCaseId = caseId;
      if (mode === 'create') {
        finalCaseId = await casesService.createCase(caseDoc);
      } else if (mode === 'edit') {
        await casesService.updateCase(caseId, caseDoc);
      }

      // Trigger On-Demand Revalidation
      triggerRevalidation([
        '/[locale]/cases',
        `/[locale]/cases/[id]`
      ], 'page');

      // 4. Mark as done and clear after a few seconds
      updateJob(job.id, { status: 'done', progress: 100 });
      setTimeout(() => {
        clearJob(job.id);
        window.dispatchEvent(new Event('case_uploaded'));
      }, 3000);

    } catch (error) {
      console.error("Background Upload Job Failed:", error);
      updateJob(job.id, { status: 'error', error: error.message });
    }
  };

  const startCaseUpload = (payload) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newJob = {
      id,
      title: payload.formData.title || 'Untitled Case',
      status: 'uploading', // 'uploading' | 'error' | 'done'
      progress: 0,
      error: null,
      payload
    };
    
    setActiveUploads(prev => [newJob, ...prev]);
    processJob(newJob);
  };

  const retryJob = (id) => {
    const job = activeUploads.find(j => j.id === id);
    if (job) {
      processJob(job);
    }
  };

  return (
    <UploadContext.Provider value={{ activeUploads, startCaseUpload, retryJob, clearJob }}>
      {children}
    </UploadContext.Provider>
  );
}

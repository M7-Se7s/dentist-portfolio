"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CreateCaseModal from './CreateCaseModal';
import styles from '../../admin.module.css';
import { casesService } from '@/lib/services/casesService';
import { useUploads } from '@/lib/contexts/UploadContext';

export default function CaseManagementPage() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [caseToDelete, setCaseToDelete] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { activeUploads, retryJob, clearJob } = useUploads();

  const loadCases = async () => {
    try {
      setLoading(true);
      const data = await casesService.getCases();
      setCases(data);
    } catch (error) {
      console.error("Failed to load cases", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCases();

    // Listen for custom event from UploadContext to refresh list when an upload succeeds
    const handleCaseUploaded = () => loadCases();
    window.addEventListener('case_uploaded', handleCaseUploaded);
    return () => window.removeEventListener('case_uploaded', handleCaseUploaded);
  }, []);

  const promptDelete = (caseItem) => {
    setCaseToDelete(caseItem);
    setModalOpen(true);
  };

  const cancelDelete = () => {
    setModalOpen(false);
    setCaseToDelete(null);
  };

  const confirmDelete = async () => {
    if (!caseToDelete) return;
    try {
      await casesService.deleteCase(caseToDelete.id);
      setCases(cases.filter(c => c.id !== caseToDelete.id));
    } catch (error) {
      console.error("Failed to delete case", error);
    } finally {
      setModalOpen(false);
      setCaseToDelete(null);
    }
  };

  return (
    <>
      <div className="animate-slideUp stagger-1">
        <div className={styles.caseManagementHeader} style={{ marginBottom: '2rem' }}>
          <div>
            <h1 className={styles.pageTitle}>Clinical Case Management</h1>
            <p className={styles.pageSubtitle}>Manage, edit, and organize all your clinical procedures.</p>
          </div>
          
          {/* Desktop Button - Hidden on Mobile */}
          <button onClick={() => setShowCreateModal(true)} className={`${styles.newCaseBtn} ${styles.desktopBtn}`} style={{border: 'none', cursor: 'pointer'}}>
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            <span className={styles.newCaseBtnText}>Add New Case</span>
          </button>
        </div>

      <div className={styles.caseCardGrid}>
        
        {/* Render Active Uploads */}
        {activeUploads && activeUploads.map(upload => (
          <div key={upload.id} className={styles.caseCardItem} style={{ border: '2px dashed var(--primary-color)' }}>
            <div className={styles.caseCardHeader}>
              <div className={styles.caseAvatar} style={{ background: 'var(--bg-secondary)', color: 'var(--primary-color)' }}>
                {upload.title.substring(0, 2).toUpperCase()}
              </div>
              <div className={styles.caseAdminActions}>
                {upload.status === 'error' ? (
                  <>
                    <button onClick={() => retryJob(upload.id)} className="btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>Retry</button>
                    <button onClick={() => clearJob(upload.id)} className="btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>Cancel</button>
                  </>
                ) : upload.status === 'done' ? (
                  <span style={{ fontSize: '0.85rem', color: '#10B981', fontWeight: 600 }}>Complete!</span>
                ) : (
                  <span style={{ fontSize: '0.85rem', color: 'var(--primary-color)', fontWeight: 600 }}>{upload.progress}%</span>
                )}
              </div>
            </div>
            
            <h3 className={styles.caseCardTitle}>{upload.title}</h3>
            
            <div className={styles.caseCardDetails} style={{ marginTop: '1rem' }}>
              <div style={{ width: '100%', backgroundColor: 'var(--border-color)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ 
                  height: '100%', 
                  backgroundColor: upload.status === 'error' ? '#EF4444' : upload.status === 'done' ? '#10B981' : 'var(--primary-color)', 
                  width: `${upload.progress}%`,
                  transition: 'width 0.3s ease'
                }} />
              </div>
              {upload.status === 'error' && (
                <p style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: '0.5rem' }}>{upload.error}</p>
              )}
            </div>
          </div>
        ))}

        {loading ? (
          <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)'}}>
            Loading cases...
          </div>
        ) : cases.length === 0 && activeUploads.length === 0 ? (
          <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)'}}>
            No cases found. Start by adding a new case!
          </div>
        ) : (
          cases.map(caseItem => {
            const date = new Date(caseItem.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            return (
              <div key={caseItem.id} className={styles.caseCardItem}>
                <div className={styles.caseCardHeader}>
                  <div className={styles.caseAvatar}>
                    {caseItem.title.substring(0, 2).toUpperCase()}
                  </div>
                  <div className={styles.caseAdminActions}>
                    <Link href={`/admin/dashboard/edit-case/${caseItem.id}`} className={`${styles.actionBtn} ${styles.edit}`}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </Link>
                    <button onClick={() => promptDelete(caseItem)} className={`${styles.actionBtn} ${styles.delete}`}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </div>
                
                <h3 className={styles.caseCardTitle}>{caseItem.title}</h3>
                
                <div className={styles.caseCardDetails}>
                  <div className={styles.caseCardDetailItem}>
                    <span className={styles.caseCardDetailLabel}>Category:</span>
                    <span className={styles.caseCardDetailValue}>{caseItem.category || 'General'}</span>
                  </div>
                  <div className={styles.caseCardDetailItem}>
                    <span className={styles.caseCardDetailLabel}>Last Modified:</span>
                    <span className={styles.caseCardDetailValue}>{date}</span>
                  </div>
                  <div className={styles.caseCardDetailItem} style={{marginTop: '0.5rem'}}>
                    {caseItem.isDraft ? (
                      <span className={styles.statusBadge} style={{backgroundColor: '#FEF3C7', color: '#B45309', borderColor: '#FDE68A'}}>Draft</span>
                    ) : (
                      <span className={styles.statusBadge}>Published</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      </div>

      {/* Custom Delete Modal (Mock) */}
      {modalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div style={{color: '#EF4444', marginBottom: '1rem'}}>
              <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{margin: '0 auto'}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            <h3 className={styles.modalTitle}>Delete Case</h3>
            <p className={styles.modalText}>
              Are you sure you want to delete <strong>{caseToDelete?.title}</strong>? <br/>This action cannot be undone.
            </p>
            <div className={styles.modalActions}>
              <button onClick={cancelDelete} className="btn-secondary">Cancel</button>
              <button onClick={confirmDelete} className="btn-primary" style={{backgroundColor: '#EF4444', borderColor: '#EF4444'}}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile FAB - Outside of animated container to preserve fixed positioning */}
      <button onClick={() => setShowCreateModal(true)} className={`${styles.newCaseBtn} ${styles.mobileFab}`} style={{border: 'none', cursor: 'pointer'}}>
        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
      </button>

      {/* Create Case Modal */}
      {showCreateModal && (
        <CreateCaseModal 
          onClose={() => setShowCreateModal(false)} 
          onSuccess={() => {
            setShowCreateModal(false);
            loadCases();
          }}
        />
      )}
    </>
  );
}

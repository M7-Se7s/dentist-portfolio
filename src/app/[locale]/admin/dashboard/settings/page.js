"use client";

import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { updatePassword } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import styles from '../../admin.module.css';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [isSavingContact, setIsSavingContact] = useState(false);
  const [contactMsg, setContactMsg] = useState('');

  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: '',
    whatsapp: '',
    instagram: '',
    linkedin: '',
    facebook: ''
  });

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    async function fetchSettings() {
      try {
        const docRef = doc(db, 'settings', 'global');
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setContactInfo(prev => ({ ...prev, ...snap.data() }));
        }
      } catch (e) {
        console.error("Failed to load settings:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveContact = async (e) => {
    e.preventDefault();
    setIsSavingContact(true);
    setContactMsg('');
    try {
      await setDoc(doc(db, 'settings', 'global'), contactInfo, { merge: true });
      setContactMsg('Contact settings saved successfully.');
      setTimeout(() => setContactMsg(''), 3000);
    } catch (e) {
      console.error(e);
      setContactMsg('Error saving contact settings.');
    } finally {
      setIsSavingContact(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const user = auth.currentUser;
      if (user) {
        await updatePassword(user, newPassword);
        setPasswordMsg({ type: 'success', text: 'Password updated successfully!' });
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordMsg({ type: 'error', text: 'You must be logged in to do this.' });
      }
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/requires-recent-login') {
        setPasswordMsg({ type: 'error', text: 'For security reasons, please log out and log back in before changing your password.' });
      } else {
        setPasswordMsg({ type: 'error', text: error.message });
      }
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (loading) {
    return <div className={styles.adminContent}>Loading Settings...</div>;
  }

  return (
    <div className={styles.adminContent}>
      <div className={styles.dashboardHeader}>
        <div>
          <h2>Global Settings</h2>
          <p style={{ color: 'var(--text-muted)' }}>Manage site-wide contact info, social links, and security.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', maxWidth: '800px' }}>
        
        {/* Contact & Social Settings */}
        <div className={styles.formSection}>
          <div className={styles.formSectionTitle}>Contact & Social Media</div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            These details will appear publicly in your website footer and contact sections.
          </p>

          <form onSubmit={handleSaveContact}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                <label>Public Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={contactInfo.email} 
                  onChange={handleContactChange} 
                  placeholder="e.g. dr.mohamed@example.com"
                  style={{ width: '100%', padding: '0.85rem 1rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                />
              </div>
              <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                <label>Phone Number</label>
                <input 
                  type="text" 
                  name="phone"
                  value={contactInfo.phone} 
                  onChange={handleContactChange} 
                  placeholder="e.g. +20 155 391 1135"
                  style={{ width: '100%', padding: '0.85rem 1rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                <label>WhatsApp Number</label>
                <input 
                  type="text" 
                  name="whatsapp"
                  value={contactInfo.whatsapp} 
                  onChange={handleContactChange} 
                  placeholder="e.g. +201553911135"
                  style={{ width: '100%', padding: '0.85rem 1rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                />
              </div>
              <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                <label>LinkedIn URL</label>
                <input 
                  type="url" 
                  name="linkedin"
                  value={contactInfo.linkedin} 
                  onChange={handleContactChange} 
                  placeholder="https://linkedin.com/in/..."
                  style={{ width: '100%', padding: '0.85rem 1rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                <label>Instagram URL</label>
                <input 
                  type="url" 
                  name="instagram"
                  value={contactInfo.instagram} 
                  onChange={handleContactChange} 
                  placeholder="https://instagram.com/..."
                  style={{ width: '100%', padding: '0.85rem 1rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                />
              </div>
              <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                <label>Facebook URL</label>
                <input 
                  type="url" 
                  name="facebook"
                  value={contactInfo.facebook} 
                  onChange={handleContactChange} 
                  placeholder="https://facebook.com/..."
                  style={{ width: '100%', padding: '0.85rem 1rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button type="submit" className="btn-primary" disabled={isSavingContact}>
                {isSavingContact ? 'Saving...' : 'Save Contact Info'}
              </button>
              {contactMsg && (
                <span style={{ color: contactMsg.includes('Error') ? '#EF4444' : '#10B981', fontSize: '0.9rem', fontWeight: 500 }}>
                  {contactMsg}
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Security Settings */}
        <div className={styles.formSection} style={{ border: '1px solid #FCA5A5' }}>
          <div className={styles.formSectionTitle} style={{ color: '#DC2626' }}>Account Security</div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Update your administrator login password. For security reasons, you may need to log out and log back in if your session is old.
          </p>

          <form onSubmit={handleUpdatePassword}>
            <div className={styles.formGroup}>
              <label>New Password</label>
              <input 
                type="password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                placeholder="Minimum 6 characters"
                minLength={6}
                required
                style={{ width: '100%', padding: '0.85rem 1rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Confirm New Password</label>
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                placeholder="Retype new password"
                minLength={6}
                required
                style={{ width: '100%', padding: '0.85rem 1rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button 
                type="submit" 
                disabled={isUpdatingPassword || !newPassword || !confirmPassword}
                style={{ 
                  background: '#EF4444', color: 'white', padding: '0.75rem 1.5rem', 
                  borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer',
                  opacity: (isUpdatingPassword || !newPassword) ? 0.7 : 1
                }}
              >
                {isUpdatingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </div>
            
            {passwordMsg.text && (
              <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: '6px', background: passwordMsg.type === 'error' ? '#FEF2F2' : '#ECFDF5', color: passwordMsg.type === 'error' ? '#B91C1C' : '#065F46', fontSize: '0.9rem' }}>
                {passwordMsg.text}
              </div>
            )}
          </form>
        </div>

      </div>
    </div>
  );
}

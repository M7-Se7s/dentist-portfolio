"use client";

import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import styles from '../../admin.module.css';
import localStyles from './profileEditor.module.css';
import Image from 'next/image';

export default function EditProfilePage() {
  const [biography, setBiography] = useState('');
  const [quote, setQuote] = useState('');
  const [homeImageUrl, setHomeImageUrl] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  
  const [homeImageFile, setHomeImageFile] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  
  const [homeImagePreview, setHomeImagePreview] = useState('');
  const [profileImagePreview, setProfileImagePreview] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const defaultBiography = `I am Dr. Mohamed El Sayed Mohamed Shabaan, a General Dentist with more than two years of post-internship clinical experience, providing comprehensive dental care across multiple private dental clinics in Egypt.

I successfully passed the Saudi Prometric Examination and obtained the Saudi Commission for Health Specialties (SCFHS) Professional Classification.

Throughout my clinical practice, I have developed strong experience in endodontics, oral surgery, fixed and removable prosthodontics, pediatric dentistry, and esthetic restorative dentistry. My clinical interests include comprehensive treatment planning, full-mouth rehabilitation, management of impacted wisdom teeth, coronectomy, apicoectomy, and advanced restorative procedures.

I am experienced in performing routine and advanced dental procedures, including anterior and posterior root canal treatment using various rotary systems, endodontic retreatment, crown and bridge rehabilitation, porcelain veneers, complete and removable dentures, pediatric pulpotomy and pulpectomy, stainless steel crowns, and surgical dental extractions.

Committed to continuous professional development, I actively attend advanced training courses in endodontics and oral surgery and continuously work on improving my clinical and digital dentistry skills.

I believe that successful dentistry is achieved through accurate diagnosis, evidence-based treatment planning, and delivering high-quality patient-centered care with the highest standards of infection control and professionalism.`;

  const defaultQuote = "Every case presented in this portfolio reflects my commitment to conservative treatment principles, functional rehabilitation, esthetic excellence, and continuous professional development.";

  useEffect(() => {
    async function fetchProfile() {
      try {
        const docRef = doc(db, "content", "profile");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setBiography(data.biography || defaultBiography);
          setQuote(data.quote || defaultQuote);
          if (data.homeImageUrl) {
            setHomeImageUrl(data.homeImageUrl);
            setHomeImagePreview(data.homeImageUrl);
          }
          if (data.profileImageUrl) {
            setProfileImageUrl(data.profileImageUrl);
            setProfileImagePreview(data.profileImageUrl);
          }
        } else {
          setBiography(defaultBiography);
          setQuote(defaultQuote);
        }
      } catch (err) {
        console.error("Error fetching profile", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [defaultBiography, defaultQuote]);

  const handleHomeImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHomeImageFile(file);
      setHomeImagePreview(URL.createObjectURL(file));
    }
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveHomeImage = () => {
    setHomeImageFile(null);
    setHomeImageUrl('');
    setHomeImagePreview('');
  };

  const handleRemoveProfileImage = () => {
    setProfileImageFile(null);
    setProfileImageUrl('');
    setProfileImagePreview('');
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
    
    const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload image to Cloudinary');
    }
    
    const data = await response.json();
    return data.secure_url;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      let finalHomeUrl = homeImageUrl;
      let finalProfileUrl = profileImageUrl;

      if (homeImageFile) {
        finalHomeUrl = await uploadToCloudinary(homeImageFile);
        setHomeImageUrl(finalHomeUrl);
      }

      if (profileImageFile) {
        finalProfileUrl = await uploadToCloudinary(profileImageFile);
        setProfileImageUrl(finalProfileUrl);
      }

      const docRef = doc(db, "content", "profile");
      await setDoc(docRef, {
        biography,
        quote,
        homeImageUrl: finalHomeUrl,
        profileImageUrl: finalProfileUrl
      }, { merge: true });
      
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error("Error saving profile", err);
      setMessage('Error updating profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className={styles.dashboardMainColumn}>Loading editor...</div>;

  return (
    <div className={`${styles.dashboardMainColumn} animate-slideUp`}>
      <div className={styles.pageHeader}>
        <h1 style={{fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-dark)'}}>Edit Professional Profile</h1>
        <p style={{color: 'var(--text-muted)'}}>Update your biography and professional philosophy quote.</p>
      </div>

      <div className={localStyles.formCard}>
        <form onSubmit={handleSave}>
          
          <div className={localStyles.imageUploadLayout}>
            
            {/* Home Page Photo */}
            <div className={localStyles.imageUploadColumn}>
              <label className={localStyles.imageLabel}>Home Page Photo</label>
              <p className={localStyles.hint}>
                This is the first impression photo displayed in the main hero section of your website.
              </p>
              
              <div className={localStyles.uploadZone}>
                {homeImagePreview ? (
                  <>
                    <div className={localStyles.imagePreview}>
                      <Image src={homeImagePreview} alt="Home Preview" fill style={{objectFit: 'cover'}} />
                    </div>
                    <div className={localStyles.overlay}>Click to Change Image</div>
                  </>
                ) : (
                  <>
                    <svg className={localStyles.uploadIcon} width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                    <span className={localStyles.uploadText}>Click to browse<br/>or drag image here</span>
                  </>
                )}
                <input 
                  type="file" 
                  accept="image/jpeg, image/png, image/webp" 
                  onChange={handleHomeImageChange} 
                  className={localStyles.hiddenInput}
                  title="Choose an image"
                />
              </div>

              {homeImagePreview && (
                <button type="button" onClick={handleRemoveHomeImage} className={localStyles.removeBtn}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  Remove Photo
                </button>
              )}
            </div>

            {/* Profile Page Photo */}
            <div className={localStyles.imageUploadColumn}>
              <label className={localStyles.imageLabel}>Professional Profile Photo</label>
              <p className={localStyles.hint}>
                This photo is shown next to your clinical biography on the Profile page.
              </p>
              
              <div className={localStyles.uploadZone}>
                {profileImagePreview ? (
                  <>
                    <div className={localStyles.imagePreview}>
                      <Image src={profileImagePreview} alt="Profile Preview" fill style={{objectFit: 'cover'}} />
                    </div>
                    <div className={localStyles.overlay}>Click to Change Image</div>
                  </>
                ) : (
                  <>
                    <svg className={localStyles.uploadIcon} width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    <span className={localStyles.uploadText}>Click to browse<br/>or drag image here</span>
                  </>
                )}
                <input 
                  type="file" 
                  accept="image/jpeg, image/png, image/webp" 
                  onChange={handleProfileImageChange} 
                  className={localStyles.hiddenInput}
                  title="Choose an image"
                />
              </div>

              {profileImagePreview && (
                <button type="button" onClick={handleRemoveProfileImage} className={localStyles.removeBtn}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  Remove Photo
                </button>
              )}
            </div>

          </div>

          <div className={localStyles.formGroup}>
            <label htmlFor="biography" className={localStyles.label}>Biography (Paragraphs)</label>
            <textarea
              id="biography"
              value={biography}
              onChange={(e) => setBiography(e.target.value)}
              rows="15"
              className={localStyles.textarea}
              placeholder="Enter your professional biography here..."
              required
            />
            <small className={localStyles.hint}>Line breaks will be preserved as separate paragraphs on the profile page.</small>
          </div>

          <div className={localStyles.formGroup}>
            <label htmlFor="quote" className={localStyles.label}>Philosophy Quote</label>
            <textarea
              id="quote"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              rows="3"
              className={localStyles.textarea}
              placeholder="Enter your professional philosophy quote..."
            />
          </div>

          <div className={localStyles.saveActions}>
            <button 
              type="submit" 
              className={localStyles.saveBtn} 
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
            {message && (
              <span className={`${localStyles.statusMessage} ${message.includes('Error') ? localStyles.statusError : localStyles.statusSuccess}`}>
                {message}
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

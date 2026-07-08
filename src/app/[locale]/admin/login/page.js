"use client";

import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, onIdTokenChanged } from 'firebase/auth';
import { useRouter } from '@/i18n/routing';
import { auth } from '@/lib/firebase';
import styles from '../admin.module.css';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Auto-redirect if already logged in (Firebase local persistence)
  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user && user.email === 'dr-mohammed-shabaan@dr.com') {
        const idToken = await user.getIdToken();
        document.cookie = `admin_session=${idToken}; path=/; max-age=86400; Secure; SameSite=Strict`;
        router.push('/admin/dashboard');
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Enforce single-account access
      if (userCredential.user.email !== 'dr-mohammed-shabaan@dr.com') {
        throw new Error('Unauthorized Account: This dashboard is restricted.');
      }
      
      const idToken = await userCredential.user.getIdToken();
      document.cookie = `admin_session=${idToken}; path=/; max-age=86400; Secure; SameSite=Strict`; // 24 hours
      router.push('/admin/dashboard');
    } catch (err) {
      if (err.message.includes('Unauthorized Account')) {
        setError(err.message);
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>Loading...</div>;
  }

  return (
    <div className={styles.loginSplitContainer}>
      <div className={styles.loginLeft}>
        <h1>Dr. Portfolio</h1>
        <p>Manage your clinical cases, update your Curriculum Vitae, and maintain your professional online presence securely.</p>
      </div>
      
      <div className={styles.loginRight}>
        <div className={styles.loginBox}>
          <h2 className={styles.loginTitle}>Admin Login</h2>
          {error && <div className={styles.errorMsg}>{error}</div>}
          <form onSubmit={handleLogin}>
            <div className={styles.formGroup}>
              <label>Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className={styles.formGroup}>
              <label>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className="btn-primary" style={{width: '100%', marginTop: '1rem', padding: '1rem'}} disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

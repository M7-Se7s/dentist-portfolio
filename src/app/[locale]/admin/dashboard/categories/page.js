"use client";

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import styles from '../../admin.module.css';

const DEFAULT_CATEGORIES = [
  { nameEn: "Composite", nameAr: "كومبوزيت" },
  { nameEn: "Endodontics", nameAr: "علاج الجذور" },
  { nameEn: "Prosthodontics", nameAr: "تركيبات أسنان" },
  { nameEn: "Esthetic", nameAr: "تجميل الأسنان" },
  { nameEn: "Posterior Restorations", nameAr: "حشوات خلفية" },
  { nameEn: "General", nameAr: "عام" },
  { nameEn: "Surgery", nameAr: "جراحة" },
  { nameEn: "Orthodontics", nameAr: "تقويم الأسنان" },
  { nameEn: "Periodontics", nameAr: "علاج اللثة" },
  { nameEn: "Pediatric", nameAr: "طب أسنان الأطفال" }
];

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [nameEn, setNameEn] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const fetchCategories = async () => {
    try {
      const q = query(collection(db, "categories"), orderBy("nameEn", "asc"));
      const querySnapshot = await getDocs(q);
      const fetched = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCategories(fetched);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleTranslate = async () => {
    if (!nameEn) return;
    setIsTranslating(true);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: nameEn, target: 'ar' })
      });
      const data = await res.json();
      if (data.translatedText) {
        setNameAr(data.translatedText);
      }
    } catch (e) {
      console.error("Translation failed", e);
      alert("Translation failed");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!nameEn || !nameAr) return;
    
    setIsAdding(true);
    try {
      await addDoc(collection(db, "categories"), {
        nameEn,
        nameAr,
        createdAt: new Date().toISOString()
      });
      setNameEn('');
      setNameAr('');
      fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Failed to add category.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteDoc(doc(db, "categories", id));
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category.");
    }
  };

  const handleSeedDefaults = async () => {
    setLoading(true);
    try {
      const promises = DEFAULT_CATEGORIES.map(cat => 
        addDoc(collection(db, "categories"), {
          ...cat,
          createdAt: new Date().toISOString()
        })
      );
      await Promise.all(promises);
      fetchCategories();
    } catch (e) {
      console.error(e);
      alert("Failed to seed categories");
      setLoading(false);
    }
  };

  return (
    <div className="animate-slideUp stagger-1">
      <div className={styles.caseManagementHeader} style={{ marginBottom: '2rem' }}>
        <div>
          <h1 className={styles.pageTitle}>Category Manager</h1>
          <p className={styles.pageSubtitle}>Manage custom categories for your cases and gallery.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Add Category Form */}
        <div className={styles.formSection}>
          <div className={styles.formSectionTitle}>Add New Category</div>
          <form onSubmit={handleAddCategory}>
            <div className={styles.formGroup}>
              <label>Category Name (EN) *</label>
              <input 
                type="text" 
                value={nameEn} 
                onChange={(e) => setNameEn(e.target.value)} 
                placeholder="e.g. Laser Therapy"
                required
                style={{ width: '100%', padding: '0.85rem 1rem', border: '1px solid var(--border-color)', borderRadius: '8px', fontFamily: 'var(--font-primary)' }}
              />
            </div>

            <div className={styles.formGroup}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label>Category Name (AR) *</label>
                <button 
                  type="button"
                  onClick={handleTranslate}
                  disabled={isTranslating || !nameEn}
                  style={{ fontSize: '0.8rem', background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', padding: 0 }}
                >
                  {isTranslating ? 'Translating...' : 'Auto-Translate'}
                </button>
              </div>
              <input 
                type="text" 
                value={nameAr} 
                onChange={(e) => setNameAr(e.target.value)} 
                placeholder="Arabic Translation"
                dir="rtl"
                required
                style={{ width: '100%', padding: '0.85rem 1rem', border: '1px solid var(--border-color)', borderRadius: '8px', fontFamily: 'var(--font-arabic)' }}
              />
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              disabled={isAdding || !nameEn || !nameAr}
              style={{ width: '100%' }}
            >
              {isAdding ? 'Adding...' : 'Add Category'}
            </button>
          </form>
        </div>

        {/* Categories List */}
        <div className={styles.formSection}>
          <div className={styles.formSectionTitle}>Existing Categories</div>
          
          {loading ? (
            <div>Loading categories...</div>
          ) : categories.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', background: '#F8FAFC', borderRadius: '8px' }}>
              <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>No categories found in database.</p>
              <button type="button" onClick={handleSeedDefaults} className="btn-primary">
                Seed Default Categories
              </button>
            </div>
          ) : (
            <div className={styles.caseTableWrapper}>
              <table className={styles.caseTable}>
                <thead>
                  <tr>
                    <th>English Name</th>
                    <th>Arabic Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(cat => (
                    <tr key={cat.id}>
                      <td style={{ fontWeight: 600 }}>{cat.nameEn}</td>
                      <td style={{ fontFamily: 'var(--font-arabic)' }} dir="rtl">{cat.nameAr}</td>
                      <td>
                        <button 
                          onClick={() => handleDelete(cat.id)}
                          style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

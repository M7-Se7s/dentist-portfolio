"use client";

import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import styles from "../../admin.module.css";
import { triggerRevalidation } from "@/lib/actions/revalidate";

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
  { nameEn: "Pediatric", nameAr: "طب أسنان الأطفال" },
];

const loadCategories = async () => {
  const q = query(collection(db, "categories"), orderBy("nameEn", "asc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [mobileLang, setMobileLang] = useState("en");

  const fetchCategories = async () => {
    try {
      setCategories(await loadCategories());
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isActive = true;

    const loadInitialCategories = async () => {
      try {
        const fetched = await loadCategories();
        if (isActive) {
          setCategories(fetched);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadInitialCategories();

    return () => {
      isActive = false;
    };
  }, []);

  const handleTranslate = async () => {
    if (!nameEn) return;
    setIsTranslating(true);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: nameEn, target: "ar" }),
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
    if (e) e.preventDefault();
    if (!nameEn || !nameAr) return;

    setIsAdding(true);
    try {
      await addDoc(collection(db, "categories"), {
        nameEn,
        nameAr,
        createdAt: new Date().toISOString(),
      });
      await triggerRevalidation(["/[locale]/cases", "/[locale]"], "page");
      setNameEn("");
      setNameAr("");
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
      await triggerRevalidation(["/[locale]/cases", "/[locale]"], "page");
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category.");
    }
  };

  const handleSeedDefaults = async () => {
    setLoading(true);
    try {
      const promises = DEFAULT_CATEGORIES.map((cat) =>
        addDoc(collection(db, "categories"), {
          ...cat,
          createdAt: new Date().toISOString(),
        }),
      );
      await Promise.all(promises);
      await triggerRevalidation(["/[locale]/cases", "/[locale]"], "page");
      fetchCategories();
    } catch (e) {
      console.error(e);
      alert("Failed to seed categories");
      setLoading(false);
    }
  };

  return (
    <div className="animate-fadeIn stagger-1">
      <div
        className={styles.caseManagementHeader}
        style={{ marginBottom: "2rem" }}
      >
        <div>
          <h1 className={styles.pageTitle}>Category Manager</h1>
          <p className={styles.pageSubtitle}>
            Manage custom categories for your cases and gallery.
          </p>
        </div>
        <div className={styles.headerActionButtons}>
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={handleTranslate} 
            disabled={isTranslating || !nameEn}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
            </svg>
            <span className={styles.fabText}>{isTranslating ? "Translating..." : "Auto-Translate"}</span>
          </button>
          <button 
            type="button" 
            className="btn-primary" 
            onClick={handleAddCategory}
            disabled={isAdding || !nameEn || !nameAr}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span className={styles.fabText}>{isAdding ? "Adding..." : "Add Category"}</span>
          </button>
        </div>
      </div>

      <div className={styles.categoryLayout}>
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
                style={{
                  width: "100%",
                  padding: "0.85rem 1rem",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  fontFamily: "var(--font-primary)",
                }}
              />
            </div>

            <div className={styles.formGroup} style={{ marginBottom: 0 }}>
              <label>Category Name (AR) *</label>
              <input
                type="text"
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                placeholder="Arabic Translation"
                dir="rtl"
                required
                style={{
                  width: "100%",
                  padding: "0.85rem 1rem",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  fontFamily: "var(--font-arabic)",
                }}
              />
            </div>
          </form>
        </div>

        {/* Categories List */}
        <div className={styles.formSection}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
            <div className={styles.formSectionTitle} style={{ marginBottom: 0 }}>Existing Categories</div>
            
            <div className={styles.mobileLangToggle}>
              <button 
                type="button" 
                onClick={() => setMobileLang('en')} 
                className={mobileLang === 'en' ? styles.activeLang : ''}
              >
                🇺🇸 English 
              </button>
              <button 
                type="button" 
                onClick={() => setMobileLang('ar')} 
                className={mobileLang === 'ar' ? styles.activeLang : ''}
              >
                🇸🇦 Arabic
              </button>
            </div>
          </div>

          {loading ? (
            <div>Loading categories...</div>
          ) : categories.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
                background: "#F8FAFC",
                borderRadius: "8px",
              }}
            >
              <p style={{ marginBottom: "1rem", color: "var(--text-muted)" }}>
                No categories found in database.
              </p>
              <button
                type="button"
                onClick={handleSeedDefaults}
                className="btn-primary"
              >
                Seed Default Categories
              </button>
            </div>
          ) : (
            <div className={`${styles.caseTableWrapper} ${mobileLang === 'en' ? styles.mobileModeEn : styles.mobileModeAr}`}>
              <table className={`${styles.caseTable} ${styles.bilingualTable}`}>
                <thead>
                  <tr>
                    <th>English Name</th>
                    <th>Arabic Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat.id}>
                      <td style={{ fontWeight: 600 }}>{cat.nameEn}</td>
                      <td
                        style={{ fontFamily: "var(--font-arabic)" }}
                        dir="rtl"
                      >
                        {cat.nameAr}
                      </td>
                      <td>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          style={{
                            color: "#EF4444",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "0.9rem",
                            fontWeight: 500,
                          }}
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




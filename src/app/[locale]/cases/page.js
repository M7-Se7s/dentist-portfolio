import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getTranslations } from 'next-intl/server';
import styles from './page.module.css';
import CasesClient from './CasesClient';

export const dynamicParams = true;

// Helper to serialize Firestore data to safe JSON
function serializeFirestoreData(data) {
  if (!data) return data;
  if (typeof data.toDate === 'function') {
    return data.toDate().toISOString();
  }
  if (Array.isArray(data)) {
    return data.map(serializeFirestoreData);
  }
  if (typeof data === 'object') {
    const result = {};
    for (const key in data) {
      result[key] = serializeFirestoreData(data[key]);
    }
    return result;
  }
  return data;
}

export default async function CasesGallery({ params }) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;
  
  const t = await getTranslations({ locale, namespace: 'Cases' });

  let dbCategories = [
    { nameEn: "All", nameAr: "الكل" },
    { nameEn: "Composite", nameAr: "كومبوزيت" },
    { nameEn: "Endodontics", nameAr: "علاج الجذور" },
    { nameEn: "Prosthodontics", nameAr: "تركيبات أسنان" },
    { nameEn: "Esthetic", nameAr: "تجميل الأسنان" },
    { nameEn: "Posterior Restorations", nameAr: "حشوات خلفية" }
  ];
  let cases = [];

  try {
    const qCats = query(collection(db, "categories"), orderBy("nameEn", "asc"));
    const snapCats = await getDocs(qCats);
    if (!snapCats.empty) {
      const fetched = snapCats.docs.map(d => d.data());
      dbCategories = [{ nameEn: "All", nameAr: "الكل" }, ...fetched];
    }
  } catch (e) {
    console.error("Failed to fetch categories on server:", e);
  }

  try {
    const qCases = query(collection(db, "cases"), orderBy("updatedAt", "desc"));
    const querySnapshot = await getDocs(qCases);
    let fetchedCases = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })).filter(caseItem => caseItem.isDraft !== true);
    
    cases = serializeFirestoreData(fetchedCases);
  } catch (error) {
    console.error("Error fetching cases on server: ", error);
  }

  return (
    <main style={{backgroundColor: 'var(--background)'}}>
      {/* Small Hero Section */}
      <div className={styles.pageHeader}>
        <div className="container">
          <h1>{t('title')}</h1>
          <p>{t('description')}</p>
        </div>
      </div>

      <CasesClient initialCases={cases} dbCategories={dbCategories} />
    </main>
  );
}

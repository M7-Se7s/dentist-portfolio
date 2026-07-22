import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import CaseClient from './CaseClient';

export const dynamicParams = true;

// Helper to serialize Firestore data to safe JSON for passing to Client Components
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

export default async function CaseDetailPage({ params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  let caseData = null;
  let error = null;

  try {
    const docRef = doc(db, "cases", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const rawData = { id: docSnap.id, ...docSnap.data() };
      caseData = serializeFirestoreData(rawData);
    } else {
      error = 'notFound';
    }
  } catch (err) {
    console.error("Error fetching case on server: ", err);
    error = 'notFound';
  }

  return <CaseClient caseData={caseData} id={id} initialError={error} />;
}

import { doc, getDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const qCases = query(collection(db, "cases"), orderBy("updatedAt", "desc"));
    const querySnapshot = await getDocs(qCases);
    const fetchedCases = querySnapshot.docs.map(doc => ({
      id: doc.id,
      title: doc.data().title,
      titleAr: doc.data().titleAr,
      steps: doc.data().steps,
      treatmentSteps: doc.data().treatmentSteps,
      treatmentPlan: doc.data().treatmentPlan,
    }));
    
    // Find the one the user is talking about
    const targetCase = fetchedCases.find(c => c.title && c.title.toLowerCase().includes('mouth rehabilitation cases 9')) || fetchedCases[0];

    return NextResponse.json({ 
      allCasesCount: fetchedCases.length,
      targetCase 
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

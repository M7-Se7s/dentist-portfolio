import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION_NAME = 'cases';

export const casesService = {
  // Fetch all cases
  getCases: async () => {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const cases = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore Timestamp to string for Next.js serialization
        createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString(),
        updatedAt: doc.data().updatedAt?.toDate().toISOString() || new Date().toISOString(),
      }));
      return cases;
    } catch (error) {
      console.error("Error fetching cases: ", error);
      throw error;
    }
  },

  // Get a single case by ID
  getCaseById: async (id) => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString(),
        };
      } else {
        console.log("No such document!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching case: ", error);
      throw error;
    }
  },

  // Create a new case
  createCase: async (caseData) => {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...caseData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding case: ", error);
      throw error;
    }
  },

  // Update an existing case
  updateCase: async (id, updateData) => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error("Error updating case: ", error);
      throw error;
    }
  },

  // Delete a case
  deleteCase: async (id) => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error("Error deleting case: ", error);
      throw error;
    }
  }
};

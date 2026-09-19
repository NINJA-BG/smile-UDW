import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UnderwritingCase } from '../types';
import { INITIAL_CASES } from '../data/mockData';

const CASES_COLLECTION = 'cases';

/**
 * Initialize Firestore collection with seed data if currently empty
 */
export async function initializeFirestoreData(): Promise<UnderwritingCase[]> {
  try {
    const casesCol = collection(db, CASES_COLLECTION);
    const snapshot = await getDocs(casesCol);

    if (snapshot.empty) {
      console.log('Seeding initial cases to Firebase Firestore (smileUDW)...');
      const batch = writeBatch(db);
      for (const item of INITIAL_CASES) {
        const docRef = doc(db, CASES_COLLECTION, item.id);
        batch.set(docRef, {
          ...item,
          updatedAt: serverTimestamp(),
        });
      }
      await batch.commit();
      return INITIAL_CASES;
    }

    const loadedCases: UnderwritingCase[] = [];
    const batch = writeBatch(db);
    let hasUpdates = false;

    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as UnderwritingCase;
      const initialMatch = INITIAL_CASES.find((c) => c.id === docSnap.id);
      
      // Auto-merge customerChangeRequest if initial data has it but Firestore doc does not
      if (initialMatch?.customerChangeRequest && !data.customerChangeRequest) {
        data.customerChangeRequest = initialMatch.customerChangeRequest;
        batch.set(docSnap.ref, { customerChangeRequest: initialMatch.customerChangeRequest }, { merge: true });
        hasUpdates = true;
      }

      loadedCases.push({ ...data, id: docSnap.id });
    });

    if (hasUpdates) {
      await batch.commit();
      console.log('Successfully synced customerChangeRequest to existing Firestore documents.');
    }

    return loadedCases;
  } catch (error) {
    console.error('Error initializing/loading Firestore cases:', error);
    // Fallback to in-memory initial cases if offline or error
    return INITIAL_CASES;
  }
}

/**
 * Subscribe to real-time changes in Firestore cases
 */
export function subscribeToCases(
  onUpdate: (cases: UnderwritingCase[]) => void,
  onError?: (err: Error) => void
) {
  const casesCol = collection(db, CASES_COLLECTION);
  return onSnapshot(
    casesCol,
    (snapshot) => {
      if (snapshot.empty) {
        onUpdate([]);
        return;
      }
      const list: UnderwritingCase[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ ...(docSnap.data() as UnderwritingCase), id: docSnap.id });
      });
      onUpdate(list);
    },
    (err) => {
      console.error('Firestore subscription error:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Save or update a case in Firestore
 */
export async function saveCaseToFirestore(updatedCase: UnderwritingCase): Promise<void> {
  try {
    const docRef = doc(db, CASES_COLLECTION, updatedCase.id);
    await setDoc(docRef, {
      ...updatedCase,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    console.log(`Successfully saved case ${updatedCase.id} to Firestore.`);
  } catch (error) {
    console.error(`Error saving case ${updatedCase.id} to Firestore:`, error);
    throw error;
  }
}

/**
 * Create a new case in Firestore
 */
export async function createCaseInFirestore(newCase: UnderwritingCase): Promise<void> {
  try {
    const docRef = doc(db, CASES_COLLECTION, newCase.id);
    await setDoc(docRef, {
      ...newCase,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    console.log(`Created new case ${newCase.id} in Firestore.`);
  } catch (error) {
    console.error('Error creating case in Firestore:', error);
    throw error;
  }
}

/**
 * Delete a case from Firestore
 */
export async function deleteCaseFromFirestore(caseId: string): Promise<void> {
  try {
    const docRef = doc(db, CASES_COLLECTION, caseId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting case ${caseId} from Firestore:`, error);
    throw error;
  }
}

/**
 * Reset all cases back to standard initial seed data in Firestore
 */
export async function resetDatabaseToInitial(): Promise<void> {
  try {
    const casesCol = collection(db, CASES_COLLECTION);
    const snapshot = await getDocs(casesCol);
    const batch = writeBatch(db);

    snapshot.forEach((d) => {
      batch.delete(d.ref);
    });

    for (const item of INITIAL_CASES) {
      const docRef = doc(db, CASES_COLLECTION, item.id);
      batch.set(docRef, {
        ...item,
        updatedAt: new Date().toISOString(),
      });
    }

    await batch.commit();
    console.log('Reset all cases in Firestore to initial mock data.');
  } catch (error) {
    console.error('Error resetting database in Firestore:', error);
    throw error;
  }
}

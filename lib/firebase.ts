import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {
  collection,
  getDocs,
  getFirestore,
  limit,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDfvTjFTYz_QCHc0nlpSL_2k4weVvRHc2g",
  authDomain: "nextfire-app-5fc18.firebaseapp.com",
  projectId: "nextfire-app-5fc18",
  storageBucket: "nextfire-app-5fc18.appspot.com",
  messagingSenderId: "85716977881",
  appId: "1:85716977881:web:6b9d0712dc3e6fa7a796c8",
  measurementId: "G-PVS6BWR8Z8",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();

export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const fromMillis = Timestamp.fromMillis;

/**
 * Gets a users/{uid} document with username
 * @param  {string} username
 */
export async function getUserWithUsername(username: string) {
  try {
    const q = query(
      collection(firestore, "users"),
      where("username", "==", username),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs[0];
  } catch (err) {
    console.log("getUserWithUsername", err);
  }
}

/**
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis(),
  };
}


// firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/13.3.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/13.3.0/firebase-firestore.js";

// Firebase Console config
const firebaseConfig = {
  apiKey: "AIzaSyCMoZI7Au3j5o2HEk1axIykGpQuI_7E7gs",
  authDomain: "the-one-26b7e.firebaseapp.com",
  projectId: "the-one-26b7e",
  storageBucket: "the-one-26b7e.firebasestorage.app",
  messagingSenderId: "531977002803",
  appId: "1:531977002803:web:fc4f7f0aacadc470ad2846"
};

// Connect Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Save SKYBLINK data
export async function saveSkyblinkData() {
  try {
    await addDoc(collection(db, "skyblink_data"), {
      project: "SKYBLINK",
      message: "Firebase Connected Successfully",
      createdAt: serverTimestamp()
    });

    console.log("Data saved successfully!");
  } catch (error) {
    console.error("Firebase Error:", error);
  }
}

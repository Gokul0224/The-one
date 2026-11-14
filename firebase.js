
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
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
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

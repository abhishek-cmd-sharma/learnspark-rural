import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBp8xFj0F8n6O5J6v5p3p7Q9Q9Q9Q9Q",
  authDomain: "learnspark-rural.firebaseapp.com",
  projectId: "learnspark-rural",
  storageBucket: "learnspark-rural.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:1234567890123456789012",
  measurementId: "G-1234567890"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("Firebase initialized successfully!");

// Test Firestore connection by trying to read a collection
import { collection, getDocs } from 'firebase/firestore';

async function testFirestoreConnection() {
  try {
    const querySnapshot = await getDocs(collection(db, "subjects"));
    console.log(`Successfully connected to Firestore! Found ${querySnapshot.size} subjects.`);
    
    // Log the first few subjects
    let count = 0;
    querySnapshot.forEach((doc) => {
      if (count < 3) {
        console.log(`Subject ${count + 1}:`, doc.data());
        count++;
      }
    });
  } catch (error) {
    console.error("Error connecting to Firestore:", error);
  }
}

testFirestoreConnection();

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDQvO0yEgqX0ypUdRKqTj1k7bQg0O1j6kU",
  authDomain: "algon-agency.firebaseapp.com",
  projectId: "algon-agency",
  storageBucket: "algon-agency.firebasestorage.app",
  messagingSenderId: "60280572264",
  appId: "1:60280572264:web:20d667e42362397cb4aedd",
  measurementId: "G-F1YBV7GC7R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);


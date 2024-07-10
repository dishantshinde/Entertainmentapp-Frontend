// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDakB4DeGIJGLdKSPqIMFJU9ECnsXrQ4fQ",
  authDomain: "entertainment-app-14156.firebaseapp.com",
  projectId: "entertainment-app-14156",
  storageBucket: "entertainment-app-14156.appspot.com",
  messagingSenderId: "186337496250",
  appId: "1:186337496250:web:f72111e9c4840a4b738683",
  measurementId: "G-FX7YV1WZVY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);

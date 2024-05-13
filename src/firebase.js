// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBxcytJa2MWbxNcPF2qCv6w9IRddqsev7M",
  authDomain: "milestone3-e6586.firebaseapp.com",
  projectId: "milestone3-e6586",
  storageBucket: "milestone3-e6586.appspot.com",
  messagingSenderId: "635710208497",
  appId: "1:635710208497:web:96b3cabe9d0b0c56e2ec50"
};

let firebaseApp
if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
} else {
    firebaseApp = getApps()[0];
}

export default firebaseApp;
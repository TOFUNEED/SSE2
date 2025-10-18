// Firebase App (the core Firebase SDK) is always required and must be listed first
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAG5BdEwEOZF6nft-9FYzdSOw3yAfHllwM",
    authDomain: "shinanopwa.firebaseapp.com",
    projectId: "shinanopwa",
    storageBucket: "shinanopwa.appspot.com",
    messagingSenderId: "65363009149",
    appId: "1:65363009149:web:8b683f5d2b86b0300cdb14",
    measurementId: "G-GXD4W4BKC8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { db };
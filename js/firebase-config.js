// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBZacr9I_ecEUKU1ZV3EsjcfGIHkfnVQdQ",
    authDomain: "minez-zone.firebaseapp.com",
    databaseURL: "https://minez-zone-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "minez-zone",
    storageBucket: "minez-zone.firebasestorage.app",
    messagingSenderId: "840393320273",
    appId: "1:840393320273:web:b1d128705055a65b781570"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase Services
const database = firebase.database();
const storage = firebase.storage();

console.log("🔥 Firebase Connected!");



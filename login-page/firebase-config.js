// ==========================================
// FIREBASE APP
// ==========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// ==========================================
// FIREBASE CONFIG
// ==========================================

const firebaseConfig = {

    apiKey: "AIzaSyD7lOBSLOZmx8RTA-VRfR5HpMaxKQD02Ys",

    authDomain:
        "startup-failure-predictor.firebaseapp.com",

    databaseURL:
        "https://startup-failure-predictor-default-rtdb.asia-southeast1.firebasedatabase.app",

    projectId:
        "startup-failure-predictor",

    storageBucket:
        "startup-failure-predictor.firebasestorage.app",

    messagingSenderId:
        "12145976790",

    appId:
        "1:12145976790:web:291eae3b0482f080ce3077"
};


// ==========================================
// INITIALIZE FIREBASE
// ==========================================

const app = initializeApp(firebaseConfig);


// ==========================================
// FIREBASE AUTHENTICATION
// ==========================================

const auth = getAuth(app);


// ==========================================
// EXPORT
// ==========================================

export { app, auth };
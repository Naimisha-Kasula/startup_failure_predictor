
// ==========================================
// FIREBASE IMPORTS
// ==========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    getDatabase,
    ref,
    get
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


// ==========================================
// FIREBASE CONFIG
// ==========================================

const firebaseConfig = {

    apiKey: "AIzaSyD7lOBSLOZmx8RTA-VRfR5HpMaxKQD02Ys",

    authDomain: "startup-failure-predictor.firebaseapp.com",

    databaseURL: "https://startup-failure-predictor-default-rtdb.asia-southeast1.firebasedatabase.app",

    projectId: "startup-failure-predictor",

    storageBucket: "startup-failure-predictor.firebasestorage.app",

    messagingSenderId: "12145976790",

    appId: "1:12145976790:web:291eae3b0482f080ce3077"
};


// ==========================================
// INITIALIZE FIREBASE
// ==========================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const database = getDatabase(app);

console.log("Firebase initialized successfully");


// ==========================================
// GET HTML ELEMENTS
// ==========================================

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const loginButton =
    document.getElementById("loginBtn");

const passwordToggle =
    document.getElementById("passwordToggle");


// ==========================================
// LOGIN FUNCTION
// ==========================================

async function login() {

    console.log("LOGIN BUTTON CLICKED");


    const email =
        emailInput.value.trim().toLowerCase();

    const password =
        passwordInput.value;


    // ======================================
    // VALIDATION
    // ======================================

    if (!email) {

        alert("Please enter your email address.");

        emailInput.focus();

        return;
    }


    if (!password) {

        alert("Please enter your password.");

        passwordInput.focus();

        return;
    }


    // ======================================
    // BUTTON LOADING
    // ======================================

    loginButton.disabled = true;

    loginButton.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        <span>Logging in...</span>
    `;


    // ======================================
    // FIREBASE LOGIN
    // ======================================

    try {

        console.log("Attempting Firebase login...");


        const userCredential =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );


        const user =
            userCredential.user;


        console.log("LOGIN SUCCESSFUL");
        console.log("User:", user);


        // ==================================
        // GET REGISTERED USER DATA
        // FROM REALTIME DATABASE
        // ==================================

        console.log(
            "Getting registered user details..."
        );


        const userReference =
            ref(
                database,
                "users/" + user.uid
            );


        const snapshot =
            await get(userReference);


        let founderName = "User";

        let companyName = "Company";


        if (snapshot.exists()) {

            const data =
                snapshot.val();


            console.log(
                "REGISTERED USER DATA:",
                data
            );


            // ==================================
            // GET FOUNDER NAME
            // ==================================

            if (data.founderName) {

                founderName =
                    data.founderName;
            }


            // ==================================
            // GET COMPANY NAME
            // ==================================

            if (data.companyName) {

                companyName =
                    data.companyName;
            }

        }

        else {

            console.warn(
                "No registered user data found in Realtime Database."
            );

        }


        // ==================================
        // SAVE USER
        // ==================================

        const userData = {

            uid: user.uid,

            email: user.email,

            displayName:
                founderName,

            founderName:
                founderName,

            companyName:
                companyName
        };


        localStorage.setItem(
            "user",
            JSON.stringify(userData)
        );


        localStorage.setItem(
            "loggedIn",
            "true"
        );


        console.log(
            "USER DATA SAVED:",
            userData
        );


        // ==================================
        // SUCCESS MESSAGE
        // ==================================

        alert("Login successful!");


        // ==================================
        // REDIRECT TO DASHBOARD
        // ==================================

        window.location.href =
            "./dashboard.html";


    } catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );


        console.error(
            "ERROR CODE:",
            error.code
        );


        if (
            error.code ===
            "auth/invalid-credential"
        ) {

            alert(
                "Incorrect email or password."
            );

        }

        else if (
            error.code ===
            "auth/user-not-found"
        ) {

            alert(
                "No account found with this email address."
            );

        }

        else if (
            error.code ===
            "auth/wrong-password"
        ) {

            alert(
                "Incorrect password."
            );

        }

        else if (
            error.code ===
            "auth/invalid-email"
        ) {

            alert(
                "Please enter a valid email address."
            );

        }

        else if (
            error.code ===
            "auth/too-many-requests"
        ) {

            alert(
                "Too many login attempts. Please try again later."
            );

        }

        else if (
            error.code ===
            "auth/network-request-failed"
        ) {

            alert(
                "Network error. Please check your internet connection."
            );

        }

        else if (
            error.code ===
            "PERMISSION_DENIED"
        ) {

            alert(
                "Firebase Database permission denied. Please check your Firebase Database Rules."
            );

        }

        else {

            alert(
                "Login failed: " +
                error.message
            );
        }

    } finally {

        // ==================================
        // RESET BUTTON
        // ==================================

        loginButton.disabled = false;

        loginButton.innerHTML = `
            <i class="fa-solid fa-right-to-bracket"></i>
            <span>Login</span>
        `;

    }

}


// ==========================================
// PASSWORD SHOW / HIDE
// ==========================================

function togglePassword() {

    if (
        !passwordInput ||
        !passwordToggle
    ) {
        return;
    }


    if (
        passwordInput.type ===
        "password"
    ) {

        passwordInput.type = "text";

        passwordToggle.innerHTML =
            `<i class="fa-solid fa-eye-slash"></i>`;

    }

    else {

        passwordInput.type = "password";

        passwordToggle.innerHTML =
            `<i class="fa-solid fa-eye"></i>`;
    }

}


// ==========================================
// LOGIN BUTTON
// ==========================================

if (loginButton) {

    loginButton.addEventListener(
        "click",
        login
    );

}


// ==========================================
// PASSWORD TOGGLE BUTTON
// ==========================================

if (passwordToggle) {

    passwordToggle.addEventListener(
        "click",
        togglePassword
    );

}


// ==========================================
// ENTER KEY LOGIN
// ==========================================

if (passwordInput) {

    passwordInput.addEventListener(
        "keypress",
        function (event) {

            if (event.key === "Enter") {

                login();

            }

        }
    );

}


console.log(
    "LOGIN SCRIPT LOADED SUCCESSFULLY"
);


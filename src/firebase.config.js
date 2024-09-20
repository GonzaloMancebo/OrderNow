import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA0-NF4o-DcXlvk_dDBsBHxdODy92dODVY",
    authDomain: "ordermate-7b5d4.firebaseapp.com",
    projectId: "ordermate-7b5d4",
    storageBucket: "ordermate-7b5d4.appspot.com",
    messagingSenderId: "83523931668",
    appId: "1:83523931668:web:3d4c341d7f54554531e101",
    measurementId: "G-75690BD6TJ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
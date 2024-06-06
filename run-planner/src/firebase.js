import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDNNo2ynWJ3rqjrjVayKkwYinsB1cI89YE",
    authDomain: "final-project-hcde-438.firebaseapp.com",
    projectId: "final-project-hcde-438",
    storageBucket: "final-project-hcde-438.appspot.com",
    messagingSenderId: "230826061346",
    appId: "1:230826061346:web:5524847d036f6fd332647b",
    measurementId: "G-LK07RVFFF3"
};
  
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
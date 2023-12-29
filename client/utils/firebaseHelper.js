// importing firebase
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
    apiKey: "AIzaSyD8LvZW2NhnvboBNPWpbj9A5kM_hGDUOz8",
    authDomain: "just-shoal-up.firebaseapp.com",
    projectId: "just-shoal-up",
    storageBucket: "just-shoal-up.appspot.com",
    messagingSenderId: "725919675951",
    appId: "1:725919675951:web:da9560e7defef195dab8da",
    measurementId: "G-JPDJW02PQR",
};

// initialize Firebase App
const app = initializeApp(firebaseConfig);
// initialize Firebase Auth for that app immediately
initializeAuth(app, {persistence: getReactNativePersistence(ReactNativeAsyncStorage)});
// const auth = initializeAuth(app, {persistence: getReactNativePersistence(ReactNativeAsyncStorage)});
const auth = getAuth();

export { auth };
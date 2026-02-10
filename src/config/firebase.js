// Import the functions you need from the SDKs you need
// src/config/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCa90g0t7T2svV3I7PXpnDS4Jp2fUAqrr0",
  authDomain: "barber-m-eb7e7.firebaseapp.com",
  projectId: "barber-m-eb7e7",
  storageBucket: "barber-m-eb7e7.firebasestorage.app",
  messagingSenderId: "697932276308",
  appId: "1:697932276308:web:66e25656e9a2d05f1d83c1"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar servicios
export const db = getFirestore(app);
export const auth = getAuth(app);

// Exportar app por si se necesita
export default app;

// 🔍 VERIFICAR QUE FIREBASE ESTÁ CONECTADO:
// Descomenta esto temporalmente para verificar la conexión

console.log('Firebase inicializado correctamente');
console.log('Project ID:', firebaseConfig.projectId);

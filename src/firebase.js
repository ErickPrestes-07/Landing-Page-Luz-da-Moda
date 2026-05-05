import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Configuração oficial fornecida
const firebaseConfig = {
  apiKey: "AIzaSyBXQSGf9FzE0gczT1fZhZsYFGzQLcNQTZ0",
  authDomain: "landing-page-luz-da-moda.firebaseapp.com",
  projectId: "landing-page-luz-da-moda",
  storageBucket: "landing-page-luz-da-moda.firebasestorage.app",
  messagingSenderId: "256984844389",
  appId: "1:256984844389:web:52a6ae1fb2f40455269e8c",
  measurementId: "G-RVJ7T0X29M"
};

let app
let auth
let db

export function getFirebase() {
  if (app) return { app, auth, db }

  // Inicializa o app com as chaves diretas para garantir funcionamento no deploy
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
  
  return { app, auth, db }
}

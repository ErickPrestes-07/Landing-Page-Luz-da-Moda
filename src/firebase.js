import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

let app
let auth
let db

/**
 * Inicializa Firebase uma vez. Retorna null se faltar variável de ambiente (VITE_*).
 */
export function getFirebase() {
  if (app) return { app, auth, db }

  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  }

  const required = ['apiKey', 'authDomain', 'projectId', 'appId']
  const missing = required.filter((k) => !firebaseConfig[k])
  if (missing.length) {
    console.warn('[Firebase] Config incompleta. Defina VITE_FIREBASE_* no .env')
    return null
  }

  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
  return { app, auth, db }
}

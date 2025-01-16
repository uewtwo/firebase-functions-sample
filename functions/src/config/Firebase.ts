import * as dotenv from 'dotenv'
import * as admin from 'firebase-admin'

dotenv.config()

export function initializeFirebase() {
  if (!admin.apps.length) {
    const config: admin.AppOptions = {
      projectId: 'demo-mimi-api',
    }
    if (process.env.AUTH_EMULATOR_HOST) {
      process.env.FIREBASE_AUTH_EMULATOR_HOST = process.env.AUTH_EMULATOR_HOST
      admin.initializeApp(config)
    } else {
      // WIP: Initialize for production
      admin.initializeApp()
    }
  }
  return admin
}

export const getFirebaseAdmin = () => {
  const admin = initializeFirebase()
  return {
    auth: admin.auth(),
    store: admin.firestore(),
  }
}

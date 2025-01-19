import * as dotenv from 'dotenv'
dotenv.config()

import * as admin from 'firebase-admin'

export function initializeFirebase() {
  // console.log('FIREBASE_PROJECT_ID', process.env.FIREBASE_PROJECT_ID)
  // console.log('AUTH_EMULATOR_HOST', process.env.AUTH_EMULATOR_HOST)
  // console.log('FIRESTORE_EMULATOR_HOST', process.env.FIRESTORE_EMULATOR_HOST)
  if (!admin.apps.length) {
    const config: admin.AppOptions = {
      projectId: process.env._FIREBASE_PROJECT_ID,
    }
    if (process.env.AUTH_EMULATOR_HOST) {
      process.env.FIREBASE_AUTH_EMULATOR_HOST = process.env.AUTH_EMULATOR_HOST
      admin.initializeApp(config)
    } else {
      // TODO: Initialize for production
      // admin.initializeApp()
    }
  }
  return admin
}

export const getFirebaseAdmin = () => {
  const admin = initializeFirebase()
  return {
    auth: admin.auth(),
  }
}

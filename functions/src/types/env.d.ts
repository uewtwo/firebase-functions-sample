declare namespace NodeJS {
  interface ProcessEnv {
    USE_EMULATOR?: string
    FIREBASE_AUTH_EMULATOR_HOST?: string
    FIRESTORE_EMULATOR_HOST?: string
  }
}

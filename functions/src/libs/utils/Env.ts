type EnvConfig = {
  environment: 'local' | 'production'
  firebase: {
    projectId: string
    privateKey: string
  }
  databaseUrl: string
}

let envConfig: EnvConfig

function getEnvConfig(): EnvConfig {
  if (envConfig) {
    return envConfig
  }

  const env = process.env.ENV
  const firebaseProjectId = process.env.FIREBASE_PROJECT_ID
  const databaseUrl = process.env.DATABASE_URL
  if (!env || !databaseUrl || !firebaseProjectId) {
    throw new Error('ENV, DATABASE_URL, FIREBASE_PROJECT_ID are required in environment variables')
  }
  const firebase = {
    databaseUrl: databaseUrl,
    projectId: firebaseProjectId,
    privateKey: 'TODO-PRIVATE-KEY',
  }

  return {
    environment: env as EnvConfig['environment'], // Not sure either Env type is set correctly...
    firebase,
    databaseUrl,
  }
}

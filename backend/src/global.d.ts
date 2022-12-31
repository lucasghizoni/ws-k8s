declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ACCESS_TOKEN_SECRET: string;
      NODE_ENV: 'production' | 'development';
      MONGODB_ADMINUSERNAME: string;
      MONGODB_ADMINPASSWORD: string;
      MONGODB_SERVER: string;
      REDIS_SERVER: string;
    }
  }
}

export {}
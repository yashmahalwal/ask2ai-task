declare global {
  interface ProcessEnv {
    PORT: string | null | undefined;
    ENVIRONMENT: string | null | undefined;
  }
}

export {};

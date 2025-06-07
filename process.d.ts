declare global {
  interface ProcessEnv {
    PORT: string | null | undefined;
  }
}

export {};

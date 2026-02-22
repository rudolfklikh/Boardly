export {};
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CI: string;
    }
  }
}

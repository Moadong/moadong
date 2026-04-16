// frontend/src/utils/logger.ts
type LogFunction = (...args: unknown[]) => void;

interface Logger {
  log: LogFunction;
  warn: LogFunction;
  error: LogFunction;
}

const createLogger = (): Logger => {
  const enableDevLogs = import.meta.env.VITE_ENABLE_DEV_LOGS === 'true';
  const isDev = import.meta.env.DEV;

  return {
    log: isDev && enableDevLogs ? console.log : () => {},
    warn: console.warn,
    error: console.error,
  };
};

const logger = createLogger();

export default logger;

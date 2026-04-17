/* eslint-disable no-console */
const isDevelopment = import.meta.env.MODE === 'development';

export const logger = {
  error: (...args: any[]) => {
    if (isDevelopment) {
      console.error(...args);
    }
    // In a real app, you might send this to an error tracking service like Sentry or LogRocket
  },
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
};
/* eslint-enable no-console */

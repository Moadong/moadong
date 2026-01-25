import { setupWorker } from 'msw/browser';
import { handlers } from './api';

export const worker = setupWorker(...handlers);

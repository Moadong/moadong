import { setupWorker } from 'msw/browser';
import { handlers } from './api';
import { RequestHandler } from 'msw/lib/core/handlers/RequestHandler.mjs';

export const worker = setupWorker(...(handlers as unknown as RequestHandler[]));

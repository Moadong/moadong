import { setupWorker } from 'msw/browser';
import { RequestHandler } from 'msw/lib/core/handlers/RequestHandler.mjs';
import { handlers } from './api';

export const worker = setupWorker(...(handlers as unknown as RequestHandler[]));

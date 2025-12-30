import { colors } from './colors';
import { typography } from './typography';

export const theme = {
  colors,
  typography,
} as const;

export type Theme = typeof theme;

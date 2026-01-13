import { colors } from './colors';
import { transitions } from './transitions';
import { typography } from './typography';

export const theme = {
  colors,
  typography,
  transitions,
} as const;

export type Theme = typeof theme;

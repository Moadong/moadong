/**
 * Branded Types utility to ensure type safety for primitive types.
 * @see https://egghead.io/blog/using-branded-types-in-typescript
 */
export type Brand<K, T> = T & { readonly __brand: K };

/**
 * Type-safe way to cast a primitive to a branded type.
 */
export const brand = <K extends string, T>(value: T): Brand<K, T> =>
  value as Brand<K, T>;

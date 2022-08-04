export type Nullish = null | undefined;

export type Nullable<T> = T | Nullish;

export const isNullish = (x: unknown): x is Nullish => x == null;

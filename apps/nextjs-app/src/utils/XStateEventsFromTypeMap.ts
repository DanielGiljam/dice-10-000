export type XStateEventFromTypeMap<T> = {
  [K in keyof T]: {
    type: K;
  } & T[K];
}[keyof T];

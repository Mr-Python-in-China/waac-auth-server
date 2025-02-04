export function safeCall<T, Args>(fn: (...args: Args[]) => T, ...args: Args[]) {
  try {
    return fn(...args);
  } catch (e: unknown) {
    return { $error: e };
  }
}
export function safeCallAsync<T, Args>(
  fn: (...args: Args[]) => Promise<T>,
  ...args: Args[]
) {
  return safePromise(fn(...args));
}
export function safePromise<T>(promise: Promise<T>) {
  return promise.catch((e: unknown) => ({ $error: e }));
}

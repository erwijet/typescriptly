/**
 * Thows the given error
 *
 * ?> This is useful for cleaner one-line lambdas which function as branches which should only throw an error;
 *
 * @example
 * ```ts
 * const key: string = ...;
 *
 * const res = match(key)
 *  .with("value1", () => "apple")
 *  .with("value2", () => "banana")
 *  .otherwise(() => err("no valid key. Did you specify the right one?");
 *
 * typeof res; // 'string'
 * ```
 *
 * @param error The error to throw
 *
 */
export function err<T extends Error | string, R = void>(error: T): R {
  throw typeof error == "string" ? new Error(error) : error;
}

import { useEffect, useState } from "react";

/**
 * Defer an action to be on a later render. By calling the returned method, the supplied function
 * will be called with the given parameter on next rerender. A rerender is then queued.
 *
 * @example
 * ```tsx
 * // console.log some message on next render
 * const deferMsg = useDefer((s: string) => console.log(s));
 *
 * const MyButton = <button onClick={() => {
 *    // ...
       deferMsg("second");
       console.log("first");
 *  }}>Click Me</button>;

    // when clicked...
    // --> "first"
    // --> "second"
 * ```
 */
export function useDefer<F extends (...args: any[]) => unknown>(fn: F) {
  const [params, setParams] = useState<Parameters<F> | null>(null);

  useEffect(() => {
    if (params != null) fn(...params);
    setParams(null);
  }, [params]);

  return (...args: Parameters<F>) => {
    setParams(args);
  };
}

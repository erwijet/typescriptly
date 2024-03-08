export function computed<T>(
  get: () => T,
  options?: {
    set?: (value: T) => void;
  }
): { value: T } {
  const proxy = new Proxy({ value: null } as any, {
    get(_target, _prop, _recvr) {
      return get();
    },
    set(_target, _prop, newValue) {
      options?.set?.(newValue);
      return !!options?.set;
    },
  }) as { value: T };

  return proxy;
}

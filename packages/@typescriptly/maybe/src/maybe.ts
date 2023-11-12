import { tryOr } from "@typescriptly/core";

/**
 * A shorthand type for `T | null`.
 */
export type Nullable<T> = T | null;

export function isNone<T>(m: Nullable<T>): m is null {
  return m == null;
}

export function isSome<T>(m: Nullable<T>): m is NonNullable<T> {
  return m != null;
}

// ## //

export function maybe<T>(
  inner: T
): T extends T
  ? T extends null | undefined
    ? T
    : Maybe<NonNullable<T>>
  : never {
  if (inner == null)
    return null as T extends T
      ? T extends null | undefined
        ? T
        : Maybe<NonNullable<T>>
      : never;
  else
    return new Maybe(inner) as T extends T
      ? T extends null | undefined
        ? T
        : Maybe<NonNullable<T>>
      : never;
}

class Maybe<T> {
  constructor(private inner: T) {}

  let<E>(mapping: (it: T) => E): Maybe<E> {
    return new Maybe(mapping(this.inner));
  }

  takeIf(predicate: (it: T) => boolean): T | null {
    if (predicate(this.inner)) return this.inner;
    else return null;
  }

  takeUnless(predicate: (it: T) => boolean): T | null {
    if (predicate(this.inner)) return null;
    else return this.inner;
  }

  if(predicate: (it: T) => boolean): Maybe<T> | null {
    if (predicate(this.inner)) return this;
    else return null;
  }

  unless(predicate: (it: T) => boolean): Maybe<T> | null {
    if (predicate(this.inner)) return null;
    else return this;
  }

  try<E>(mapping: (it: T) => E): Maybe<E> | null {
    return tryOr(() => this.let(mapping), null);
  }

  tryTake<E>(mapping: (it: T) => E): E | null {
    return this.try(mapping)?.take() ?? null;
  }

  also(fn: (it: T) => unknown): Maybe<T> {
    fn(this.inner);
    return this;
  }

  take(): T;
  take<E>(mapping?: (it: T) => E): E;

  take<E = T>(mapping?: (it: T) => E): T | E {
    return typeof mapping == "function" ? mapping(this.inner) : this.inner;
  }
}

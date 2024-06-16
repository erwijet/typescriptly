import { tryOr } from "@tsly/core";

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

type Maybe<T> =
  | Some<NonNullable<T>>
  | (T extends T ? (T extends null | undefined ? null : never) : never);

export function maybe<T>(inner: T): Maybe<T> {
  if (inner == null) return null as Maybe<T>;
  else return new Some(inner) as Maybe<T>;
}

class Some<T> {
  constructor(private inner: T) {}

  let<E>(mapping: (it: T) => E): Maybe<E> {
    return maybe(mapping(this.inner));
  }

  map<E>(mapping: (it: T) => E): Maybe<E> {
    return this.let(mapping);
  }

  takeIf(predicate: (it: T) => boolean): T | null {
    if (predicate(this.inner)) return this.inner;
    else return null;
  }

  takeUnless(predicate: (it: T) => boolean): T | null {
    if (predicate(this.inner)) return null;
    else return this.inner;
  }

  if(predicate: (it: T) => boolean): Some<T> | null {
    if (predicate(this.inner)) return this;
    else return null;
  }

  unless(predicate: (it: T) => boolean): Some<T> | null {
    if (predicate(this.inner)) return null;
    else return this;
  }

  try<E>(mapping: (it: T) => E): Maybe<E> | null {
    return tryOr(() => this.let(mapping), null);
  }

  tryTake<E>(mapping: (it: T) => E): E | null {
    return this.try(mapping)?.take() ?? null;
  }

  also(fn: (it: T) => unknown): Some<T> {
    fn(this.inner);
    return this;
  }

  tap(fn: (it: T) => unknown): Some<T> {
    return this.also(fn);
  }

  // take<E>(mapping: (it: T) => E): E;
  take<Fn extends (it: T) => unknown>(mapping: Fn): ReturnType<Fn>
  take(): T;

  take<E = T>(mapping?: (it: T) => E): T | E {
    return typeof mapping == "function" ? mapping(this.inner) : this.inner;
  }
}
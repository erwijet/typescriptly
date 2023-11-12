import { pipe } from "@typescriptly/core";

/** @internal */
type Entries<T extends object> = { [k in keyof T]: [k, T[k]] }[keyof T][];

/** @internal */
type Flattened<
  T extends object,
  KIden extends string,
  VIden extends string | undefined = undefined
> = VIden extends string
  ? {
      [k in keyof T]: {
        [iden in KIden | VIden]: iden extends KIden ? k : T[k];
      };
    }[keyof T][]
  : { [k in keyof T]: T[k] & { [_ in KIden]: k } }[keyof T][];

//

export function obj<T extends object>(obj: T): TslyObject<T> {
  return new TslyObject(obj);
}

class TslyObject<T extends object> {
  constructor(private inner: T) {}

  /**
   * Return the keys of the given object an array.
   *
   * ?> This is identical to `Object.keys()`, except this method types it's return type as `(keyof T)[]`, rather than `string | number | symbol`.
   *
   * @example
   * ```ts
   * const person = {
   *   firstName: 'Jane',
   *   lastName: 'Doe',
   *   favoriteColor: 'Green'
   * }
   *
   * const keys = getObjKeys(person);
   * //    ^? ('firstName' | 'lastName' | 'favoriteColor')[]
   * ```
   * @param v The given object
   * @returns The array of keys
   *
   * @category Object
   */
  get keys(): (keyof T)[] {
    return Object.keys(this.inner) as (keyof T)[];
  }

  /**
   * Returns the entries for a given object
   *
   * ?> This is identical to `Object.entries()`, except this method types the resulting value more narrowly than `[string, any][]`
   *
   * @example
   * ```ts
   * const person = {
   *   firstName: 'Jane' as const,
   *   lastName: 'Doe' as const,
   *   favoriteColor: 'Green',
   *   age: 21
   * }
   *
   * const entries = getObjEntries(person);
   * //    ^? (["firstName", readonly "Jane"] | ["lastName", readonly "Doe"] | ["favoriteColor", string] | ["age", number])[]
   * ```
   *
   * @param v The given object
   * @returns The array of entries
   */
  get entries(): Entries<T> {
    return Object.entries(this.inner) as Entries<T>;
  }

  /**
   * Performs a deep clone of an object via the JSON serialize/deserialize method.
   *
   * !> This method *will not work* for objects that have values of `Date`, `undefined`, or `Infinity`s
   *
   * @example
   * ```ts
   * const gizmo = { name: 'gizmo', extraInfo: { tags: ['tag1', 'tag2'] } } }
   *
   * // with quickDeepClone
   * const deepClone = obj(gizmo).quickDeepClone();
   * shallowClone == gizmo; // false
   * shallowClone.name == gizmo.name; // false
   * shallowClone.extraInfo.tags == gizmo.extraInfo.tags; // false
   *
   * // with shallow clone
   * const shallowClone = { ...gizmo };
   * shallowClone == gizmo; // false
   * shallowClone.name == gizmo.name; // false
   * shallowClone.extraInfo.tags == gizmo.extraInfo.tags; // true
   * ```
   *
   * @returns The deep clone
   */
  quickDeepClone(): TslyObject<T> {
    return obj(JSON.parse(JSON.stringify(this.inner)));
  }

  /**
   * Creates a new object from the given object with the specified fields deleted.
   *
   * @example
   * ```ts
   * const person = {
   *  first: "John",
   *  last: "Smith",
   *  age: 23,
   *  state: "NY"
   * }
   *
   * const name = dropKeys(person, ['age', 'state']);
   * console.log(name); // { "first": "John", "last": "Smith" }
   * console.log(person); // { "first": "John", "last": "Smith", "age": 23, "state": "NY" }
   * ```
   */
  dropKeys<K extends (keyof T)[]>(keys: K): TslyObject<Omit<T, K[number]>> {
    const o = { ...this.inner }; // clone object
    for (const k of keys) delete o[k];
    return obj(o as Omit<T, K[number]>);
  }

  /**
   * Creates a new object from the given object only with the specified fields from the given object
   *
   * @example
   * ```ts
   * const person = {
   *  first: "John",
   *  last: "Smith",
   *  age: 23,
   *  state: "NY"
   * }
   *
   * const newObj = TslyObject.pickKeys(person, ['first', 'last']);
   * console.log(newObj); // { "first": "John", "last": "Smith" }
   * console.log(person); // { "first": "John", "last": "Smith", "age": 23, "state": "NY" }
   * ```
   */
  pickKeys<K extends (keyof T)[]>(keys: K): TslyObject<Pick<T, K[number]>> {
    return pipe(
      this.keys.filter((k) => keys.includes(k)).map((k) => [k, this.inner[k]]),
      Object.fromEntries,
      obj
    );
  }

  /**
   * Maybe get a property on some object, who's type does not define the specified key. If no property is found on the given object at the given key, `null` is returned.
   *
   * @category Object
   */
  getUntypedProperty<K extends string, E>(key: K): E | null {
    return (this.inner as Record<K, E | undefined>)[key] ?? null;
  }

  /**
   * Converts a record-style object to an array with each record key and value mapped to a specified named attribute.
   * If the given `v` name is '...' then, given that the value of each record is an object, the keys of that subobject will be inlined into the new object.
   *
   * This method is pure.
   *
   * @example
   * ```ts
   * const ages = {
   *  bill: 38,
   *  john: 21,
   *  adam: 25
   * };
   *
   * derecordify(ages, { k: 'name', v: 'age' });
   * // [{ name: 'bill', age: 38 }, { name: 'john', age: 21 }, ...]
   *
   * const people = {
   *   bill: { age: 38, hobbies: ['cooking']},
   *   john: { age: 21, hobbies: ['gardening', 'sports']},
   *   adam: { age: 25 , hobbies: ['hiking']},
   * }
   *
   * derecordify(people, { k: 'name', v: 'info' });
   * // [{ name: "bill", info: { age: 38, hobbies: ["cooking"]}}, ...]
   *
   * derecordify(people, { k: 'name', v: '...' });
   * // [{ name: "bill", age: 38, hobbies: ["cooking"] }, ...]
   * ```
   */
  flatten<
    KeyName extends string,
    ValueName extends string | undefined = undefined
  >(
    keyName: KeyName,
    valueName?: ValueName
  ): TslyObject<Flattened<T, KeyName, ValueName>> {
    if (typeof valueName == "string")
      return obj(
        this.entries.map(([k, v]) => ({
          [keyName]: k,
          [valueName]: v,
        })) as Flattened<T, KeyName, ValueName>
      );
    else
      return obj(
        this.entries.map(([k, v]) => ({
          [keyName]: k,
          ...v,
        })) as Flattened<T, KeyName, ValueName>
      );
  }

  /**
   * Cast some given `T` to `E` without any type overlap checks.
   *
   * !> This function should be used _very_ sparingly, and only in situations where typescript cannot follow the typechecking. Often times, this happens when object properies are being checked on an indexed value. Although, in most cases this object should simply be explicitly bound to a variable, in sitations where it cannot, `unsafeCast` may be used.
   *
   * @example
   * ```ts
   * type Shape2D = ...;
   * type Shape3D = ...;
   *
   * type Shape =
   *  | { type: '2d', shape: Shape2D }
   *  | { type: '3d', shape: Shape3D }
   *
   * function print2DShape(shape: Shape2D) { ... }
   * function print3DShape(shape: Shape3D) { ... }
   *
   * function printShapeRange(shapes: Shape[], lowerIdx: number, upperIdx: number) {
   *  if (shapes[lowerIdx].type == '2d')
   *    print2DShape(castUnsafe(shapes[lowerIdx]));
   *  else
   *    print3DShape(castUnsafe(shapes[lowerIdx]))
   *
   *  if (lowerIdx < upperIdx)
   *    printShapeRange(shapes, lowerIdx + 1, upperIdx);
   * }
   *
   * ```
   */
  cast<E>(): E {
    return this.inner as unknown as E;
  }

  take(): T;
  take<E>(mapping?: (it: T) => E): E;

  take(mapping?: (it: T) => unknown) {
    return typeof mapping == "function" ? mapping(this.inner) : this.inner;
  }

  into<E>(mapping: (it: T) => E): E {
    return this.take(mapping);
  }
}

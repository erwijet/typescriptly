import { obj } from "@tsly/obj";
import { DeepKeyOf, DeepPick, DeepValue } from "./types";

export function deep<T extends object>(obj: T): DeepObject<T> {
  return new DeepObject(obj);
}

class DeepObject<T extends object> {
  constructor(private inner: T) {}

  /**
   * Construct a new object which is a clone of the given `obj` with the specified value replacing the base value at the given deep key (see {@link DeepKeyOf}), without modifying the source object.
   *
   * This method can also work with multiple objects spread across nested subobjects/arrays.
   *
   * !> This method internally uses {@link quickDeepClone}, and is thus subject to all the object limitations therein.
   *
   * ### Examples
   *
   * #### Basic Values
   * @example
   * ```ts
   * slicePropertyAtDeepKey({ name: 'John Doe' }, 'name', 'Jane Doe');
   * // returns: { name: 'Jane Doe' }
   * slicePropertyAtDeepKey({ person: { name: 'John Doe' } }, 'person.name', 'Jane Doe');
   * // returns: { person: { name: 'Jane Doe' } }
   * ```
   *
   * #### Array Values
   * @example
   * ```ts
   * slicePropertyAtDeepKey({ arr: ["one", "two", "three"] }, "arr", ["four", "five"]);
   * // returns: { arr: ["four", "five"] }
   * ```
   *
   * #### Undefined Direct Parents
   * It may be possible to specify a valid deep key which does not resolve to a value that has a parent. For example
   * @example
   * ```ts
   * type Thing = { a: { b?: { c: string } } };
   * const thing: Thing = { a: { } };
   * slicePropertyAtDeepKey(a, 'a.b.c', 'foo');
   *
   * // `c` doesn't have a parent to set the key/value `"c" => "foo"` since `b` is optional.
   * // in this situation, the method will just return the base object.
   * // returns { a: { } }
   * ```
   *
   * #### Distributed Replacement (1-Dimentional)
   * It is possible that a single key can target multiple different values within an object. This often happens if the key specifies a subobject within an array.
   * With this method, we can specify a key for *each* of the expected targets of keys by specifying an array of values to use. The values will be used in the order
   * of which the subobjects are encountered (top to bottom, outer to inner).
   * @example
   * ```ts
   * const data = {
   *  people: [
   *    { name: "Joe", age: 12 },
   *    { name: "Jane", age: 15 }
   *  ]
   * };
   *
   * slicePropertyAtDeepKey(data, 'people.name', ["foo", "bar"]);
   * // returns: {
   * //   people: [
   * //     { name: "foo", age: 12 },
   * //     { name: "bar", age: 15 }
   * //   ]
   * // }
   * ```
   *
   * #### Advanced Distributed Replacement (N-Dimentional)
   * This concept of distributed replacement can be scaled to any number of nested dimentions. For each new subobject array encountered,
   * the method will move one more level deep in the array. A 2D distributed replacement could look like this
   * @example
   * ```ts
   * const customer = {
   *   firstname: 'john',
   *   lastname: 'doe',
   *   orders: [
   *     {
   *       day: 'monday',
   *       items: [
   *         {
   *           name: 'gizmo',
   *           price: 12
   *         },
   *         {
   *           name: 'gadget',
   *           price: 15
   *         }
   *       ]
   *     },
   *     {
   *       day: 'wednesday',
   *       items: [
   *         {
   *           name: 'tickets',
   *           price: 20
   *         },
   *       ]
   *     }
   *   ]
   * }
   *
   * slicePropertAtDeepKey(customer, 'orders.items.name', [["foo", "bar", "foobar"]]);
   * // returns: {
   * //   firstname: 'john',
   * //   lastname: 'doe',
   * //   orders: [
   * //     {
   * //       day: 'monday',
   * //       items: [
   * //         {
   * //           name: 'foo',
   * //           price: 12
   * //         },
   * //         {
   * //           name: 'bar',
   * //           price: 15
   * //         }
   * //       ]
   * //     },
   * //     {
   * //       day: 'wednesday',
   * //       items: [
   * //         {
   * //           name: 'foobar',
   * //           price: 20
   * //         },
   * //       ]
   * //     }
   * //   ]
   * // }
   * ```
   *
   * @param obj The base object to use
   * @param key The specified {@link DeepKeyOf} of the base object
   * @param value The value to use at the specified `key`
   */
  replaceAt<K extends DeepKeyOf<T>>(key: K, value: DeepValue<T, K>): DeepObject<T> {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const _mutateObj = (obj: any, key: string, value: any): void => {
      const [kHead, ...kRest] = key.split(".");

      if (Array.isArray(obj)) obj.forEach((member, i) => _mutateObj(member, key, value[i]));
      else if (kRest.length == 0) obj[kHead] = value;
      else if (obj[kHead] !== undefined) _mutateObj(obj[kHead], kRest.join("."), value);
    };

    const clonedObj = this.take(obj).quickDeepClone().take();
    _mutateObj(clonedObj, key, value);

    return deep(clonedObj);
  }

  /**
   * Returns the keys of the given object in {@link DeepKeyOf} format.
   *
   * @example
   * ```ts
   * const joe = {
   *   firstName: 'Joe',
   *   lastName: 'Smith',
   *   address: {
   *     city: 'Somewhereville',
   *     state: "NY"
   *   },
   *   hobbies: [{
   *     name: "Golfing"
   *     equipment: ["Clubs", "Membership", "Golf Balls"]
   *   }]
   * }
   * console.log(getDeepKeyOf(person))
   * DeepKeyOf<Person>;
   * // ^? 'firstName' | 'lastName' | 'address' | 'address.city' | 'address.state' | 'hobbies' | 'hobbies.name' | 'hobbies.equipment'
   * ````
   */
  get deepkeys(): DeepKeyOf<T>[] {
    function _next<T extends object>(o: T, prefix: string): DeepKeyOf<T>[] {
      if (obj(o).keys.length == 0) return [];

      return Object.keys(o).flatMap((k) => {
        const v = o[k as keyof T];

        if (Array.isArray(v) && v.some((el) => typeof el == "object")) {
          v.reduce((last, cur) => {
            if (JSON.stringify(obj(last).keys) != JSON.stringify(obj(cur).keys))
              throw new Error(
                `Tried to call getDeepObjKeys with an array subobject that does not have a well-defined structure: ${
                  obj(last).keys
                } != ${obj(cur).keys}`,
              );
            return cur;
          });

          return [prefix + k, ..._next(v[0], k + ".").map((k) => prefix + k)];
        }

        if (typeof v == "object" && !Array.isArray(v) && v != null)
          return [prefix + k, ..._next(v as object, k + ".").map((k) => k + prefix)];
        return prefix + k;
      }) as DeepKeyOf<T>[];
    }

    return _next(this.inner, "");
  }

  /**
   * Returns the value at the specified {@link DeepKeyOf} the specified object.
   *
   * @example
   * ```ts
   * const obj = { a: { b: { c: 10 } } };
   *
   * getDeepValue(obj, 'a.b.c'); // returns 10
   * ```
   *
   * @example
   * ```ts
   * const obj = { a: [{ b: { c: 10 } }, { b: { c: 20 } }] };
   *
   * getDeepValue(obj, 'a.b.c'); // returns [10, 20]
   * ```
   *
   * @example
   * ```ts
   * const john: Person = {
   *     firstName: 'John',
   *     orders: [
   *         {
   *             day: 'Monday',
   *             items: [
   *                 { name: 'gizmo', price: 5 },
   *                 { name: 'thing', price: 2 },
   *             ],
   *         },
   *         {
   *             day: 'Wednesday',
   *             items: [
   *                 { name: 'guitar', price: 20 },
   *             ],
   *         },
   *     ],
   * };
   *
   * getDeepValue(john, 'orders.day'); // returns ['Monday', 'Wednesday']
   * getDeepValue(john, 'orders.items.name'); // returns [['gizmo', 'thing'], ['guitar']]
   * ```
   *
   * @param obj - The object to retrieve the value from.
   * @param key - The deep key to retrieve the value at.
   * @returns The value at the specified deep key of the object.
   */
  get<TKey extends DeepKeyOf<T>>(key: TKey): DeepValue<T, TKey> {
    const [kHead, ...kRest] = key.split(".") as [keyof T, ...string[]];
    const cur = this.inner[kHead];

    if (cur === undefined) return cur as DeepValue<T, TKey>;
    if (kRest.length == 0) return cur as DeepValue<T, TKey>;
    else if (Array.isArray(cur))
      return cur.map((el) => deep(el).get(kRest.join(".") as DeepKeyOf<typeof el>)) as DeepValue<
        T,
        TKey
      >;
    else return deep(cur as object).get(kRest.join(".") as DeepKeyOf<object>);
  }

  /**
   * Narrows a deeply nested object by returning a copy of the given base object, but with all keys except for those in the specific {@link DeepKeyOf<TBase>} path
   *
   * ?> This method differs from {@link getDeepValue} by returning an object with the same path to the specified value as the base object, whereas {@link getDeepValue} only returns the leaf-node value.
   *
   * @param {TBase} base The base object from which to retrieve the nested object
   * @param {TDeepKey} deepKey A deep key string specifying the path to the nested object
   *
   * @returns {DeepPick<TBase, TDeepKey>} The nested object specified by the deep key
   *
   * @example
   * ```ts
   * const obj = {
   *   name: {
   *     first: "joe",
   *     last: "bean",
   *   },
   *   attrs: {
   *     age: 20,
   *     hobbies: [
   *       {
   *         name: "coffee",
   *         startDate: "today",
   *       },
   *       {
   *         name: "other stuff",
   *         startDate: "yesterday",
   *       },
   *     ],
   *   },
   * };
   *
   * const nestedObj = getObjByDeepKey(obj, "name.first");
   * // returns { name: { first: "joe" } }
   *
   * const anotherNestedObj = getObjByDeepKey(obj, "attrs.hobbies.name");
   * // returns { attrs: { hobbies: [ { name: "coffee" }, { name: "other stuff" } ] } }
   * ```
   */
  getNested<TDeepKey extends DeepKeyOf<T>>(deepKey: TDeepKey): DeepPick<T, TDeepKey> {
    if (Array.isArray(this.inner))
      return this.inner.map((child) => deep(child).getNested(deepKey)) as DeepPick<T, TDeepKey>;
    if (!deepKey.includes(".")) return { [deepKey]: this.get(deepKey) } as DeepPick<T, TDeepKey>;

    const [curKey, ...restKeys] = deepKey.split(".");
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any  */
    return {
      [curKey]: deep(this.inner[curKey as keyof T] as any).getNested(restKeys.join(".")),
    } as DeepPick<T, TDeepKey>;
  }

  take(): T;
  take<E>(mapping?: (it: T) => E): E;

  take(mapping?: (it: T) => unknown) {
    return typeof mapping == "function" ? mapping(this.inner) : this.inner;
  }
}

//

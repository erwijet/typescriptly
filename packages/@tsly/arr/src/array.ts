import { DeepUnwind, err } from "@tsly/core";

class TslyArray<T> {
  constructor(private inner: T[]) {}

  /**
   * Creates a clone of some given array, without calling the given array's internal iterator, thereby improving
   * performance, particularly for larger arrays. For more information refer to [this comparison benchmark](https://jsbench.me/fylb5kvldn/1)
   *
   * This operation yields the same result as `const newArr = [...arr];`
   */
  clone(): TslyArray<T> {
    return arr(new Array<T>().concat(this.inner));
  }

  /**
   * Returns a copy of the given array, with the element at the specified startIdx moved to the specified endIdx.
   *
   * This operation is pure and leaves no gaps in the resulting array
   */
  moveToIdx(startIdx: number, endIdx: number): TslyArray<T> {
    const cpy = this.clone().take();
    const [moved] = cpy.splice(startIdx, 1);
    cpy.splice(endIdx, 0, moved);

    return arr(cpy);
  }

  /**
   * Swaps two elements in some array, returning a copy of the new array without modifying the source.
   *
   * This method is pure
   *
   * @example
   * ```ts
   * const arr = ['apple', 'banana', 'pear'];
   *
   * console.log(swapAt(arr, 1, 2)); // ['apple', 'pear', 'banana']
   * console.log(arr); // ['apple', 'banana', 'pear']
   * ```
   */
  swapAt(i1: number, i2: number): TslyArray<T> {
    const cpy = this.clone().take();
    const tmp = cpy[i2];
    cpy[i2] = cpy[i1];
    cpy[i1] = tmp;

    return arr(cpy);
  }

  /**
   * Returns the last element of some array, and `null` if the array is empty
   *
   * @example
   * ```ts
   * const arr1 = [1, 2, 3, 4];
   * const arr2 = [];
   *
   * // vanilla
   * arr1[arr1.length - 1]; // 4
   * arr2[arr2.length - 1]; // undefined
   *
   * // with `lastElem`
   * lastElem(arr1); // 4
   * lastElem(arr2) // null
   * ```
   *
   */
  get last(): T | null {
    return this.inner.at(this.inner.length - 1) ?? null;
  }

  /**
   * Inserts the `toInsert` value at the first position of a given array at which the array value matches the supplied predicate.
   * If no values are found that match the predicate, then the original array is returned.
   *
   * This method is pure
   *
   * @example
   * ```ts
   * const arr = [1, 2, null, 3, null, 4];
   * findFirstAndReplace([1, 2, null, 3, null, 4], 9, (v) => v == null);  // [1, 2, 9, 3, null, 4]
   *
   * console.log(arr); // [1, 2, null, 3, null, 4];
   * ```
   *
   * @category Array
   */
  findFirstAndReplace(toInsert: T, predicate: (v: T) => boolean): TslyArray<T> {
    const inner = this.inner;
    for (const [i, v] of inner.entries())
      if (predicate(v))
        return arr(inner.slice(0, i).concat([toInsert], inner.slice(i + 1)));
    return arr(inner.slice(0));
  }

  /**
   * Interleave some value in-between each element of some array.
   *
   * This method is pure
   *
   * @example
   * ```ts
   * const arr = ['apple', 'banana', 'orange'];
   * console.log(interleave(arr, '|')); // ['apple', '|', 'banana', '|', 'orange']
   * console.log(arr); // ['apple', 'banana', 'orange']
   * ```
   */
  interleave(toInsert: T) {
    return arr(this.inner.flatMap((e) => [toInsert, e]).slice(1));
  }

  /**
   * Checks if some given number, i, is a, index of some array, arr.
   * Equivilant to `i >= 0 && i < arr.length`
   */
  hasIdx(idx: number): boolean {
    return idx >= 0 && idx < this.inner.length;
  }

  /**
   * Create an array with some value inserted at some index, without modifying the source array.
   *
   * @example
   * ```ts
   * const arr = ['one', 'two', 'three'];
   * console.log(sliceAround(arr, 2, 'foo')); // ['one', 'two', 'foo', 'three']
   * console.log(arr); // ['one', 'two', 'three']
   * ```
   */
  insertAt(idx: number, v: T): TslyArray<T> {
    return arr(
      this.inner.slice(0, idx).concat([v]).concat(this.inner.slice(idx))
    );
  }

  /**
   * Creates a copy of some array, with some value at the given index replaced with the given value
   */
  replaceAt(idx: number, v: T): TslyArray<T> {
    if (!this.hasIdx(idx)) return this.clone();

    const cpy = this.clone().take();
    cpy[idx] = v;
    return arr(cpy);
  }

  /**
   * Construct a new array equal to the given array with the data at the given index excluded. The source array is left unmodified.
   *
   * @example
   * ```ts
   * const fruits = ['apple', 'banana', 'orange'];
   * dropIdx(fruits, 1); // [ 'apple', 'orange' ];
   * console.log(fruits); // ['apple', 'banana', 'orange']
   * ```
   */
  dropIdx(idx: number): TslyArray<T> {
    if (!this.hasIdx(idx)) return this;
    return arr(this.inner.filter((_, i) => i != idx));
  }

  /**
   * Chunks the input array into smaller arrays of the specified size.
   *
   * @typeParam T - The type of the elements in the array.
   * @param arr - The array to chunk.
   * @param chunkSize - The size of each chunk.
   * @returns An array of chunks, where each chunk is an array of `T`.
   *
   * @example
   * ```ts
   * const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
   * const chunkSize = 3;
   * const chunks = chunkArr(arr, chunkSize);
   * console.log(chunks); // [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]
   * ```
   */
  chunk(chunkSize: number): TslyArray<T[]> {
    const chunks: T[][] = [];
    const buf: T[] = [];

    this.inner.forEach((cur, i) => {
      buf.push(cur);

      if (buf.length == chunkSize || i + 1 == this.inner.length) {
        chunks.push([...buf]);
        buf.splice(0, buf.length); // clear buffer
      }
    });

    return arr(chunks);
  }

  /**
   * Returns a clone of the given array wih duplicate elements removed via the `filter/indexOf` method.
   *
   * @example
   * ```ts
   * const arr = [1, 1, 1, 2, 1, 3, 4, 4, 2, 1, 2];
   *
   * dedupArr(arr);
   * // returns [1, 2, 3, 4]
   * ```
   */
  dedup(): TslyArray<T> {
    return arr(this.inner.filter((cur, i) => this.inner.indexOf(cur) == i));
  }

  /**
   * Recursively flattens a nested array, returning a new array with all elements flattened.
   *
   * ?> This method serves as a more typescript-friendly, ergonimic alternative to `Array.prototype.flat` called with `Number.POSITIVE_INFINITY`
   *
   * @typeParam T - The type of the input array.
   * @param arr - The array to flatten.
   * @returns A new array with all elements flattened.
   *
   * ### With `deepFlattenArr`
   *
   * @example
   * ```typescript
   * const arr1 = deepFlattenArr([[0], [[1]]]);
   * //    ^? number[]
   * //    returns [0, 1]
   *
   * const arr2 = [[["str"]], [false], [[5]]];
   * //    ^? (string | boolean | number)[]
   * //    returns ["str", false, 5]
   * ```
   *
   * ### With `Array.prototype.flat`
   * ```typescript
   * const arr = [[0], [[1]]].flat(Number.POSITIVE_INFINITY);
   * //    ^? FlatArray<number[] | number[][], 0 | 1 | 2 | -1 | 3 | 4 | 5 | ...
   * ```
   *
   */

  deepFlatten(): TslyArray<DeepUnwind<T>> {
    return arr(
      this.inner.flatMap((el) =>
        Array.isArray(el) ? arr(el).deepFlatten().take() : el
      )
    );
  }

  /**
   * Merges multiple arrays and returns a new array containing the unique elements from all union of the given arrays.
   *
   * @typeParam T - The type of elements in the arrays.
   * @param arrs - Arrays to be merged.
   * @returns A new array with unique elements from all input arrays.
   *
   * @example
   * ```ts
   * const arr1 = [1, 2, 3];
   * const arr2 = [2, 3, 4];
   * const arr3 = [3, 4, 5];
   *
   * mergeArrs(arr1, arr2, arr3);
   * // returns [1, 2, 3, 4, 5]
   * ```
   */
  merge(...arrs: T[][]): TslyArray<T> {
    return arr(
      [this.inner, ...arrs].reduce((acc, cur) => acc.concat(cur))
    ).dedup();
  }

  //

  /**
   * Construct a new array of a given size from the result of calling the given factory method with the respective index therein.
   *
   * @example
   * ```ts
   * arrFromFactory(5, (idx) => idx % 2 == 0 ? 'even' : 'odd');
   * // ['even', 'odd', 'even', 'odd', 'even'];
   * ```
   *
   * @category Array
   */
  static fromFactory<T>(size: number, by: (i: number) => T): TslyArray<T> {
    return arr(new Array(size).fill(null).map((_, i) => by(i)));
  }

  //

  [Symbol.iterator]() {
    return this.inner[Symbol.iterator]();
  }

  get isEmpty() {
    return this.inner.length == 0;
  }

  take(): T[];
  take<E>(mapping?: (it: T[]) => E): E;

  take(mapping?: (it: T[]) => unknown) {
    return typeof mapping == "function" ? mapping(this.inner) : this.inner;
  }

  into<E>(mapping: (it: T[]) => E): E {
    return this.take(mapping);
  }
}

function _builder<T>(size: number, factory: (i: number) => T): TslyArray<T>;
function _builder<T>(inner: T[]): TslyArray<T>;

function _builder<T>(
  arg1: number | T[],
  arg2?: (i: number) => T
): TslyArray<T> {
  if (Array.isArray(arg1)) return new TslyArray(arg1);
  else return TslyArray.fromFactory(arg1, arg2 ?? err("missing factory"));
}

export const arr = Object.assign(_builder, {
  byReduce: <const>[
    <T>(tslyArr: TslyArray<T>, cur: T, _idx: number, _self: T[]) => {
      return tslyArr.merge([cur]);
    },
    new TslyArray([] as any[]),
  ],
});

/**
 * Concatenates a tuple of strings using a specified delimiter.
 *
 * @typeParam TTuple - The input tuple of strings.
 * @typeParam TDelim - The delimiter used to concatenate the strings.
 * @typeParam TAcc - The accumulated string during concatenation (initially an empty string).
 * @returns The concatenated string.
 *
 * @example
 * ```typescript
 * type Result = ConcatTuple<["Hello", "World"], "-">;
 * //   ^? "Hello-World"
 * ```
 */
export type ConcatTuple<
  TTuple extends string[],
  TDelim extends string,
  TAcc extends string = "",
> = TTuple extends [infer Head extends string, ...infer Rest extends string[]]
  ? ConcatTuple<Rest, TDelim, `${TAcc}${TDelim}${Head}`>
  : TAcc;

/**
 * Concatenates a readonly tuple of strings using a specified delimiter.
 *
 * @typeParam TTuple - The input readonly tuple of strings.
 * @typeParam TDelim - The delimiter used to concatenate the strings.
 * @typeParam TAcc - The accumulated string during concatenation (initially an empty string).
 * @returns The concatenated string.
 *
 * @example
 * ```typescript
 * type Result = ConcatReadonlyTuple<readonly ["Hello", "World"], "-">;
 * //   ^? "Hello-World"
 * ```
 */
export type ConcatReadonlyTuple<
  TTuple extends readonly string[],
  TDelim extends string,
  TAcc extends string = "",
> = TTuple extends readonly [infer Head extends string, ...infer Rest extends readonly string[]]
  ? ConcatReadonlyTuple<Rest, TDelim, `${TAcc}${TDelim}${Head}`>
  : TAcc;

/**
 * Represents a mapped tuple type that extracts a specific property from each object in a tuple.
 *
 * @typeParam TTuple The input tuple type.
 * @typeParam TKey The key of the property to extract from each object in the tuple.
 * @typeParam TMapped The resulting mapped tuple type.
 *
 * @example
 * ```ts
 * // Extract the 'id' property from each object in the tuple.
 * type InputTuple = [{ id: number }, { id: string }, { id: boolean }];
 * type ResultTuple = MappedTuple<InputTuple, 'id'>;
 *      ^? [number, string, boolean]
 * ```
 */
export type MappedTuple<
  TTuple extends readonly [...object[]],
  TKey extends keyof TTuple[number],
  TMapped extends readonly [...unknown[]] = [],
> = TTuple extends readonly [infer THead extends object, ...infer TRest extends object[]]
  ? MappedTuple<TRest, TKey, [...TMapped, THead[TKey]]>
  : TMapped;

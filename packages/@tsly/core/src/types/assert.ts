/**
 *
 * Asserts whether a type `T` is a subtype of a given super type `TSuperType`.
 *
 * @remarks
 *
 * This can solve the problem often associated with the type value of indexed types not being preserved. For example, consider
 * ```ts
 * type ValueOf<T extends object> = T[keyof T];
 *
 * function fn<T extends object, K extends KeyOfType<T, object>, V extends ValueOf<T[K]>>() { ... }
 * // fails with "Type 'T[K]' does not satisfy the constraint 'object'""           ^^^^
 * ```
 *
 * Typically, we can solve this by doing an immediate check that `T[K] <: object`:
 * ```ts
 * function fn<T extends object, K extends KeyOfType<T, object>, V extends ValueOf<T[K] extends infer It extends object ? It : never>>() { ... }
 * ```
 *
 * This is, of course, cumbersome. `AssertSubtype` improves readability in situations such as this.
 * ```ts
 * function fn<T extends object, K extends KeyOfType<T, object>, V extends ValueOf<AssertSubtype<T[K], object>>>() { ... }
 * ```
 */
export type AssertSubtype<T, TSuperType> = T extends TSuperType ? T : never;

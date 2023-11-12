/**
 * Similar in functionality to the built-in {@link Partial<T>}, but the type is recursivly applied to all subobjects
 *
 * @example
 * ```ts
 * type FormattingBlock = { where: { argument: { value: string } } };
 *
 * type FormattingBlockPatch DeepPartial<FormattingBlock>;
 * //   ^?: { where?: DeepPartial<{ argument: { value: string; }; }> | undefined;
 * ```
 */
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends (infer U)[] ? DeepPartial<U>[] : T[P] extends object ? DeepPartial<T[P]> : T[P];
};

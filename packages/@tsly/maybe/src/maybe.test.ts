import { isNone, isSome, maybe, Nullable } from "./maybe";
import { pipe, err } from "@tsly/core";

test("is none", () => {
  expect(isNone(null)).toEqual(true);
  expect(isNone("foo")).toEqual(false);
});

test("is some", () => {
  expect(isSome(null)).toEqual(false);
  expect(isSome("foo")).toEqual(true);
});

describe("maybe()", () => {
  it("should allow chaining methods and return the wrapped value", () => {
    const wrappedValue = maybe(42);
    const result = wrappedValue.let((it) => it * 2).take();

    expect(result).toBe(84);
  });

  it("should handle null or undefined values correctly", () => {
    expect(maybe(null as string | null)?.let((it) => it.length)).toEqual(
      undefined
    );
  });

  it('should handle "takeUnless" method correctly', () => {
    expect(
      maybe([1, 2, 3] as number[] | null)?.takeUnless((it) => it.length == 0)
    ).toEqual([1, 2, 3]);
    expect(
      maybe([] as number[] | null)?.takeUnless((it) => it.length == 0)
    ).toEqual(null);
  });

  it('should handle "takeIf" method correctly', () => {
    expect(
      maybe([1, 2, 3] as number[] | null)?.takeIf((it) => it.length > 0)
    ).toEqual([1, 2, 3]);
    expect(maybe([] as number[] | null)?.takeIf((it) => it.length > 0)).toEqual(
      null
    );
  });

  it('should handle "if" method correctly', () => {
    expect(
      maybe([1, 2, 3] as number[] | null)
        ?.if((it) => it.length > 0)
        ?.take()
    ).toEqual([1, 2, 3]);
    expect(
      maybe([1, 2, 3] as number[] | null)
        ?.if((it) => it.length == 0)
        ?.take()
    ).toEqual(undefined);
  });

  it('should handle "unless" method correctly', () => {
    expect(
      maybe([1, 2, 3] as number[] | null)
        ?.unless((it) => it.length == 0)
        ?.take()
    ).toEqual([1, 2, 3]);
    expect(
      maybe([] as number[] | null)?.unless((it) => it.length == 0)
    ).toEqual(maybe(null));
  });

  it("should properly eject the wrapped value", () => {
    const thing = "foo" as Nullable<string>;
    const thing2 = null as Nullable<string>;

    expect(maybe(thing)?.take()).toEqual("foo");
    expect(maybe(thing2)?.take()).toEqual(undefined);
  });

  it("should properly call the mapping and eject the wrapped value", () => {
    const thing = "foo" as Nullable<string>;
    const thing2 = null as Nullable<string>;

    expect(maybe(thing)?.take((it) => it.length)).toEqual(3);
    expect(maybe(thing2)?.take((it) => it.length)).toEqual(undefined);
  });

  it('should handle the "try" method correctly', () => {
    const thing = "1234" as Nullable<string>;
    const thing2 = "foo" as Nullable<string>;

    function parse(str: string) {
      return pipe(Number.parseInt(str), (it) =>
        !Number.isNaN(it) ? it : err("Failed to parse")
      );
    }

    expect(
      maybe(thing)
        ?.try((it) => parse(it))
        ?.take() ?? null
    ).toEqual(1234);
    expect(
      maybe(thing2)
        ?.try((it) => parse(it))
        ?.take() ?? null
    ).toEqual(null);
  });

  it('should handle the "tryTake" method correctly', () => {
    const thing = "1234" as Nullable<string>;
    const thing2 = "foo" as Nullable<string>;

    function parse(str: string) {
      return pipe(Number.parseInt(str), (it) =>
        !Number.isNaN(it) ? it : err("Failed to parse")
      );
    }

    expect(maybe(thing)?.tryTake((it) => parse(it)) ?? null).toEqual(1234);
    expect(maybe(thing2)?.tryTake((it) => parse(it)) ?? null).toEqual(null);
  });

  it('should handle "also" method correctly', () => {
    const thing = "foo" as Nullable<string>;
    const thing2 = null as Nullable<string>;

    const fn = jest.fn();

    expect(
      maybe(thing)
        ?.also((it) => {
          fn(it);
          return "bar";
        })
        .take()
    ).toEqual("foo");

    expect(
      maybe(thing2)
        ?.also((it) => {
          fn(it);
          return "bar";
        })
        .take()
    ).toEqual(undefined);

    expect(fn).toBeCalledTimes(1);
  });
});

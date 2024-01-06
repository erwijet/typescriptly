import { arr } from "./array";

function assertNoSideEffects(baseArr: unknown[], newArr: unknown[]) {
  expect(baseArr).not.toEqual(newArr);
  expect(baseArr).not.toBe(newArr);
}

test("for-of iterator", () => {
  const fruit = arr(["apple", "banana", "pear"]);
  const fn = jest.fn();

  for (const each of fruit) {
    fn(each);
  }

  expect(fn).toHaveBeenCalledTimes(fruit.take().length);
  fruit.take().forEach((el) => {
    expect(fn).toHaveBeenCalledWith(el);
  });
});

test("moveToIdx()", () => {
  const fruit = ["apple", "banana", "orange", "pear", "kiwi"];
  const newArr = arr(fruit).moveToIdx(1, 3).take();

  expect(newArr).toEqual(["apple", "orange", "pear", "banana", "kiwi"]);
  assertNoSideEffects(fruit, newArr);
});

test("isEmpty", () => {
  expect(arr([]).isEmpty).toBe(true);
  expect(arr(["something"]).isEmpty).toBe(false);
  expect(arr([[]]).isEmpty).toBe(false);
});

test("swapAt()", () => {
  const nums = [1, 2, 3, 4];
  const swp = arr(nums).swapAt(1, 2).take();

  expect(swp).toEqual([1, 3, 2, 4]);

  assertNoSideEffects(nums, swp);
});

test("last", () => {
  expect(arr([]).last).toEqual(null);
  expect(arr([1, 2, 3]).last).toEqual(3);
});

test("findFirstAndReplace()", () => {
  const arr1 = [1, 2, null, 3, null, 4];
  const arr2 = arr(arr1)
    .findFirstAndReplace(9, (el) => el == null)
    .take();
  const arr3 = arr(arr1)
    .findFirstAndReplace(9, (el) => el == -1)
    .take();

  expect(arr1).toEqual(arr3);
  expect(arr2).toEqual([1, 2, 9, 3, null, 4]);

  assertNoSideEffects(arr1, arr2);
});

test("interleave()", () => {
  const fruit = ["apple", "banana", "orange"];
  const newArr = arr(fruit).interleave("|").take();

  expect(newArr).toEqual(["apple", "|", "banana", "|", "orange"]);
  assertNoSideEffects(fruit, newArr);
});

test("hasIdx", () => {
  expect(arr(50, (it) => it).hasIdx(50)).toEqual(false);
  expect(arr(50, (it) => it).hasIdx(-1)).toEqual(false);
  expect(arr(50, (it) => it).hasIdx(25)).toEqual(true);
});

test("insertAt()", () => {
  const things = ["one", "two", "three"];
  const newArr = arr(things).insertAt(2, "foo").take();

  expect(newArr).toEqual(["one", "two", "foo", "three"]);
  assertNoSideEffects(things, newArr);
});

test("clone()", () => {
  const nums = [1, 2, 3, 4];
  const newArr = arr(nums).clone().take();

  expect(nums).toEqual(newArr);
  expect(nums).not.toBe(newArr);
});

test("no implicit clone", () => {
  const nums = [1, 2, 3];
  const sameArr = arr(nums).take();

  expect(nums).toEqual(sameArr);
  expect(nums).toBe(sameArr);
});

test("arr() from factory", () => {
  expect(arr(5, (i) => i).take()).toEqual([0, 1, 2, 3, 4]);
});

test("arr.byReduce", () => {
  const fruits = ["apple", "orange", "grape", "pear"];
  expect(fruits.reduce(...arr.byReduce).take()).toEqual(fruits);
});

test("dropIdx()", () => {
  const fruits = ["apple", "banana", "orange"];
  expect(arr(fruits).dropIdx(1).take()).toEqual(["apple", "orange"]);
  expect(arr(fruits).dropIdx(-1).take()).toEqual(fruits);
});

test("chunk()", () => {
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  expect(arr(nums).chunk(3).take()).toEqual([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [10],
  ]);
  expect(arr([1, 2]).chunk(4).take()).toEqual([[1, 2]]);
  expect(arr([]).chunk(3).take()).toEqual([]);
  expect(
    arr([{ a: 1 }, { b: 2 }, { c: 3 }])
      .chunk(2)
      .take()
  ).toEqual([[{ a: 1 }, { b: 2 }], [{ c: 3 }]]);
});

describe("dedup()", () => {
  it("removes duplicate elements from the array", () => {
    const nums = [1, 1, 1, 2, 1, 3, 4, 4, 2, 1, 2];
    expect(arr(nums).dedup().take()).toEqual([1, 2, 3, 4]);
  });

  it("returns an empty array for an empty input array", () => {
    const emptyArr: number[] = [];
    const deduped = arr(emptyArr).dedup().take();
    expect(deduped).toEqual([]);
  });

  it("preserves the order of elements", () => {
    const nums = [3, 1, 2, 2, 1, 4, 4, 3];
    const deduped = arr(nums).dedup().take();
    expect(deduped).toEqual([3, 1, 2, 4]);
  });
});

describe("deep flatten arr", () => {
  it("should flatten a nested array of numbers", () => {
    const flat = arr([[0], [[1]], [[[2]]]])
      .deepFlatten()
      .take();
    expect(flat).toEqual([0, 1, 2]);
  });

  it("should flatten a nested array of mixed types", () => {
    const flat = arr([[["str"]], [false], [[5]], [null]])
      .deepFlatten()
      .take();
    expect(flat).toEqual(["str", false, 5, null]);
  });
});

describe("merge()", () => {
  it("should merge multiple arrays and return a new array with unique elements", () => {
    const arr1 = [1, 2, 3];
    const arr2 = [2, 3, 4];
    const arr3 = [3, 4, 5];

    const mergedArray = arr(arr1).merge(arr2, arr3).take();

    expect(mergedArray).toEqual(expect.arrayContaining([1, 2, 3, 4, 5]));
    expect(mergedArray.length).toEqual(5);
  });
});


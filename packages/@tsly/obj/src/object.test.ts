import { obj } from "./object";

function assertNoSideEffects<T extends object, E extends object>(o1: T, o2: E) {
  expect(o1).not.toEqual(o2);
  expect(o1).not.toBe(o2);
}

test("drop keys", () => {
  const o = {
    first: "John",
    last: "Smith",
    age: 23,
    state: "NY",
  };

  const newObj = obj(o).dropKeys(["age", "state"]).take();

  expect(newObj).toEqual({
    first: "John",
    last: "Smith",
  });

  assertNoSideEffects(obj, newObj);
});

test("pick keys", () => {
  const person = {
    first: "John",
    last: "Smith",
    age: 23,
    state: "NY",
  };

  const newObj = obj(person).pickKeys(["first", "last"]).take();
  expect(newObj).toEqual({ first: "John", last: "Smith" });
});

test("flatten with value specified", () => {
  const ages = {
    bill: 38,
    john: 21,
    adam: 25,
  };

  const o = obj(ages).flatten("name", "age").take();
  expect(o).toEqual([
    {
      name: "bill",
      age: 38,
    },
    {
      name: "john",
      age: 21,
    },
    {
      name: "adam",
      age: 25,
    },
  ]);

  assertNoSideEffects(ages, obj);
});

test("flatten without value specified", () => {
  const people = {
    bill: {
      age: 38,
      hobbies: ["cooking"],
    },
    john: {
      age: 21,
      hobbies: ["gardening", "fishing"],
    },
    adam: {
      age: 25,
      hobbies: ["hiking"],
    },
  };

  const o = obj(people).flatten("name").take();

  expect(o).toEqual([
    {
      name: "bill",
      age: 38,
      hobbies: ["cooking"],
    },
    {
      name: "john",
      age: 21,
      hobbies: ["gardening", "fishing"],
    },
    {
      name: "adam",
      age: 25,
      hobbies: ["hiking"],
    },
  ]);

  assertNoSideEffects(people, obj);
});

test("get object keys", () => {
  const person = {
    first: "John",
    last: "Smith",
    age: 23,
    state: "NY",
  };

  const keys = obj(person).keys;

  expect(keys).toEqual(["first", "last", "age", "state"]);
  assertNoSideEffects(obj, keys);
});

test("get object entries", () => {
  const person = {
    first: "John",
    last: "Smith",
    age: 23,
    state: "NY",
  };

  const entries = obj(person).entries;

  expect(entries).toEqual(Object.entries(person));
  assertNoSideEffects(person, entries);
});

test("quick deep clone", () => {
  const gizmo = { name: "gizmo", extraInfo: { tags: ["tag1", "tag2"] } };

  const clone = obj(gizmo).quickDeepClone().take();
  expect(clone).toEqual(gizmo);
  expect(clone).not.toBe(gizmo);
  expect(clone.extraInfo).not.toBe(gizmo.extraInfo);
  expect(clone.extraInfo.tags).not.toBe(gizmo.extraInfo.tags);
});

test("get untyped property", () => {
  const person = {
    name: "John Smith",
  } as object;

  const name: string | null = obj(person).getUntypedProperty("name");
  const age: number | null = obj(person).getUntypedProperty("age");

  expect(name).toEqual("John Smith");
  expect(age).toStrictEqual(null);
});

test("cast", () => {
  const people = [
    { first: "john", last: "smith", state: "NY" },
    { first: "sam", last: "johnson", state: "NY" },
    { first: "john", last: "appleseed", state: "CO" },
  ];

  expect(obj(people).cast()).toBe(people);
});

describe("with", () => {
  const person = obj({
    name: { first: "john", last: "smith" },
    age: 25,
  });

  it("works by passing the selected value directly when not an object", () => {
    const updated = person.with("age", (age) => {
      expect(age).toEqual(25);
      return age + 1;
    });

    expect(updated.take()).toEqual({
      ...person.take(),
      age: 26,
    });
  });

  it("directly inserts non-functor values", () => {
    expect(person.with("age", 30).take()).toEqual({
      ...person.take(),
      age: 30,
    });
    expect(person.with("hobbies", ["running"]).take()).toEqual({
      ...person.take(),
      hobbies: ["running"],
    });
  });
});

describe("obj.hasNoNullishProps", () => {
  type InputShape = {
    name?: string | null;
    age: number | null | undefined;
  };

  const things = (
    [
      { age: null },
      { name: "adam", age: undefined },
      { name: "john", age: 21 },
    ] satisfies InputShape[]
  ).filter(obj.hasNoNullishProps);

  things.forEach((val) => {
    expect(val.age).toEqual(21);
    expect(val.name).toEqual("john");
  });
});

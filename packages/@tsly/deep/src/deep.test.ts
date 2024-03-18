import { deep } from "./deep";

test("deep().deepkeys", () => {
  const joe = {
    firstName: "Joe",
    lastName: "Smith",
    address: {
      city: "Somewhereville",
      state: "NY",
    },
    hobbies: [
      {
        name: "Golfing",
        equipment: ["Clubs", "Membership", "Golf Balls"],
      },
      {
        name: "Painting",
        equipment: ["Paint Brush"],
      },
    ],
    emptyKey: {},
  };

  const keys = deep(joe).deepkeys;
  expect(keys).toEqual([
    "firstName",
    "lastName",
    "address",
    "address.city",
    "address.state",
    "hobbies",
    "hobbies.name",
    "hobbies.equipment",
    "emptyKey",
  ]);

  expect(deep({ a: 1, b: { c: null } }).deepkeys).toEqual(["a", "b", "b.c"]);

  expect(() => deep({ parent: [{ a: "a" }, { b: "b" }] }).deepkeys).toThrow(
    "Tried to call getDeepObjKeys with an array subobject that does not have a well-defined structure: a != b",
  );
});

test("deep().replaceAt()", () => {
  const obj = {
    firstname: "john",
    lastname: "doe",
    orders: [
      {
        day: "monday",
        items: [
          {
            name: "gizmo",
            price: 5,
          },
          {
            name: "thigy",
            price: 2,
          },
        ],
      },
      {
        day: "wednesday",
        items: [
          {
            name: "guitar",
            price: 20,
          },
        ],
      },
    ],
  };

  expect(deep({ v: "foo" }).replaceAt("v", "bar").take()).toEqual({
    v: "bar",
  });

  type Thing = { a: { b?: { c: string } } };
  expect(
    deep({ a: {} } as Thing)
      .replaceAt("a.b.c", "foo")
      .take(),
  ).toEqual({
    a: {},
  });

  expect(
    deep({ arr: ["one", "two", "three"] })
      .replaceAt("arr", ["four", "five"])
      .take(),
  ).toEqual({ arr: ["four", "five"] });
  expect(
    deep({
      people: [
        { name: "joe", age: 12 },
        { name: "jane", age: 15 },
      ],
    })
      .replaceAt("people.name", ["foo", "bar"])
      .take(),
  ).toEqual({
    people: [
      { name: "foo", age: 12 },
      { name: "bar", age: 15 },
    ],
  });

  expect(
    deep(obj)
      .replaceAt("orders.items.name", [["one", "two"], ["three"]])
      .take(),
  ).toEqual({
    firstname: "john",
    lastname: "doe",
    orders: [
      {
        day: "monday",
        items: [
          {
            name: "one",
            price: 5,
          },
          {
            name: "two",
            price: 2,
          },
        ],
      },
      {
        day: "wednesday",
        items: [
          {
            name: "three",
            price: 20,
          },
        ],
      },
    ],
  });
});

test("deep().get()", () => {
  const obj = {
    firstname: "john",
    subobj1: {
      subobj2: {
        deepValue: 5,
      },
    },
    orders: [
      {
        day: "monday",
        items: [
          {
            name: "gizmo",
            price: 5,
          },
          {
            name: "thing",
            price: 2,
          },
        ],
      },
      {
        day: "wednesday",
        items: [
          {
            name: "guitar",
            price: 20,
          },
        ],
      },
    ],
  };

  type DeepObjectWithUndef = { a: { b?: { c: string } } };
  const deepObjWithUndef: DeepObjectWithUndef = { a: {} };
  expect(deep(deepObjWithUndef).get("a.b.c")).toBeUndefined();
  expect(deep(obj).get("firstname")).toEqual("john");
  expect(deep(obj).get("subobj1.subobj2.deepValue")).toEqual(5);
  expect(deep(obj).get("orders.day")).toEqual(["monday", "wednesday"]);
  expect(deep(obj).get("orders.items.name")).toEqual([["gizmo", "thing"], ["guitar"]]);
});

test("deep().getNested()", () => {
  const obj = {
    name: {
      first: "joe",
      last: "bean",
    },
    attrs: {
      age: 20,
      hobbies: [
        {
          name: "coffee",
          startDate: "today",
        },
        {
          name: "other stuff",
          startDate: "yesterday:",
        },
      ],
    },
  };

  expect(deep(obj).getNested("name.first")).toEqual({
    name: { first: "joe" },
  });
  expect(deep(obj).getNested("name")).toEqual({
    name: { first: "joe", last: "bean" },
  });
  expect(deep(obj).getNested("attrs.hobbies.name")).toEqual({
    attrs: { hobbies: [{ name: "coffee" }, { name: "other stuff" }] },
  });
});

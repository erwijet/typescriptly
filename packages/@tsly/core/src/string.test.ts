import { str } from "./string";

test("escape regex", () => {
  expect(new RegExp("$50").test("$50")).toEqual(false);
  expect(new RegExp(str("$50").escapeRegex().take()).test("$50")).toEqual(true);
});

test("sliceStrTo", () => {
  expect(str("apple.banana.orange.kiwi").sliceTo(".").take()).toEqual("apple.");
  expect(str("apple.banana.orange.kiwi").sliceTo(".", 2).take()).toEqual(
    "apple.banana.orange."
  );
  expect(str("apple.banana.orange.kiwi").sliceTo(".", 100).take()).toEqual(
    "apple.banana.orange.kiwi"
  );
});

test("maybe parse int", () => {
  expect(str("123").maybeParseInt()).toEqual(123);
  expect(str("1010").maybeParseInt(2)).toEqual(10);
  expect(str("abc").maybeParseInt()).toBeNull();
});

test("maybe parse float", () => {
  expect(str("3.14").maybeParseFloat()).toEqual(3.14);
  expect(str("123").maybeParseFloat()).toEqual(123);
  expect(str("abc").maybeParseFloat()).toBeNull();
});

test("capitalize", () => {
  expect(str("hello, world").capitalize().take()).toEqual("Hello, world");
  expect(str("HELLO, WORLD").capitalize().take()).toEqual("Hello, world");
  expect(str("hello, WORLD").capitalize().take()).toEqual("Hello, world");
});

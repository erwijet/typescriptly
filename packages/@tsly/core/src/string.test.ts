import { escapeRegex, sliceStrTo, maybeParseInt, maybeParseFloat } from "./string";

test("escape regex", () => {
    expect(new RegExp("$50").test("$50")).toEqual(false);
    expect(new RegExp(escapeRegex("$50")).test("$50")).toEqual(true);
});

test("sliceStrTo", () => {
    expect(sliceStrTo("apple.banana.orange.kiwi", ".")).toEqual("apple.");
    expect(sliceStrTo("apple.banana.orange.kiwi", ".", 2)).toEqual("apple.banana.orange.");
    expect(sliceStrTo("apple.banana.orange.kiwi", ".", 100)).toEqual("apple.banana.orange.kiwi");
});

test("maybe parse int", () => {
    expect(maybeParseInt("123")).toEqual(123);
    expect(maybeParseInt("1010", 2)).toEqual(10);
    expect(maybeParseInt("abc")).toBeNull();
});

test("maybe parse float", () => {
    expect(maybeParseFloat("3.14")).toEqual(3.14);
    expect(maybeParseFloat("123")).toEqual(123);
    expect(maybeParseFloat("abc")).toBeNull();
});

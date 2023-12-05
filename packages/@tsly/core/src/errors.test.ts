import { err } from "./errors";

test("throw error", () => {
    const expr = () => {
        const _: string = err("some message"); // this function should have return type of "string"
        throw "this should not be reached";
    };

    expect(expr).toThrow("some message");
    expect(expr).not.toThrow("this should not be reached");

    const objErr = new Error("some error object");

    expect(() => err(objErr)).toThrow(objErr);
});

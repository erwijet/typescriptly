import { act, renderHook } from "@testing-library/react";
import { useDefer } from "./useDefer";

describe("useDefer", () => {
  it("handles 0 arguments", () => {
    const fn = jest.fn();
    const { result } = renderHook(() => useDefer(fn));

    expect(result.current).toBeInstanceOf(Function);
    expect(fn).not.toHaveBeenCalled();

    expect(result.current).toBeInstanceOf(Function);
    expect(fn).not.toHaveBeenCalled();

    act(() => {
      result.current();
      expect(fn).not.toHaveBeenCalled();
    });

    expect(fn).toHaveBeenCalled();
  });

  it("handles a non-zero number of arguments", () => {
    const fn = jest.fn();
    const { result } = renderHook(() => useDefer(fn));

    const arg = Symbol();
    const arg2 = Symbol();

    expect(result.current).toBeInstanceOf(Function);
    expect(fn).not.toHaveBeenCalled();

    expect(result.current).toBeInstanceOf(Function);
    expect(fn).not.toHaveBeenCalled();

    act(() => {
      result.current(arg, arg2);
      expect(fn).not.toHaveBeenCalled();
    });

    expect(fn).toHaveBeenLastCalledWith(arg, arg2);
  });
});

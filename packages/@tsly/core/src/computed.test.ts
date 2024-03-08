import { computed } from "./computed";

test("computed value :: get", () => {
  const nums = [1, 2, 3, 4];

  const proxy = computed(() => {
    return nums.pop();
  });

  expect(proxy.value).toBe(4);
  expect(proxy.value).toBe(3);
  expect(proxy.value).toBe(2);
  expect(proxy.value).toBe(1);
});

test("computed value :: set", () => {
  const fn = jest.fn();

  const proxy = computed(() => "", {
    set: (val) => fn(val),
  });

  proxy.value = "1";
  proxy.value = "2";
  proxy.value = "3";

  expect(fn).toHaveBeenCalledTimes(3);

  expect(fn).toHaveBeenCalledWith("1");
  expect(fn).toHaveBeenCalledWith("2");
  expect(fn).toHaveBeenCalledWith("3");
});

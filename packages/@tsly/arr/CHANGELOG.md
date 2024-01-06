# @tsly/arr

## 1.2.0

### Minor Changes

- 5c9a447: - Removed `replaceAt` in favor of ECMA2023 `Array.prototype.with`
  - Updated `dedup` to optionally accept a custom equality method

## 1.1.1

### Patch Changes

- d7bc5c6: Unwrapped TslyArray now correctly publish a `[Symbol.iterator]` for `for-of` loops

## 1.1.0

### Minor Changes

- 6caaf3e: - Reimplement `rangeIter` non-recursivly as `iter.range`
  - Introduce `arr.byReduce` and `iter.byReduce` builders

## 1.0.0

### Major Changes

- First Release

### Patch Changes

- Updated dependencies
  - @tsly/core@1.0.0

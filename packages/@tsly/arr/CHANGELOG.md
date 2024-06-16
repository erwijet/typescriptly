# @tsly/arr

## 1.6.4

### Patch Changes

- Updated dependencies [fa4b7a9]
  - @tsly/obj@1.3.0

## 1.6.3

### Patch Changes

- Updated dependencies [43cd9c1]
  - @tsly/obj@1.2.1

## 1.6.2

### Patch Changes

- Updated dependencies [d4cfa7e]
  - @tsly/obj@1.2.0

## 1.6.1

### Patch Changes

- Updated dependencies [2676e5e]
  - @tsly/core@1.5.0
  - @tsly/obj@1.1.0

## 1.6.0

### Minor Changes

- 7c2d8ec: Adds `update()` method

## 1.5.0

### Minor Changes

- d5dcc96: Introduces `mergeBy` for merging arrays that require a custom equality function for deduping

## 1.4.3

### Patch Changes

- Updated dependencies [fa015f7]
  - @tsly/core@1.4.0
  - @tsly/obj@1.1.0

## 1.4.2

### Patch Changes

- Updated dependencies [52ffd6c]
- Updated dependencies [0edfd27]
- Updated dependencies [f3d72b4]
  - @tsly/core@1.3.0
  - @tsly/obj@1.1.0

## 1.4.1

### Patch Changes

- Updated dependencies [4a303d7]
  - @tsly/core@1.2.0
  - @tsly/obj@1.0.0

## 1.4.0

### Minor Changes

- 7300770: Introduces `.toObj()` method which allows arrays to be transformed into tsly objects

## 1.3.0

### Minor Changes

- 7300770: Introduces `.toObj()` method which allows arrays to be transformed into tsly objects

## 1.2.2

### Patch Changes

- Updated dependencies [3f492da]
  - @tsly/core@1.1.0

## 1.2.1

### Patch Changes

- 5eb63b0: Introduces `count()`

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

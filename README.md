LinqTS
======
Native LINQ for Typesctipt <br/>
Version: alpha-2014-09-05 <br/>
License: MIT License

## Features
* 10 LINQ methods
* implemented IEnumerators for javasctipt Array and Objects
* lazy evaluation (only any, all, toArray, count run evaluations)
* only Typesctipt (maximum type-safety)
* fully tested (QUnit with d.ts)

## Usage
```typescript
var array = [2, 4, 6];
var enumerable = new EnumerableArray(array)
  .where(item => item > 5);
console.log(enumerable.count()); // 1
```

## Supported methods (`Enumerable<T>`)
* `where(predicate: (item: T) => boolean): Enumerable<T>`
* `take(count: number): Enumerable<T>`
* `skip(count: number): Enumerable<T>`
* `select<U>(selector: (item: T) => U): Enumerable<U>`
* `cast<U>(type: IType<U>, strict: boolean = false): Enumerable<U>`
* `ofType<U>(type: IType<U>, strict: boolean = false): Enumerable<U>`
* `any(predicate: (item: T) => boolean): boolean`
* `all(predicate: (item: T) => boolean): boolean`
* `toArray(): T[]`
* `count(): number`

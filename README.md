LinqTS
======
Native LINQ for Typesctipt <br/>
Version: alpha-2014-09-05 <br/>
License: MIT License

## Features
* 21 LINQ methods
* implemented IEnumerator for javasctipt Array and Object
* maximum lazy evaluation
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
* `average(selector: (item: T) => number): number`
* `concat(secondEnumerable: Enumerable<T>): Enumerable<T>`
* `defaultIfEmpty(defaultValue: T = null): Enumerable<T>`
* `elementAt(index: number): T`
* `elementAtOrDefault(index: number, defaultValue: T = null): T`
* `empty<T>(): Enumerable<T>`
* `first(predicate: (item: T) => boolean = () => true): T`
* `firstOrDefault(predicate: (item: T) => boolean = () => true, defaultValue: T = null): T`
* `last(predicate: (item: T) => boolean = () => true): T`
* `lastOrDefault(predicate: (item: T) => boolean = () => true, defaultValue: T = null): T`
* `where(predicate: (item: T) => boolean): Enumerable<T>`
* `take(count: number): Enumerable<T>`
* `skip(count: number): Enumerable<T>`
* `select<U>(selector: (item: T) => U): Enumerable<U>`
* `sum(selector: (item: T) => number): number`
* `cast<U>(type: IType<U>, strict: boolean = false): Enumerable<U>`
* `ofType<U>(type: IType<U>, strict: boolean = false): Enumerable<U>`
* `any(predicate: (item: T) => boolean): boolean`
* `all(predicate: (item: T) => boolean): boolean`
* `toArray(): T[]`
* `count(): number`

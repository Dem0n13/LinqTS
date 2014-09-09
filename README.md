LinqTS
======
Native LINQ for Typesctipt <br/>
Version: alpha-0.28 <br/>
License: MIT License

## Features
* 28 LINQ methods
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
* `all(predicate: (item: T) => boolean): boolean`
* `any(predicate: (item: T) => boolean): boolean`
* `average(selector: (item: T) => number): number`
* `cast<U>(type: IType<U>, strict: boolean = false): Enumerable<U>`
* `concat(secondEnumerable: Enumerable<T>): Enumerable<T>`
* `count(): number`
* `defaultIfEmpty(defaultValue: T = null): Enumerable<T>`
* `elementAt(index: number): T`
* `elementAtOrDefault(index: number, defaultValue: T = null): T`
* `empty<T>(): Enumerable<T>`
* `first(predicate: (item: T) => boolean = () => true): T`
* `firstOrDefault(predicate: (item: T) => boolean = () => true, defaultValue: T = null): T`
* `last(predicate: (item: T) => boolean = () => true): T`
* `lastOrDefault(predicate: (item: T) => boolean = () => true, defaultValue: T = null): T`
* `max(selector: (item: T) => number): number`
* `min(selector: (item: T) => number): number`
* `ofType<U>(type: IType<U>, strict: boolean = false): Enumerable<U>`
* `range(start: number, count: number): Enumerable<number>`
* `repeat<T>(element: T, count: number): Enumerable<T>`
* `select<U>(selector: (item: T) => U): Enumerable<U>`
* `sequenceEqual(secondEnumerable: Enumerable<T>): boolean`
* `skip(count: number): Enumerable<T>`
* `skipWhile(predicate: (item: T) => boolean): Enumerable<T>`
* `sum(selector: (item: T) => number): number`
* `take(count: number): Enumerable<T>`
* `takeWhile(predicate: (item: T) => boolean): Enumerable<T>`
* `toArray(): T[]`
* `where(predicate: (item: T) => boolean): Enumerable<T>`

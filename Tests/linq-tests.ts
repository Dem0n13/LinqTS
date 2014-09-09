module Linq.Tests {
    QUnit.module("Linq");

    test("All", () => {
        var array = [0, 1, 2];
        var enumerable = new EnumerableArray(array);

        ok(enumerable.all(item => item > -1));
        ok(!enumerable.all(item => item > 0));
    });

    test("Any", () => {
        var array = [0, 1, 2];
        var enumerable = new EnumerableArray(array);

        ok(enumerable.any(item => item > 1));
        ok(!enumerable.any(item => item > 2));
    });

    test("Average", () => {
        var array = [];
        var enumerable = new EnumerableArray(array);

        throws(() => enumerable.average(item => item));

        array.push(0, 1, 2);
        
        var actual = enumerable.average(item => item);
        var expected = 1;
        strictEqual(actual, expected);
    });

    test("Cast", () => {
        var array = ["Hello", new String("Hello"), "Hi", 1];
        var enumerable = new Linq.EnumerableArray(array);

        throws(() => enumerable.cast<String>(typeOf.String).toArray());

        enumerable = enumerable.ofType(typeOf.String);

        var actual: any[] = enumerable.cast(typeOf.string).toArray();
        var expected: any[] = ["Hello", "Hello", "Hi"];
        propEqual(actual, expected);

        actual = enumerable.cast(typeOf.String).toArray();
        expected = [new String("Hello"), new String("Hello"), new String("Hi")];
        propEqual(actual, expected);

        array = [new Derived()];
        enumerable = new Linq.EnumerableArray(array);
        throws(() => enumerable.cast(typeOf.string).toArray());
    });

    test("Concat", () => {
        var array0 = [0, 1, 2],
            array1 = [2, 1, 0];
        var enumerable0 = new EnumerableArray(array0),
            enumerable1 = new EnumerableArray(array1);

        var actual = enumerable0.concat(enumerable1).toArray();
        var expected = [0, 1, 2, 2, 1, 0];
        propEqual(actual, expected);
    });

    test("Count", () => {
        var array = [0, 1, 2];
        array[-1] = -1;
        array[10] = 10;

        var enumerable = new Linq.EnumerableArray(array);
        strictEqual(enumerable.count(), 5);
        strictEqual(enumerable.count(), 5);

        enumerable = enumerable.where(item => item >= 0);
        strictEqual(enumerable.count(), 4);
        strictEqual(enumerable.count(), enumerable.toArray().length);

        array = [];
        enumerable = new Linq.EnumerableArray(array);
        propEqual(enumerable.count(), 0);
    });

    test("DefaultIfEmpty", () => {
        var array = [];
        var enumerable = new EnumerableArray(array);

        var actual = enumerable.defaultIfEmpty().toArray();
        var expected = [null];
        propEqual(actual, expected);

        array.push(2);

        actual = enumerable.defaultIfEmpty().toArray();
        expected = [2];
        propEqual(actual, expected);
    });

    test("ElementAt", () => {
        var array = [0, 1, 2];
        var enumerable = new EnumerableArray(array);

        var actual = enumerable.elementAt(2);
        var expected = 2;
        strictEqual(actual, expected);

        throws(() => enumerable.elementAt(-1));
        throws(() => enumerable.elementAt(3));
    });

    test("ElementAtOrDefault", () => {
        var array = [0, 1, 2];
        var enumerable = new EnumerableArray(array);

        var actual = enumerable.elementAtOrDefault(2);
        var expected = 2;
        strictEqual(actual, expected);

        actual = enumerable.elementAtOrDefault(3);
        expected = null;
        strictEqual(actual, expected);

        actual = enumerable.elementAtOrDefault(-1);
        expected = null;
        strictEqual(actual, expected);
    });

    test("Empty", () => {
        var actual = Enumerable.empty<string>().toArray();
        var expected = [];
        propEqual(actual, expected);
    });

    test("First", () => {
        var array: number[] = [];
        var enumerable = new EnumerableArray(array);

        throws(() => enumerable.first());

        array.push(0);
        array.push(1);

        var actual = enumerable.first();
        var expected = 0;
        strictEqual(actual, expected);
        throws(() => enumerable.first(item => item > 1));
    });

    test("FirstOrDefault", () => {
        var array: number[] = [];
        var enumerable = new EnumerableArray(array);

        var actual = enumerable.firstOrDefault();
        var expected = null;
        strictEqual(actual, expected);

        array.push(0);
        array.push(1);

        actual = enumerable.firstOrDefault();
        expected = 0;
        strictEqual(actual, expected);

        actual = enumerable.firstOrDefault(item => item > 1, 42);
        expected = 42;
        strictEqual(actual, expected);
    });

    test("Last", () => {
        var array: number[] = [];
        var enumerable = new EnumerableArray(array);

        throws(() => enumerable.last());

        array.push(0);
        array.push(1);

        var actual = enumerable.last();
        var expected = 1;
        strictEqual(actual, expected);
        throws(() => enumerable.last(item => item > 1));
    });

    test("LastOrDefault", () => {
        var array: number[] = [];
        var enumerable = new EnumerableArray(array);

        var actual = enumerable.lastOrDefault();
        var expected = null;
        strictEqual(actual, expected);

        array.push(0);
        array.push(1);

        actual = enumerable.lastOrDefault();
        expected = 1;
        strictEqual(actual, expected);

        actual = enumerable.lastOrDefault(item => item > 1, 42);
        expected = 42;
        strictEqual(actual, expected);
    });

    test("Max", () => {
        var array: number[] = [];
        var enumerable = new EnumerableArray(array);

        throws(() => enumerable.max(item => item));

        array.push(0, 1, -1);

        var actual = enumerable.max(item => item);
        var expected = 1;
        strictEqual(actual, expected);
    });

    test("Min", () => {
        var array: number[] = [];
        var enumerable = new EnumerableArray(array);

        throws(() => enumerable.min(item => item));

        array.push(0, 1, -1);

        var actual = enumerable.min(item => item);
        var expected = -1;
        strictEqual(actual, expected);
    });

    test("OfType", () => {
        var s = "Hello";
        var S = new String(s);
        var d = new Derived();
        var array: any[] = [s, S, 1, null, undefined, d];
        var enumerable = new Linq.EnumerableArray(array);

        var actual: any[] = enumerable.ofType(typeOf.String).toArray();
        var expected: any[] = [s, S];
        propEqual(actual, expected);

        actual = enumerable.ofType(typeOf.string, true).toArray();
        expected = [s];
        propEqual(actual, expected);

        actual = enumerable.ofType(typeOf(Base)).toArray();
        expected = [d];
        propEqual(actual, expected);
    });

    test("Range", () => {
        var enumerable = Enumerable.range(5, 5);

        var actual = enumerable.toArray();
        var expected = [5, 6, 7, 8, 9];
        propEqual(actual, expected);
    });

    test("Repeat", () => {
        var enumerable = Enumerable.repeat("hi", 3);

        var actual = enumerable.toArray();
        var expected = ["hi", "hi", "hi"];
        propEqual(actual, expected);
    });

    test("Select", () => {
        var array: { val: number }[] = [{ val: 0 }, { val: 1 }, { val: 2 }];
        var enumerable = new Linq.EnumerableArray(array);

        var actual = enumerable.select(item => item.val).toArray();
        var expected = [0, 1, 2];
        propEqual(actual, expected);
    });

    test("SequenceEqual", () => {
        var array1 = [1, 2, 3];
        var array2 = [1];

        var enumerable1 = new EnumerableArray(array1);
        var enumerable2 = new EnumerableArray(array2);

        var actual = enumerable1.sequenceEqual(enumerable2);
        ok(!actual);

        array2.push(2, 3);

        actual = enumerable1.sequenceEqual(enumerable2);
        ok(actual);
    });

    test("Skip", () => {
        var array = [0, 1, 2];
        var enumerable = new Linq.EnumerableArray(array);

        var actual = enumerable.skip(1).toArray();
        var expected = [1, 2];
        propEqual(actual, expected);

        actual = enumerable.skip(0).toArray();
        expected = array;
        propEqual(actual, expected);

        actual = enumerable.skip(3).toArray();
        expected = [];
        propEqual(actual, expected);
    });

    test("SkipWhile", () => {
        var array = [0, 1, 2, 1, 0];
        var enumerable = new Linq.EnumerableArray(array);

        var actual = enumerable.skipWhile(item => item < 2).toArray();
        var expected = [2, 1, 0];
        propEqual(actual, expected);
    });

    test("Sum", () => {
        var array = [0, 1, 2];
        var enumerable = new EnumerableArray(array);

        var average = enumerable.sum(item => item);
        strictEqual(average, 3);
    });

    test("Take", () => {
        var array = [0, 1, 2];
        var enumerable = new Linq.EnumerableArray(array);

        var actual = enumerable.take(1).toArray();
        var expected = [0];
        propEqual(actual, expected);

        actual = enumerable.take(0).toArray();
        expected = [];
        propEqual(actual, expected);
    });

    test("TakeWhile", () => {
        var array = [0, 1, 2, 1, 0];
        var enumerable = new Linq.EnumerableArray(array);

        var actual = enumerable.takeWhile(item => item < 2).toArray();
        var expected = [0, 1];
        propEqual(actual, expected);
    });

    test("ToArray", () => {
        var array = [0, 1, 2];

        var enumerable = new Linq.EnumerableArray(array);
        deepEqual(enumerable.toArray(), array);
        deepEqual(enumerable.toArray(), array);

        array = [];

        enumerable = new Linq.EnumerableArray(array);
        propEqual(enumerable.toArray(), array);
        propEqual(enumerable.toArray(), array);
    });

    test("Where", () => {
        var array = [0, 1, 2];
        var enumerable = new Linq.EnumerableArray(array);

        var actual = enumerable.where(item => item > 0)
            .where(item => item < 2)
            .toArray();
        var expected = [1];
        propEqual(actual, expected);
    });
}
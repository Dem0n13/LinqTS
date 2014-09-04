module Linq.Tests {
    QUnit.module("Linq");

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

    test("Where", () => {
        var array = [0, 1, 2];
        var enumerable = new Linq.EnumerableArray(array);

        var actual = enumerable.where(item => item > 0)
            .where(item => item < 2)
            .toArray();
        var expected = [1];
        propEqual(actual, expected);
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

    test("Select", () => {
        var array: { val: number }[] = [{ val: 0 }, { val: 1 }, { val: 2 }];
        var enumerable = new Linq.EnumerableArray(array);

        var actual = enumerable.select(item => item.val).toArray();
        var expected = [0, 1, 2];
        propEqual(actual, expected);
    });

    test("Any", () => {
        var array = [0, 1, 2];
        var enumerable = new Linq.EnumerableArray(array);

        ok(enumerable.any(item => item > 1));
        ok(!enumerable.any(item => item > 2));
    });

    test("All", () => {
        var array = [0, 1, 2];
        var enumerable = new Linq.EnumerableArray(array);

        ok(enumerable.all(item => item > -1));
        ok(!enumerable.all(item => item > 0));
    });

    test("OfType", () => {
        var s = "Hello";
        var S = new String(s);
        var d = new Derived();
        var array: any[] = [s, S, 1, null, undefined, d];
        var enumerable = new Linq.EnumerableArray(array);

        var actual: any[] = enumerable.ofType(String).toArray();
        var expected: any[] = [s, S];
        propEqual(actual, expected);

        var actual: any[] = enumerable.ofType(String, IsMode.Primitives).toArray();
        var expected: any[] = [s];
        propEqual(actual, expected);

        actual = enumerable.ofType(Base).toArray();
        expected = [d];
        propEqual(actual, expected);
    });

    test("Cast", () => {
        var array = ["Hello", new String("Hello"), "Hi", 1];
        var enumerable = new Linq.EnumerableArray(array);

        throws(() => enumerable.cast<String>(String).toArray());

        enumerable = enumerable.ofType(String);

        var actual: any[] = enumerable.cast(String).toArray();
        var expected: any[] = ["Hello", new String("Hello"), "Hi"];
        propEqual(actual, expected);

        actual = enumerable.cast<string>(String, CastMode.ToPrivitives).toArray();
        expected = ["Hello", "Hello", "Hi"];
        propEqual(actual, expected);

        actual = enumerable.cast(String, CastMode.ToObjects).toArray();
        expected = [new String("Hello"), new String("Hello"), new String("Hi")];
        propEqual(actual, expected);

        array = [new Derived()];
        enumerable = new Linq.EnumerableArray(array);
        throws(() => enumerable.cast(Derived, CastMode.ToPrivitives).toArray());
    });
}
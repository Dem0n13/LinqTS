module Linq.Tests {
    QUnit.module("Enumerators");

    test("Array", () => {
        var a = [0, 1];

        var enumerator = new ArrayEnumerator(a);
        throws(() => enumerator.getCurrent());

        ok(enumerator.moveNext());
        strictEqual(enumerator.getCurrent(), 0);
        ok(enumerator.moveNext());
        strictEqual(enumerator.getCurrent(), 1);
        ok(!enumerator.moveNext());
        strictEqual(enumerator.getCurrent(), 1);

        enumerator.reset();
        throws(() => enumerator.getCurrent());
    });

    test("Partial array", () => {
        var a = [];
        a[-10] = -10;
        a[-1] = -1;
        a[0] = 0;
        a[2] = 2;
        a[10] = 10;

        var enumerator = new ArrayEnumerator(a);
        throws(() => enumerator.getCurrent());

        ok(enumerator.moveNext());
        strictEqual(enumerator.getCurrent(), -10);
        ok(enumerator.moveNext());
        strictEqual(enumerator.getCurrent(), -1);
        ok(enumerator.moveNext());
        strictEqual(enumerator.getCurrent(), 0);
        ok(enumerator.moveNext());
        strictEqual(enumerator.getCurrent(), 2);
        ok(enumerator.moveNext());
        strictEqual(enumerator.getCurrent(), 10);
        ok(!enumerator.moveNext());
        strictEqual(enumerator.getCurrent(), 10);

        enumerator.reset();
        throws(() => enumerator.getCurrent());
    });

    test("Object", () => {
        var o = {
            field0: 0,
            field1: 1
        };

        var enumerator = new ObjectEnumerator(o);
        throws(() => enumerator.getCurrent());

        ok(enumerator.moveNext());
        deepEqual(enumerator.getCurrent(), { key: "field0", value: 0 });
        ok(enumerator.moveNext());
        deepEqual(enumerator.getCurrent(), { key: "field1", value: 1 });
        ok(!enumerator.moveNext());
        deepEqual(enumerator.getCurrent(), { key: "field1", value: 1 });

        enumerator.reset();
        throws(() => enumerator.getCurrent());
    });
}
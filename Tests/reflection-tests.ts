module Linq.Tests {
    QUnit.module("Reflection - Is");

    test("Primitives", () => {
        var s = "";
        ok(is(s, typeOf.string, false));
        ok(is(s, typeOf.string, true));
        ok(is(s, typeOf.String, false));
        ok(!is(s, typeOf.String, true));
    });

    test("Primitive objects", () => {
        var s = new String("");
        ok(is(s, typeOf.string, false));
        ok(!is(s, typeOf.string, true));
        ok(is(s, typeOf.String, false));
        ok(is(s, typeOf.String, true));
    });

    test("User objects", () => {
        var d = new Derived();
        ok(is(d, typeOf(Derived), false));
        ok(is(d, typeOf(Derived), true));
        ok(is(d, typeOf(Base), false));
        ok(is(d, typeOf(Base), true));
        ok(is(d, typeOf.Object, false));
        ok(is(d, typeOf.Object, true));

    });

    test("Special cases", () => {
        var f = () => { };
        ok(is(f, typeOf.Function, false));
        ok(is(f, typeOf.Function, true));

        ok(!is(undefined, typeOf.Object));
        ok(!is(undefined, undefined));

        ok(!is(null, typeOf.Object));
        ok(!is(null, null));
    });
}
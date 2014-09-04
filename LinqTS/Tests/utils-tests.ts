module Linq.Tests {
    QUnit.module("Utils - Wrapper");

    test("Wrapper: default behavior", () => {
        var o = new Base();
        var wrapper = wrap(o, {});
        wrapper.setField(1);

        ok(o.field);
    });

    test("Wrapper: overridden behavior", () => {
        var o = new Base();
        var wrapper = wrap(o, {
            setField: function(value: number) { this.field = value + 1; }
        });
        wrapper.setField(0);

        ok(o.field);
    });

    QUnit.module("Utils - Proxy");

    test("Proxy", () => {
        var o = new Base();
        var p = proxy(o, {
            inc: function() { this.field++; }
        });
        p.inc();

        ok(o.field);
    });

    QUnit.module("Utils - Is");

    test("Primitives", () => {
        var s = "";
        ok(is(s, String, IsMode.Primitives));
        ok(is(s, String, IsMode.All));
        ok(!is(s, String, IsMode.Objects));

        var b = false;
        ok(is(b, Boolean, IsMode.Primitives));
        ok(!is(b, Boolean, IsMode.Objects));
        ok(is(b, Boolean, IsMode.All));

        var n = 0;
        ok(is(n, Number, IsMode.Primitives));
        ok(!is(n, Number, IsMode.Objects));
        ok(is(n, Number, IsMode.All));
    });

    test("Primitive objects", () => {
        var s = new String("");
        ok(!is(s, String, IsMode.Primitives));
        ok(is(s, String, IsMode.Objects));
        ok(is(s, String, IsMode.All));

        var b = new Boolean(false);
        ok(!is(b, Boolean, IsMode.Primitives));
        ok(is(b, Boolean, IsMode.Objects));
        ok(is(b, Boolean, IsMode.All));

        var n = new Number(0);
        ok(!is(n, Number, IsMode.Primitives));
        ok(is(n, Number, IsMode.Objects));
        ok(is(n, Number, IsMode.All));
    });

    test("User objects", () => {
        var d = new Derived();

        ok(!is(d, Object, IsMode.Primitives));
        ok(is(d, Object, IsMode.Objects));
        ok(is(d, Object, IsMode.All));

        ok(!is(d, Base, IsMode.Primitives));
        ok(is(d, Base, IsMode.Objects));
        ok(is(d, Base, IsMode.All));

        ok(!is(d, Derived, IsMode.Primitives));
        ok(is(d, Derived, IsMode.Objects));
        ok(is(d, Derived, IsMode.All));
    });

    test("Special cases", () => {
        var f = function() {};
        ok(!is(f, Function, IsMode.Primitives));
        ok(is(f, Function, IsMode.Objects));
        ok(is(f, Function, IsMode.All));

        ok(!is(undefined, Object));
        ok(!is(undefined, undefined));

        ok(!is(null, Object));
        ok(!is(null, null));
    });

}
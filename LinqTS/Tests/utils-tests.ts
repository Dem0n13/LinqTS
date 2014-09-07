module Linq.Tests {
    QUnit.module("Utils - Wrapper");

    test("Default behavior", () => {
        var o = new Base();
        var wrapper = wrap(o, {});
        wrapper.setField(1);

        ok(o.field);
    });

    test("Overridden behavior", () => {
        var o = new Base();
        var wrapper = wrap(o, {
            setField: function(value: number) { this.field = value + 1; }
        });
        wrapper.setField(0);

        ok(o.field);
    });

    QUnit.module("Utils - Proxy");

    test("Overridden behavior", () => {
        var o = new Base();
        var p = proxy(o, {
            inc: function() { this.field++; }
        });
        p.inc();

        ok(o.field);
    });
}
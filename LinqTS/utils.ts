module Linq {
    function bind(func: Function, context: {}): Function {
        return () => func.apply(context, arguments);
    }

    export function proxy<T, U extends { [name: string]: Function }>(object: T, functions: U): U {
        var proxy: any = {};
        for (var funcName in functions) {
            var func: Function = functions[funcName];
            proxy[funcName] = bind(func, object);
        }
        return proxy;
    }

    export function wrap<T>(object: T, functions: { [name: string]: Function }): T {
        var wrapper: any = {};
        for (var propertyName in object) {
            var propertyValue = object[propertyName];
            if (typeof propertyValue === "function") {
                var func: Function = functions[propertyName] || propertyValue;
                wrapper[propertyName] = bind(func, object);
            }
        }
        return wrapper;
    }
}

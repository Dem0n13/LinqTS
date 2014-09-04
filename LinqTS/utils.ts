module Linq {
    function bind(func: Function, context: {}): Function {
        return () => func.apply(context, arguments);
    }

    function isPrimitive(object: any): boolean {
        var type = typeof object;
        return type === "string" || type === "number" || type === "boolean";
    }

    function isPrimitiveConstructor(ctor: Constructor<any>): boolean {
        return ctor === String || ctor === Number || ctor === Boolean;
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

    export interface Constructor<T> {
        new (...args: any[]) : T;
    }

    export enum IsMode {
        Primitives, // string but not String
        Objects, 	// String but not string
        All			// string and String
    }

    export function is<T>(object: any, ctor: Constructor<T>, mode: IsMode = IsMode.All): boolean {
        if (object == null || !ctor) return false;
        
        /* Research results:
        class Class extends Super { }
        var s = "",
            S = new String(""),
            o = new Class(),
            f = function() {};
        ************************************************
            instanceof		typeof		constructor
        s	-				"string"	String
        S	String			"object"	String
        o	Class, Super	"object"	Class
        f	Function		"function"	All Ctors
        */
        switch (mode) {
            case IsMode.Primitives:
                return isPrimitive(object) && object.constructor === ctor;
            case IsMode.Objects:
                return object instanceof ctor;
            case IsMode.All:
                return object instanceof ctor || object.constructor === ctor;
            default:
                throw "Unknown value of IsMode enum: " + mode;
        }
    }

    export enum CastMode {
        ToPrivitives,   // String => string, string => string
        ToObjects,      // String => String, string => String
        Inherit,        // String => String, string => string
    }

    export function cast<T>(object: any, ctor: Constructor<any>, mode: CastMode = CastMode.Inherit): T {
        if (!is(object, ctor, IsMode.All))
            throw "Cannot cast from source type to destination type";

        switch (mode) {
            case CastMode.ToPrivitives:
                if (!isPrimitiveConstructor(object.constructor))
                    throw "This object cannot be casted to primitive. Constructor: " + object.constructor;
                return isPrimitive(object) ? object : object.valueOf();
            case CastMode.ToObjects:
                return isPrimitive(object) ? new ctor(object) : object;
            case CastMode.Inherit:
                return object;
            default:
                throw "Unknown value of CastMode enum: " + mode;
        }
    }
}

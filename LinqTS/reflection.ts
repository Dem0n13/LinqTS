module Linq {

    export interface IConstructor<T> {
        new(...args: any[]): T;
    }

    export enum TypeGroup {
        Primitive,
        Reference,
        Special
    }

    export interface IType<T> {
        name: string;
        group: TypeGroup;
        ctor: IConstructor<any>
    }

    export var typeOf: {
        <T>(ctor: IConstructor<T>): IType<T>;
        boolean: IType<boolean>;
        number: IType<number>;
        string: IType<string>;
        Boolean: IType<Boolean>;
        Number: IType<Number>;
        String: IType<String>;
        Function: IType<Function>;
        Array: IType<Array<any>>;
        Object: IType<Object>;
    } = (() => {
        var _: any = <T>(ctor: IConstructor<T>): IType<T> => {
            if (ctor == null)
                throw "";

            var name: string = ctor["name"];
            var type: IType<T> = _[name];
            if (type && type.ctor === ctor) return type;
            return {
                name: name,
                group: TypeGroup.Reference,
                ctor: ctor
            };
        };

        // known types
        // primitive
        _.boolean = { name: "boolean", group: TypeGroup.Primitive, ctor: Boolean };
        _.number = { name: "number", group: TypeGroup.Primitive, ctor: Number };
        _.string = { name: "string", group: TypeGroup.Primitive, ctor: String };

        // reference
        _.Boolean = { name: "object", group: TypeGroup.Reference, ctor: Boolean };
        _.Number = { name: "object", group: TypeGroup.Reference, ctor: Number };
        _.String = { name: "object", group: TypeGroup.Reference, ctor: String };
        _.Function = { name: "function", group: TypeGroup.Reference, ctor: Function };
        _.Array = { name: "object", group: TypeGroup.Reference, ctor: Array }
        _.Object = { name: "object", group: TypeGroup.Reference, ctor: Object };
        return _;
    })();

    // strictly: string is not String, String is not string, Cast error
    // !strictly: string casted to String, String casted to string
    export function cast<T>(object: any, type: IType<T>, strictly: boolean = false): T {
        if (is(object, type, true)) {
            return object;
        } else if (!strictly && is(object, type, false)) {
            return type.group == TypeGroup.Primitive ? object.valueOf() : new type.ctor(object);
        } else {
            throw "Cast error";
        }
    }

    // strictly: string is not String
    // !strictly: string is String
    export function is<T>(object: any, type: IType<T>, strictly: boolean = false): boolean {
        return object != null && (
            strictly && (type.group === TypeGroup.Primitive && typeof object === type.name || type.group === TypeGroup.Reference && object instanceof type.ctor) ||
                !strictly && (object instanceof type.ctor || object.constructor === type.ctor)
        );
    }
}
 
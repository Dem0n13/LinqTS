module Linq.Tests {
    export class Base {
        field: number = 0;
        setField(value: number) {
            this.field = value;
        }
    }
    export class Derived extends Base { }
}
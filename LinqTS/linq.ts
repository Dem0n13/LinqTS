module Linq {
    export interface IEnumerator<T> {
        getCurrent(): T;
        reset(): void;
        moveNext(): boolean;
    }

    export interface IEnumerable<T> {
        getEnumerator(): IEnumerator<T>;
    }

    export class Enumerable<T> implements IEnumerable<T> {
        private _enumerator: IEnumerator<T>;

        constructor(enumerator: IEnumerator<T>) {
            this._enumerator = enumerator;
        }

        getEnumerator() {
            return this._enumerator;
        }

        where(predicate: (item: T) => boolean): Enumerable<T> {
            return new Enumerable(wrap(this._enumerator, {
                moveNext: function () {
                    while (this.moveNext()) {
                        if (predicate(this.getCurrent())) {
                            return true;
                        }
                    }
                    return false;
                }
            }));
        }

        take(count: number): Enumerable<T> {
            var currentCount: number;
            return new Enumerable(wrap(this._enumerator, {
                reset: function() {
                    currentCount = 0;
                    this.reset();
                },
                moveNext: function() {
                    if (currentCount < count && this.moveNext()) {
                        currentCount++;
                        return true;
                    } else {
                        return false;
                    }
                }
            }));
        }

        skip(count: number): Enumerable<T> {
            var currentCount: number;
            return new Enumerable(wrap(this._enumerator, {
                reset: function() {
                    currentCount = 0;
                    this.reset();
                },
                moveNext: function() {
                    while (this.moveNext()) {
                        if (currentCount >= count)
                            return true;
                        currentCount++;
                    }
                    return false;
                }
            }));
        }

        select<U>(selector: (item: T) => U): Enumerable<U> {
            return new Enumerable(wrap(this._enumerator, {
                getCurrent: function() { return selector(this.getCurrent()); }
            }));
        }

        cast<U>(type: IType<U>, strict: boolean = false): Enumerable<U> {
            return new Enumerable(proxy(this._enumerator, {
                getCurrent: function () {
                    var item = this.getCurrent();
                    return cast<U>(item, type, strict);
                },
                reset: function() { this.reset(); },
                moveNext: function() { return this.moveNext(); }
            }));
        }

        ofType<U>(type: IType<U>, strict: boolean = false): Enumerable<U> {
            return <any>this.where(item => is(item, type, strict));
        }

        any(predicate: (item: T) => boolean): boolean {
            this._enumerator.reset();
            while (this._enumerator.moveNext()) {
                if (predicate(this._enumerator.getCurrent())) {
                    return true;
                }
            }
            return false;
        }

        all(predicate: (item: T) => boolean): boolean {
            this._enumerator.reset();
            while (this._enumerator.moveNext()) {
                if (!predicate(this._enumerator.getCurrent())) {
                    return false;
                }
            }
            return true;
        }

        toArray(): T[] {
            var result = [];
            this._enumerator.reset();
            while (this._enumerator.moveNext()) {
                result.push(this._enumerator.getCurrent());
            }
            return result;
        }

        count(): number {
            var result = 0;
            this._enumerator.reset();
            while (this._enumerator.moveNext()) {
                result++;
            }
            return result;
        }
    }

    export class EnumerableArray<T> extends Enumerable<T> {
        constructor(array: T[]) {
            super(new ArrayEnumerator<T>(array));
        }
    }

    export class ArrayEnumerator<T> implements IEnumerator<T> {
        private _array: T[];
        private _indexes: string[];
        private _currentIndex: number;

        constructor(array: T[]) {
            this._array = array;
            this.reset();
        }

        getCurrent() {
            if (this._currentIndex === -1)
                throw "Enumerator is in a reset state";

            var index = this._indexes[this._currentIndex];
            return this._array[index];
        }

        reset() {
            function sorter(a, b) {
                 return a - b;
            }

            this._indexes = Object.keys(this._array).sort(sorter);
            this._currentIndex = -1;
        }

        moveNext() {
            if (this._currentIndex + 1 < this._indexes.length) {
                this._currentIndex++;
                return true;
            } else {
                return false;
            }
        }
    }

    export interface IKeyValuePair<TKey, TValue> {
        key: TKey;
        value: TValue;
    }

    export class EnumerableObject extends Enumerable<IKeyValuePair<string, any>> {
        constructor(object: any) {
            super(new ObjectEnumerator(object));
        }
    }

    export class ObjectEnumerator implements IEnumerator<IKeyValuePair<string, any>> {
        private _object: any;
        private _propertyNames: string[];
        private _currentIndex: number;

        constructor(object: any) {
            this._object = object;
            this.reset();
        }

        getCurrent(): IKeyValuePair<string, any> {
            if (this._currentIndex === -1)
                throw "Enumerator is in a reset state";

            var propertyName = this._propertyNames[this._currentIndex];
            return { key: propertyName, value: this._object[propertyName] };
        }

        reset() {
            this._propertyNames = Object.keys(this._object);
            this._currentIndex = -1;
        }

        moveNext(): boolean {
            if (this._currentIndex + 1 < this._propertyNames.length) {
                this._currentIndex++;
                return true;
            } else {
                return false;
            }
        }
    }
}
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

        all(predicate: (item: T) => boolean): boolean {
            this._enumerator.reset();
            while (this._enumerator.moveNext()) {
                if (!predicate(this._enumerator.getCurrent())) {
                    return false;
                }
            }
            return true;
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

        average(selector: (item: T) => number): number {
            this._enumerator.reset();
            if (!this._enumerator.moveNext()) {
                throw "InvalidOperationException";
            }

            var sum = selector(this._enumerator.getCurrent());
            var count = 1;
            while (this._enumerator.moveNext()) {
                var item = this._enumerator.getCurrent();
                sum += selector(item);
                count++;
            }
            return sum / count;
        }

        cast<U>(type: IType<U>, strict: boolean = false): Enumerable<U> {
            return new Enumerable(proxy(this._enumerator, {
                getCurrent: function () {
                    var item = this.getCurrent();
                    return cast<U>(item, type, strict);
                },
                reset: function () { this.reset(); },
                moveNext: function () { return this.moveNext(); }
            }));
        }

        concat(secondEnumerable: Enumerable<T>): Enumerable<T> {
            var first = this._enumerator,
                second = secondEnumerable.getEnumerator(),
                current = first;
            return new Enumerable({
                getCurrent: () => current.getCurrent(),
                reset: () => {
                    first.reset();
                    second.reset();
                    current = first;
                },
                moveNext: () => {
                    return current.moveNext() || (
                        current = second, current.moveNext()
                    );
                }
            });
        }

        count(): number {
            var result = 0;
            this._enumerator.reset();
            while (this._enumerator.moveNext()) {
                result++;
            }
            return result;
        }

        defaultIfEmpty(defaultValue: T = null): Enumerable<T> {
            var isEmpty: boolean = undefined;
            return new Enumerable(wrap(this._enumerator, {
                getCurrent: function() {
                    return isEmpty ? defaultValue : this.getCurrent();
                },
                reset: function() {
                    isEmpty = undefined;
                    this.reset();
                },
                moveNext: function() {
                    switch (isEmpty) {
                        case false:
                            return this.moveNext();
                        case true:
                            return false;
                        default:
                            isEmpty = !this.moveNext();
                            return true;
                    }
                }
            }));
        }

        elementAt(index: number): T {
            if (index < 0)
                throw "ArgumentOutOfRangeException";
            this._enumerator.reset();
            for (var i = 0; i <= index; i++) {
                if (!this._enumerator.moveNext())
                    throw "ArgumentOutOfRangeException";
            }
            return this._enumerator.getCurrent();
        }

        elementAtOrDefault(index: number, defaultValue: T = null): T {
            if (index < 0)
                return defaultValue;
            this._enumerator.reset();
            for (var i = 0; i <= index; i++) {
                if (!this._enumerator.moveNext())
                    return defaultValue;
            }
            return this._enumerator.getCurrent();
        }

        static empty<T>(): Enumerable<T> {
            return new Enumerable({
                getCurrent: (): T => { throw "Enumerator is in a reset state"; },
                reset: () => {},
                moveNext: () => false
            });
        }

        first(predicate: (item: T) => boolean = () => true): T {
            this._enumerator.reset();
            while (this._enumerator.moveNext()) {
                if (predicate(this._enumerator.getCurrent())) {
                    return this._enumerator.getCurrent();
                }
            }
            throw "InvalidOperationException";
        }
        
        firstOrDefault(predicate: (item: T) => boolean = () => true, defaultValue: T = null): T {
            this._enumerator.reset();
            while (this._enumerator.moveNext()) {
                if (predicate(this._enumerator.getCurrent())) {
                    return this._enumerator.getCurrent();
                }
            }
            return defaultValue;
        }

        last(predicate: (item: T) => boolean = () => true): T {
            this._enumerator.reset();
            var result: T;
            var isFound = false;
            while (this._enumerator.moveNext()) {
                if (predicate(this._enumerator.getCurrent())) {
                    isFound = true;
                    result = this._enumerator.getCurrent();
                }
            }
            if (isFound)
                return result;
            else
                throw "InvalidOperationException";
        }

        lastOrDefault(predicate: (item: T) => boolean = () => true, defaultValue: T = null): T {
            this._enumerator.reset();
            var result: T = defaultValue;
            while (this._enumerator.moveNext()) {
                if (predicate(this._enumerator.getCurrent())) {
                    result = this._enumerator.getCurrent();
                }
            }
            return result;
        }

        max(selector: (item: T) => number): number {
            this._enumerator.reset();
            if (!this._enumerator.moveNext()) {
                throw "InvalidOperationException";
            }
            var max = selector(this._enumerator.getCurrent());
            while (this._enumerator.moveNext()) {
                var item = selector(this._enumerator.getCurrent());
                if (item > max)
                    max = item;
            }
            return max;
        }

        min(selector: (item: T) => number): number {
            this._enumerator.reset();
            if (!this._enumerator.moveNext()) {
                throw "InvalidOperationException";
            }
            var min = selector(this._enumerator.getCurrent());
            while (this._enumerator.moveNext()) {
                var item = selector(this._enumerator.getCurrent());
                if (item < min)
                    min = item;
            }
            return min;
        }

        ofType<U>(type: IType<U>, strict: boolean = false): Enumerable<U> {
            return <any>this.where(item => is(item, type, strict));
        }

        static range(start: number, count: number): Enumerable<number> {
            var currentIndex = -1;
            return new Enumerable({
                getCurrent: (): number => {
                    if (currentIndex === -1)
                        throw "Enumerator is in a reset state";
                    return start + currentIndex;
                },
                reset: () => {
                    currentIndex = -1;
                },
                moveNext: (): boolean => {
                    return currentIndex + 1 < count ? (currentIndex++, true) : false;
                }
            });
        }

        static repeat<T>(element: T, count: number): Enumerable<T> {
            var currentIndex = -1;
            return new Enumerable({
                getCurrent: (): T => {
                    if (currentIndex === -1)
                        throw "Enumerator is in a reset state";
                    return element;
                },
                reset: () => {
                    currentIndex = -1;
                },
                moveNext: (): boolean => {
                    return currentIndex + 1 < count ? (currentIndex++, true) : false;
                }
            });
        }

        select<U>(selector: (item: T) => U): Enumerable<U> {
            return new Enumerable(wrap(this._enumerator, {
                getCurrent: function () { return selector(this.getCurrent()); }
            }));
        }

        sequenceEqual(secondEnumerable: Enumerable<T>): boolean {
            var first = this._enumerator,
                second = secondEnumerable._enumerator;
            first.reset(), second.reset();
            var firstMoved = first.moveNext(),
                secondMoved = second.moveNext();
            while (firstMoved && secondMoved) {
                var firstItem = first.getCurrent(),
                    secondItem = second.getCurrent();
                if (firstItem !== secondItem)
                    return false;
                firstMoved = first.moveNext(), secondMoved = second.moveNext();
            }

            return firstMoved === secondMoved;
        }

        skip(count: number): Enumerable<T> {
            var currentCount: number;
            return new Enumerable(wrap(this._enumerator, {
                reset: function() {
                    this.reset();
                    currentCount = 0;
                },
                moveNext: function(): boolean {
                    while (this.moveNext()) {
                        if (currentCount >= count)
                            return true;
                        currentCount++;
                    }
                    return false;
                }
            }));
        }

        skipWhile(predicate: (item: T) => boolean): Enumerable<T> {
            var skipped = false;
            return new Enumerable(wrap(this._enumerator, {
                reset: function() {
                    this.reset();
                    skipped = false;
                },
                moveNext: function(): boolean {
                    while (this.moveNext()) {
                        if (skipped)
                            return true;
                        if (!predicate(this.getCurrent())) {
                            skipped = true;
                            return true;
                        }
                    }
                    return false;
                }
            }));
        }

        sum(selector: (item: T) => number): number {
            this._enumerator.reset();
            var sum = 0;
            while (this._enumerator.moveNext()) {
                var item = this._enumerator.getCurrent();
                sum += selector(item);
            }
            return sum;
        }

        take(count: number): Enumerable<T> {
            var currentCount: number;
            return new Enumerable(wrap(this._enumerator, {
                reset: function () {
                    currentCount = 0;
                    this.reset();
                },
                moveNext: function () {
                    if (currentCount < count && this.moveNext()) {
                        currentCount++;
                        return true;
                    } else {
                        return false;
                    }
                }
            }));
        }

        takeWhile(predicate: (item: T) => boolean): Enumerable<T> {
            var take = true;
            return new Enumerable(wrap(this._enumerator, {
                reset: function() {
                    this.reset();
                    take = true;
                },
                moveNext: function(): boolean {
                    while (take && this.moveNext()) {
                        return predicate(this.getCurrent()) || (take = false);
                    }
                    return false;
                }
            }));
        }

        toArray(): T[] {
            var result = [];
            this._enumerator.reset();
            while (this._enumerator.moveNext()) {
                result.push(this._enumerator.getCurrent());
            }
            return result;
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
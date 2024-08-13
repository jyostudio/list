import overload from "@jyostudio/overload";

export default class List {
    #list = [];

    #innerType = null;

    #proxy = null;

    get length() {
        return this.#list.length;
    }

    get [Symbol.isConcatSpreadable]() {
        return true;
    }

    get [Symbol.toStringTag]() {
        return `List<${this.#innerType.name}>`;
    }

    constructor(...params) {
        const initFn = overload()
            .add([Function], function (innerType) {
                this.#innerType = innerType;
            })
            .add([Function, [Array, List]], function (innerType, list) {
                this.#innerType = innerType;
                for (let item of list) this.add(item);
            });

        initFn.apply(this, params);

        return this.#initProxy();
    }

    static T(...params) {
        const CACHE_T_PROXY = new WeakMap();

        List.T = overload([Function], function (innerType) {
            let proxy = CACHE_T_PROXY.get(innerType);
            !proxy && CACHE_T_PROXY.set(innerType, proxy = new Proxy(List, {
                get: (target, prop, receiver) => {
                    if (prop === "##INNER_TYPE##") return innerType;
                    return target[prop];
                }
            }));

            return proxy;
        });

        return List.T(...params);
    }

    #initProxy() {
        return this.#proxy = new Proxy(this, {
            get: (target, prop, receiver) => {
                if (prop === "@@INNER_TYPE@@") return this.#innerType;

                let result = null;

                if (typeof prop === "symbol") result = this[prop];
                else if (typeof prop === "string") {
                    if (/^\d+$/.test(prop)) result = this.#list[prop];
                    else result = this[prop];
                }

                if (typeof result === "function") return result.bind(this);

                return result;
            },
            set: (target, prop, value, receiver) => {
                if (typeof prop === "string" && /^\d+$/.test(prop)) {
                    if (prop >= this.#list.length) throw new Error(`Index ${prop} out of bounds, List length is ${this.#list.length}`);

                    overload([this.#innerType], (value) => {
                        this.#list[prop] = value;
                    }).call(this, value);

                    return true;
                }

                throw new Error(`Cannot set property "${prop}" on List`);
            },
        });
    }

    #rangeCheck(index) {
        if (index < 0) throw new Error(`Index ${index} out of bounds, Index must be greater than or equal to 0`);
        if (index >= this.#list.length) throw new Error(`Index ${index} out of bounds, List length is ${this.#list.length}`);
    }

    [Symbol.iterator] = function* () {
        for (let i = 0; i < this.#list.length; i++) {
            yield this.#list[i];
        }
    }

    add(...params) {
        this.add = overload([this.#innerType], function (item) {
            this.#list.push(item);
        });

        return this.add(...params);
    }

    addRange(...params) {
        List.prototype.addRange = overload([[Array, List]], function (list) {
            for (let item of list) this.add(item);
        }).add(["..."], function (...items) {
            for (let item of items) this.add(item);
        });

        return this.addRange(...params);
    }

    asReadOnly(...params) {
        const ignore = ["add", "addRange", "insert", "insertRange", "remove", "removeAt", "removeAll", "removeRange", "clear", "reverse", "sort", "asReadOnly"];

        List.prototype.asReadOnly = overload([], function () {
            return new Proxy(this, {
                get: (target, prop, receiver) => {
                    if (ignore.includes(prop)) throw new Error(`Cannot access method "${prop}" on read-only List`);

                    return this.#proxy[prop];
                },
                set: (target, prop, value, receiver) => {
                    throw new Error(`Cannot set property "${prop}" on read-only List`);
                }
            });
        });

        return this.asReadOnly(...params);
    }

    concat(...params) {
        List.prototype.concat = overload([[Array, List]], function (list) {
            let newList = new List(this.#innerType);
            for (let item of this) newList.add(item);
            for (let item of list) newList.add(item);
            return newList;
        });

        return this.concat(...params);
    }

    clear(...params) {
        List.prototype.clear = overload([], function () {
            this.#list = [];
        });

        return this.clear(...params);
    }

    clone(...params) {
        List.prototype.clone = overload([], function () {
            return new List(this.#innerType, this);
        });

        return this.clone(...params);
    }

    contains(...params) {
        this.contains = overload([this.#innerType], function (item) {
            return this.#list.includes(item);
        });

        return this.contains(...params);
    }

    copyTo(...params) {
        List.prototype.copyTo = overload()
            .add([Array], function (array) {
                this.#list.forEach((item, index) => {
                    array[index] = item;
                });
            })
            .add([Array, Number], function (array, arrayIndex) {
                this.#list.forEach((item, index) => {
                    array[arrayIndex + index] = item;
                });
            })
            .add([Array, Number, Number], function (array, arrayIndex, count) {
                for (let i = 0; i < count; i++) {
                    array[arrayIndex + i] = this.#list[i];
                }
            });

        return this.copyTo(...params);
    }

    exists(...params) {
        List.prototype.exists = overload([Function], function (predicate) {
            return this.#list.some(predicate);
        });

        return this.exists(...params);
    }

    forEach(...params) {
        List.prototype.forEach = overload([Function], function (callback) {
            this.#list.forEach(callback);
        });

        return this.forEach(...params);
    }

    find(...params) {
        List.prototype.find = overload([Function], function (predicate) {
            return this.#list.find(predicate);
        });

        return this.find(...params);
    }

    findIndex(...params) {
        List.prototype.findIndex = overload([Function], function (predicate) {
            return this.#list.findIndex(predicate);
        });

        return this.findIndex(...params);
    }

    findLast(...params) {
        List.prototype.findLast = overload([Function], function (predicate) {
            this.#list.reverse();
            let find = this.#list.find(predicate);
            this.#list.reverse();
            return find;
        });

        return this.findLast(...params);
    }

    findLastIndex(...params) {
        List.prototype.findLastIndex = overload([Function], function (predicate) {
            this.#list.reverse();
            let find = this.#list.findIndex(predicate);
            this.#list.reverse();
            return find;
        });

        return this.findLastIndex(...params);
    }

    insert(...params) {
        this.insert = overload([Number, this.#innerType], function (index, item) {
            this.#rangeCheck(index);

            this.#list.splice(index, 0, item);
        });

        return this.insert(...params);
    }

    insertRange(...params) {
        List.prototype.insertRange = overload([Number, [Array, List]], function (index, list) {
            this.#rangeCheck(index);

            for (let item of list) this.insert(index++, item);
        }).add([Number, "..."], function (index, ...items) {
            this.#rangeCheck(index);

            for (let item of items) this.insert(index++, item);
        });

        return this.insertRange(...params);
    }

    indexOf(...params) {
        this.indexOf = overload([this.#innerType], function (item) {
            return this.#list.indexOf(item);
        });

        return this.indexOf(...params);
    }

    lastIndexOf(...params) {
        this.lastIndexOf = overload([this.#innerType], function (item) {
            return this.#list.lastIndexOf(item);
        });

        return this.lastIndexOf(...params);
    }

    remove(...params) {
        this.remove = overload([this.#innerType], function (item) {
            const index = this.#list.indexOf(item);

            if (index !== -1) {
                this.#list.splice(index, 1);
                return true;
            }

            return false;
        });

        return this.remove(...params);
    }

    removeAt(...params) {
        List.prototype.removeAt = overload([Number], function (index) {
            this.#rangeCheck(index);

            this.#list.splice(index, 1);
        });

        return this.removeAt(...params);
    }

    removeAll(...params) {
        List.prototype.removeAll = overload([Function], function (predicate) {
            let count = 0;

            for (let i = this.#list.length - 1; i >= 0; i--) {
                if (predicate(this.#list[i])) {
                    this.#list.splice(i, 1);
                    count++;
                }
            }

            return count;
        });

        return this.removeAll(...params);
    }

    removeRange(...params) {
        List.prototype.removeRange = overload([Number, Number], function (index, count) {
            this.#rangeCheck(index);
            this.#rangeCheck(index + count - 1);

            this.#list.splice(index, count);
        });

        return this.removeRange(...params);
    }

    reverse(...params) {
        List.prototype.reverse = overload([], function () {
            this.#list.reverse();
        }).add([Number, Number], function (index, count) {
            this.#rangeCheck(index);
            this.#rangeCheck(index + count - 1);

            const temp = this.#list.splice(index, count);
            temp.reverse();
            this.#list.splice(index, 0, ...temp);
        });

        return this.reverse(...params);
    }

    slice(...params) {
        List.prototype.slice = overload().add([Number, Number], function (start, end) {
            return new List(this.#innerType, this.#list.slice(start, end));
        });

        return this.slice(...params);
    }

    sort(...params) {
        List.prototype.sort = overload()
            .add([], function () {
                this.#list.sort();
            })
            .add([Function], function (compareFn) {
                this.#list.sort(compareFn);
            });

        return this.sort(...params);
    }

    toArray(...params) {
        List.prototype.toArray = overload([], function () {
            return this.#list.slice();
        });

        return this.toArray(...params);
    }

    trueForAll(...params) {
        List.prototype.trueForAll = overload([Function], function (predicate) {
            return this.#list.every(predicate);
        });

        return this.trueForAll(...params);
    }

    toString(...params) {
        List.prototype.toString = overload().any(function (...params) {
            return this.#list.toString(...params);
        });

        return this.toString(...params);
    }
}
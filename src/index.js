import overload from "@jyostudio/overload";
import JSONSchema from "@jyostudio/overload/dist/jsonSchema.js";

/**
 * @template T
 * @class List
 */
export default class List {
    /**
     * 元素列表
     * @type {T[]}
     */
    #list = [];

    /**
     * 内部类型
     * @type {T}
     */
    #innerType = null;

    /**
     * 代理
     * @type {Proxy<List>}
     */
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

    static #_constructor = function (...params) {
        List.#_constructor = overload()
            .add([[Function, JSONSchema]],
                /**
                 * @this {List<T>}
                 * @param {T} innerType - 内部类型
                 */
                function (innerType) {
                    this.#innerType = innerType;
                })
            .add([[Function, JSONSchema], [Array, List.T(typeof params?.[0] === "function" ? params[0] : class { })]],
                /**
                 * @this {List<T>}
                 * @param {T} innerType - 内部类型
                 * @param {T[] | List<T>} list - 列表
                 */
                function (innerType, list) {
                    this.#innerType = innerType;
                    for (let item of list) {
                        this.add(item);
                    }
                })
            .add([[Function, JSONSchema], Number], function (innerType, count) {
                this.#innerType = innerType;
                let defaultValue;

                if (innerType === Number) defaultValue = 0;
                else if (innerType === String) defaultValue = "";
                else if (innerType === Boolean) defaultValue = false;
                else if (innerType === BigInt) defaultValue = BigInt(0);
                else if (innerType === Symbol) defaultValue = Symbol();
                else defaultValue = null;

                for (let i = 0; i < count; i++) {
                    this.add(innerType?.["##STRUCT_CONSTURCTOR##"]?.() || defaultValue);
                }
            });

        return List.#_constructor.call(this, ...params);
    };

    constructor(...params) {
        List.#_constructor.apply(this, params);

        return this.#initProxy();
    }

    static T(...params) {
        const CACHE_T_PROXY = new WeakMap();

        List.T = overload([[Function, JSONSchema]], function (innerType) {
            let proxy = CACHE_T_PROXY.get(innerType);
            !proxy && CACHE_T_PROXY.set(innerType, proxy = new Proxy(List, {
                get: (target, prop, receiver) => {
                    if (prop === "##INNER_TYPE##") {
                        return innerType;
                    }
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
                if (prop === "@@INNER_TYPE@@") {
                    return this.#innerType;
                }

                let result = null;

                if (typeof prop === "symbol") {
                    result = this[prop];
                } else if (typeof prop === "string") {
                    if (/^\d+$/.test(prop)) {
                        result = this.#list[prop];
                    } else {
                        result = this[prop];
                    }
                }

                if (typeof result === "function") {
                    return result.bind(this);
                }

                return result;
            },
            set: (target, prop, value, receiver) => {
                if (typeof prop === "string" && /^\d+$/.test(prop)) {
                    if (prop >= this.#list.length) {
                        throw new Error(`索引 ${prop} 超出范围，列表长度为 ${this.#list.length}。`);
                    }

                    overload([this.#innerType],
                        /**
                         * @param {T} value - 值
                         */
                        (value) => {
                            this.#list[prop] = value;
                        }).call(this, value);

                    return true;
                }

                throw new Error(`无法在此列表上设置属性 ${prop}。`);
            },
        });
    }

    /**
     * @param {Number} index - 索引
     * @throws {Error}
     */
    #rangeCheck(index) {
        if (index < 0) {
            throw new Error(`索引 ${index} 超出范围，索引必须大于或等于 0。`);
        }

        if (index >= this.#list.length) {
            throw new Error(`索引 ${index} 超出范围，列表长度为 ${this.#list.length}。`);
        }
    }

    [Symbol.iterator] = function* () {
        for (let i = 0; i < this.#list.length; i++) {
            yield this.#list[i];
        }
    }

    add(...params) {
        this.add = overload([[this.#innerType, null]],
            /**
             * @this {List<T>}
             * @param {T | null} item 
             */
            function (item) {
                this.#list.push(item);
            });

        return this.add(...params);
    }

    addRange(...params) {
        List.prototype.addRange = overload([[Array, List]],
            /**
             * @this {List<T>}
             * @param {T[] | List<T>} list - 列表
             */
            function (list) {
                for (let item of list) {
                    this.add(item);
                }
            }).any(
                /**
                 * @this {List<T>}
                 * @param {T[]} items - 项目
                 */
                function (...items) {
                    for (let item of items) {
                        this.add(item);
                    }
                });

        return this.addRange(...params);
    }

    asReadOnly(...params) {
        const ignore = ["add", "addRange", "insert", "insertRange", "remove", "removeAt", "removeAll", "removeRange", "clear", "reverse", "sort", "asReadOnly"];

        List.prototype.asReadOnly = overload([],
            /**
             * @this {List<T>}
             * @returns {Proxy<List<T>>}
             */
            function () {
                return new Proxy(this, {
                    get: (target, prop, receiver) => {
                        if (ignore.includes(prop)) {
                            throw new Error(`无法访问只读列表上的方法 ${prop}。`);
                        }

                        return this.#proxy[prop];
                    },
                    set: (target, prop, value, receiver) => {
                        throw new Error(`无法在只读列表上设置属性 ${prop}。`);
                    }
                });
            });

        return this.asReadOnly(...params);
    }

    concat(...params) {
        List.prototype.concat = overload([[Array, List]],
            /**
             * @this {List<T>}
             * @param {T[] | List<T>} list - 列表
             */
            function (list) {
                /**
                 * @type {List<T>}
                 */
                const newList = new List(this.#innerType);
                for (let item of this) {
                    newList.add(item);
                }
                for (let item of list) {
                    newList.add(item);
                }
                return newList;
            });

        return this.concat(...params);
    }

    clear(...params) {
        List.prototype.clear = overload([],
            /**
             * @this {List<T>}
             */
            function () {
                this.#list = [];
            });

        return this.clear(...params);
    }

    clone(...params) {
        List.prototype.clone = overload([],
            /**
             * @this {List<T>}
             * @returns {List<T>}
             */
            function () {
                return new List(this.#innerType, this);
            });

        return this.clone(...params);
    }

    contains(...params) {
        this.contains = overload([this.#innerType],
            /**
             * @this {List<T>}
             * @param {T} item
             * @returns {Boolean}
             */
            function (item) {
                return this.#list.includes(item);
            });

        return this.contains(...params);
    }

    copyTo(...params) {
        List.prototype.copyTo = overload()
            .add([Array],
                /**
                 * @this {List<T>}
                 * @param {T[]} array - 数组
                 */
                function (array) {
                    this.#list.forEach((item, index) => {
                        array[index] = item;
                    });
                })
            .add([Array, Number],
                /**
                 * @this {List<T>}
                 * @param {T[]} array - 数组
                 * @param {Number} arrayIndex - 数组索引
                 */
                function (array, arrayIndex) {
                    this.#list.forEach((item, index) => {
                        array[arrayIndex + index] = item;
                    });
                })
            .add([Array, Number, Number],
                /**
                 * @this {List<T>}
                 * @param {T[]} array - 数组
                 * @param {Number} arrayIndex - 数组索引
                 * @param {Number} count - 数量
                 */
                function (array, arrayIndex, count) {
                    for (let i = 0; i < count; i++) {
                        array[arrayIndex + i] = this.#list[i];
                    }
                });

        return this.copyTo(...params);
    }

    exists(...params) {
        List.prototype.exists = overload([Function],
            /**
             * @this {List<T>}
             * @param {Function} predicate - 谓词
             * @returns {Boolean}
             */
            function (predicate) {
                return this.#list.some(predicate);
            });

        return this.exists(...params);
    }

    forEach(...params) {
        List.prototype.forEach = overload([Function],
            /**
             * @this {List<T>}
             * @param {Function} callback - 回调
             */
            function (callback) {
                this.#list.forEach(callback);
            });

        return this.forEach(...params);
    }

    find(...params) {
        List.prototype.find = overload([Function],
            /**
             * @this {List<T>}
             * @param {Function} predicate - 谓词
             * @returns {T?}
             */
            function (predicate) {
                return this.#list.find(predicate);
            });

        return this.find(...params);
    }

    findIndex(...params) {
        List.prototype.findIndex = overload([Function],
            /**
             * @this {List<T>}
             * @param {Function} predicate - 谓词
             * @returns {Number}
             */
            function (predicate) {
                return this.#list.findIndex(predicate);
            });

        return this.findIndex(...params);
    }

    findLast(...params) {
        List.prototype.findLast = overload([Function],
            /**
             * @this {List<T>}
             * @param {Function} predicate - 谓词
             * @returns {T?} 
             */
            function (predicate) {
                this.#list.reverse();
                let find = this.#list.find(predicate);
                this.#list.reverse();
                return find;
            });

        return this.findLast(...params);
    }

    findLastIndex(...params) {
        List.prototype.findLastIndex = overload([Function],
            /**
             * @this {List<T>}
             * @param {Function} predicate - 谓词
             * @returns {Number}
             */
            function (predicate) {
                this.#list.reverse();
                let find = this.#list.findIndex(predicate);
                this.#list.reverse();
                return find;
            });

        return this.findLastIndex(...params);
    }

    getInnerType(...params) {
        List.prototype.getInnerType = overload([],
            /**
             * @this {List<T>}
             * @returns {T}
             */
            function () {
                return this.#innerType;
            });

        return this.getInnerType(...params);
    }

    insert(...params) {
        this.insert = overload([Number, [this.#innerType, null]],
            /**
             * @this {List<T>}
             * @param {Number} index - 索引
             * @param {T | null} item - 项目
             */
            function (index, item) {
                this.#rangeCheck(index);

                this.#list.splice(index, 0, item);
            });

        return this.insert(...params);
    }

    insertRange(...params) {
        List.prototype.insertRange = overload([Number, [Array, List]],
            /**
             * @this {List<T>}
             * @param {Number} index - 索引
             * @param {T[] | List<T>} list - 列表
             */
            function (index, list) {
                this.#rangeCheck(index);

                for (let item of list) {
                    this.insert(index++, item);
                }
            }).add([Number, "..."],
                /**
                 * @this {List<T>}
                 * @param {Number} index - 索引
                 * @param {T[]} items - 项目
                 */
                function (index, ...items) {
                    this.#rangeCheck(index);

                    for (let item of items) {
                        this.insert(index++, item);
                    }
                });

        return this.insertRange(...params);
    }

    indexOf(...params) {
        this.indexOf = overload([this.#innerType],
            /**
             * @this {List<T>}
             * @param {T} item - 项目
             * @returns {Number}
             */
            function (item) {
                return this.#list.indexOf(item);
            });

        return this.indexOf(...params);
    }

    lastIndexOf(...params) {
        this.lastIndexOf = overload([this.#innerType],
            /**
             * @this {List<T>}
             * @param {T} item - 项目
             * @returns {Number}
             */
            function (item) {
                return this.#list.lastIndexOf(item);
            });

        return this.lastIndexOf(...params);
    }

    remove(...params) {
        this.remove = overload([this.#innerType],
            /**
             * @this {List<T>}
             * @param {T} item - 项目
             * @returns {Boolean}
             */
            function (item) {
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
        List.prototype.removeAt = overload([Number],
            /**
             * @this {List<T>}
             * @param {Number} index - 索引 
             */
            function (index) {
                this.#rangeCheck(index);

                this.#list.splice(index, 1);
            });

        return this.removeAt(...params);
    }

    removeAll(...params) {
        List.prototype.removeAll = overload([Function],
            /**
             * @this {List<T>}
             * @param {Function} predicate - 谓词
             * @returns {Number}
             */
            function (predicate) {
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
        List.prototype.removeRange = overload([Number, Number],
            /**
             * @this {List<T>}
             * @param {Number} index - 索引
             * @param {Number} count - 数量
             */
            function (index, count) {
                this.#rangeCheck(index);
                this.#rangeCheck(index + count - 1);

                this.#list.splice(index, count);
            });

        return this.removeRange(...params);
    }

    reverse(...params) {
        List.prototype.reverse = overload([],
            /**
             * @this {List<T>}
             */
            function () {
                this.#list.reverse();
            })
            .add([Number, Number],
                /**
                 * @this {List<T>}
                 * @param {Number} index - 索引
                 * @param {Number} count - 数量 
                 */
                function (index, count) {
                    this.#rangeCheck(index);
                    this.#rangeCheck(index + count - 1);

                    const temp = this.#list.splice(index, count);
                    temp.reverse();
                    this.#list.splice(index, 0, ...temp);
                });

        return this.reverse(...params);
    }

    slice(...params) {
        List.prototype.slice = overload().add([Number, Number],
            /**
             * @this {List<T>}
             * @param {Number} start - 开始
             * @param {Number} end - 结束
             * @returns {List<T>}
             */
            function (start, end) {
                return new List(this.#innerType, this.#list.slice(start, end));
            });

        return this.slice(...params);
    }

    sort(...params) {
        List.prototype.sort = overload()
            .add([],
                /**
                 * @this {List<T>}
                 */
                function () {
                    this.#list.sort();
                })
            .add([Function],
                /**
                 * @this {List<T>}
                 * @param {Function} compareFn - 比较函数 
                 */
                function (compareFn) {
                    this.#list.sort(compareFn);
                });

        return this.sort(...params);
    }

    toArray(...params) {
        List.prototype.toArray = overload([],
            /**
             * @this {List<T>}
             * @returns {T[]}
             */
            function () {
                return this.#list.slice();
            });

        return this.toArray(...params);
    }

    trueForAll(...params) {
        List.prototype.trueForAll = overload([Function],
            /**
             * @this {List<T>}
             * @param {Function} predicate - 谓词
             * @returns {Boolean}
             */
            function (predicate) {
                return this.#list.every(predicate);
            });

        return this.trueForAll(...params);
    }

    toString(...params) {
        List.prototype.toString = overload().any(
            /**
             * @this {List<T>}
             * @param  {...any} params - 参数
             * @returns {String}
             */
            function (...params) {
                return this.#list.toString(...params);
            });

        return this.toString(...params);
    }
}
import overload from "@jyostudio/overload";
import JSONSchema from "@jyostudio/overload/dist/jsonSchema.js";

export type ConstructorType<T> =
    T extends string ? StringConstructor :
    T extends number ? NumberConstructor :
    T extends boolean ? BooleanConstructor :
    T extends bigint ? BigIntConstructor :
    T extends symbol ? SymbolConstructor :
    abstract new (...args: any[]) => T;

export type NativeType<T> =
    T extends String ? string :
    T extends Number ? number :
    T extends Boolean ? boolean :
    T extends Symbol ? symbol :
    T extends BigInt ? bigint :
    T;

/**
 * 只读的强类型对象列表
 */
export abstract class ReadOnlyList<T> {
    [index: number]: NativeType<T>;

    /**
     * 获取包含的元素数
     */
    abstract get length(): number;

    /**
     * 获取指定元素类型的 List 类型
     * @param innerType 元素类型构造函数
     */
    static T<T>(innerType: ConstructorType<T>): typeof List<T> {
        throw new Error("Method not implemented.");
    }

    /**
     * 合并两个 List
     * @param list 要合并的 List
     * @returns 合并后的 List
     */
    abstract concat(list: NativeType<T>[] | List<T>): List<T>;

    /**
     * 复制一个 List
     * @returns 复制的 List
     */
    abstract clone(): List<T>;

    /**
     * 判断是否包含某个元素
     * @param item 要判断的元素
     * @returns 是否包含
     */
    abstract contains(item: NativeType<T>): boolean;

    /**
     * 将当前 List 的元素转换为另一种类型，并返回包含转换后元素的 List
     * @param targetType 目标类型构造函数
     * @param converter 转换函数
     * @returns 转换后的 List
     */
    abstract convertAll<U>(targetType: ConstructorType<U>, converter: (item: NativeType<T>) => U): List<U>;

    /**
     * 复制到一个数组
     * @param array 目标数组
     * @param arrayIndex 数组起始位置
     * @param count 复制数量
     */
    abstract copyTo(array: NativeType<T>[], arrayIndex?: number, count?: number): void;

    /**
     * 确定 List 中是否包含与指定谓词定义的条件匹配的元素
     * @param predicate 判断函数
     * @returns 是否包含
     */
    abstract exists(predicate: (item: NativeType<T>) => boolean): boolean;

    /**
     * 检索与指定谓词定义的条件匹配的所有元素
     * @param predicate 判断函数
     * @returns 包含所有匹配元素的 List
     */
    abstract findAll(predicate: (item: NativeType<T>) => boolean): List<T>;

    /**
     * 对 List 中每个元素执行指定操作
     * @param callback 操作函数
     */
    abstract forEach(callback: (item: NativeType<T>, index: number, list: List<T>) => void): void;

    /**
     * 搜索与指定谓词所定义的条件相匹配的元素，并返回整个 List 中的第一个匹配元素
     * @param predicate 判断函数
     * @returns 符合条件的元素
     */
    abstract find(predicate: (item: NativeType<T>) => boolean): NativeType<T> | undefined;

    /**
     * 搜索与指定谓词所定义的条件相匹配的元素，并返回整个 List 中的第一个匹配元素的从零开始的索引
     * @param predicate 判断函数
     * @returns 符合条件的元素索引
     */
    abstract findIndex(predicate: (item: NativeType<T>) => boolean): number;

    /**
     * 搜索与指定谓词所定义的条件相匹配的元素，并返回整个 List 中的最后一个匹配元素
     * @param predicate 判断函数
     * @returns 符合条件的元素
     */
    abstract findLast(predicate: (item: NativeType<T>) => boolean): NativeType<T> | undefined;

    /**
     * 搜索与指定谓词所定义的条件相匹配的元素，并返回整个 List 中的最后一个匹配元素的从零开始的索引
     * @param predicate 判断函数
     * @returns 符合条件的元素索引
     */
    abstract findLastIndex(predicate: (item: NativeType<T>) => boolean): number;

    /**
     * 获取内部元素类型
     * @returns 元素类型
     */
    abstract getInnerType(): ConstructorType<T>;

    /**
     * 搜索指定的对象，并返回整个 List 中第一个匹配项的从零开始的索引
     * @param item 要搜索的元素
     * @returns 元素索引
     */
    abstract indexOf(item: NativeType<T>): number;

    /**
     * 搜索指定的对象，并返回整个 List 中最后一个匹配项的从零开始的索引
     * @param item 要搜索的元素
     * @returns 元素索引
     */
    abstract lastIndexOf(item: NativeType<T>): number;

    /**
     * 在源 List 中创建元素范围的浅表副本
     * @param start 起始索引
     * @param length 复制数量
     * @returns 新 List
     */
    abstract slice(start: number, length: number): List<T>;

    /**
     * 将整个 List 中的元素复制到新数组中
     * @returns 新数组
     */
    abstract toArray(): NativeType<T>[];

    /**
     * 判断是否所有元素都符合条件
     * @param predicate 判断函数
     * @returns 是否所有元素都符合条件
     */
    abstract trueForAll(predicate: (item: NativeType<T>) => boolean): boolean;

    /**
     * 串联 List 的成员，其中在每个成员之间使用指定的分隔符
     * @param separator 分隔符
     * @returns 拼接后的字符串
     */
    abstract join(separator?: string): string;

    /**
     * 返回 List 的字符串表示形式
     * @returns 字符串
     */
    abstract toString(): string;
}

/**
 * 强类型对象列表
 */
export default class List<T> extends ReadOnlyList<T> {
    /**
     * 元素列表
     */
    #list: NativeType<T>[] = [];

    /**
     * 内部类型
     */
    #innerType: ConstructorType<T> | null = null;

    /**
     * 代理
     */
    #proxy: any = null;

    /**
     * 方法缓存
     */
    #methodCache = new Map<string | symbol, Function>();

    /**
     * 类型检查器
     */
    #typeChecker: Function | null = null;

    get length() {
        return this.#list.length;
    }

    get [Symbol.isConcatSpreadable]() {
        return true;
    }

    get [Symbol.toStringTag]() {
        return `List<${this.#innerType!.name}>`;
    }

    static #_constructor = function (this: List<any>, ...params: any[]) {
        List.#_constructor = overload()
            .add([[Function, JSONSchema]],
                function (this: List<any>, innerType: any) {
                    this.#innerType = innerType;
                })
            .add([[Function, JSONSchema], [Array, List.T(typeof params?.[0] === "function" ? params[0] : class { })]],
                function (this: List<any>, innerType: any, list: any) {
                    this.#innerType = innerType;
                    for (let item of list) {
                        this.add(item);
                    }
                })
            .add([[Function, JSONSchema], Number], function (this: List<any>, innerType: any, count: number) {
                this.#innerType = innerType;
                let defaultValue;

                if (innerType === Number) defaultValue = 0;
                else if (innerType === String) defaultValue = "";
                else if (innerType === Boolean) defaultValue = false;
                else if (innerType === BigInt) defaultValue = BigInt(0);
                else if (innerType === Symbol) defaultValue = Symbol();
                else defaultValue = null;

                for (let i = 0; i < count; i++) {
                    this.add(innerType?.["##STRUCT_CONSTRUCTOR##"]?.() || defaultValue);
                }
            });

        return (List.#_constructor as any).call(this, ...params);
    };

    /**
     * 初始化 List 类的新实例
     * @param innerType 元素类型构造函数
     */
    constructor(innerType: ConstructorType<T>);
    /**
     * 初始化 List 类的新实例
     * @param innerType 元素类型构造函数
     * @param list 要复制的元素列表
     */
    constructor(innerType: ConstructorType<T>, list: NativeType<T>[] | List<T>);
    /**
     * 初始化 List 类的新实例
     * @param innerType 元素类型构造函数
     * @param count 初始容量
     */
    constructor(innerType: ConstructorType<T>, count: number);
    constructor(...params: any[]) {
        super();
        (List.#_constructor as any).apply(this, params);

        return this.#initProxy();
    }

    static T<T>(innerType: ConstructorType<T>): typeof List<T>;
    static T(...params: any[]): any {
        const CACHE_T_PROXY = new WeakMap();

        List.T = overload([[Function, JSONSchema]], function (innerType: any) {
            let proxy = CACHE_T_PROXY.get(innerType);
            !proxy && CACHE_T_PROXY.set(innerType, proxy = new Proxy(List, {
                get: (target, prop, receiver) => {
                    if (prop === "##INNER_TYPE##") {
                        return innerType;
                    }
                    return Reflect.get(target, prop, receiver);
                },
                construct: (target, args) => {
                    return new (target as any)(innerType, ...args);
                }
            }));

            return proxy;
        });

        return (List.T as any)(...params);
    }

    #initProxy() {
        return this.#proxy = new Proxy(this, {
            get: (target, prop, receiver) => {
                if (prop === "@@INNER_TYPE@@") {
                    return this.#innerType;
                }

                if (typeof prop === "string") {
                    const first = prop.charCodeAt(0);
                    if (first >= 48 && first <= 57) {
                        const index = Number(prop);
                        if (Number.isInteger(index) && index >= 0) {
                            return this.#list[index];
                        }
                    }
                }

                // 优先处理已知属性和 Symbol
                const value = Reflect.get(target, prop, target);

                if (value !== undefined) {
                    if (typeof value === "function") {
                        let bound = this.#methodCache.get(prop);
                        if (!bound) {
                            bound = value.bind(this);
                            this.#methodCache.set(prop, bound!);
                        }
                        return bound;
                    }
                    return value;
                }

                return undefined;
            },
            set: (target, prop, value, receiver) => {
                if (typeof prop === "string") {
                    const first = prop.charCodeAt(0);
                    if (first >= 48 && first <= 57) {
                        const index = Number(prop);
                        if (Number.isInteger(index) && index >= 0) {
                            if (index >= this.#list.length) {
                                throw new Error(`索引 ${prop} 超出范围，列表长度为 ${this.#list.length}。`);
                            }

                            if (!this.#typeChecker) {
                                this.#typeChecker = overload([this.#innerType], () => { });
                            }
                            (this.#typeChecker as any).call(this, value);

                            this.#list[index] = value;
                            return true;
                        }
                    }
                }

                throw new Error(`无法在此列表上设置属性 ${String(prop)}。`);
            },
        });
    }

    /**
     * @param {Number} index - 索引
     * @throws {Error}
     */
    #rangeCheck(index: number) {
        if (index < 0) {
            throw new Error(`索引 ${index} 超出范围，索引必须大于或等于 0。`);
        }

        if (index >= this.#list.length) {
            throw new Error(`索引 ${index} 超出范围，列表长度为 ${this.#list.length}。`);
        }
    }

    [Symbol.iterator] = function* (this: List<T>) {
        for (let i = 0; i < this.#list.length; i++) {
            yield this.#list[i];
        }
    }

    /**
     * 添加一个元素
     * @param item 要添加的元素
     */
    add(item: NativeType<T> | null): void;
    add(...params: any[]): void {
        if (this.#innerType === Number) {
            this.add = function (this: List<T>, item: any) {
                if (typeof item !== 'number') throw new Error(`参数不匹配: 期望 Number, 实际是 ${typeof item}`);
                this.#list.push(item as any);
            } as any;
        } else if (this.#innerType === String) {
            this.add = function (this: List<T>, item: any) {
                if (typeof item !== 'string') throw new Error(`参数不匹配: 期望 String, 实际是 ${typeof item}`);
                this.#list.push(item as any);
            } as any;
        } else if (this.#innerType === Boolean) {
            this.add = function (this: List<T>, item: any) {
                if (typeof item !== 'boolean') throw new Error(`参数不匹配: 期望 Boolean, 实际是 ${typeof item}`);
                this.#list.push(item as any);
            } as any;
        } else {
            this.add = overload([[this.#innerType, null]],
                function (this: List<T>, item: NativeType<T> | null) {
                    this.#list.push(item!);
                });
        }

        return (this.add as any)(...params);
    }

    /**
     * 添加一组元素
     * @param list 要添加的元素列表
     */
    addRange(list: NativeType<T>[] | List<T>): void;
    /**
     * 添加一组元素
     * @param items 要添加的元素列表
     */
    addRange(...items: NativeType<T>[]): void;
    addRange(...params: any[]): void {
        List.prototype.addRange = overload([[Array, List]],
            function (this: List<T>, list: any) {
                for (let item of list) {
                    this.add(item);
                }
            }).any(
                function (this: List<T>, ...items: any[]) {
                    for (let item of items) {
                        this.add(item);
                    }
                });

        return (this.addRange as any)(...params);
    }

    /**
     * 返回一个只读的 List
     * @returns 只读的 List
     */
    asReadOnly(): ReadOnlyList<T>;
    asReadOnly(...params: any[]): ReadOnlyList<T> {
        const ignore = ["add", "addRange", "insert", "insertRange", "remove", "removeAt", "removeAll", "removeRange", "clear", "reverse", "sort", "asReadOnly"];

        List.prototype.asReadOnly = overload([],
            function (this: List<T>) {
                return new Proxy(this, {
                    get: (target, prop, receiver) => {
                        if (typeof prop === "string" && ignore.includes(prop)) {
                            throw new Error(`无法访问只读列表上的方法 ${prop}。`);
                        }

                        return this.#proxy[prop];
                    },
                    set: (target, prop, value, receiver) => {
                        throw new Error(`无法在只读列表上设置属性 ${String(prop)}。`);
                    }
                });
            });

        return (this.asReadOnly as any)(...params);
    }

    /**
     * 合并两个 List
     * @param list 要合并的 List
     * @returns 合并后的 List
     */
    concat(list: NativeType<T>[] | List<T>): List<T>;
    concat(...params: any[]): List<T> {
        List.prototype.concat = overload([[Array, List]],
            function (this: List<T>, list: any) {
                /**
                 * @type {List<T>}
                 */
                const newList = new List<T>(this.#innerType!);
                for (let item of this) {
                    newList.add(item);
                }
                for (let item of list) {
                    newList.add(item);
                }
                return newList;
            });

        return (this.concat as any)(...params);
    }

    /**
     * 清空所有元素
     */
    clear(): void;
    clear(...params: any[]): void {
        List.prototype.clear = overload([],
            function (this: List<T>) {
                this.#list = [];
            });

        return (this.clear as any)(...params);
    }

    /**
     * 复制一个 List
     * @returns 复制的 List
     */
    clone(): List<T>;
    clone(...params: any[]): List<T> {
        List.prototype.clone = overload([],
            function (this: List<T>) {
                return new List<T>(this.#innerType!, this);
            });

        return (this.clone as any)(...params);
    }

    /**
     * 判断是否包含某个元素
     * @param item 要判断的元素
     * @returns 是否包含
     */
    contains(item: NativeType<T>): boolean;
    contains(...params: any[]): boolean {
        this.contains = overload([this.#innerType],
            function (this: List<T>, item: NativeType<T>) {
                return this.#list.includes(item);
            });

        return (this.contains as any)(...params);
    }

    /**
     * 将当前 List 的元素转换为另一种类型，并返回包含转换后元素的 List
     * @param targetType 目标类型构造函数
     * @param converter 转换函数
     * @returns 转换后的 List
     */
    convertAll<U>(targetType: ConstructorType<U>, converter: (item: NativeType<T>) => U): List<U>;
    convertAll(...params: any[]): any {
        List.prototype.convertAll = overload([[Function, JSONSchema], Function],
            function (this: List<T>, targetType: any, converter: any) {
                const result = new List<any>(targetType);
                for (let i = 0; i < this.#list.length; i++) {
                    result.add(converter(this.#list[i]));
                }
                return result;
            });

        return (this.convertAll as any)(...params);
    }

    /**
     * 复制到一个数组
     * @param array 目标数组
     * @param arrayIndex 数组起始位置
     * @param count 复制数量
     */
    copyTo(array: NativeType<T>[], arrayIndex?: number, count?: number): void;
    copyTo(...params: any[]): void {
        List.prototype.copyTo = overload()
            .add([Array],
                function (this: List<T>, array: NativeType<T>[]) {
                    this.#list.forEach((item, index) => {
                        array[index] = item;
                    });
                })
            .add([Array, Number],
                function (this: List<T>, array: NativeType<T>[], arrayIndex: number) {
                    this.#list.forEach((item, index) => {
                        array[arrayIndex + index] = item;
                    });
                })
            .add([Array, Number, Number],
                function (this: List<T>, array: NativeType<T>[], arrayIndex: number, count: number) {
                    for (let i = 0; i < count; i++) {
                        array[arrayIndex + i] = this.#list[i];
                    }
                });

        return (this.copyTo as any)(...params);
    }

    /**
     * 确定 List 中是否包含与指定谓词定义的条件匹配的元素
     * @param predicate 判断函数
     * @returns 是否包含
     */
    exists(predicate: (item: NativeType<T>) => boolean): boolean;
    exists(...params: any[]): boolean {
        List.prototype.exists = overload([Function],
            function (this: List<T>, predicate: (item: NativeType<T>) => boolean) {
                return this.#list.some(predicate);
            });

        return (this.exists as any)(...params);
    }

    /**
     * 检索与指定谓词定义的条件匹配的所有元素
     * @param predicate 判断函数
     * @returns 包含所有匹配元素的 List
     */
    findAll(predicate: (item: NativeType<T>) => boolean): List<T>;
    findAll(...params: any[]): List<T> {
        List.prototype.findAll = overload([Function],
            function (this: List<T>, predicate: any) {
                const result = new List<T>(this.#innerType!);
                for (let i = 0; i < this.#list.length; i++) {
                    if (predicate(this.#list[i])) {
                        result.add(this.#list[i]);
                    }
                }
                return result;
            });

        return (this.findAll as any)(...params);
    }

    /**
     * 对 List 中每个元素执行指定操作
     * @param callback 操作函数
     */
    forEach(callback: (item: NativeType<T>, index: number, list: List<T>) => void): void;
    forEach(...params: any[]): void {
        List.prototype.forEach = overload([Function],
            function (this: List<T>, callback: any) {
                this.#list.forEach(callback);
            });

        return (this.forEach as any)(...params);
    }

    /**
     * 搜索与指定谓词所定义的条件相匹配的元素，并返回整个 List 中的第一个匹配元素
     * @param predicate 判断函数
     * @returns 符合条件的元素
     */
    find(predicate: (item: NativeType<T>) => boolean): NativeType<T> | undefined;
    find(...params: any[]): NativeType<T> | undefined {
        List.prototype.find = overload([Function],
            function (this: List<T>, predicate: any) {
                return this.#list.find(predicate);
            });

        return (this.find as any)(...params);
    }

    /**
     * 搜索与指定谓词所定义的条件相匹配的元素，并返回整个 List 中的第一个匹配元素的从零开始的索引
     * @param predicate 判断函数
     * @returns 符合条件的元素索引
     */
    findIndex(predicate: (item: NativeType<T>) => boolean): number;
    findIndex(...params: any[]): number {
        List.prototype.findIndex = overload([Function],
            function (this: List<T>, predicate: any) {
                return this.#list.findIndex(predicate);
            });

        return (this.findIndex as any)(...params);
    }

    /**
     * 搜索与指定谓词所定义的条件相匹配的元素，并返回整个 List 中的最后一个匹配元素
     * @param predicate 判断函数
     * @returns 符合条件的元素
     */
    findLast(predicate: (item: NativeType<T>) => boolean): NativeType<T> | undefined;
    findLast(...params: any[]): NativeType<T> | undefined {
        List.prototype.findLast = overload([Function],
            function (this: List<T>, predicate: any) {
                this.#list.reverse();
                let find = this.#list.find(predicate);
                this.#list.reverse();
                return find;
            });

        return (this.findLast as any)(...params);
    }

    /**
     * 搜索与指定谓词所定义的条件相匹配的元素，并返回整个 List 中的最后一个匹配元素的从零开始的索引
     * @param predicate 判断函数
     * @returns 符合条件的元素索引
     */
    findLastIndex(predicate: (item: NativeType<T>) => boolean): number;
    findLastIndex(...params: any[]): number {
        List.prototype.findLastIndex = overload([Function],
            function (this: List<T>, predicate: any) {
                this.#list.reverse();
                let index = this.#list.findIndex(predicate);
                this.#list.reverse();
                return index === -1 ? -1 : this.#list.length - 1 - index;
            });

        return (this.findLastIndex as any)(...params);
    }

    /**
     * 获取内部元素类型
     * @returns 元素类型
     */
    getInnerType(): ConstructorType<T>;
    getInnerType(...params: any[]): any {
        List.prototype.getInnerType = overload([],
            function (this: List<T>) {
                return this.#innerType;
            });

        return (this.getInnerType as any)(...params);
    }

    /**
     * 将元素插入 List 的指定索引处
     * @param index 索引
     * @param item 要插入的元素
     */
    insert(index: number, item: NativeType<T> | null): void;
    insert(...params: any[]): void {
        this.insert = overload([Number, [this.#innerType, null]],
            function (this: List<T>, index: number, item: NativeType<T> | null) {
                this.#rangeCheck(index);

                this.#list.splice(index, 0, item!);
            });

        return (this.insert as any)(...params);
    }

    /**
     * 将集合的元素插入 List 的指定索引处
     * @param index 索引
     * @param list 要插入的元素列表
     */
    insertRange(index: number, list: NativeType<T>[] | List<T>): void;
    /**
     * 将集合的元素插入 List 的指定索引处
     * @param index 索引
     * @param items 要插入的元素列表
     */
    insertRange(index: number, ...items: NativeType<T>[]): void;
    insertRange(...params: any[]): void {
        List.prototype.insertRange = overload([Number, [Array, List]],
            function (this: List<T>, index: number, list: any) {
                this.#rangeCheck(index);

                for (let item of list) {
                    this.insert(index++, item);
                }
            }).add([Number, "..."],
                function (this: List<T>, index: number, ...items: any[]) {
                    this.#rangeCheck(index);

                    for (let item of items) {
                        this.insert(index++, item);
                    }
                });

        return (this.insertRange as any)(...params);
    }

    /**
     * 搜索指定的对象，并返回整个 List 中第一个匹配项的从零开始的索引
     * @param item 要搜索的元素
     * @returns 元素索引
     */
    indexOf(item: NativeType<T>): number;
    indexOf(...params: any[]): number {
        this.indexOf = overload([this.#innerType],
            function (this: List<T>, item: NativeType<T>) {
                return this.#list.indexOf(item);
            });

        return (this.indexOf as any)(...params);
    }

    /**
     * 搜索指定的对象，并返回整个 List 中最后一个匹配项的从零开始的索引
     * @param item 要搜索的元素
     * @returns 元素索引
     */
    lastIndexOf(item: NativeType<T>): number;
    lastIndexOf(...params: any[]): number {
        this.lastIndexOf = overload([this.#innerType],
            function (this: List<T>, item: NativeType<T>) {
                return this.#list.lastIndexOf(item);
            });

        return (this.lastIndexOf as any)(...params);
    }

    /**
     * 从 List 中移除特定对象的第一个匹配项
     * @param item 要移除的元素
     * @returns 是否成功移除
     */
    remove(item: NativeType<T>): boolean;
    remove(...params: any[]): boolean {
        this.remove = overload([this.#innerType],
            function (this: List<T>, item: NativeType<T>) {
                const index = this.#list.indexOf(item);

                if (index !== -1) {
                    this.#list.splice(index, 1);
                    return true;
                }

                return false;
            });

        return (this.remove as any)(...params);
    }

    /**
     * 移除 List 中指定索引处的元素
     * @param index 索引
     */
    removeAt(index: number): void;
    removeAt(...params: any[]): void {
        List.prototype.removeAt = overload([Number],
            function (this: List<T>, index: number) {
                this.#rangeCheck(index);

                this.#list.splice(index, 1);
            });

        return (this.removeAt as any)(...params);
    }

    /**
     * 删除与指定谓词所定义的条件匹配的所有元素
     * @param predicate 判断函数
     * @returns 删除数量
     */
    removeAll(predicate: (item: NativeType<T>) => boolean): number;
    removeAll(...params: any[]): number {
        List.prototype.removeAll = overload([Function],
            function (this: List<T>, predicate: any) {
                let count = 0;

                for (let i = this.#list.length - 1; i >= 0; i--) {
                    if (predicate(this.#list[i])) {
                        this.#list.splice(i, 1);
                        count++;
                    }
                }

                return count;
            });

        return (this.removeAll as any)(...params);
    }

    /**
     * 移除 List 中指定索引处的元素
     * @param index 索引
     * @param count 移除数量
     */
    removeRange(index: number, count: number): void;
    removeRange(...params: any[]): void {
        List.prototype.removeRange = overload([Number, Number],
            function (this: List<T>, index: number, count: number) {
                this.#rangeCheck(index);
                this.#rangeCheck(index + count - 1);

                this.#list.splice(index, count);
            });

        return (this.removeRange as any)(...params);
    }

    /**
     * 反转整个 List 中元素的顺序
     */
    reverse(): void;
    /**
     * 反转整个 List 中元素的顺序
     * @param index 起始索引
     * @param count 反转数量
     */
    reverse(index: number, count: number): void;
    reverse(...params: any[]): void {
        List.prototype.reverse = overload([],
            function (this: List<T>) {
                this.#list.reverse();
            })
            .add([Number, Number],
                function (this: List<T>, index: number, count: number) {
                    this.#rangeCheck(index);
                    this.#rangeCheck(index + count - 1);

                    const temp = this.#list.splice(index, count);
                    temp.reverse();
                    this.#list.splice(index, 0, ...temp);
                });

        return (this.reverse as any)(...params);
    }

    /**
     * 在源 List 中创建元素范围的浅表副本
     * @param start 起始索引
     * @param length 复制数量
     * @returns 新 List
     */
    slice(start: number, length: number): List<T>;
    slice(...params: any[]): List<T> {
        List.prototype.slice = overload().add([Number, Number],
            function (this: List<T>, start: number, end: number) {
                return new List<T>(this.#innerType!, this.#list.slice(start, end));
            });

        return (this.slice as any)(...params);
    }

    /**
     * 使用默认比较器对整个 List 中的元素进行排序
     */
    sort(): void;
    /**
     * 使用指定的比较器对整个 List 中的元素进行排序
     * @param compareFn 比较函数
     */
    sort(compareFn: (a: NativeType<T>, b: NativeType<T>) => number): void;
    sort(...params: any[]): void {
        List.prototype.sort = overload()
            .add([],
                function (this: List<T>) {
                    this.#list.sort();
                })
            .add([Function],
                function (this: List<T>, compareFn: any) {
                    this.#list.sort(compareFn);
                });

        return (this.sort as any)(...params);
    }

    /**
     * 将整个 List 中的元素复制到新数组中
     * @returns 新数组
     */
    toArray(): NativeType<T>[];
    toArray(...params: any[]): NativeType<T>[] {
        List.prototype.toArray = overload([],
            function (this: List<T>) {
                return this.#list.slice();
            });

        return (this.toArray as any)(...params);
    }

    /**
     * 判断是否所有元素都符合条件
     * @param predicate 判断函数
     * @returns 是否所有元素都符合条件
     */
    trueForAll(predicate: (item: NativeType<T>) => boolean): boolean;
    trueForAll(...params: any[]): boolean {
        List.prototype.trueForAll = overload([Function],
            function (this: List<T>, predicate: any) {
                return this.#list.every(predicate);
            });

        return (this.trueForAll as any)(...params);
    }

    /**
     * 串联 List 的成员，其中在每个成员之间使用指定的分隔符
     * @param separator 分隔符
     * @returns 拼接后的字符串
     */
    join(separator?: string): string;
    join(...params: any[]): string {
        List.prototype.join = overload()
            .add([], function (this: List<T>) {
                return this.#list.join();
            })
            .add([String], function (this: List<T>, separator: string) {
                return this.#list.join(separator);
            });

        return (this.join as any)(...params);
    }

    /**
     * 返回 List 的字符串表示形式
     * @returns 字符串
     */
    toString(): string;
    toString(...params: any[]): string {
        List.prototype.toString = overload().any(
            function (this: List<T>, ...params: any[]) {
                return this.#list.toString();
            });

        return (this.toString as any)(...params);
    }
}

/**
 * 只读的强类型对象列表
 */
declare class ReadOnlyList<T> {
   /**
   * 获取包含的元素数
   */
   get length(): Number;

   /**
    * 初始化 List 类的新实例
    * @param innerType 元素类型
    */
   constructor(innerType: T);
 
   /**
    * 初始化 List 类的新实例
    * @param innerType 元素类型
    * @param list 要复制的元素列表
    */
   constructor(innerType: T, list: Array<T> | List<T>);
 
   /**
    * 获取指定元素类型的 List 类型
    * @param innerType 元素类型
    */
   static T(innerType: any): List<any>;
 
   /**
    * 合并两个 List
    * @param list 要合并的 List
    * @returns 合并后的 List
    */
   concat(list: Array<T> | List<T>): List<T>;
 
   /**
    * 复制一个 List
    * @returns 复制的 List
    */
   clone(): List<T>;
 
   /**
    * 判断是否包含某个元素
    * @param item 要判断的元素
    * @returns 是否包含
    */
   contains(item: T): Boolean;
 
   /**
    * 复制到一个数组
    * @param array 目标数组
    */
   copyTo(array: Array<T>): void;
 
   /**
    * 复制到一个数组
    * @param array 目标数组
    * @param arrayIndex 数组起始位置
    */
   copyTo(array: Array<T>, arrayIndex: Number): void;
 
   /**
    * 复制到一个数组
    * @param array 目标数组
    * @param arrayIndex 数组起始位置
    * @param count 复制数量
    */
   copyTo(array: Array<T>, arrayIndex: Number, count: Number): void;
 
   /**
    * 确定 List 中是否包含与指定谓词定义的条件匹配的元素
    * @param predicate 判断函数
    * @returns 是否包含
    */
   exists(predicate: Function): Boolean;
 
   /**
    * 对 List 中每个元素执行指定操作
    * @param callback 操作函数
    */
   forEach(callback: Function): void;
 
   /**
    * 搜索与指定谓词所定义的条件相匹配的元素，并返回整个 List 中的第一个匹配元素
    * @param predicate 判断函数
    * @returns 符合条件的元素
    */
   find(predicate: Function): T;
 
   /**
    * 搜索与指定谓词所定义的条件相匹配的元素，并返回整个 List 中的第一个匹配元素的从零开始的索引
    * @param predicate 判断函数
    * @returns 符合条件的元素索引
    */
   findIndex(predicate: Function): Number;
 
   /**
    * 搜索与指定谓词所定义的条件相匹配的元素，并返回整个 List 中的最后一个匹配元素
    * @param predicate 判断函数
    * @returns 符合条件的元素
    */
   findLast(predicate: Function): T;
 
   /**
    * 搜索与指定谓词所定义的条件相匹配的元素，并返回整个 List 中的最后一个匹配元素的从零开始的索引
    * @param predicate 判断函数
    * @returns 符合条件的元素索引
    */
   findLastIndex(predicate: Function): Number;
 
   /**
    * 搜索指定的对象，并返回整个 List 中第一个匹配项的从零开始的索引
    * @param item 要搜索的元素
    * @returns 元素索引
    */
   indexOf(item: T): Number;
 
   /**
    * 搜索指定的对象，并返回整个 List 中最后一个匹配项的从零开始的索引
    * @param item 要搜索的元素
    * @returns 元素索引
    */
   lastIndexOf(item: T): Number;
 
   /**
    * 在源 List 中创建元素范围的浅表副本
    * @param start 起始索引
    * @param length 复制数量
    * @returns 新 List
    */
   slice(start: Number, length: Number): List<T>;
 
   /**
    * 将整个 List 中的元素复制到新数组中
    * @returns 新数组
    */
   toArray(): Array<T>;
 
   /**
    * 判断是否所有元素都符合条件
    * @param predicate 判断函数
    * @returns 是否所有元素都符合条件
    */
   trueForAll(predicate: Function): Boolean;
 
   /**
    * 返回 List 的字符串表示形式
    * @returns 字符串
    */
   toString(): String;
}

/**
 * 强类型对象列表
 */
export default class List<T> {
  /**
   * 获取包含的元素数
   */
  get length(): Number;

  /**
   * 初始化 List 类的新实例
   * @param innerType 元素类型
   */
  constructor(innerType: T);

  /**
   * 初始化 List 类的新实例
   * @param innerType 元素类型
   * @param list 要复制的元素列表
   */
  constructor(innerType: T, list: Array<T> | List<T>);

  /**
   * 获取指定元素类型的 List 类型
   * @param innerType 元素类型
   */
  static T(innerType: any): List<any>;

  /**
   * 添加一个元素
   * @param item 要添加的元素
   */
  add(item: T): void;

  /**
   * 添加一组元素
   * @param list 要添加的元素列表
   */
  addRange(list: Array<T> | List<T>): void;

  /**
   * 添加一组元素
   * @param items 要添加的元素列表
   */
  addRange(...items: T[]): void;

  /**
   * 返回一个只读的 List
   * @returns 只读的 List
   */
  asReadOnly(): ReadOnlyList<T>;

  /**
   * 合并两个 List
   * @param list 要合并的 List
   * @returns 合并后的 List
   */
  concat(list: Array<T> | List<T>): List<T>;

  /**
   * 清空所有元素
   */
  clear(): void;

  /**
   * 复制一个 List
   * @returns 复制的 List
   */
  clone(): List<T>;

  /**
   * 判断是否包含某个元素
   * @param item 要判断的元素
   * @returns 是否包含
   */
  contains(item: T): Boolean;

  /**
   * 复制到一个数组
   * @param array 目标数组
   */
  copyTo(array: Array<T>): void;

  /**
   * 复制到一个数组
   * @param array 目标数组
   * @param arrayIndex 数组起始位置
   */
  copyTo(array: Array<T>, arrayIndex: Number): void;

  /**
   * 复制到一个数组
   * @param array 目标数组
   * @param arrayIndex 数组起始位置
   * @param count 复制数量
   */
  copyTo(array: Array<T>, arrayIndex: Number, count: Number): void;

  /**
   * 确定 List 中是否包含与指定谓词定义的条件匹配的元素
   * @param predicate 判断函数
   * @returns 是否包含
   */
  exists(predicate: Function): Boolean;

  /**
   * 对 List 中每个元素执行指定操作
   * @param callback 操作函数
   */
  forEach(callback: Function): void;

  /**
   * 搜索与指定谓词所定义的条件相匹配的元素，并返回整个 List 中的第一个匹配元素
   * @param predicate 判断函数
   * @returns 符合条件的元素
   */
  find(predicate: Function): T;

  /**
   * 搜索与指定谓词所定义的条件相匹配的元素，并返回整个 List 中的第一个匹配元素的从零开始的索引
   * @param predicate 判断函数
   * @returns 符合条件的元素索引
   */
  findIndex(predicate: Function): Number;

  /**
   * 搜索与指定谓词所定义的条件相匹配的元素，并返回整个 List 中的最后一个匹配元素
   * @param predicate 判断函数
   * @returns 符合条件的元素
   */
  findLast(predicate: Function): T;

  /**
   * 搜索与指定谓词所定义的条件相匹配的元素，并返回整个 List 中的最后一个匹配元素的从零开始的索引
   * @param predicate 判断函数
   * @returns 符合条件的元素索引
   */
  findLastIndex(predicate: Function): Number;

  /**
   * 将元素插入 List 的指定索引处
   * @param index 索引
   * @param item 要插入的元素
   */
  insert(index: Number, item: T): void;

  /**
   * 将集合的元素插入 List 的指定索引处
   * @param index 索引
   * @param list 要插入的元素列表
   */
  insertRange(index: Number, list: Array<T> | List<T>): void;

  /**
   * 将集合的元素插入 List 的指定索引处
   * @param index 索引
   * @param items 要插入的元素列表
   */
  insertRange(index: Number, ...items: T[]): void;

  /**
   * 搜索指定的对象，并返回整个 List 中第一个匹配项的从零开始的索引
   * @param item 要搜索的元素
   * @returns 元素索引
   */
  indexOf(item: T): Number;

  /**
   * 搜索指定的对象，并返回整个 List 中最后一个匹配项的从零开始的索引
   * @param item 要搜索的元素
   * @returns 元素索引
   */
  lastIndexOf(item: T): Number;

  /**
   * 从 List 中移除特定对象的第一个匹配项
   * @param item 要移除的元素
   * @returns 是否成功移除
   */
  remove(item: T): Boolean;

  /**
   * 移除 List 中指定索引处的元素
   * @param index 索引
   */
  removeAt(index: Number): void;

  /**
   * 删除与指定谓词所定义的条件匹配的所有元素
   * @param predicate 判断函数
   * @returns 删除数量
   */
  removeAll(predicate: Function): Number;

  /**
   * 移除 List 中指定索引处的元素
   * @param index 索引
   * @param count 移除数量
   */
  removeRange(index: Number, count: Number): void;

  /**
   * 反转整个 List 中元素的顺序
   */
  reverse(): void;

  /**
   * 反转整个 List 中元素的顺序
   * @param index 起始索引
   * @param count 反转数量
   */
  reverse(index: Number, count: Number): void;

  /**
   * 在源 List 中创建元素范围的浅表副本
   * @param start 起始索引
   * @param length 复制数量
   * @returns 新 List
   */
  slice(start: Number, length: Number): List<T>;

  /**
   * 使用默认比较器对整个 List 中的元素进行排序
   */
  sort(): void;

  /**
   * 使用指定的比较器对整个 List 中的元素进行排序
   * @param compareFn 比较函数
   */
  sort(compareFn: Function): void;

  /**
   * 将整个 List 中的元素复制到新数组中
   * @returns 新数组
   */
  toArray(): Array<T>;

  /**
   * 判断是否所有元素都符合条件
   * @param predicate 判断函数
   * @returns 是否所有元素都符合条件
   */
  trueForAll(predicate: Function): Boolean;

  /**
   * 返回 List 的字符串表示形式
   * @returns 字符串
   */
  toString(): String;
}

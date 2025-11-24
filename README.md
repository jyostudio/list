# @jyostudio/list

强类型对象列表。

## 引用

浏览器

```HTML
<script type="importmap">
  {
    "imports": {
      "@jyostudio/list": "https://unpkg.com/@jyostudio/list"
    }
  }
</script>
```

Node.js

```bash
npm install @jyostudio/list
```

根据环境引用后，用法完全一致，不需要在使用时区分引用地址和方式。

## 构建版本说明

本库提供两个构建版本：

1.  **`dist/list.js`** (默认):
    *   不包含 `JSONSchema` 依赖。
    *   适用于不需要 JSON Schema 验证的场景，体积更小。
    *   代码中的 `[Function, JSONSchema]` 已被替换为 `Function`。

2.  **`dist/list-with-json-schema.js`**:
    *   包含完整的 `JSONSchema` 支持。
    *   如果你的项目依赖于 `@jyostudio/overload` 的 JSON Schema 功能，请使用此版本。

可以通过修改引用路径来选择特定版本：

```javascript
// 默认引用 (list.js)
import List from "@jyostudio/list";

// 引用带 JSON Schema 的版本
import List from "@jyostudio/list/dist/list-with-json-schema.js";
```

## 用法

### 1. 创建列表

支持多种初始化方式，必须指定列表元素的类型。

```javascript
import List from "@jyostudio/list";

// 创建空的数字列表
const numList = new List(Number);

// 创建指定初始容量的列表（填充默认值）
const strList = new List(String, 5); // ["", "", "", "", ""]

// 从数组创建
const fromArray = new List(Number, [1, 2, 3]);

// 从另一个 List 创建（复制）
const copyList = new List(Number, fromArray);

// 支持自定义类
class Person {
    constructor(name) { this.name = name; }
}
const personList = new List(Person);
```

### 2. 基本增删改查

```javascript
const list = new List(Number);

// 添加元素
list.add(1);
list.addRange([2, 3, 4]);
list.addRange(5, 6); // 支持多参数

// 插入元素
list.insert(0, 0); // 在索引 0 处插入 0
list.insertRange(1, [1.5, 1.6]);

// 索引访问与修改
console.log(list[0]); // 0
list[0] = 100;

// 移除元素
list.remove(100); // 移除第一个匹配项，返回 boolean
list.removeAt(0); // 移除指定索引处的元素
list.removeRange(0, 2); // 从索引 0 开始移除 2 个元素
list.removeAll(x => x < 0); // 移除所有符合条件的元素

// 清空
list.clear();

// 获取长度
console.log(list.length);
```

### 3. 查找与筛选

```javascript
const list = new List(Number, [1, 2, 3, 4, 5, 2]);

// 判断包含
list.contains(3); // true
list.exists(x => x > 4); // true
list.trueForAll(x => x > 0); // true

// 查找索引
list.indexOf(2); // 1
list.lastIndexOf(2); // 5

// 查找元素
list.find(x => x > 3); // 4 (第一个匹配项)
list.findLast(x => x > 3); // 5 (最后一个匹配项)
list.findIndex(x => x > 3); // 3
list.findLastIndex(x => x > 3); // 4

// 筛选 (返回新 List)
const evens = list.findAll(x => x % 2 === 0); // List<Number> [2, 4, 2]
```

### 4. 转换与导出

```javascript
const list = new List(Number, [1, 2, 3]);

// 转换为原生数组
const arr = list.toArray();

// 转换为其他类型的 List
// convertAll(目标类型构造函数, 转换函数)
const strList = list.convertAll(String, x => `Value: ${x}`); 

// 拼接字符串
list.join(", "); // "1, 2, 3"

// 截取 (返回新 List)
const subList = list.slice(0, 2);

// 复制到数组
const targetArr = new Array(5);
list.copyTo(targetArr, 1); // 从目标数组索引 1 开始填充
```

### 5. 迭代与遍历

```javascript
const list = new List(Number, [1, 2, 3]);

// forEach
list.forEach((item, index) => {
    console.log(index, item);
});

// for...of
for (const item of list) {
    console.log(item);
}
```

### 6. 排序与反转

```javascript
const list = new List(Number, [3, 1, 2]);

// 排序
list.sort(); // [1, 2, 3]
list.sort((a, b) => b - a); // [3, 2, 1]

// 反转
list.reverse();
```

### 7. 只读包装

```javascript
const list = new List(Number, [1, 2, 3]);
const readOnly = list.asReadOnly();

console.log(readOnly[0]); // 1
// readOnly.add(4); // Error: 无法访问只读列表上的方法 add
// readOnly[0] = 5; // Error: 无法在只读列表上设置属性 0
```

### 8. 配合 @jyostudio/overload 使用

`List.T(Type)` 可用于在重载函数中指定参数必须是特定类型的 List。

```javascript
import overload from "@jyostudio/overload";
import List from "@jyostudio/list";

const fn = overload()
  .add([List.T(Number)], function (list) {
    console.log("接收到数字列表，长度：", list.length);
  })
  .add([List.T(String)], function (list) {
    console.log("接收到字符串列表，第一个元素：", list[0]);
  });

fn(new List(Number, [1, 2]));
fn(new List(String, ["a", "b"]));
```

## 许可证

MIT License

Copyright (c) 2025 nivk

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

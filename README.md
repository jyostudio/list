# @jyostudio/list

强类型对象列表。

## 引用

浏览器

```HTML
<script type="importmap">
  {
    imports: {
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

## 用法

下列代码演示了如何创建列表。

```javascript
import List from "@jyostudio/list";

let list = new List(Number, [1, 2, 3, 4]);
new List(String);
new List(Boolean, [true, false, true, true]);
new List(Number, list);
```

下面代码演示了如何搭配 overload 使用。

```javascript
import overload from "@jyostudio/overload";
import List from "@jyostudio/list";

const fn = overload()
  .add([List.T(Number)], function (list) {
    console.log("只允许数字类型的列表：", list);
  })
  .add([List.T(String)], function (list) {
    console.log("只允许字符串类型的列表：", list);
  });

fn(new List(String));
fn(new List(Number));
```

更多用法请参考智能提示。

## 许可证

MIT License

Copyright (c) 2024 nivk

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

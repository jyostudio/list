import List from '../dist/list.js';

const expect = window.chai.expect;

describe('List 类', function () {

    describe('构造函数', function () {
        it('应使用指定类型创建一个空列表', function () {
            const list = new List(Number);
            expect(list.length).to.equal(0);
            expect(list.getInnerType()).to.equal(Number);
        });

        it('应创建一个具有初始计数和默认值的列表', function () {
            const list = new List(Number, 5);
            expect(list.length).to.equal(5);
            for (let i = 0; i < 5; i++) {
                expect(list[i]).to.equal(0);
            }

            const strList = new List(String, 3);
            expect(strList.length).to.equal(3);
            expect(strList[0]).to.equal("");
        });

        it('应从数组创建一个列表', function () {
            const arr = [1, 2, 3];
            const list = new List(Number, arr);
            expect(list.length).to.equal(3);
            expect(list[0]).to.equal(1);
            expect(list[2]).to.equal(3);
        });

        it('应从另一个列表创建一个列表', function () {
            const list1 = new List(Number, [1, 2, 3]);
            const list2 = new List(Number, list1);
            expect(list2.length).to.equal(3);
            expect(list2[0]).to.equal(1);
        });
    });

    describe('属性', function () {
        it('应通过索引获取和设置元素', function () {
            const list = new List(Number);
            list.add(1);
            expect(list[0]).to.equal(1);
            list[0] = 2;
            expect(list[0]).to.equal(2);
        });

        it('设置超出范围的索引时应抛出错误', function () {
            const list = new List(Number);
            expect(() => list[0] = 1).to.throw();
        });

        it('设置无效类型时应抛出错误', function () {
            const list = new List(Number);
            list.add(1);
            expect(() => list[0] = "string").to.throw();
        });
        
        it('应具有正确的 toStringTag', function() {
             const list = new List(Number);
             expect(Object.prototype.toString.call(list)).to.equal('[object List<Number>]');
        });
    });

    describe('方法', function () {
        let list;

        beforeEach(function () {
            list = new List(Number);
        });

        describe('add', function () {
            it('应将项目添加到末尾', function () {
                list.add(1);
                expect(list.length).to.equal(1);
                expect(list[0]).to.equal(1);
            });

            it('添加无效类型时应抛出错误', function () {
                expect(() => list.add("string")).to.throw();
            });
        });

        describe('addRange', function () {
            it('应添加项目数组', function () {
                list.addRange([1, 2]);
                expect(list.length).to.equal(2);
                expect(list[1]).to.equal(2);
            });

            it('应添加另一个列表', function () {
                const other = new List(Number, [3, 4]);
                list.addRange(other);
                expect(list.length).to.equal(2);
                expect(list[0]).to.equal(3);
            });
            
            it('应添加多个项目作为参数', function() {
                list.addRange(1, 2, 3);
                expect(list.length).to.equal(3);
                expect(list[2]).to.equal(3);
            });
        });

        describe('insert', function () {
            it('应在索引处插入项目', function () {
                list.add(1);
                list.add(3);
                list.insert(1, 2);
                expect(list.length).to.equal(3);
                expect(list[1]).to.equal(2);
            });

            it('如果索引超出范围应抛出错误', function () {
                expect(() => list.insert(1, 1)).to.throw();
            });
        });

        describe('insertRange', function () {
            it('应在索引处插入数组', function () {
                list.add(1);
                list.add(4);
                list.insertRange(1, [2, 3]);
                expect(list.length).to.equal(4);
                expect(list[1]).to.equal(2);
                expect(list[2]).to.equal(3);
            });
            
             it('应在索引处插入多个项目', function () {
                list.add(1);
                list.add(4);
                list.insertRange(1, 2, 3);
                expect(list.length).to.equal(4);
                expect(list[1]).to.equal(2);
                expect(list[2]).to.equal(3);
            });
        });

        describe('remove', function () {
            it('应移除项目的第一次出现', function () {
                list.addRange([1, 2, 1]);
                const removed = list.remove(1);
                expect(removed).to.be.true;
                expect(list.length).to.equal(2);
                expect(list[0]).to.equal(2);
                expect(list[1]).to.equal(1);
            });

            it('如果未找到项目应返回 false', function () {
                list.add(1);
                const removed = list.remove(2);
                expect(removed).to.be.false;
            });
        });

        describe('removeAt', function () {
            it('应移除索引处的项目', function () {
                list.addRange([1, 2, 3]);
                list.removeAt(1);
                expect(list.length).to.equal(2);
                expect(list[1]).to.equal(3);
            });
        });

        describe('removeAll', function () {
            it('应移除所有匹配谓词的项目', function () {
                list.addRange([1, 2, 3, 2, 1]);
                const count = list.removeAll(x => x === 2);
                expect(count).to.equal(2);
                expect(list.length).to.equal(3);
                expect(list.contains(2)).to.be.false;
            });
        });

        describe('removeRange', function () {
            it('应移除项目范围', function () {
                list.addRange([1, 2, 3, 4, 5]);
                list.removeRange(1, 3); // Remove 2, 3, 4
                expect(list.length).to.equal(2);
                expect(list[0]).to.equal(1);
                expect(list[1]).to.equal(5);
            });
        });

        describe('clear', function () {
            it('应清空列表', function () {
                list.add(1);
                list.clear();
                expect(list.length).to.equal(0);
            });
        });

        describe('contains', function () {
            it('如果项目存在应返回 true', function () {
                list.add(1);
                expect(list.contains(1)).to.be.true;
            });

            it('如果项目不存在应返回 false', function () {
                list.add(1);
                expect(list.contains(2)).to.be.false;
            });
        });

        describe('indexOf / lastIndexOf', function () {
            it('应返回正确的索引', function () {
                list.addRange([1, 2, 3, 2, 1]);
                expect(list.indexOf(2)).to.equal(1);
                expect(list.lastIndexOf(2)).to.equal(3);
            });

            it('如果未找到应返回 -1', function () {
                expect(list.indexOf(1)).to.equal(-1);
            });
        });

        describe('find / findIndex / findLast / findLastIndex', function () {
            beforeEach(function() {
                list.addRange([1, 2, 3, 4, 2]);
            });

            it('find 应返回第一个匹配的元素', function () {
                expect(list.find(x => x > 2)).to.equal(3);
            });

            it('findIndex 应返回第一个匹配元素的索引', function () {
                expect(list.findIndex(x => x > 2)).to.equal(2);
            });

            it('findLast 应返回最后一个匹配的元素', function () {
                expect(list.findLast(x => x < 3)).to.equal(2); // The last 2
            });

            it('findLastIndex 应返回最后一个匹配元素的索引', function () {
                expect(list.findLastIndex(x => x < 3)).to.equal(4);
            });
        });

        describe('exists / trueForAll', function () {
            it('exists 如果任何元素匹配应返回 true', function () {
                list.addRange([1, 2, 3]);
                expect(list.exists(x => x === 2)).to.be.true;
            });

            it('trueForAll 如果所有元素匹配应返回 true', function () {
                list.addRange([1, 2, 3]);
                expect(list.trueForAll(x => x > 0)).to.be.true;
                expect(list.trueForAll(x => x > 1)).to.be.false;
            });
        });

        describe('forEach', function () {
            it('应迭代所有元素', function () {
                list.addRange([1, 2, 3]);
                let sum = 0;
                list.forEach(x => sum += x);
                expect(sum).to.equal(6);
            });
        });

        describe('sort / reverse', function () {
            it('sort 应排序元素', function () {
                list.addRange([3, 1, 2]);
                list.sort();
                expect(list.toArray()).to.deep.equal([1, 2, 3]);
            });

            it('使用比较器排序', function () {
                list.addRange([1, 2, 3]);
                list.sort((a, b) => b - a);
                expect(list.toArray()).to.deep.equal([3, 2, 1]);
            });

            it('reverse 应反转元素', function () {
                list.addRange([1, 2, 3]);
                list.reverse();
                expect(list.toArray()).to.deep.equal([3, 2, 1]);
            });
            
            it('反转范围', function() {
                list.addRange([1, 2, 3, 4, 5]);
                list.reverse(1, 3); // Reverse 2, 3, 4 -> 4, 3, 2
                expect(list.toArray()).to.deep.equal([1, 4, 3, 2, 5]);
            });
        });

        describe('slice', function () {
            it('应返回包含切片元素的新列表', function () {
                list.addRange([1, 2, 3, 4, 5]);
                const sliced = list.slice(1, 4); // 2, 3, 4
                expect(sliced).to.be.instanceOf(List);
                expect(sliced.length).to.equal(3);
                expect(sliced[0]).to.equal(2);
                expect(sliced[2]).to.equal(4);
            });
        });

        describe('clone', function () {
            it('应返回列表的浅拷贝', function () {
                list.add(1);
                const clone = list.clone();
                expect(clone).to.not.equal(list);
                expect(clone.length).to.equal(list.length);
                expect(clone[0]).to.equal(list[0]);
            });
        });

        describe('concat', function () {
            it('应与另一个列表连接', function () {
                list.add(1);
                const other = new List(Number, [2]);
                const result = list.concat(other);
                expect(result.length).to.equal(2);
                expect(result[0]).to.equal(1);
                expect(result[1]).to.equal(2);
            });
        });

        describe('copyTo', function () {
            it('应复制到数组', function () {
                list.addRange([1, 2]);
                const arr = [0, 0, 0];
                list.copyTo(arr);
                expect(arr[0]).to.equal(1);
                expect(arr[1]).to.equal(2);
            });
            
            it('应复制到具有索引的数组', function () {
                list.addRange([1, 2]);
                const arr = [0, 0, 0, 0];
                list.copyTo(arr, 1);
                expect(arr[1]).to.equal(1);
                expect(arr[2]).to.equal(2);
            });
            
            it('应复制到具有索引和计数的数组', function () {
                list.addRange([1, 2, 3]);
                const arr = [0, 0, 0, 0];
                list.copyTo(arr, 1, 2); // Copy 1, 2 to index 1
                expect(arr[1]).to.equal(1);
                expect(arr[2]).to.equal(2);
                expect(arr[3]).to.equal(0);
            });
        });

        describe('toArray', function () {
            it('应返回原生数组', function () {
                list.addRange([1, 2]);
                const arr = list.toArray();
                expect(arr).to.be.an('array');
                expect(arr).to.deep.equal([1, 2]);
            });
        });

        describe('toString', function () {
            it('应返回字符串表示形式', function () {
                list.addRange([1, 2]);
                expect(list.toString()).to.equal('1,2');
            });
        });
        
        describe('asReadOnly', function() {
            it('应返回只读包装器', function() {
                list.add(1);
                const readOnly = list.asReadOnly();
                expect(readOnly.length).to.equal(1);
                expect(readOnly[0]).to.equal(1);
                
                // Check read-only restrictions
                expect(() => readOnly.add(2)).to.throw();
                expect(() => readOnly.clear()).to.throw();
                expect(() => readOnly[0] = 2).to.throw();
                
                // Check that it reflects changes in original list
                list.add(2);
                expect(readOnly.length).to.equal(2);
            });
        });

        describe('findAll', function () {
            it('应返回包含所有匹配元素的新列表', function () {
                list.addRange([1, 2, 3, 4, 5]);
                const result = list.findAll(x => x % 2 === 0);
                expect(result).to.be.instanceOf(List);
                expect(result.length).to.equal(2);
                expect(result[0]).to.equal(2);
                expect(result[1]).to.equal(4);
                expect(result.getInnerType()).to.equal(Number);
            });
        });

        describe('convertAll', function () {
            it('应将元素转换为新类型并返回新列表', function () {
                list.addRange([1, 2, 3]);
                const result = list.convertAll(String, x => x.toString());
                expect(result).to.be.instanceOf(List);
                expect(result.length).to.equal(3);
                expect(result[0]).to.equal("1");
                expect(result.getInnerType()).to.equal(String);
            });
        });

        describe('join', function () {
            it('应使用默认分隔符连接元素', function () {
                list.addRange([1, 2, 3]);
                expect(list.join()).to.equal("1,2,3");
            });

            it('应使用指定分隔符连接元素', function () {
                list.addRange([1, 2, 3]);
                expect(list.join(" - ")).to.equal("1 - 2 - 3");
            });
        });
    });

    describe('静态方法', function () {
        describe('List.T', function () {
            it('应返回该类型的类构造函数', function () {
                const NumberList = List.T(Number);
                const list = new NumberList();
                expect(list).to.be.instanceOf(List);
                expect(list.getInnerType()).to.equal(Number);
            });
            
            it('应缓存代理类', function() {
                const T1 = List.T(Number);
                const T2 = List.T(Number);
                expect(T1).to.equal(T2);
            });
        });
    });
    
    describe('复杂类型', function() {
        it('应适用于对象', function() {
            class Person {
                constructor(name) { this.name = name; }
            }
            
            const list = new List(Person);
            const p1 = new Person("Alice");
            const p2 = new Person("Bob");
            
            list.add(p1);
            expect(list[0]).to.equal(p1);
            
            expect(() => list.add({ name: "Charlie" })).to.throw(); // Not instance of Person
        });
    });

    describe('性能测试 (对比原生 Array)', function () {
        this.timeout(20000); // 增加超时时间
        const COUNT = 100000;

        function logResult(operation, listTime, arrayTime, context) {
            const msg = `List: ${listTime.toFixed(2)}ms, Array: ${arrayTime.toFixed(2)}ms, Ratio: ${(listTime/arrayTime).toFixed(2)}x`;
            const fullMsg = `[${operation}] ${msg}`;
            
            if (window.logPerf) window.logPerf(fullMsg);
            else console.log(fullMsg);
            
            // 尝试更新测试标题以在报告中显示
            if (context && context.test) {
                context.test.title += ` (${msg})`;
            }
        }

        it(`添加 ${COUNT} 个元素`, function () {
            const list = new List(Number);
            const arr = [];

            const t1 = performance.now();
            for (let i = 0; i < COUNT; i++) {
                list.add(i);
            }
            const t2 = performance.now();
            
            const t3 = performance.now();
            for (let i = 0; i < COUNT; i++) {
                arr.push(i);
            }
            const t4 = performance.now();

            logResult('Add', t2 - t1, t4 - t3, this);
            expect(list.length).to.equal(COUNT);
        });

        it(`索引读取 ${COUNT} 次`, function () {
            const list = new List(Number);
            const arr = [];
            for (let i = 0; i < COUNT; i++) {
                list.add(i);
                arr.push(i);
            }

            const t1 = performance.now();
            let sum1 = 0;
            for (let i = 0; i < COUNT; i++) {
                sum1 += list[i];
            }
            const t2 = performance.now();

            const t3 = performance.now();
            let sum2 = 0;
            for (let i = 0; i < COUNT; i++) {
                sum2 += arr[i];
            }
            const t4 = performance.now();

            logResult('Get Index', t2 - t1, t4 - t3, this);
            expect(sum1).to.equal(sum2);
        });

        it(`forEach 遍历 ${COUNT} 个元素`, function () {
            const list = new List(Number);
            const arr = [];
            for (let i = 0; i < COUNT; i++) {
                list.add(i);
                arr.push(i);
            }

            const t1 = performance.now();
            let sum1 = 0;
            list.forEach(x => sum1 += x);
            const t2 = performance.now();

            const t3 = performance.now();
            let sum2 = 0;
            arr.forEach(x => sum2 += x);
            const t4 = performance.now();

            logResult('forEach', t2 - t1, t4 - t3, this);
            expect(sum1).to.equal(sum2);
        });
    });
});

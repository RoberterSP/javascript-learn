#前端代码规范
## JavaScript 风格指南
#####宗旨：  
- **安全性**：无副作用
- **可读性**：降低维护成本
- **渐进性**：尽量使用新的 API，简化代码
### 命名规范
- 避免用一个没有含义的字母命名，让你的命名更加语义化。 eslint: `id-length`
- 用 camelCase 命名你的对象、函数、实例。 eslint: `camelcase`
- 用 PascalCase 命名类。 eslint: `new-cap`
- 简称和首字母缩写应该全部大写或全部小写
- 全大写字母定义用来导出的常量
	```
	// ex:
	const queryStr = '';
	
	function getQuery() {}
	
	class QueryFactory {
	
	}
	
	const SQLString = '';
	
	export const LIMIT = 100;
	
	```
### 声明
- 所有的赋值都用 const，避免使用var. eslint: `prefer-const`, `no-const-assign`
- 如果你一定要对参数重新赋值，那就用let，而不是var. eslint: `no-var`
- 每个变量单独用一个 const 或 let。 eslint: `one-var`
- 不要使用连续变量分配。 eslint: no-multi-assign
	```
	// bad
	let a = b = c = 1;
	```
- 不允许有未使用的变量。 eslint: `no-unused-vars`
### 字符串
- string 统一用单引号 '' 。 eslint: `quotes`
- 不应该用 + 连接字符串, 而是 `
- 不要使用不必要的转义字符。eslint: `no-useless-escape`
> 反斜线可读性差，只在必要时使用  
> 模板字符串更具可读性、语法简洁、字符串插入参数。
	// bad
	function sayHi(name) {
	  return 'How are you, ' + name + '?';
	}
	
	// good
	function sayHi(name) {
	  return `How are you, ${name}?`;
	}
### 对象
- 使用字面值创建对象. eslint: `no-new-object`
- 方法简写. eslint: `object-shorthand`
	``` javascript
	// bad
	const atom = {
	  value: 1,
	
	  addValue: function (value) {
	    return atom.value + value;
	  },
	};
	
	// good
	const atom = {
	  value: 1,
	
	  // 对象的方法
	  addValue(value) {
	    return atom.value + value;
	  },
	};
	
	```
- 属性值缩写. eslint: `object-shorthand`
	```javascript
	const lukeSkywalker = 'Luke Skywalker';
	
	// bad
	const obj = {
	  lukeSkywalker: lukeSkywalker,
	};
	
	// good
	const obj = {
	  lukeSkywalker
	};
	```
	
- 只对那些无效的标示使用引号 ''. eslint: `quote-props`
	```javascript
	// bad
	const bad = {
	  'foo': 3,
	  'bar': 4,
	  'data-blah': 5,
	};
	
	// good
	const good = {
	  foo: 3,
	  bar: 4,
	  'data-blah': 5,
	};
	```
	
### 数组使用
- 使用字面值创建数组. eslint: `no-array-constructor`
- 在数组方法的回调函数中使用 return 语句。 如果函数体由一条返回一个表达式的语句组成， 并且这个表达式没有副作用， 这个时候可以忽略return. eslint: `array-callback-return`
	
	```
	// bad
	let y = 0;
	[1, 2, 3].map((x) => {
	  y ++
	});
	
	// good
	[1, 2, 3].map((x) => {
	  const y = x + 1;
	  return x * y;
	});
	
	// good 函数只有一个语句
	[1, 2, 3].map(x => x + 1);
	``` 	
- 如果一个数组有很多行，在数组的 [ 后和 ] 前换行。
	
	```
	// bad
	const objectInArray = [{
	  id: 1,
	}, {
	  id: 2,
	}];
	
	// good
	const objectInArray = [
	  {
	    id: 1,
	  },
	  {
	    id: 2,
	  },
	];
	```
### 使用解构
	
- 用对象的解构赋值来获取和使用对象某个或多个属性值。 eslint: `prefer-destructuring`
	> 这样就不需要给这些属性创建临时/引用
	```
	// example
	const {startTime, endTime} = dateRange;
	
	const [step1, step2] = steps
	```
	
	
### 函数  
- 尽量不要保存 this 的引用，而是使用箭头函数或硬绑定。
- 把立即执行函数包裹在圆括号里。 eslint: `wrap-iife`
	```
	// ex
	{
		...(() => {
	        let extendOption = {}
	
	        if (this.type === 'dagre') {
	          extendOption = {
	            // pixelRatio: 3
	          }
	        }
	
	        return extendOption
	      })()
	}
	```
	
- 使用默认参数语法，而不是在函数里对参数重新赋值。
	```
	// ex:
	function handleThings(opts = {}) {
	  // ...
	}
	```
	
- 不要改参数. eslint: `no-param-reassign`
- 不要对参数重新赋值。 eslint: `no-param-reassign`
> 特别注意引用类型的操作，保证数据的不可变性
### 箭头函数
- 尽量使用箭头函数，而不是使用 this 赋值来保持上下文
- 如果函数体由一个没有副作用的表达式的单个语句组成，去掉大括号和 return。否则，保留大括号且使用 return 语句。 eslint: `arrow-parens`, `arrow-body-style`
### 模块
- 尽量使用 import / export 而不是 require
- 编写模块的时候 尽量提供 import { es6 } from module 的细粒度方式调用
- 一个入口只 import 一次。 eslint: `no-duplicate-imports`
	```
	// bad
	import { named1 } from 'foo';
	...
	import { named2 } from 'foo';
	```
- 尽量保证导出数据的不变性
- import 放在其他所有语句之前。 eslint: `import/first`
### 属性
- 访问属性时尽量使用点符号. eslint: `dot-notation`
- 获取的属性是变量时用方括号[]
### 比较
- 使用 === 和 !== 而不是 == 和 !=. eslint: `eqeqeq`
- 避免不需要的三元表达式，eslint rules: `no-unneeded-ternary`.
	```
	// bad
	const foo = a ? a : b;
	const bar = c ? true : false;
	const baz = c ? false : true;
	
	// good
	const foo = a || b;
	const bar = !!c;
	const baz = !c;
	```
- 混合操作符时，要放在 () 里，只有当它们是标准的算术运算符(+, -, *, & /)， 并且它们的优先级显而易见时，可以不用。 eslint: `no-mixed-operators`
	```
	// bad
	const foo = a && b < 0 || c > 0 || d + 1 === 0;
	
	// good
	const foo = (a && b < 0) || c > 0 || (d + 1 === 0);
	```
### 空格
- tab 使用两个空格, eslint: `indent`
- 在大括号 {} 前空一格。 eslint: `space-before-blocks`
- 在控制语句 if, while 等的圆括号前空一格。在函数调用和定义时，函数名和圆括号之间不空格。 eslint: `keyword-spacing`
	```
	// bad
	if(isJedi) {
	  fight ();
	}
	
	// good
	if (isJedi) {
	  fight();
	}
	
	// bad
	function fight () {
	  console.log ('Swooosh!');
	}
	
	// good
	function fight() {
	  console.log('Swooosh!');
	}
	```
- 用空格来隔开运算符。 eslint: `space-infix-ops`
- 函数签名部分要有空格。eslint: `space-before-function-paren` `space-before-blocks`
	```
	const x = function () {};
	const y = function a() {};
	```
- 在一个代码块之后，下一条语句之前空一行。
	
	```
	// ex
	const obj = {
	  foo() {
	  },
	
	  bar() {
	  },
	};
	
	return obj;
	```
- 不要故意留一些没必要的空白行。 eslint: `padded-blocks`
- 圆括号里不要加空格。 eslint: `space-in-parens`
	```
	// ex
	if (foo) {
	  console.log(foo);
	}
	```
- 方括号里不要加空格,  eslint: `array-bracket-spacing`
- `,` 前避免空格， `,` 后需要空格。 eslint: `comma-spacing`
- 在对象的属性中， 键值之间要有空格。 eslint: `key-spacing`
- 行末不要空格。 eslint: `no-trailing-spaces`
### 代码块
- 用大括号 {} 包裹多行代码块。 eslint: `nonblock-statement-body-position`
	```
	// bad
	if (test)
	  return false;
	  
	// good
	if (test) return false;
	
	// good
	if (test) {
	  return false;
	}
	```
	
- else 和 if 的大括号保持在一行。 eslint: `brace-style`
	```
	// ex: 
	if (xxx) {
	 ...
	} else {
	 ...
	}
	```
- 如果 if 语句都要用 return 返回， 那后面的 else 就不用写了。 eslint: `no-else-return`
	```
	// bad
	function foo() {
	  if (x) {
	    return x;
	  } else {
	    return y;
	  }
	}
	
	// good
	function foo() {
	  if (x) {
	    return x;
	  }
	
	  return y;
	}
	```
### 逗号
- 不要前置逗号。 eslint: `comma-style`
- 结尾不要加逗号 eslint: `comma-dangle`
	
### 分号
- 尽量在行尾使用分号结束，避免由于 ASI 引起的不确定错误
```
// ex
(function () {
  const name = 'Skywalker'
  return name
})()
[].slice.call(xxx)
```	
在压缩合并的时候可能会引起报错，因为 slice 是数组的原型方法，而压缩后可能会是 `undefined.slice`
	
### 注释
- <span style="color: red">多加注释。</span>
- 单行注释用//，将单行注释放在被注释区域上方。如果注释不是在第一行，就在注释前面加一个空行
- 所有注释开头加一个空格，方便阅读。 eslint: `spaced-comment`
- 复杂功能性函数添加 JsDoc 风格的注释
	```
	// ex
	
	/**
	 * @param {String} tag
	 * @return {Element} element
	 */
	function make(tag) {
	
	  // ...
	
	  return element;
	}
	
	```
	
> 防止以后自己也看不懂代码
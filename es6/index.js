// ###  1
// 模板字面量本质上是包含嵌入式表达式的字符串字面量.
// 模板字面量用倒引号 ( `` )（而不是单引号 ( '' ) 或双引号( "" )）表示，可以包含用 ${expression} 表示的占位符
const student = {
    name: 'Richard Kalehoff',
    guardian: 'Mr. Kalehoff'
  };
  
  const teacher = {
    name: 'Mrs. Wilson',
    room: 'N231'
  }
  
  let message = student.name + ' please see ' + teacher.name + ' in ' + teacher.room + ' to pick up your report card.';
  let message_es6 = `${student.name} please see ${teacher.name} in ${teacher.room} to pick up your report card.`;
  let msg = `${student.name} ceshi ${student.guardian}`
console.log(msg)
console.log(message,message_es6)

// 解构 
// []表示被解构的数组, x,y,z表示要将数组中的值存储在其中的变量, 在解构数组是, 还可以忽略值, 例如const[x,,z]=point,忽略y坐标.
let detail = {
    a: 1,
    c: 2,
    b: 3
}
let { a, b, c} = detail
// 花括号 { } 表示被解构的对象，a、b 和 c 表示要将对象中的属性存储到其中的变量
console.log('a=', a, 'b=', b, 'c=', c)

// 对象字面量简写法
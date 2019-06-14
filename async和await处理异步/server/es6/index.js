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

class vip {
  constructor (name, age) {
    this.name = name
    this.age = age
  }
  showName () {
    alert(this.name)
  }
}
 class vipSup extends vip{
   constructor (name, age, level) {
     super(name, age)
     this.level = level
   }
   vipNameShow () {
     alert(this.level)
   }
 }
 let vipSup1 = new vipSup('CSP',20,3)
 vipSup1.vipNameShow()
 vipSup1.showName()

 // ********promise*****异步操作********8
 function creatPromise (url) {
   return new Promise(function (resolve, reject) {
    $.ajax({
      url,
      dataType: 'json',
      success(res) {
        resolve(res)
      },
      error(err) {
        reject(err)
      }
    })     
   })
 }
 Promise.all([creatPromise('./test1.json'), creatPromise('./test2.json')])
   .then(
    arr => {
    let [arr1, arr2] = arr
    console.log(arr1,arr2)
   },err => {
    console.log(err)
  })
  // 格式
   Promise.all([],).then(function () {}, function (){})


   /**
 * Create Time 2019/5/29
 * tryCatch 高级用法
 * @author csp
 **/
(function(){
    try{
        something
    }catch (e){
        //看似平淡无常 实则惊涛骇浪
        window.open("//www.baidu.com/s?wd=" + e.message, "_blank");
    }
}());
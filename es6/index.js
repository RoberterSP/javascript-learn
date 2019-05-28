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
// console.log(msg)
// console.log(message,message_es6)

// 解构 
// []表示被解构的数组, x,y,z表示要将数组中的值存储在其中的变量, 在解构数组是, 还可以忽略值, 例如const[x,,z]=point,忽略y坐标.
let detail = {
    a: 1,
    c: 2,
    b: 3
}
let { a, b, c} = detail
// 花括号 { } 表示被解构的对象，a、b 和 c 表示要将对象中的属性存储到其中的变量
// console.log('a=', a, 'b=', b, 'c=', c)

// 对象字面量简写法

class vip {
  constructor (name, age) {
    this.name = name
    this.age = age
  }
  showName () {
    // alert(this.name)
  }
}
 class vipSup extends vip{
   constructor (name, age, level) {
     super(name, age)
     this.level = level
   }
   vipNameShow () {
    //  alert(this.level)
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
 Promise.all([creatPromise('./test1.json', './test2.json')])
   .then(
    arr => {
    let [arr1, arr2] = arr
    // console.log(arr1,arr2)
   },err => {
    // console.log(err)
  })
  // 格式
   Promise.all([],).then(function () {}, function (){})
  //  array的常用方法
  /**
 * 根据属性去重数组
 * @param {array} arr 去重的数组
 * @param {string} key 去重的key
 * @example utilscore.uniqueBy([{name:'1111'},{name:'1111'},{name:'222'},{name:'333'}],'name') => [{name:'1111'},{name:'222'},{name:'333'}
 */
export const uniqueBy = function(arr,key){
  return arr.filter((element,index,array)=>array.findIndex(row=>row[key]===element[key]) === index)
}
let arr = [
  {name: 'csp1', age: 25, timestap: 32254345634345},
  {name: 'csp2', age: 25, timestap: 3225434565345},
  {name: 'csp3', age: 25, timestap: 322543345345},
  {name: 'csp4', age: 25, timestap: 322456345345},
  {name: 'csp5', age: 25, timestap: 3543456345345},
  {name: 'csp6', age: 25, timestap: 324345345345}
]
// arr.map( items => items['timestap'])   把数字return出来,形成一个新数组
// result: [32254345634345, 3225434565345, 322543345345, 322456345345, 3543456345345, 324345345345]
let maxNum = (arr, key) => arr.find( item => item[key] === Math.max.apply(Math, arr.map( items => items[key])))
maxNum(arr)
// 深度克隆
/**
 * 深度克隆
 * @param {*} obj 
 */
export const deepClone = (obj) => {
  if(null === obj){
      return obj;
  }
  if(obj instanceof Array){
      return obj.map(row => deepClone(row));
  }
  if(obj instanceof Object){
      let ret = {};
      Object.keys(obj).forEach(key =>{
          if(obj[key] instanceof Date){
              ret[key] = new Date(obj[key].getTime());
          } else {
              ret[key] = deepClone(obj[key]);
          }
      });
      return ret;
  }
  return obj;
};

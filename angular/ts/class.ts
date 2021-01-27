
class Person {

  age:number

  constructor(age:number) {
    this.age = age
  }

  disp(): void {
    console.log(`age: ${this.age}`)
  }

}

let obj = new Person(12)

console.log(obj.age)
console.log(obj.disp())
  // Person 类
  class Person {
    name: string;
    sayHello() {
        console.log('tag', `Helo ${ this.name }!`)
    }
}

// Student 类
class Student {
    grade: number;

    study() {
        console.log('tag', ' I need Study!')
    }
}

class SmartObject implements Person, Student {

  // Person
  name: string = 'person';
  sayHello: () => void;
  // Activatable
  grade: number = 3;
  study: () => void;
}

  // 把mixins混入定义的类
  applyMixins(SmartObject, [Person, Student]);


  // applyMixins 方法
  function applyMixins(derivedCtor: any, baseCtors: any[]) {
      baseCtors.forEach(baseCtor => {
          Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            console.log(derivedCtor.prototype[name], 'derivedCtor.prototype[name]')
              derivedCtor.prototype[name] = baseCtor.prototype[name];
          })
      });
  }
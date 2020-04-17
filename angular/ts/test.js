// Person 类
var Person = /** @class */ (function () {
    function Person() {
    }
    Person.prototype.sayHello = function () {
        console.log('tag', "Helo " + this.name + "!");
    };
    return Person;
}());
// Student 类
var Student = /** @class */ (function () {
    function Student() {
    }
    Student.prototype.study = function () {
        console.log('tag', ' I need Study!');
    };
    return Student;
}());
var SmartObject = /** @class */ (function () {
    function SmartObject() {
        // Person
        this.name = 'person';
        // Activatable
        this.grade = 3;
    }
    return SmartObject;
}());
// 把mixins混入定义的类
applyMixins(SmartObject, [Person, Student]);
// applyMixins 方法
function applyMixins(derivedCtor, baseCtors) {
    baseCtors.forEach(function (baseCtor) {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
            console.log(derivedCtor.prototype[name], 'derivedCtor.prototype[name]');
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}

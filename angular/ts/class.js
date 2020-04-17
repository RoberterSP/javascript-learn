var Person = /** @class */ (function () {
    function Person(age) {
        this.age = age;
    }
    Person.prototype.disp = function () {
        console.log("age: " + this.age);
    };
    return Person;
}());
var obj = new Person(12);
console.log(obj.age);
console.log(obj.disp());

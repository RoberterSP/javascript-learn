const EventEmitter = require('events')
const path = require('path')

class Persion extends EventEmitter {
    constructor () {
        super()
        this.age = 0
    }
    group () {
        this.age++
        this.emit('group')
    }
}
let p1 = new Persion()
p1.on('event', (a, b) => {
    // console.log(a, b, this, this === p1);
  });
p1.addListener('group', () => {
    // console.log('123')
})
p1.group()
p1.emit('event', 'a', 'b');
let aa = path.parse('/index/ceshi.html')
aa = JSON.stringify(aa)

// console.log(`extname of name ${path.extname('1.html')}`)
console.log(`parse of path ${aa}`)

    
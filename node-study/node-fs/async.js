const wait1 = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
            console.log("1s later")
        }, 1000)
    })
}

const wait2 = () => {
    return new Promise((resolve) => {
        resolve(setTimeout(() => { console.log("2s later") }, 2000))
    })
}
async function test() {
    const a = await wait1()
    const b = await wait2()
    console.log("end")
}
console.log("start")
test()
function findData() {
    return new Promise(resolve => {
        setTimeout(() => resolve("long_time_value"), 1000);
    });
}


async function test1() {
    const v = await findData();
    console.log(v);
}


test1();
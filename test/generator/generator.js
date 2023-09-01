function timeoutAsync(millionSeconds) {
    return new Promise((res, rej) => {
        setTimeout(() => {
            res(1);
        }, millionSeconds);
    });
}

function* generatorFunc() {
    yield 1
    yield timeoutAsync(1000)
    yield Math.pow(2, 2)
    yield 2
}

async function test() {
    let gen = generatorFunc();
    let a = gen.next();
    console.log(`gen.next a=`, a);
    let b = gen.next();
    let bResult = await b.value;
    console.log(`gen.next b=`, b, `bResult = ${bResult}`);
    let c = gen.next();
    console.log(`gen.next c=`, c);
    let d = gen.next();
    console.log(`gen.next d=`, d);
    console.log(gen.next());
}
test();

---
title: generator函数与Async/await函数
date: 2023-09-01 11:32:52
tags:
    - Koa
    - Javascript
categories:
    - Koa
    - Javascript
---

## 一 概述

generator函数是一个迭代器

## 二 详情

Generator 函数是ECMAScript 6（ES6）中的一种特殊类型的函数，它能够产生迭代器（Iterator）。与普通的函数不同，Generator 函数可以暂停执行并随时恢复执行，而不会丢失函数的内部状态。这使得它们在处理异步操作、流控制和延迟执行方面非常有用。

Generator 函数通过使用特殊的关键字 function* 来声明，并在函数体内部使用 yield 表达式来暂停函数的执行并返回一个产生的值。每次调用 yield 都会暂停函数的执行，同时返回一个迭代器对象，您可以使用该迭代器对象来恢复函数的执行。调用生成器函数不会立即执行函数体，而是返回一个生成器对象，您需要显式地调用该生成器对象的 next() 方法来触发函数的执行。

简单来说：Generator函数是一个迭代器。

一个Generator函数的例子：
```javascript
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

```

结合以上例子，我们来总结一下generator函数的用法：
1. generator函数需要用“*”来声明
2. yield 后面需要跟的是可被迭代的东西 ，数值，表达式都行
3. 如果yield后面跟一个promise，那么执行时迭代到这里，next中的value也是一个promise，需要自己手动去await执行
4. 每次next，都会返回一个对象，该对象中的value表示被迭代的值，done表示是否完毕
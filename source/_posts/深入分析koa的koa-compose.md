---
title: 深入分析koa的koa-compose
date: 2023-08-31 12:25:21
tags:
  - Koa
comments: true
categories: 
  - Koa
---
#### 一：简介
koa-compose 是koa用来合并中间件的工具，并且在中间件内部，原各个中间件的执行过程为洋葱式的。
本文我们从源码的角度，去看洋葱式是什么？它又是如何实现的？

#### 二：源码
```javascript
function compose (middleware) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }

  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */

  return function (context, next) {
    // last called middleware #
    let index = -1
    return dispatch(0)
    function dispatch (i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i]
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve()
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}
```
源码精简
```javascript
function compose (middleware) {
  return function (context, next) {
    // last called middleware #
    let index = -1
    return dispatch(0)
    function dispatch (i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i]
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve()
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}
```
源码中的重要逻辑：
* 返回值为一个中间件A
* 中间件数组的执行，是从第一个开始的
* 执行某中间件时，同时传入了下一个中间件（赋值为next），并通过调用next来执行该中间件
* 数组中中间件执行完毕后，执行A的下一个中间件

#### 三：next与洋葱模型
上回说到，next是用来执行下一个中间件的，那么在某中间件中，next的执行可能有以下情况

##### 3.1 在最开始调用
```javascript
let md1 = async function (ctx, next) {
    await next();
    console.log(1);
    console.log(2);
}

let md2 = async function (ctx, next) {
    await next();
    console.log(3);
    console.log(4);
}

let mds = compose([md1, md2]);
mds({}, null).then(() => {
    console.log('all finished');
}).catch(e => {
    console.error(e);
});
```
输出：
```
3
4
1
2
all finished
```

##### 3.2 在中间调用
```javascript
let md1 = async function (ctx, next) {
    console.log(1);
    await next();
    console.log(2);
}

let md2 = async function (ctx, next) {
    console.log(3);
    await next();
    console.log(4);
}

let mds = compose([md1, md2]);
mds({}, null).then(() => {
    console.log('all finished');
}).catch(e => {
    console.error(e);
});
```
输出：
```
1
3
4
2
all finished
```
##### 3.3 在末尾调用
```javascript
let md1 = async function (ctx, next) {
    console.log(1);
    console.log(2);
    await next();
}

let md2 = async function (ctx, next) {
    console.log(3);
    console.log(4);
    await next();
}

let mds = compose([md1, md2]);
mds({}, null).then(() => {
    console.log('all finished');
}).catch(e => {
    console.error(e);
});
```
输出：
```
1
2
3
4
all finished
```
##### 3.4 总结
由于以下两条显而易见的规则：
* 在某中间件内，next之前的代码先于next之后的代码执行
* 对某中间件来说，next执行完毕的标志，是其后所有的中间件均执行完毕

故而中间件执行的过程有以下特征：
* 先执行各个中间件next之前的代码，再执行各个中间件next之后的代码
* 各中间件next之前的代码，执行顺序为按照中间件顺序，从前向后
* 各中间件next之后的代码，执行顺序为按照中间件顺序，从后向前

最后祭出那颗著名的葱：

![洋葱模型](/pic/yangcong.jpg)


参考:
https://github.com/koajs/compose.git


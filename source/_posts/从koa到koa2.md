---
title: 从koa到koa2
date: 2023-08-31 15:39:49
tags: 
  - Koa
categories: 
  - Koa
---

## 一： Koa2简介及与Koa1的区别
Koa2是Koa1框架的升级版本，目前已经是koa的默认版本；
相较于Koa1，Koa2引入了一些重要的变化和改进。以下是Koa2相对于Koa1的一些区别：

1. Koa 1 使用 Generator 函数来处理中间件和异步操作，而 Koa 2 直接支持 async/await，让中间件的编写和理解更加简洁明了

下面我们从使用的角度分别分析：

## 二：Koa2的Async/Await支持
现在我们使用koa1来实现一个中间件，该如何做呢？
```javascript
const koa = require('koa');
const app = koa();

app.use(function * (next) {
  console.log('Middleware 1: Before async operation');
  yield someAsyncFunction(); // Yielding async operation
  console.log('Middleware 1: After async operation');
  yield next;
});

app.use(function * () {
  console.log('Middleware 2');
});

app.listen(3000);

```

koa2:
```javascript
const Koa = require('koa');
const app = new Koa();

app.use(async (ctx, next) => {
  console.log('Middleware 1: Before async operation');
  await xxxx(); // Await async operation
  console.log('Middleware 1: After async operation');
  await next();
});

app.use(async (ctx) => {
  console.log('Middleware 2');
});

app.listen(3000);

```
Koa2的中间件函数采用 async (ctx, next) => {...}，而在 Koa1中是function * (next) {...}。Koa2直接支持Async/Await，使得中间件的编写和理解更加简洁。
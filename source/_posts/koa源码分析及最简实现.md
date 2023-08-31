---
title: koa源码学习及最简实现
date: 2023-08-31 11:19:49
tags: Koa,Node.js
comments: true
categories: Node.js
---

#### 一：简介
koa是基于nodejs平台的下一代web框架（官网描述）
官网地址：https://koa.bootcss.com/
git地址：https://github.com/koajs/koa.git
koa提供基于http服务的最简的框架模型，包括洋葱式的中间件处理逻辑、对请求和响应的封装等。
#### 二：使用
```javascript
const Koa = require('koa');

let koa = new Koa();

koa.use((ctx, next) => {
    console.log(ctx.request.url);
    ctx.body = { code: 200, success: true };
});

koa.listen(5000);
console.log('server listen 5000');
```
#### 三：源码
源码的lib下共四个文件：application.js，context.js，request.js，response.js
##### 3.1 application.js
application.js是暴露给外部的入口，关键代码：
###### 3.1.1 use
```javascript
  use(fn) {
    if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
    if (isGeneratorFunction(fn)) {
      deprecate('Support for generators will be removed in v3. ' +
                'See the documentation for examples of how to convert old middleware ' +
                'https://github.com/koajs/koa/blob/master/docs/migration.md');
      fn = convert(fn);
    }
    debug('use %s', fn._name || fn.name || '-');
    this.middleware.push(fn);
    return this;
  }
```
use方法接收中间件（即函数），并将其放入middleware数组中；
return this，用于支持use的链式调用；
###### 3.1.2 listen

```javascript
  listen(...args) {
    debug('listen');
    const server = http.createServer(this.callback());
    return server.listen(...args);
  }
```
koa提供的服务，本质上是nodejs的http模块提供的。koa定义了自己的callback函数用来接收请求和返回结果；
```javascript
  callback() {
    const fn = compose(this.middleware);

    if (!this.listenerCount('error')) this.on('error', this.onerror);

    const handleRequest = (req, res) => {
      const ctx = this.createContext(req, res);
      return this.handleRequest(ctx, fn);
    };

    return handleRequest;
  }
```
compose函数是koa-compose提供的，其作用是将多个中间件整理成一个中间件，在此中间件内部，原来的多个中间件的执行过程是洋葱式的；
createContext的作用是封装req,res为一个context对象，该对象经handleRequest函数传入每一个中间件；
```javascript
  handleRequest(ctx, fnMiddleware) {
    const res = ctx.res;
    res.statusCode = 404;
    const onerror = err => ctx.onerror(err);
    const handleResponse = () => respond(ctx);
    onFinished(res, onerror); 
    return fnMiddleware(ctx).then(handleResponse).catch(onerror);
  }   
```
当所有中间件执行完毕，调用handleResponse函数，来返回结果

##### 3.2 context.js
包含createContext的返回对象相关的一些方法
##### 3.3 request.js
基于http.createServer中callback内的参数 req，封装了一些方法
##### 3.4 response.js
基于http.createServer中callback内的参数 res，封装了一些方法

#### 四：最简实现
假设不考虑参数验错，req和res封装等，最简的类koa模型应该具备以下特征
* 支持增加中间件
* 中间件的执行流程为洋葱式
* context传入每个中间件，以实现中间件间的数据共享
* 具备处理各种事件的能力，如error事件

```javascript
'use strict';

const Emitter = require('events');
const http = require('http');
const compose = require('koa-compose');

class SimpleKoa extends Emitter{
    constructor() {
        super();
        this.middleware = [];
    }

    use(fn) {
        this.middleware.push(fn);
        return this;
    }

    listen(...args) {
        const server = http.createServer(this.callback());
        server.listen(...args);
    }

    callback() {
        if (!this.listenrCount('error')) this.on('error', (error) => console.error(error));
        let fn = compose(this.middleware);
        const handleRequest = (req, res) => {
            let ctx = {
                req,
                res
            };
            return this.handleRequest(ctx, fn);
        }
        return handleRequest;
    }

    handleRequest(ctx, fnMiddleware) {
        return fnMiddleware(ctx);
    }
}
```

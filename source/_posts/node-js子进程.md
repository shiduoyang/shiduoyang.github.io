---
title: node.js子进程
date: 2023-09-11 17:00:11
tags:
    - Node.js
categories:
    - Node.js
---


## 一： 子进程概述
在Node.js中，子进程是指由主Node.js进程启动的独立的操作系统进程。这些子进程可以执行独立的任务、脚本或外部命令，与主进程并行运行，从而充分利用多核处理器和执行并发任务。
Node.js提供了child_process模块，其中包含多种方法来创建、控制和与子进程进行交互。以下是一些常见的用例：

* 执行外部命令： child_process.spawn或child_process.exec
* 运行独立脚本： child_process.fork创建一个新的Node.js进程，该进程可以运行独立的JavaScript脚本文件。这通常用于创建并发的Node.js进程来处理不同的任务。
* 进程间通信： child_process.send和process.on('message')等方法在父子进程之间传递消息和数据。
* 并行处理： 通过创建多个子进程，你可以并行处理任务，提高程序性能。这对于处理大量请求或计算密集型任务非常有用。

## 二：如何创建子进程

### 2.1 spawn 用来执行外部命令
```javascript
const { spawn } = require('child_process');

// 执行 ls 命令
const ls = spawn('ls', ['-l']);

// 处理子进程的输出
ls.stdout.on('data', (data) => {
  console.log(`子进程输出：${data}`);
});

// 处理子进程的错误
ls.stderr.on('data', (data) => {
  console.error(`子进程错误：${data}`);
});

// 子进程退出时触发
ls.on('close', (code) => {
  console.log(`子进程退出，退出码 ${code}`);
});

```
### 2.2 fork 用来创建子进程并执行node.js文件
```javascript
const { fork } = require('child_process');

// 在子进程中执行 child.js 文件
const child = fork('child.js');

// 父进程发送消息给子进程
child.send({ message: 'Hello from parent' });

// 处理子进程发送的消息
child.on('message', (message) => {
  console.log(`父进程接收到消息：${JSON.stringify(message)}`);
});

// 子进程退出时触发
child.on('close', (code) => {
  console.log(`子进程退出，退出码 ${code}`);
});
```
### 2.3 exec 来执行外币命令，与spawn不同的是它传输整个的命令字符串
```javascript
const { exec } = require('child_process');

// 执行 ls 命令
exec('ls -l', (error, stdout, stderr) => {
  if (error) {
    console.error(`执行错误：${error}`);
    return;
  }

  console.log(`子进程输出：${stdout}`);
  console.error(`子进程错误：${stderr}`);
});
```
## 三：主进程与子进程之间如何通讯

1. 主进程与子进程之间通过child_process模块提供的函数来通讯
2. 通过网络请求来通讯，如TCP，具体用法是在子进程创建一个tcp客户端，连接到主进程的tcp服务器上。
3. 一些共享内存的模块如shared-memory
4. 通过文件来交换数据


以下是child_process来实现父子进程通讯的例子
```javascript
const { fork } = require('child_process');

// 创建子进程
const child = fork('child.js');

// 向子进程发送消息
child.send({ message: 'Hello from the main process' });

// 监听来自子进程的消息
child.on('message', (message) => {
  console.log(`主进程收到消息：${JSON.stringify(message)}`);
});
```
使用child_process的相关方法，进程之间通讯的方法
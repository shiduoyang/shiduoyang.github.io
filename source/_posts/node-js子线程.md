---
title: node.js子线程
date: 2023-09-11 17:10:46
tags:
    - Node.js
categories:
    - Node.js
---
## 一：概述
在Node.js中，子线程（Child Threads）通常是指通过worker_threads模块创建的独立线程。这些子线程允许你在Node.js应用程序中执行并行计算任务，从而充分利用多核处理器，并提高性能。

相关概念：
1. worker_threads 模块： Node.js的核心模块中包含了worker_threads，该模块允许你创建和管理子线程。通过这个模块，你可以在独立的线程中运行JavaScript代码。
2. 线程与进程的区别： 子线程是运行在主Node.js进程内部的额外线程，与主进程共享内存空间。与子进程不同，子线程不是独立的操作系统进程。这意味着**子线程之间可以共享数据和资源**，但也需要谨慎处理共享数据以避免竞态条件等问题。
3. 多核处理器利用： 子线程适用于需要执行计算密集型任务的场景，例如图像处理、数据分析、加密等。通过将这些任务分配给子线程，可以充分利用多核处理器的性能。
4. 通信和同步： 主线程和子线程之间可以通过消息传递进行通信，就像主进程和子进程之间的通信一样。worker_threads模块提供了postMessage和on('message')等方法来实现消息传递。

## 二：示例

```javascript
const { Worker, isMainThread, parentPort } = require('worker_threads');

if (isMainThread) {
  // 主线程代码
  const worker = new Worker(__filename);

  // 监听子线程的消息
  worker.on('message', (result) => {
    console.log(`主线程收到计算结果：${result}`);
  });

  // 向子线程发送消息，触发计算
  worker.postMessage({ num1: 5, num2: 10 });
} else {
  // 子线程代码
  parentPort.on('message', ({ num1, num2 }) => {
    console.log(`子线程收到任务：计算 ${num1} * ${num2}`);

    // 执行复杂计算
    const result = num1 * num2;

    // 向主线程发送计算结果
    parentPort.postMessage(result);
  });
}
```
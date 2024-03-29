---
title: node.js事件循环
date: 2023-09-09 22:49:26
tags:
  - Node.js
categories:
    - Node.js
---

## 一：概述
node.js的事件循环，是node.js非阻塞IO的原因，因为非阻塞IO，node.js获得了高性能。

## 二：事件循环的阶段
事件循环的每一个阶段，都有一个队列来执行回调。

* timer ： 处理 setTimeout 和setInterval 回调
* pending callback：执行推迟到下一个事件循环的io回调
* idle prepare：仅内部使用
* poll: 检索新的 I/O 事件;执行与 I/O 相关的几乎任何回调（如网络请求，数据库查询，文件读取）;在适当的时机在此处暂停
* check 处理setImmediately回调
* close：处理一些关闭回调，如socket.on('close')回调

宏任务在不同的队列中被执行，处于事件循环的不同阶段
微任务穿插在每一种宏任务之间，即微任务在不同阶段之间执行

* 执行process.nexttick就绪的任务
* 查看有没有就绪的微任务，如果有，拿出来全部执行

### 2.2 微任务与宏任务
宏任务：
* setTimeout
* setInterval
* I/O
微任务:
* promises
* process.nextTick
* Object.observe

每个事件循环迭代包括以下步骤：
执行宏任务
执行所有微任务
<!-- 

检查是否有宏任务需要执行。如果有，**执行一个宏任务**。
执行当前事件循环迭代中的**所有微任务（Micro Task）**。
  * 先执行process.nextTick回调
  * 然后执行promise -->


参考：
https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick
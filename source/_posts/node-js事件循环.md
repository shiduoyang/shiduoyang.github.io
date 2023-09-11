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

process.nextTick队列：执行process.nextTick回调
微任务队列：执行微任务回调，如promise
* timer ： 处理 setTimeout 和setInterval 回调
* pending callback：系统级回调函数
* idle prepare：与node.js核心和性能优化有关
* poll: 检索新的 I/O 事件;执行与 I/O 相关的几乎任何回调（如网络请求，数据库查询，文件读取）;在适当的时机在此处暂停
* check 处理setImmediately回调
* close：处理一些关闭回调，如socket.on('close')回调

源码如下：
```javascript
int uv_run(uv_loop_t* loop, uv_run_mode mode) {
  int timeout;
  int r;
  int can_sleep;

  r = uv__loop_alive(loop);
  if (!r)
    uv__update_time(loop);

  /* Maintain backwards compatibility by processing timers before entering the
   * while loop for UV_RUN_DEFAULT. Otherwise timers only need to be executed
   * once, which should be done after polling in order to maintain proper
   * execution order of the conceptual event loop. */
  if (mode == UV_RUN_DEFAULT && r != 0 && loop->stop_flag == 0) {
    uv__update_time(loop);
    uv__run_timers(loop);//是一个最小堆
  }

  while (r != 0 && loop->stop_flag == 0) {
    can_sleep =
        uv__queue_empty(&loop->pending_queue) &&
        uv__queue_empty(&loop->idle_handles);

    uv__run_pending(loop);// pending
    uv__run_idle(loop);// idle
    uv__run_prepare(loop);// prepare

    timeout = 0;
    if ((mode == UV_RUN_ONCE && can_sleep) || mode == UV_RUN_DEFAULT)
      timeout = uv__backend_timeout(loop);

    uv__metrics_inc_loop_count(loop);

    uv__io_poll(loop, timeout);// poll io

    /* Process immediate callbacks (e.g. write_cb) a small fixed number of
     * times to avoid loop starvation.*/
    for (r = 0; r < 8 && !uv__queue_empty(&loop->pending_queue); r++)
      uv__run_pending(loop);

    /* Run one final update on the provider_idle_time in case uv__io_poll
     * returned because the timeout expired, but no events were received. This
     * call will be ignored if the provider_entry_time was either never set (if
     * the timeout == 0) or was already updated b/c an event was received.
     */
    uv__metrics_update_idle_time(loop);

    uv__run_check(loop);
    uv__run_closing_handles(loop);

    uv__update_time(loop);
    uv__run_timers(loop);

    r = uv__loop_alive(loop);
    if (mode == UV_RUN_ONCE || mode == UV_RUN_NOWAIT)
      break;
  }

  /* The if statement lets gcc compile it to a conditional store. Avoids
   * dirtying a cache line.
   */
  if (loop->stop_flag != 0)
    loop->stop_flag = 0;

  return r;
}

```

### 2.3 微任务与宏任务
宏任务：
* setTimeout
* setInterval
* I/O
微任务:
* promises
* process.nextTick
* Object.observe

每个事件循环迭代包括以下步骤：
执行当前事件循环迭代中的**所有微任务（Micro Task）**。
检查是否有宏任务需要执行。如果有，**执行一个宏任务**，然后返回步骤1。
如果没有待执行的宏任务，事件循环迭代结束。

### 2.2 事件循环源码解析


参考：
https://blog.risingstack.com/node-js-at-scale-understanding-node-js-event-loop/
https://nodejs.org/zh-cn/docs/guides/event-loop-timers-and-nexttick
http://docs.libuv.org/en/v1.x/poll.html
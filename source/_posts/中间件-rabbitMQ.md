---
title: rabbitMQ概述
date: 2023-09-11 17:30:38
tags:
    - RabbitMQ
categories:
    - RabbitMQ

---

## 是什么
RabbitMQ是一个开源的消息代理软件，用来在不同系统之间进行异步通讯

## 特性
1. 消息队列
2. 消息路由：根据路由键将消息路由到不同的队列中
3. 可靠性与持久化：保证消息不丢失，支持将消息持久化到磁盘上
4. 高可用性与可扩展
5. 灵活的插件系统

## 使用场景
* 异步通信
* 任务队列
* 发布订阅模式
* 日志收集与分析
* 应用程序集成：解耦
* 微服务架构
* 流式处理

## 业务适用场景示例

生产者生成任务 到任务队列中，然后去干别的事
消费者从任务队列中取出任务，处理，然后发送确认消息（或采用其他形式的通信给生产者告知任务完成）
生产者监听到确认消息，执行该任务的收尾工作

## 使用方法

1. 生产者：
```javascript
const amqp = require('amqplib');

async function produceMessage() {
  try {
    const connection = await amqp.connect('amqp://localhost'); // RabbitMQ服务器的地址
    const channel = await connection.createChannel();
    const queue = 'hello';

    const message = 'Hello, RabbitMQ!';

    // 声明一个队列，如果队列不存在则创建
    await channel.assertQueue(queue, { durable: false });

    // 发送消息到队列
    channel.sendToQueue(queue, Buffer.from(message));
    console.log(`[x] Sent '${message}'`);

    // 关闭连接
    await channel.close();
    await connection.close();
  } catch (error) {
    console.error(error);
  }
}

produceMessage();

```
2. 消费者
```javascript
const amqp = require('amqplib');

async function consumeMessage() {
  try {
    const connection = await amqp.connect('amqp://localhost'); // RabbitMQ服务器的地址
    const channel = await connection.createChannel();
    const queue = 'hello';

    // 声明一个队列，如果队列不存在则创建
    await channel.assertQueue(queue, { durable: false });

    console.log(`[*] Waiting for messages in ${queue}. To exit press CTRL+C`);

    // 接收消息
    channel.consume(queue, (message) => {
      console.log(`[x] Received '${message.content.toString()}'`);
      channel.ack(message); // 发送确认消息，rabbitMQ收到该消息后会删除该消息
    }, 
    { 
      noAck: false 
    });
  } catch (error) {
    console.error(error);
  }
}

consumeMessage();

```

3. 常用示例

3.1 消息持久化
消息数据被持久化的保存在磁盘中，直到用户确认消费为止
``` javascript
channel.sendToQueue(queue, Buffer.from('Hello world'), { persistent: true });

```
3.2 队列持久化
队列的元数据被持久的保存在磁盘中。
```javascript
channel.assertQueue('myQueue', { durable: true });
```

## 架构
RabbitMQ的组成和架构包括以下核心组件：

1. Broker：
Broker是RabbitMQ的核心组件，负责接收、存储和传递消息。它包括了Exchange、Queue、Channel等子组件。

2. Exchange：
Exchange是消息的分发中心，它根据规则将消息路由到一个或多个队列。Exchange有不同的类型，包括Direct、Fanout、Topic等。

3. Queue：
Queue是消息的缓冲区，存储待处理的消息。多个消费者可以订阅同一个队列，但只有一个消费者会接收到特定消息。

4. Channel：
Channel是在连接中创建的虚拟连接，用于在客户端和Broker之间传递消息。它可以看作是在连接中的独立工作线程，用于提高消息传递效率。

5. Producer和Consumer：
Producer是生产者，负责将消息发布到Exchange。Consumer是消费者，负责从Queue获取并处理消息。

## 四：一些问题
1. rabbitMQ是否支持接收历史信息

RabbitMQ默认情况下不会保留历史消息数据，这意味着一旦消息被消费者接收并确认（Acknowledge），**它们将被删除，不再可用**。这种行为是为了保持消息队列的高性能和低延迟。

然而，如果实在想要接收历史消息，怎么办？
* 持久化消息。在消息发布时将persistent设置为true
* 使用消息日志
* 使用消息记录器
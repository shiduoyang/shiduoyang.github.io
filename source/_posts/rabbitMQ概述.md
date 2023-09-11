---
title: rabbitMQ概述
date: 2023-09-11 17:30:38
tags:

---

## 一：概述
RabbitMQ是一个开源的消息代理软件，用于实现高级消息队列协议（AMQP）和其他消息传递协议。它为应用程序提供了一种可靠、异步的消息传递机制，允许不同的组件之间进行通信。在本文中，我们将深入了解RabbitMQ，包括它的基本概念、使用方式以及其组成和架构。

rabbitMQ用来解耦应用程序组件，从而太高可伸缩性与可维护性。

## 二：使用
RabbitMQ的使用方式非常简单，它基于以下几个核心概念：

1. 生产者（Producer）：
生产者是负责将消息发送到RabbitMQ的应用程序。它将消息发布到一个或多个消息队列，并指定消息的内容和目标队列。

2. 消息队列（Queue）：
消息队列是RabbitMQ中的中间存储区域，用于存储待处理的消息。生产者将消息发布到队列，而消费者从队列中获取消息并进行处理。

3. 消费者（Consumer）：
消费者是订阅队列并接收消息的应用程序。它们从队列中获取消息，然后执行特定的处理逻辑。

4. 消息路由：
RabbitMQ提供了丰富的消息路由和过滤功能，允许消息根据一定的规则被路由到一个或多个队列。

5. 交换机（Exchange）：
交换机是用于决定消息应该被发送到哪个队列的组件。它根据一定的规则将消息路由到队列。


使用实例，用node.js：

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
    }, { noAck: true });
  } catch (error) {
    console.error(error);
  }
}

consumeMessage();

```

## 三：组成
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
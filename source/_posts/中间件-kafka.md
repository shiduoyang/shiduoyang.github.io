---
title: 中间件-kafka
date: 2023-09-19 17:50:12
tags:
  - Kafka
categories:
  - Kafka
---

## 是什么
一个高吞吐量的发布订阅消息系统，被用来处理大规模的数据流。

## 特性

* 持久性
* 分区
* 复制
* 容错

## 使用场景
用来处理大规模数据流，构建实时数据处理系统，实现异步通信和事件驱动架构

* 实时日志收集和分析
* 构建事件驱动的服务架构
* 实时处理和分析大规模的数据流

## 业务使用场景示例

以处理游戏中的日志 item_change为例

topic = serverName_item_change 按日志来源来分区
partitionKey = 用户ID、或者对消息进行hash，确保消息在分区中均匀分布

notes:
* topic 用来确认发往哪个频道
* partitionKey 用来确定消息存在此频道的哪个分区

## 使用方法

生产者
```javascript
const { Producer } = require('node-rdkafka');

const producer = new Producer({
  'metadata.broker.list': 'localhost:9092', // Kafka 服务器地址
});

producer.on('ready', () => {
  console.log('Producer ready');

  // 发送消息
  /**
   * topic
   * partition 用来指定发往哪个分区
   * message
   * key 消息的键值，相同key的消息会被发往相同的分区
   * timestamp 消息的时间戳
   * headers 头信息，用来传一些额外的信息
   */
  producer.produce('my-topic', null, Buffer.from('Hello Kafka!'), null, Date.now());
});

producer.on('delivery-report', (err, report) => {
  if (err) {
    console.error('Delivery failed:', err);
  } else {
    console.log('Message delivered:', report);
  }
});

// 连接 Kafka
producer.connect();

// 等待生产者准备就绪
setTimeout(() => {
  producer.disconnect();
}, 1000);

```

```javascript
const { KafkaConsumer } = require('node-rdkafka');

const consumer = new KafkaConsumer({
  'group.id': 'my-group',
  'metadata.broker.list': 'localhost:9092', // Kafka 服务器地址
});

consumer.on('ready', () => {
  console.log('Consumer ready');

  // 订阅 Topic
  consumer.subscribe(['my-topic']);
});

consumer.on('data', (message) => {
  console.log('Message received:', message.value.toString());
});

// 连接 Kafka
consumer.connect();

// 等待消费者准备就绪
setTimeout(() => {
  consumer.disconnect();
}, 10000);

```
* 创建消费者，需要指定消费者组
* 同一个消费者组的消费者，不会重复消费消息，会尽量均分消息。
* 一个消费者可以订阅多个topic

## 架构

* 消费者
* broker 服务节点
* topic 主题，逻辑容器
* partition 分区 物理存储单元，用于将消息均匀分布在多个broker上
* consumer group 消费者组，同一消费者组分topic中的信息
* zookeeper 协调服务，用来存储kafka集群的元数据，并能将变化及时通知出去

kafka中某个topic的分区，如分3各区，这三个partition会分布在不同的broker上
比如：
* partition1在broker1上
* partition2在broker2上
* partition3在broker3上
然后broker中还会存储partition的副本数据，写入操作只有在写入所有副本之后才算成功，提高容错性和高可用性

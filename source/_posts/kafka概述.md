---
title: kafka概述
date: 2023-09-19 17:50:12
tags:
  - Kafka
categories:
  - Kafka
---



broker 服务节点
topic partition


topic
offset在partition中的序号
副本
record: 包含  topic key value


kafka中zookeeper的作用

作为kafka集群信息和状态的保存者，并能将变化及时通知出去。


```javascript
// Producer.ts
// 声明发送的topic，然后send

import * as kafka from 'kafka-node'

const client = new kafka.KafkaClient({kafkaHost: 'localhost:9092'})

const producer = new kafka.HighLevelProducer(client)
producer.on('ready', function () {
  console.log('Kafka Producer is connected and ready.')
})

// For this demo we just log producer errors to the console.
producer.on('error', function (error) {
  console.error(error)
})

const sendRecord = (objData, cb) => {
  const buffer = Buffer.from(JSON.stringify(objData))

  // Create a new payload
  const record = [
    {
      topic: 'webevents.dev',
      messages: buffer,
      attributes: 1 /* Use GZip compression for the payload */
    }
  ]

  // Send record to Kafka and log result/error
  producer.send(record, cb)
}

let times = 0

setInterval(() => {
  sendRecord({
    msg: `this is message ${++times}!`
  }, (err, data) => {
    if (err) {
      console.log(`err: ${err}`)
    }
    console.log(`data: ${JSON.stringify(data)}`)
  })
}, 1000)


```

```javascript
// Consumer.ts
// 设定侦听的topic，然后on message
import * as kafka from 'kafka-node'

const client = new kafka.KafkaClient({kafkaHost: 'localhost:9092'})

const topics = [
  {
    topic: 'webevents.dev'
  }
]
const options = {
  autoCommit: true,
  fetchMaxWaitMs: 1000,
  fetchMaxBytes: 1024 * 1024
  // encoding: 'buffer'
}
// { autoCommit: false, fetchMaxWaitMs: 1000, fetchMaxBytes: 1024 * 1024 };

const consumer = new kafka.Consumer(client, topics, options)

consumer.on('message', function (message) {

  // Read string into a buffer.
  console.info(`[message]:==:>${JSON.stringify(message)}`)
  const buf = new Buffer(String(message.value), 'binary')
  const decodedMessage = JSON.parse(buf.toString())

  console.log('decodedMessage: ', decodedMessage)
})

consumer.on('error', function (err) {
  console.log('error', err)
})

process.on('SIGINT', function () {
  consumer.close(true, function () {
    process.exit()
  })
})
```

kafka的作用：
作为一个消息队列，又因为它能长久的保存数据，且容量理论上可以无限的大。
可以用于：
1. 流量削峰，比方说秒杀
2. 因为它是一个中间件，因此可以用于解耦
3. 他用一种异步转同步的方式保证了消息消费的顺序性，因此可以用于消除一些并发问题


redis的发布订阅，是推的，消息存入内存，不会持久化。
kafka的发布订阅，是拉的，默认可持久化
rabbitmMQ的发布订阅，是推的，默认不持久化，可以持久化
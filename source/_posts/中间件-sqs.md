---
title: 中间件-sqs
date: 2024-03-29 14:32:26
tags:
---


## 是什么
amazon simple queue service 亚马逊提供的完全托管式消息队列服务

## 特性
* 完全托管
* 可靠性
* 持久性
* 分布式，可扩展性
* 消息队列模型
* 消息确认机制

## 适用场景

* 与rabbitMQ相似

## 使用方法

```javascript
const AWS = require('aws-sdk');

// 设置 AWS 配置
AWS.config.update({ region: 'your-region' });

// 创建 SQS 服务对象
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

// 定义要发送的消息内容
const params = {
  MessageBody: 'Hello from Node.js!',
  QueueUrl: 'your-queue-url' // 替换为你的队列 URL
};

// 发送消息到队列
sqs.sendMessage(params, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Message sent successfully", data.MessageId);
  }
});

```

消费者：
```javascript
const AWS = require('aws-sdk');

// 设置 AWS 配置
AWS.config.update({ region: 'your-region' });

// 创建 SQS 服务对象
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

// 定义接收消息的参数
const params = {
  QueueUrl: 'your-queue-url', // 替换为你的队列 URL
  MaxNumberOfMessages: 10,     // 最多获取 10 条消息
  VisibilityTimeout: 30,       // 消息可见性超时时间（秒）
  WaitTimeSeconds: 0           // 等待时间（秒），设置为 0 表示立即返回
};

// 接收消息
sqs.receiveMessage(params, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else if (data.Messages) {
    console.log("Received messages:", data.Messages);

    // 处理接收到的消息
    data.Messages.forEach(message => {
      console.log("Message:", message.Body);
    });

    // 删除已接收的消息
    const deleteParams = {
      QueueUrl: params.QueueUrl,
      ReceiptHandle: data.Messages[0].ReceiptHandle // 删除第一条消息的句柄
    };
    sqs.deleteMessage(deleteParams, function(err, data) {
      if (err) {
        console.log("Delete Error", err);
      } else {
        console.log("Message Deleted", data);
      }
    });
  } else {
    console.log("No messages available");
  }
});

```
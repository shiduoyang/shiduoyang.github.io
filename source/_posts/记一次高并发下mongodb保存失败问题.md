---
title: 记一次高并发下mongodb保存失败问题
date: 2023-09-19 17:32:32
tags:
  - 系统设计
categories:
  - 系统设计
---

## 一 概述

mongodb在高并发下保存失败，报了version error错误

来自同一用户的请求，A，B,A在未返回之前，B到来了，且A，B在几乎同时，去更新了同一个document。
处理流程较长的请求在处理过程中，如果有一个处理流程较短的请求，就有可能出现上述情况。

解决方案：
加了redlock锁

改进方案：
1. 找一个kafka, 将请求路径及参数发到kafka，然后由server订阅kafka的topic，topic可以是server+serverNum
2. 让客户端做个限制，当之前的请求未返回时，不发送后续的请求。

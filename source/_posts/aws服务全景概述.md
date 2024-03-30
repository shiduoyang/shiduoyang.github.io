---
title: aws服务全景概述
date: 2023-09-15 17:35:32
tags:
    - Aws
categories:
    - Aws
---

## 一：概述

## 二：各产品

* 数据库产品
  * 关系型
    * amazon aurora: 与 MySQL 和 PostgreSQL 兼容的关系数据库，专为云而打造,性能与商用数据库相当，成本只有1/10
    * amazon rds：Amazon Relational Database Service，关系型数据库，支持多种数据引擎，如MySQL、PostgreSQL、Oracle、SQL Server 和 Amazon Aurora
    * amazon redshift：关系型数据仓库
  * 非关系型
    * amazon dynamodb: nosql数据库，被设计为近乎有无限的可拓展性
    * amazon documentDB 兼容mongodb：文档数据库
  * 内存中
    * amazon elastiCache：使用可扩展的缓存服务实现微秒级延迟，与 Redis 或 Memcached 兼容。
    * amazon memoryDB for Redis: 用于提供超快的性能的兼容且持久的内存数据库服务。
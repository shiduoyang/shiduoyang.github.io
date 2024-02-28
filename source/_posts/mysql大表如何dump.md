---
title: mysql大表如何dump
date: 2024-01-17 17:29:21
tags:
 - mysql
categories:
 - mysql
---

## 一：思路
1. 不要锁表
2. 谨防数据一下全部入内存
3. 在非访问高峰期进行
4. 增加dump速度

## 二：可选方案
1. 使用`--single-transaction`选项。启动事务来保证数据的一致性，同时不会锁表
   ```bash
   mysqldump --single-transaction -u 用户名 -p 数据库名 表名 > 大表备份.sql
   ```
2. 使用`--quick`选项，逐行获取数据，而不是将整个结果集加载到内存中。
   ```bash
   mysqldump --quick -u 用户名 -p 数据库名 表名 > 大表备份.sql
   ```
3. 使用`--compress`选项，对远程数据库服务器进行备份时，该选项可以减少传输数据量
   ```bash
   mysqldump --compress -u 用户名 -p 数据库名 表名 > 大表备份.sql
   ```
4. 使用`--where`来分割数据导出，这样可以将一个大表分成多个部分备份。
   ```bash
   mysqldump --where="id < 1000000" -u 用户名 -p 数据库名 表名 > 大表部分1.sql
   ```
5. 使用mydumper/myloader工具，支持多线程导出和导入，可以加快备份和恢复过程
---
title: mysql索引建立指导规则及慢查询分析
date: 2023-09-05 16:08:05
tags:
    - Mysql
categories:
    - Mysql
---

## 一：概述

之前的文章中提到过mysql innodb的索引结构，这篇文章探讨mysql的索引建立规则，即慢查询。

## 二：索引建立规则

1. 满足最左前缀匹配原则。在建立索引时需考虑将来的应用场景，及可能的需求变化。
2. 尽量选择区分度高的列作为索引。区分度 = count(distinct col)  / count(col) ，通俗来说就是相同的值比较少的列
3. 尽量的扩展索引而非新建索引
4. 索引尽量建立在小字段上，一些长的文本字段，不要建立索引

## 三：慢查询如何分析

1. explain 查看执行计划
    ```bash
    explain select * from xxx where xxxx;
    ```
2. 开启慢查询日志
    ```bash
    set global show_query_log = on; # 这种是在交互式命令中的方式，如果数据库重启，这些就会失效，如果需要长期有效，需要修改mysql的配置文件
    show variables like '%long%'; 
    set long_query_time=0.02;// # long_query_time是慢查询的临界值单位秒
    ```
    慢查询日志的样子：
    ![慢查询日志](/pic/manchaxunrizhi.jpg)
    
3. 开启性能详情
    ```bash
    show variables like '%profiling%'
    set profiling = on
    ```

## 四：慢查询的常见原因

1. 没加索引/没用索引导致全表扫描
2. 单表数据量太大。这种情况看下索引设置的到底对不对，要么考虑分表
3. limit 深分页。比方说每页10条，去获取第十万页的数据。 如
    ```SQL
    select * from xx where click > 0 order by id limit 100000,10;
    ```
    即使click加了索引，但因为二级索引的叶子结点保存的是主键的值，每条记录还需要回表查询才能知道是否需要丢弃，在该例子中，需要回表100010次，因此会很慢。
    这种情况下，需要考虑先查出主键ID，再根据主键查出所有字段
    ```SQL
    select * from 
    xxx t1,
    (select id from xxx where click > 0 order by id limit 10000,10) t2
    where t1.id = t2.id;
    ```
4. 排序不当，导致使用filesort查询
    如果  order by xxx 这个xxx不能由查询此sql使用的索引直接完成，mysql就有可能会进行filewort
    * 如查询的数量较少，没有超过系统变量sort_buffer_size的大小，会进行内存排序（快排）
    * 如查询的数量较多，超过了该系统变量，会使用文件进行排序（归并）
    会使用filesort查询的场景
    1. order by 用的字段，不是查询该sql使用到的索引。解决方案：排序字段加索引
    2. 俩排序字段，一个正序，一个倒序，解决方案：可分析需求，然后比方说加个字段，在新的字段上排序，
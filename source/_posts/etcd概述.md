---
title: etcd概述
date: 2023-09-15 16:36:40
tags:
    - Kubernetes
    - Docker
    - Etcd
categories:
    - Etcd
---

## 一：概述
etcd 是一个分布式键值对存储，设计用来可靠而快速的保存关键数据并提供访问。通过分布式锁，leader选举和写屏障(write barriers)来实现可靠的分布式协作。etcd集群是为高可用，持久性数据存储和检索而准备。

## 二：如何使用
以mac，本地集群为例：

```bash
brew search etcd;
brew install etcd; ## 安装
brew services list;
brew services start etcd; ## 运行
brew services stop etcd;
etcdctl endpoint health; ## 检查下是否真的运行

etcdctl put 'name' 'shiduoyang' ## 设置键值对
etcdctl get 'name' ## 获取键对应的值
etcdctl del 'name' 
etcdctl watch 'name' ## 建立长连接，监听key的值变化

## 租约，租约是一段时间，租约到期，附加该租约的key全部到期
etcdctl lease grant 20; ## 定义一个租约，grant类型（creates leases), 20秒到期
etcdctl put --lease=694d8a9802897a11 'name' '123' ## 租约到期以后，该key被删除
```

## 三：如何创建一个etcd集群

以三台机器为例，
架设他们的ip分别是10.0.1.10；10.0.1.11；10.0.1.12；
主机分别是infra0.example.com;infra1.example.com;infra2.example.com;
名字分别是infra0,infra1,infra2;
那么：
```bash
etcd --name infra0 
--initial-advertise-peer-urls http://10.0.1.10:2380 \
--listen-peer-urls http://10.0.1.10:2380 \
--listen-client-urls http://10.0.1.10:2379,http://127.0.0.1:2379 \
--advertise-client-urls http://10.0.1.10:2379 \
--initial-cluster-token etcd-cluster-1 \
--initial-cluster infra0=http://10.0.1.10:2380,infra1=http://10.0.1.11:2380,infra2=http://10.0.1.12:2380 \
--initial-cluster-state new
```

```bash
etcd --name infra1 --initial-advertise-peer-urls http://10.0.1.11:2380 \
--listen-peer-urls http://10.0.1.11:2380 \
--listen-client-urls http://10.0.1.11:2379,http://127.0.0.1:2379 \
--advertise-client-urls http://10.0.1.11:2379 \
--initial-cluster-token etcd-cluster-1 \
--initial-cluster infra0=http://10.0.1.10:2380,infra1=http://10.0.1.11:2380,infra2=http://10.0.1.12:2380 \
--initial-cluster-state new
```

```bash
etcd --name infra2 --initial-advertise-peer-urls http://10.0.1.12:2380 \
--listen-peer-urls http://10.0.1.12:2380 \
--listen-client-urls http://10.0.1.12:2379,http://127.0.0.1:2379 \
--advertise-client-urls http://10.0.1.12:2379 \
--initial-cluster-token etcd-cluster-1 \
--initial-cluster infra0=http://10.0.1.10:2380,infra1=http://10.0.1.11:2380,infra2=http://10.0.1.12:2380 \
--initial-cluster-state new
```

--listen-peer-urls 都是填本机
--listen-client-urls填本机ip
--advertise-client-urls填本机ip
集群信息在inital-cluster中体现

## 三：etcd的存储方案

etcd分为内存存储与磁盘存储
内存存储，存储的内容主要是wa（预写日志 write ahead log）和 索引，堆，等方便查询的数据结构；
磁盘存储，存储snapshot和wa日志。
snapshot是某个时间点etcd的数据快照，这样能及时释放日益增加的wa日志。



## 参考
https://doczhcn.gitbook.io/etcd/index
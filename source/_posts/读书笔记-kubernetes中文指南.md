---
title: 读书笔记-kubernetes中文指南
date: 2023-09-15 14:39:14
tags:
    - 读书笔记
    - Docker
    - Kubernetes
categories: 
    - 读书笔记
---

## 一：容器，容器化，docker,到kubernetes
1. 容器：想象一个集装箱，里面包含有应用程序运行所需的所有组件，且这个集装箱可以跨平台的运行。
2. 容器化：将应用程序放在容器中，以容器为单位进行管理，实现跨平台运行的这种思想，叫做容器化
3. docker：docker是一个容器化工具，用于打包和运行容器
4. kubernetes：kubernetes用于对若干容器组成的集群的管理

## 二：云原生概念与云原生的发展
云原生本身甚至不能称之为一个架构，它首先是一个基础设施，运行于其上的应用程序叫做云原生应用，符合云原生设计哲学的应用架构才叫做云原生架构。

那么云原生的设计哲学是什么呢？
1. 面向分布式设计：容器，微服务，API驱动的开发
2. 面向配置设计：一个镜像，多个环境配置
3. 面向韧性设计：故障容忍和自愈
4. 面向弹性设计：弹性扩展和对负载变化做出反应
5. 面向交付设计：自动拉起，缩短交付时间
6. 面向性能设计：响应式，并发和资源高效利用
7. 面向自动化设计：自动化的devops
8. 面向诊断性设计：集群级别的日志，metic和追踪
9. 面向安全性设计：安全端点，api gateway,端到端加密

总体来说，凡能提升云上资源利用率和应用交付效率的方式和行为，都是云原生的。
云原生的相关概念：微服务，devops, 容器化，持续交付

云原生的发展史：
1. kubernetes开启了云原生的序幕
2. istio服务网格的出现，引领了后kubernetes时代的微服务
3. serverless的再次兴起，使得云原生从基础设施层不断向应用架构层挺近。

## 三：云计算的宏观分类
1. lass: Infrastructure-as-a-service 基础设施服务,etc: computer,coterage,networking,aws,google cloud platform
2. pass: platform-as-a-service,etc: mysql,mongodb,java,node.js
3. sass: software-as-a-service,etc: email,facebook

## 四：kubernetes概念与原理
kubernetes是一个容器编排引擎。它运用了“期望状态”原则，它提供一个规范，让你描述集群的架构，定义服务的最终形态，kubernetes帮你维护这个形态。

### 4.1 kubernetes架构
kubernetes架构，如果从外部来看，可类比为一个有一个集装箱所组成的集群，这些集装箱有不同的类型和功能。

1. 集群。所有组件都是集群的一部分。你也可以创建多个虚拟集群，称为命名空间
2. 节点。节点是集群中的单个机器（对应物理机器或云中的虚拟机），节点是部署应用和服务的地方。有两种节点master和worker
3. 主节点。主节点是控制其他所有节点的特殊节点。主节点的组成：
    * API Server：命令接收
    * Scheduler：调度pod，比方说将某pod调度到某worker执行
    * Controlelr Manager：控制管理各种资源
    * etcd: 用于存储集群信息，在数据发生变化时，及时通知相关组件
    * kubelet：所有节点都有，用于接收来自master的信息，及报告当前节点的状态
    * kubeproxy：所有节点都有，用于将service的流量转发到后端的容器，kubeproxy实现了负载均衡
4. worker节点。集群中真正干活的地方(你的应用程序在此运行), 它托管或运行一个或多个容器
    * kubelet
    * kubeproxy
5. pod。是一个逻辑单位，是kubernetes可调度的最小单位，包含一个或多个容器，构建出一个应用程序。pod运行在node（即节点）上。
6. service。services是一组逻辑上的pod，并提供了一个ip地址和DNS名称，你可以通过它访问service内的所有pod
7. ReplicationController或ReplicaSet。负责实际管理pod的生命周期，在适当的时机创建或杀死pod

网络相关：
8. ingress和egress。把pod看层一个逻辑的服务器，那么从外部进入服务器的流量称为ingress,从服务器出去的叫egress。创建入口策略与出口策略的目的是控制哪些流量能进入服务器，哪些流量能流出服务器。比方说定义9998端口的所有流量，都导入某pod
10. 服务网络。用于管理服务之间的网络流量。 

![kubernetes架构](/pic/kubernetesjiagoutu.jpg)

#### 4.1.1 kubernetes的设计理念

kubernetes的设计理念和功能类似一个linux的分层结构。
![kubernetes分层](/pic/kubernetesfenceng.jpg)

### 4.1.2 kubernetes的资源对象

以下对象都可以在yaml中作为一种api类型来配置
资源对象：
* pod: 可创建和管理的最小单元，一组容器
* Pod ReplicaSet：一组描述，描述了pod需要维护的副本个数 
* ReplicationController 
* Deployment：为pod和replicaSet提供声明式的更新能力
* StatefulSet： 
* DaemonSet 
* Job：
* CronJob : 重复调用的job
* HorizontalPodAutoscaling 
* Node 
* Namespace 
* Service 
* Ingress
* Label 
* CustomResourceDefinition

存储对象：
* Volume
* PersistentVolume 
* Secret 
* ConfigMap

策略对象：
* SecurityContext 
* ResourceQuota 
* LimitRange

身份对象：
* ServiceAccount 
* Role 
* ClusterRole

简单来说，用这些对象来描述三件事：
1. 什么容器化应用在运行，及其在哪个pod上
2. 使用什么资源
3. 表现出什么策略

TODO:


参考：
kubernetes中文指南
https://kubernetes.io/zh-cn/docs/concepts/workloads/controllers/statefulset/
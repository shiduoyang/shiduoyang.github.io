---
title: mysql事务与分布式事务实例
date: 2023-09-15 17:35:54
tags:
    - Mysql
categories:
    - Mysql
---

## 一：如何创建一个事务

```bash
# -- 1. 开始一个新手事物
START TRANSACTION;
# -- 2. 获取最新的订单编号
SELECT 
    @orderNumber:=MAX(orderNUmber)+1
FROM
    orders;
# -- 3. 向145客户插入新订单编号
INSERT INTO orders(orderNumber,
                   orderDate,
                   requiredDate,
                   shippedDate,
                   status,
                   customerNumber)
VALUES(@orderNumber,
       '2005-05-31',
       '2005-06-10',
       '2005-06-11',
       'In Process',
        145);
# -- 4. 插入订单详情
INSERT INTO orderdetails(orderNumber,
                         productCode,
                         quantityOrdered,
                         priceEach,
                         orderLineNumber)
VALUES(@orderNumber,'S18_1749', 30, '136', 1),
      (@orderNumber,'S18_2248', 50, '55.09', 2); 
      
# -- 5. 提交
COMMIT; 
```

在node.js中如何开启一个事务呢？以使用sequelize为例
```JavaScript
// 首先,我们开始一个事务并将其保存到变量中
const t = await sequelize.transaction();

try {
  // 然后,我们进行一些调用以将此事务作为参数传递:
  const user = await User.create({
    firstName: '张',
    lastName: '三'
  }, { transaction: t });

  await user.addSibling({
    firstName: '李',
    lastName: '四'
  }, { transaction: t });
  // 如果执行到此行,且没有引发任何错误.
  // 我们提交事务.
  await t.commit();
} catch (error) {
  // 如果执行到达此行,抛出错误.
  // 我们回滚事务.
  await t.rollback();
}

```
上边的方案是非托管事务，也可以选择托管事务，即回滚操作由sequelize来做。
```javascript
try {
  const result = await sequelize.transaction(async (t) => {
    const user = await User.create({
        firstName: '张',
        lastName: '三'
    }, { transaction: t });
    await user.setShooter({
        firstName: '李',
        lastName: '四'
    }, { transaction: t });
    return user;
  });
  // 如果执行到此行,则表示事务已成功提交,`result`是事务返回的结果
  // `result` 就是从事务回调中返回的结果(在这种情况下为 `user`)
} catch (error) {
  // 如果执行到此,则发生错误.
  // 该事务已由 Sequelize 自动回滚！
}
```

## 二：分布式事务
传统事务，发生在同一个数据库进程中。
分布式事务啥意思呢？就是事务中包含的操作，分布在不同的服务器上。

### 2.1 分布式事务产生的原因：
* 由于服务的拆分，导致了表拆到了不同的服务器上（如优惠券服务，积分服务）
* 由于数据的拆分，导致了表拆到了不同的服务器上（如分库分表）

### 2.2 分布式事务的基础
1. CAP: 一致性，可用性，分区容错性，此三者不能共有
    * C (一致性):对某个指定的客户端来说，读操作能返回最新的写操作。对于数据分布在不同节点上的数据上来说，如果在某个节点更新了数据，那么在其他节点如果都能读取到这个最新的数据，那么就称为强一致，如果有某个节点没有读取到，那就是分布式不一致。
    * A (可用性)：非故障的节点在合理的时间内返回合理的响应(不是错误和超时的响应)。可用性的两个关键一个是合理的时间，一个是合理的响应。合理的时间指的是请求不能无限被阻塞，应该在合理的时间给出返回。合理的响应指的是系统应该明确返回结果并且结果是正确的，这里的正确指的是比如应该返回50，而不是返回40。
    * P (分区容错性):当出现网络分区后，系统能够继续工作。打个比方，这里个集群有多台机器，有台机器网络出现了问题，但是这个集群仍然可以正常工作。

2. BASE：Basically Available(基本可用)、Soft state(软状态)和 Eventually consistent (最终一致性)三个短语的缩写。是对CAP中AP的一个扩展
基本可用:分布式系统在出现故障时，允许损失部分可用功能，保证核心功能可用。
软状态:允许系统中存在中间状态，这个状态不影响系统可用性，这里指的是CAP中的不一致。
最终一致:最终一致是指经过一段时间后，所有节点数据都将会达到一致。

BASE解决了CAP中理论没有网络延迟，在BASE中用软状态和最终一致，保证了延迟后的一致性。BASE和 ACID 是相反的，它完全不同于ACID的强一致性模型，而是通过牺牲强一致性来获得可用性，并允许数据在一段时间内是不一致的，但最终达到一致状态。

###  2.3：分布式事务的实现方案
1. 2pc: 两段提交协议。
    方案：
    1. 事务管理器先要求所有的数据库预提交，并反应是否可以提交
    2. 事务管理器要求所有的数据库提交或者回滚
    劣势：
    1. 单点问题，事务管理器宕机，有可能引起数据库无法使用；
    2. 同步阻塞，准备就绪后，直到提交完成，资源管理器中的资源处于阻塞状态
    3. 数据不一致，如果发送了提交命令，但由于网络原因丢失了，那么数据将不一致
2. 三段提交协议
    TODO
2. tcc（try confirm cancel）： 补偿事务
    方案：
    1. Try阶段：尝试执行,完成所有业务检查（一致性）,预留必须业务资源（准隔离性）
    2. Confirm阶段：确认执行真正执行业务，不作任何业务检查，只使用Try阶段预留的业务资源，Confirm操作满足幂等性。要求具备幂等设计，Confirm失败后需要进行重试。
    3. Cancel阶段：取消执行，释放Try阶段预留的业务资源，Cancel操作满足幂等性Cancel阶段的异常和Confirm阶段异常处理方案基本上一致。
    
    简单来说，先冻结（将某字段置于一个冻结态），然后执行，任何失败了就回滚。


国内的TCC分布式事务框架： ByteTCC、Himly、TCC-transaction

### 2.4：TCC分布式事务框架 事务编写实例

```javascript

```

   







## 参考

https://www.begtut.com/mysql/mysql-transaction.html
https://juejin.cn/post/7061243208491565063
https://juejin.cn/post/6844903647197806605
https://www.cnblogs.com/jajian/p/10014145.html
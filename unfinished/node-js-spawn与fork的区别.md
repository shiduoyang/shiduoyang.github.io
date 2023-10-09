---
title: node.js spawn与fork的区别
date: 2023-09-19 18:32:19
tags:
---


Node.js 里创建子进程有四种不同的方式：spawn(), fork(), exec() 和 execFile()。

spawn用来执行linux命令
exec用来执行linux命令，它缓冲了命令生成的输出，并传递整个输出值给一个回调函数
fork，创建子进程时，通信频道建立与子进程，因此可以父子进程通讯



<!-- 默认情况下，spawn 函数并不为我们传进的命令而创建一个 shell 来执行，这使得它相比创建 shell 的 exec 函数，效率略微更高。exec 函数还有另一个主要的区别，它缓冲了命令生成的输出，并传递整个输出值给一个回调函数（而不是使用流，那是 spawn 的做法）。 -->



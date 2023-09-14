---
title: shell命令概述
date: 2023-09-14 15:00:48
tags:
    - Shell
categories:
    - Shell
---


## 一 shell概述
shell是你（用户）和Linux（或者更准确的说，是你和Linux内核）之间的接口程序。你在提示符下输入的每个命令都由shell先解释然后传给Linux内核。
shell 是一个命令语言解释器（command-language interpreter）。拥有自己内建的 shell 命令集。此外，shell也能被系统中其他有效的Linux 实用程序和应用程序（utilities and application programs）所调用。

## 二 shell命令

| 文件管理 | 命令 | 示例 |
| :-----| :----- | :----- |
| ls | 查询目录中的文件及属性信息 | ls -a |
| cp | 复制文件或目录 | cp -rf ./ ../ |
| mkdir | 创建目录 | mkdir test |
| mv | 移动文件或目录 | mv a.txt ../ |
| pwd | 显示当前目录的路径 | pwd |
| tar | 压缩和解压缩文件 | tar czvf File.tar.gz /etc |


| 文档编辑 | 命令 | 示例 |
| :-----| :----- | :----- |
| cat | 在终端显示文件内容 | cat -n x.txt |
| echo | 输出字符串或提取后的变量值 | echo '123' |
| rm | 删除文件或目录 | rm -rf ./test  |
| grep | 强大的文本搜索工具 | grep -arn 'xxx' ./ |
| tail | 查看文件尾部内容 | tail -f xxx.log |
| rmdir | 删除空目录文件 | rmdir ./dir |

| 系统管理 | 命令 | 示例 |
| :-----| :----- | :----- |
| find | 根据路径和条件搜索指定文件 | find / -name '*.conf' |
| rpm | rmp软件包管理器 | rpm -ivh cockpit-185-2.el8.x86_64.rpm |
| startx | 初始化x-Windows系统  | startx |
| ps | 显示进程状态 | ps aux | grep 4000 |
| uname | 显示系统内核信息 | uname -a |
| resize2fs | 同步文件系统容量到内核 |  |

| 磁盘管理 | 命令 | 示例 |
| :-----| :----- | :----- |
| df | 显示磁盘空间使用量情况 | df -h |
| fdisk | 管理磁盘分区 | fdisk -l  |
| lsblk | 查看系统的磁盘使用情况 |  |
| vgextend | 扩展卷组设备 |  |
| hdparm | 显示与设定硬盘参数 |  |
| pvcreate | 创建物理卷设备  |  |

| 文件传输 | 命令 | 示例 |
| :-----| :----- | :----- |
| tftp | 上传及下载命令 | ftp 192.168.10.10;get File1.txt |
| curl | 文件与传输工具 | curl -X 'POST' localhost:4000/|
| fsck | 检查与修复文件系统 |  |
| lprm | 移除打印队列中的人物 |  |
| ftpwho | 显示FTP会话信息 |  |
| rsync | 远程数据同步工具 | rsync -r /Dir 192.168.10.10:/Dir |

| 网络通讯 | 命令 | 示例 |
| :-----| :----- | :----- |
| ssh | 安全的远程连接服务器 | ssh 192.168.10.10 |
| netstat | 显示网络状态 | netstat -ap | grep ssh |
| dhclient | 动态获取或释放ip地址 |  |
| ifconfig | 显示或设置网络设备参数信息 |  |
| ping | 测试主机间网络连通性 | ping 192.168.10.10 |
| sshd | openssh服务器守护进程 |  |

| 设备管理 | 命令 | 示例 |
| :-----| :----- | :----- |
| mount | 将文件挂载到目录 |  |
| lspci | 显示当前设备PCI总线设备信息 |  |
| sencors | 监测服务器硬件信息 |  |
| setleds | 设置键盘的led灯光状态 |  |
| rfkill | 管理蓝牙和wify设备 |  |
| setpci | 设置PCI硬件设备参数 |  |

| 备份压缩 | 命令 | 示例 |
| :-----| :----- | :----- |
| zip | 压缩文件 |  |
| unzip | 解压缩zip文件  |  |
| gzip | 压缩和解压文件 |  |
| zipinfo | 查看压缩文件信息 |  |
| gunzip | 解压提取文件内容 |  |
| unarj | 解压arj文件 |  |


| 其他命令 | 命令 | 示例 |
| :-----| :----- | :----- |
| hash | 管理命令运行时查询的hash表 |  |
| wait | 等待指令执行完毕 |  |
| wget | 下载网络文件 | wget http://xxxxx/x.log|
| history | 显示与管理历史命令记录 |  |
| bc | 数字计算器 |  |
| rmmod | 移除内核模块 |  |


所以，要想知道某端口的占用情况，有几种方式？
```bash
ps aux | grep 4000
lsof -i:4000
```

常用的命令：
* ps
* curl
* grep
* ssh
* netstat

## 三 参考
参考：https://www.linuxcool.com/
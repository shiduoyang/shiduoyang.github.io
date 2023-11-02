---
title: http之headers与https概述
date: 2023-09-26 08:50:56
tags:
  - Http
categories:
  - Http
---


## 一：概述



## 二：http header
常见字段
1. content-type：
    * text/html ： HTML格式
    * text/plain ：纯文本格式
    * text/xml ： XML格式
    * image/gif ：gif图片格式
    * image/jpeg ：jpg图片格式
    * image/png：png图片格式
    以application开头的媒体格式类型：
    * application/xhtml+xml ：XHTML格式
    * application/xml： XML数据格式
    * application/atom+xml ：Atom XML聚合格式
    * application/json： JSON数据格式
    * application/pdf：pdf格式
    * application/msword ： Word文档格式
    * application/octet-stream ： 二进制流数据（如常见的文件下载）
    * application/x-www-form-urlencoded ： <form encType=””>中默认的encType，form表单数据被编码为key/value格式发送到服务器（表单默认的提交数据的格式）
    另外一种常见的媒体格式是上传文件之时使用的：
    * multipart/form-data ： 需要在表单中进行文件上传时，就需要使用该格式
2. Authorization 鉴权相关
3. Cache-Control 指定请求和响应遵循的缓存机制	
4. Cookie 为辨别用户身份保存在浏览器的缓存数据
5. User-Agent	User-Agent的内容包含发出请求的用户信息	如操作系统版本、CPU 类型、浏览器版本等（爬虫相关）
6. referer 先前网页的地址，即请求的来路	

## 二：http三次握手与四次挥手

http基于TCP建立连接，TCP报文中的相关字段：
1. SYN=1用来标识想建立连接；
2. ACK=1标识这是一条确认报文
3. seq 是序号
4. ack 是确认序号

HTTP三次握手
1. SYN=1 ACK=0 seq=x ack=0 （即想建立TCP连接）
2. SYN=1 ACK=1 seq=y ack=x+1  （服务端回复报文）
3. SYN=0 ACK=1 seq=x+1 ack=y+1  (客户端回复报文)

三次握手的目的，是为了确认双方都有收发能力。

HTTP四次挥手
1. FIN=1 客户端向服务器发
2. ACK=1
3. FIN=1服务器向客户端发
4. ACK=1

## HTTP与HTTPS的区别
HTTPS 使用TLS (SSL) 来加密普通的HTTP 请求和响应，ssl协议也是应用层协议，但它工作在应用层和传输层之间。   
SSL（Secure Sockets Layer安全套接层）

https请求过程，在TCP连接建立之后：
1. 客户端发送支持的加密协议及版本，如SSL TLS
2. 服务端收到后，选择合适的加密协议，返回证书（包含公钥）
3. 客户端收到以后，确定证书的有效性，如有效，生成一个会话秘钥（即一个随机数），用公钥加密它，并发送给服务端
4. 服务端收到以后，用私钥解密，拿到会话秘钥，随后用这个会话秘钥对要发送的数据进行加密
5. 客户端收到以后，用会话秘钥解密，并且解析数据呈现给客户

简单来说，用非对称加密的方式来传输了会话秘钥，后续用会话秘钥来加解密通信内容。

## 参考

https://www.rfc-editor.org/rfc/rfc9110.html#field.content-type
https://cloud.tencent.com/developer/article/1017988
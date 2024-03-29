---
title: nginx-配置loadbalance
date: 2024-03-29 14:37:53
tags:
---

## loadbanlance配置

nginx用upsream模块来实现负载均衡

```config
http {
    upstream backend {
        server 192.168.1.100:80;
        server 192.168.1.101:80;
    }

    server {
        listen 80;

        location / {
            proxy_pass http://backend;
        }
    }
}

```
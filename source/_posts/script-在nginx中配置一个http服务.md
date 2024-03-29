---
title: 'script: 在nginx中配置一个http服务'
date: 2024-02-28 17:05:30
tags:
---


```javascript
const serverPort = 9006;
const serverUrl = 'dev-fb-instant.bubbleshootermvp.com';
const conf = `server {
    listen 80;
    server_name ${serverUrl};
    client_max_body_size 10m;
    charset utf-8;

    gzip on;
    gzip_min_length 1k;
    gzip_buffers 4 16k;
    gzip_http_version 1.0;
    gzip_comp_level 2;
    gzip_types text/plain application/javascript application/x-javascript text/css text/javascript application/xml application/json;
    gzip_vary on;
    gzip_proxied off;
    gzip_disable msie6;

    location / {
        proxy_pass http://127.0.0.1:${serverPort};
        proxy_set_header Host $http_host;
    }
}`;
```
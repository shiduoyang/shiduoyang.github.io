---
title: node.js-流
date: 2024-03-29 15:53:59
tags:
---

```javascript
const fs = require('fs');

const readableStream = fs.createReadStream('input.txt');
const writableStream = process.stdout; // 输出到控制台

readableStream.on('data', (chunk) => {
    writableStream.write(chunk);
});
```

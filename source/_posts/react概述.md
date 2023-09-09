---
title: react概述
date: 2023-09-08 16:40:28
tags:
    - React
categories: 
   - React
---

## 一：概述
react哲学：页面由组件整合而来

## 二：相关概念
1. 如何创建和嵌套组件：
```jsx
function MyButton() {
  return (
    <button>I'm a button</button>
  );
}
export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton />
    </div>
  );
}
```
2. 如何添加标签和样式
```jsx
<img className="avatar" />
/* In your CSS */
.avatar {
  border-radius: 50%;
}
```
3. 如何显示数据
```jsx
const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  imageSize: 90,
};

export default function Profile() {
  return (
    <>
      <h1>{user.name}</h1>
      <img
        className="avatar"
        src={user.imageUrl}
        alt={'Photo of ' + user.name}
        style={{
          width: user.imageSize,
          height: user.imageSize
        }}
      />
    </>
  );
}
```
4. 如何渲染条件和列表
```jsx
<div>
  {isLoggedIn ? (
    <AdminPanel />
  ) : (
    <LoginForm />
  )}
</div>

const listItems = products.map(product =>
  <li key={product.id}>
    {product.title}
  </li>
);
return (
  <ul>{listItems}</ul>
);
```
5. 如何对事件做出响应并更新界面
```jsx
function MyButton() {
  function handleClick() {
    alert('You clicked me!');
  }

  return (
    <button onClick={handleClick}>
      Click me
    </button>
  );
}
// 更新界面
import { useState } from 'react';
function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Clicked {count} times
    </button>
  );
}
```
6. 如何在组件间共享数据
```jsx
function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      Clicked {count} times
    </button>
  );
}

export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counters that update together</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}
```

## 三：生产级的react框架
1. next.js是一个全栈式的 React 框架
```bash
npx create-next-app
```
2. remix是一个具有嵌套路由的全栈式 React 框架
```bash
npx create-remix
```
3. Gatsby是一个快速的支持 CMS（内容管理系统） 的网站的 React 框架
```bash
npx create-gatsby
```
4. expo 用于原生应用
```bash
npx create-expo-app
```

## 参考

react官网：https://zh-hans.react.dev/learn

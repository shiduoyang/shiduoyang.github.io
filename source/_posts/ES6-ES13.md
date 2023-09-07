---
title: ES6-ES13
date: 2023-09-07 11:53:21
tags:
    - Javascript
categories:
    - Javascript
---

## 一：概述
ES6 ES7 ES8的名称由来是啥？
* ES6 就是 ES2015
* ES7 就是 ES2016
* ES8 就是 ES2017
。。。

## 二：各版本的特性
1. ES6的新特性
    * let const 块作用域
    * 箭头函数
    * for of 
    * Map 和 Set
    * class
    * Promise
    * 函数参数默认值
    * ...
    * String.includes startsWith endsWith
    * Array.find findIndex
    * 解构赋值
3. ES7的新特性
    * 2 ** 3 <=> Math.pow(2,3)
    * Array.includes
4. ES8的新特性  ES2017
    * String 的 padStart  padEnd 长度补全  如：‘5’.padStart(4,0)=> '0005'
    * Object.entries 来遍历对象 for(let [k,v] of Object.entries(obj))
    * Object.values
    * async await 函数
5. ES9的新特性
    * 在循环中使用await for(){await xxxxx}
    * Promise.finally
    * 对象剩余属性 允许把除了解构出的属性之外的剩余属性，放到一个新的对象中
        obj = {a:1,b:2,c:3}; let {a,bc}=obj => a=1 bc ={b:2,c:3}
    * 对象扩展属性 允许把对象的所有属性拷贝到另一个对象中
        let c = {...obj} 
6. ES10的新特性
    * String.trimStart trimEnd '    123'.trimStart = '123‘
    * Object fromEntries     通过一个entries来创建对象
    * catch(e){} 如无需访问e，可以改成 catch{...}
    * Array flat 数组展平（降N维），默认降1维
    * Array flatMap 数组展平 + map
    * Array sort
7. ES11的新特性
    * BigInt
    * String matchAll
    * x &&= y  当x 为真时，把Y赋给X
    * x ||= y  当x 为假时，把Y赋给X
    * x ??= y  当x 不存在时，把Y赋给X
    * ?? 空值运算符,前边为空的时候设置成后边的默认值  x= a ?? 0 <=> if(a!=undefined){x=a}else{x=0} 
    * ?.xxx   a.x  a存在时取值, 不存在时返回undefined
8. ES12的新特性
    * Promise.any
    * String replaceAll
    * Numeric Separators
    * 数字分割符  1_0000_0000 = 100000000
9. ES13的新特性 即 ES2012
    * Array at
    * String at
    * await import 
    等等
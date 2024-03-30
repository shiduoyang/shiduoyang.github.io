---
title: 跟我学golang 1:语法与特性
date: 2024-03-06 18:30:18
tags:
---

## 1. 特性

1. 静态类型：有利于类型安全
2. 编译型：go代码直接翻译成机器码，运行速度快
3. 并发编程：通过goruntines 和 channel，内建对并发的支持
4. 自动垃圾回收
5. 反射
6. 语法简洁
7. 函数多返回值
8. 标准库丰富
9. 跨平台：支持多种操作系统和架构，可以在不同的系统上编译运行
   
## 2. 优点
1. 高性能：go的性能接近于C++
2. 快速开发：因语法简洁，标准库丰富，开发速度快
3. 工程化：内置工具链，如格式化，编译，测试工具
4. 易于部署：编译后的可执行文件不需要依赖库或虚拟环境

## 3. 缺点
1. 错误处理较为繁琐，需要显示的检查错误
2. 包管理系统不如其他语言成熟
3. 图形界面方面的支持不如其他语言

## 4. 语法
[go语言之旅](!https://tour.go-zh.org/flowcontrol/11)

1. 变量声明 var a int = 1; b:=2; const Pi = 3.14;
2. 数据类型:
   bool
   string
   int  int8  int16  int32  int64
   uint uint8 uint16 uint32 uint64 uintptr
   float32 float64
   complex64 complex128 复述
   byte // uint8 的别名
   rune // int32 的别名
3. 数据结构
   1. 指针：去掉指针运算的C指针
   2. 结构体：结构体就是一组字段 type Person struct {x int; y int}; p:= Person{1,2} fmt.Println(p.x)
   3. 数组：数组的大小固定 var a [10]int; primes := [6]int{2, 3, 5, 7, 11, 13}
   4. 切片：为数组提供动态灵活的视角，就像数组的引用 var s []int = primes[1:4]; 
      1. 定义：从数组中建立：var s []int = primes[1:4];
      2. 定义：文法：q := []int{2, 3, 5, 7, 11, 13}
      3. 定义：make: a := make([]int, 0, 5)  // len(a)=0 cap(a) = 5
      4. 切片的容量，是切片第一个访问的数据起，一直到原数组的末尾包含的元素数
   5. 映射：map[string]string{"a":"a"}
4. 流程控制
   1. 循环 for i:=0; i<10;i++ {} ;  for {} ;  for i,v := range(arr)
   2. 判断 if a < 0 {}; if a:= 1+1; a > 1 {}
   3. switch a {case a: xxxxx }
   4. defer 将函数推迟到外层函数返回后执行。其参数会立即求值，但延迟调用。通常用来做函数结束时的必须动作.多个defer，后进先出
5. 函数：独立的代码块
   1. 函数作为参数传递
   2. 闭包
6. 方法：绑定到某类型上的函数 
   1. type Person struct{}; 
   2. func (p Person) say() string {return 'hi, im'+p.name}
   3. func (p *Person) setName(s string) void {p.name = s}
   4. 指针接收者访问调用者本身，值接收者访问调用者的副本
   5. 选择指针作为函数接收者的原因
      1. 避免复制
      2. 可直接修改调用者的属性
7. 接口：一组方法定义的集合
   1. 类型通过实现接口定义的所有方法的形式来实现该接口，不需要通过implements显式声明
   2. 空接口可以保存任何值，因为任何值都实现了0个方法
   3. 类型断言 var i interface{} = MyStruct{"hello"}; s,ok:= i.(MyStruct); switch i.(type){case xxxx}
8. 并发编程
   1. goruntine go程 由go运行时管理的轻量级线程，由于不是直接由系统控制，因此创建和管理开销远远小于传统的线程 
   2. channel 信道 v:= make(chan int) v <- 1  x:= <- v fmt.Println(x)
      1. 带缓冲的信道 v:= make(chan int, 100) 仅当信道的缓冲区填满后，才阻塞
      2. range读取信道：for i:= range v {fmt.Println(i)} 不断从v中读取数据，直至它被发送方关闭
      3. select使得一个go程可以等待多个通信操作：select {case c <- x xxxxx case <- quit xxxx default xxx}
9.  错误处理和异常机制
    1.  error 类型是一个内建接口
10. 包的导入与管理
11. 指针与内存分配
12. 方法定义于接收者？
13. defer panic recover 用于异常处理与资源释放
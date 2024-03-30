package main

import "fmt"

func main() {
	var a int = 10
	fmt.Println(a)
}

func swap(a string,b string) (string,string) {
	return b,a
}

func fibonacci() func() int {
	lastTwo:=-1
	lastOne:=-1
	return func() int{
	 if lastTwo == -1 {
	 	lastTwo = 0
		return 0
	 }
	 if lastOne == -1 {
	 	lastOne = 1
		return 1;
	 }
	 current := lastTwo + lastOne;
	 lastTwo = lastOne;
	 lastOne = current
	 return current;
	}
}
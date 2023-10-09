let obj = { a: 1 };

function a(o) {
    o = null;
}

a(obj);
exports.func = a;
module = { a: 1, b: 2, c: 3 };

module.xxx = 123;
// 所以直接在模块中调用module={xxxx}是不好使的
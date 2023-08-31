const koa = require('koa');
const app = koa();

app.use(function* (next) {
    console.log('Middleware 1: Before async operation');
    yield someAsyncFunction(); // Yielding async operation
    console.log('Middleware 1: After async operation');
    yield next;
});

app.use(function* () {
    console.log('Middleware 2');
});

app.listen(3000);

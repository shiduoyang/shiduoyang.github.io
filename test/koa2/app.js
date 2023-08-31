const Koa = require('koa');
const app = new Koa();

app.use(async (ctx, next) => {
    console.log('Middleware 1: Before async operation');
    await someAsyncFunction(); // Await async operation
    console.log('Middleware 1: After async operation');
    await next();
});

app.use(async (ctx) => {
    console.log('Middleware 2');
});

app.listen(3000);
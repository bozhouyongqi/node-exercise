

const Koa = require('koa');

const app = new Koa();

app.use(async (ctx, next) => {

    Math.random() > 0.6 ? aaa() : '2';

    await next();
    ctx.response.type = 'text/html';
    ctx.response.body = '<h1>hello, koa2</h1>';
});


if (!module.parent) {
    app.listen(3000);
    console.log('app started at port 3000');
}
else {
    module.exports = app;
}

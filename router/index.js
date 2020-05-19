const path = require('path');
const Router = require('koa-router');
const send = require('koa-send');

const router = new Router();

const root = path.join(__dirname, '../dist/');
router.get('/', async ctx => {
  ctx.cookies.set('JESSIONID', '2bfab65b-fc85-4574-b3d0-d74980dde7d1', {
    maxAge: 10 * 60 * 1000, // cookie有效时长
    httpOnly: false, // 是否只用于http请求中获取
    overwrite: false // 是否允许重写
  });
  await send(ctx, 'index.html', { root });
});
router.get(/index(\.html)?$/, (ctx, next) => {
  ctx.redirect('/');
});
router.get(/html$/, async ctx => {
  await send(ctx, ctx.path.replace('/', ''), { root });
});

module.exports = router;

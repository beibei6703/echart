const Koa = require('koa');
const path = require('path');
const e2k = require('express-to-koa');
const c2k = require('koa-connect');
const koaStatic = require('koa-static');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const open = require('open');
const router = require('../router');
const mock = require('../router/mock');
const proxy = require('../router/proxy');

const devConfig = require('./webpack.dev.conf');

const app = new Koa();

const port = 3011;

const compiler = webpack(devConfig);

app.use(
  koaStatic(path.resolve(__dirname, '../static'))
);
// webpackDevMiddleware默认不支持koa，需要用express-to-koa和koa-connect解决
app.use(c2k((req, res, next) => {
  res.statusCode = 200;
  next();
}));

app.use(e2k(webpackDevMiddleware(compiler, {
  publicPath: devConfig.output.publicPath,
  stats: 'errors-only',
  headers: {
    'Access-Control-Allow-Origin': '*'
  }
})));
app.use(e2k(webpackHotMiddleware(compiler)));
app.use(router.routes());

// npm命令中带有process.env.proxy参数,则开启代理到指定服务器
if (process.env.proxy) {
  app.use(proxy());
} else {
  app.use(mock.routes());
}

app.listen(port);
open(`http://localhost:${port}`);



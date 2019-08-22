import Hapi from 'hapi';
import inert from 'inert';
import nunjucks from 'nunjucks';
import router from './router';

import Application from './lib';

nunjucks.configure('./dist');

const start = async () => {

  const server = new Hapi.Server({
    host: 'localhost',
    port: 8000
  });

  await server.register(require('inert'));
  //配置CSS请求的服务器端响应
  const common_css = '/bundle.css';
  server.route({
    method: 'GET',
    path: common_css,
    handler: function(request, response){
      response.file('dist/bundle.css')
    }
  })
  //配置JS请求的服务器端响应
  const common_js = '/bundle.js';
  server.route({
    method: 'GET',
    path: common_js,
    handler: function(request, h){
      return h.file('dist/bundle.js')
    }
  })

  //配置client端模板异步请求
  server.route({
    method: 'GET',
    path: '/template/{template*}',
    handler:(request, h) => {
      return h.file('dist/template/' + request.params.template)
    }
  })

  const application = new Application(router,{
    server: server,
    /**
     * 为啥在这里设置个entry呢？
     * 1. entry本身作为所有页面的最外层模板
     * 2. 模板本身在客户端包含打包的js和css，适合放在一个页面, 方便引用
     * 3. 当然可以将于entry相关的所有引用放到applacation的代码中
     **/
    entry: function(html, callback){
      nunjucks.render('./entry.html',{
        css: common_css,
        js: common_js,
        state: '{}',
        body: html
      },callback)
    }
  })

  await application.start();
}

start();


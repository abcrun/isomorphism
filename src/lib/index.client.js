import Call from 'call';
import query from 'query-string';

export default class Applaction {

  constructor(routes, options){
    this.routes = routes;//记录routes和对应的controller
    this.router = new Call.Router();//记录并处理route path等信息

    this.registRoutes(routes)
  }

  createController(url) {
    const [path, search] = url.split('?');
    const match = this.router.route('get', path);
    const { route, params } = match;
    const Controller = this.routes[route];

    if(!Controller) return;

    return new Controller({
      query: query.parse(search),
      params: params
    });
  }

  goto(url){
    if(!history.pushState){
      location.href = url;
      return;
    }

    const prevController = this.controller;
    this.controller = this.createController(url);

    if(prevController) prevController.unbind();//解绑事件

    if(this.controller){
      history.pushState({}, null, url);//调用history api

      this.controller.index((err, html) => {
        if(err) console.log(err)

        document.body.innerHTML = html;

        this.controller.bind();//绑定事件
      })
    }else{
      console.error('未找到匹配路径')
      location.href = url;
    }

  }

  registRoutes(routes){
    for(let path in routes){
      this.router.add({
        path: path,
        method: 'get'
      })
    }
  }

  getURL() {
    const { pathname, search } = window.location;

    return pathname + search;
  }

  start() {
    //获取当前页面的location相关信息,初始化controller
    const url = this.getURL();
    this.controller = this.createController(url);

    //绑定事件
    this.controller.bind();

    //处理history api
    window.addEventListener('popstate', (e) => {
      const url = this.getURL();

      alert('goto')
      this.goto(url);
    })

    //处理页面内链接跳转
    document.body.addEventListener('click', (e) => {
      const { target } = e, href = target.getAttribute('href');

      if(href){
        e.preventDefault();
        this.goto(href);
      }
    })
  }

}

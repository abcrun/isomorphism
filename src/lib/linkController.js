import nunjucks from 'nunjucks';

export default class Controller {
  /**
   * Controller不要将request和response对象本身传入进来
   * 因为server端和client要尽量公用一套代码
   * 所以跟request和response相关的，可以放到application里面，或者通过controller里的回调，在applaction中执行
   */
  constructor(context){
    this.context = context;
  }

  index(callback) {
    nunjucks.render('./template/link.html', function(err, html){
      callback(err, html);
    })
  }

  //绑定事件
  bind(){
    alert('bind /link')
  }

  //解绑事件
  unbind(){
    alert('unbind /link')
  }
}

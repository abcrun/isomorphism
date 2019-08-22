export default class Applaction {

  constructor(routes, options){
    this.server = options.server;
    this.entry = options.entry;

    this.registRoutes(routes)
  }

  registRoutes(routes){
    const self = this;
    for(let path in routes){
      const Controller = routes[path];

      this.server.route({
        path: path,
        method: 'GET',
        handler: (request, h) => {
          const controller = new Controller({
            params: request.params
          });

          //Hapi v17要求route handler必须返回promise string 或者 error
          return new Promise((resolve, reject) => {
            controller.index((err, html) => {
              if(err) return err;

              //this.entry(html, resolve); 为啥不这么写？ 因为resolve不能只接受一个参数
              this.entry(html, (err, html) =>{
                if(err) return '500 - Frame Error';

                resolve(html);
              })
            })
          }).then(html => {
            return html;
          })


        }
      })
    }
  }

  start() {
    this.server.start();
  }

}

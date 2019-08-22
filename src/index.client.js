import nunjucks from 'nunjucks';
import Application from './lib';
import router from './router.js';

nunjucks.configure('.');

const application = new Application(router)

application.start();

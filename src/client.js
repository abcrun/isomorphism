import router from './router';
import Application from './lib';

const application = new Application(router)

application.start();

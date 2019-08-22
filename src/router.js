import indexController from './lib/indexController';
import linkController from './lib/linkController';

export default {
  '/index/{tag*}': indexController,
  '/link': linkController
}

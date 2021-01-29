import 'es6-promise/auto';
import 'babel-polyfill';

import routes from 'routers/client';
import renderRoutes from './helpers/render-routes';

renderRoutes(routes);

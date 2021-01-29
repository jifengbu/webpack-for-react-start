import 'babel-polyfill';

import app from './App/server';
import config from './config';

const server = app.listen(config.port, () => {
    const port = server.address().port;
    console.log('Listening at port', port);
});

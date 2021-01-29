import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { apiQuery } from 'relatejs';
import Client from 'pages/client';
import Home from 'pages/client/home';

let firstEntry = true;
const authenticate = (nextState, replaceState, callback) => {
    if (typeof window !== 'undefined' && !firstEntry) {
        apiQuery({ fragments: { session: 1 } }, (result) => {
            if (result.session) {
                callback();
            } else {
                window.location.href = '/hbclient';
            }
        })();
    } else {
        firstEntry = false;
        callback();
    }
};

export default [
    <Route name='client' path='/hbclient' component={Client}>
        <IndexRoute component={Home} onEnter={authenticate} />
    </Route>,
];

import React from 'react';
import { Route } from 'react-router';
import gaSend from 'helpers/ga-send';
import Auth from 'pages/auth';
import Login from 'pages/auth/pages/login';
import ForgotPwd from 'pages/auth/pages/forgotPwd';

export default [
    <Route component={Auth}>
        <Route path='/hbclient/login' component={Login} onEnter={gaSend} />
        <Route path='/hbclient/forgotPwd' component={ForgotPwd} onEnter={gaSend} />
        <Route path='/hbclient' component={() => <div />} onEnter={() => { window.location.href = '/hbclient'; }} />
    </Route>,
];

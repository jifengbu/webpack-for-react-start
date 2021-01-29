import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Auth from 'pages/auth';

function scrollToTop () {
    if (typeof window !== 'undefined') {
        window.scrollTo(0, 0);
    }
}

export default [
    <Route name='client' path='/' component={Auth}>
        <IndexRoute component={Auth} />
    </Route>,
];

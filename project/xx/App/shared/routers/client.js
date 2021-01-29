import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { apiQuery } from 'relatejs';
import AsyncLoad from './AsyncLoad';
import Client from 'pages/client';

// common
const Home = AsyncLoad((cb) => require.ensure([], (require) => cb(require('pages/client/home').default), 'Home'));
const Personal = AsyncLoad((cb) => require.ensure([], (require) => cb(require('pages/client/common/personal').default), 'Personal'));
const Notifies = AsyncLoad((cb) => require.ensure([], (require) => cb(require('pages/client/common/notifies').default), 'Notifies'));
const Members = AsyncLoad((cb) => require.ensure([], (require) => cb(require('pages/client/common/members').default), 'Members'));
const MemberDetail = AsyncLoad((cb) => require.ensure([], (require) => cb(require('pages/client/common/members/pages/detail').default), 'MemberDetail'));
const Feedback = AsyncLoad((cb) => require.ensure([], (require) => cb(require('pages/client/common/feedback').default), 'Feedback'));
const Organizations = AsyncLoad((cb) => require.ensure([], (require) => cb(require('pages/client/common/organizations').default), 'Organizations'));
const OrganizationsDetail = AsyncLoad((cb) => require.ensure([], (require) => cb(require('pages/client/common/organizations/pages/detail').default), 'OrganizationsDetail'));
const Roles = AsyncLoad((cb) => require.ensure([], (require) => cb(require('pages/client/common/roles').default), 'Roles'));
const RoleDetail = AsyncLoad((cb) => require.ensure([], (require) => cb(require('pages/client/common/roles/pages/detail').default), 'RoleDetail'));
const Setting = AsyncLoad((cb) => require.ensure([], (require) => cb(require('pages/client/common/setting').default), 'Setting'));
const DevelopPage = AsyncLoad((cb) => require.ensure([], (require) => cb(require('pages/client/common/developPage').default), 'DevelopPage'));
const ShowHtml = AsyncLoad((cb) => require.ensure([], (require) => cb(require('pages/client/common/showHtml').default), 'ShowHtml'));

let firstEntry = true;
function authenticate (nextState, replaceState, callback) {
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
}

function scrollToTop () {
    if (typeof window !== 'undefined') {
        window.scrollTo(0, 0);
    }
}

export default [
    <Route name='client' path='/hbclient' component={Client}>
        <IndexRoute component={Home} onEnter={authenticate} />
        <Route name='Home' path='home' component={Home} onEnter={authenticate} />
        <Route name='Logout' path='/hbclient/logout' component={() => <div />} onEnter={() => { window.location.href = '/hbclient/logout'; }} />
        <Route name='Personal' path='personal'>
            <IndexRoute component={Personal} onEnter={authenticate} />
        </Route>
        <Route name='Notifies' path='notifies' component={Notifies} onEnter={authenticate} />
        <Route name='Feedback' path='feedback' component={Feedback} />
        <Route name='Members' path='members'>
            <IndexRoute component={Members} onEnter={authenticate} />
            <Route name='MemberDetail' path='detail' component={MemberDetail} onEnter={authenticate} />
        </Route>
        <Route name='Organizations' path='organizations'>
            <IndexRoute component={Organizations} onEnter={authenticate} />
            <Route name='OrganizationsDetail' path='detail' component={OrganizationsDetail} onEnter={authenticate} />
        </Route>
        <Route name='Roles' path='roles'>
            <IndexRoute component={Roles} onEnter={authenticate} />
            <Route name='RoleDetail' path='detail' component={RoleDetail} onEnter={authenticate} />
        </Route>
        <Route name='Setting' path='setting' component={Setting} onEnter={authenticate} />
        <Route name='DevelopPage' path='developPage' component={DevelopPage} />
        <Route name='ShowHtml' path='showHtml' component={ShowHtml} onEnter={scrollToTop} />
    </Route>,
];

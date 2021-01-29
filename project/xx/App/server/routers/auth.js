import getDefaultFavicon from 'helpers/default-favicon';
import getMarkup from 'helpers/get-markup';
import routeHandler from 'helpers/route-handler';
import routes from 'routers/auth';
import { Router } from 'express';
import config from '../../../config';

const authRouter = new Router();

function injectScript (req, res, next) {
    if (process.env.NODE_ENV === 'production') {
        res.locals.header.push({
            tag: 'link',
            props: {
                rel: 'stylesheet',
                type: 'text/css',
                href: '/hbclient/assets/auth.css',
            },
        });
        // res.locals.header.push({
        //     tag: 'link',
        //     props: {
        //         rel: 'stylesheet',
        //         type: 'text/css',
        //         href: '/hbclient/assets/common.js.css',
        //     },
        // });
    }
    res.locals.header.push(getDefaultFavicon(res));
    res.locals.footer.push({
        tag: 'script',
        props: {
            src: `${res.baseScriptsURL}/hbclient/assets/auth.js`,
        },
    });
    next();
}

authRouter.get('/hbclient*', (req, res, next) => {
    if (req.useragent.isMobile) {
        return res.redirect(config.apiServer + '/hb/weixin/downloadApp');
    }
    next();
});

authRouter.get('/hbclient/login', (req, res, next) => {
    if (!req.query.phone && req.isAuthenticated()) {
        res.redirect('/hbclient');
    } else {
        routeHandler(routes, req, res, next);
    }
});

authRouter.get('/hbclient/logout', (req, res) => {
    req.logout();
    res.redirect('/hbclient/login');
});

authRouter.get(/^\/hbclient\/(register|forgotPwd)$/, (req, res, next) => {
    routeHandler(routes, req, res, next);
});

// Register | ForgotPwd
authRouter.get(/^\/hbclient\/(register|forgotPwd)$/, injectScript, async (req, res, next) => {
    res.status(200).send(getMarkup(req, res));
});

// Login
authRouter.get('/hbclient/login', injectScript, (req, res) => {
    if (!req.query.phone && req.isAuthenticated()) {
        res.redirect('/hbclient');
    } else {
        res.status(200).send(getMarkup(req, res));
    }
});

export default authRouter;

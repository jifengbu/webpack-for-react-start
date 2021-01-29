import getBaseComponent from 'helpers/get-base-component';
import getDefaultFavicon from 'helpers/default-favicon';
import renderHtml from 'helpers/render-html';
import routeHandler from 'helpers/route-handler';
import routes from 'routers/client-server';
import { Router } from 'express';
import { graphql } from 'graphql';
import { getDataDependencies } from 'relatejs';

import schema from '../schema';

const clientRouter = new Router();

clientRouter.get(/^\/hbclient\/.+/, (req, res, next) => {
    if (req.isAuthenticated()) {
        res.redirect('/hbclient');
    } else {
        next();
    }
});

clientRouter.get('/hbclient*', (req, res, next) => {
    if (req.isAuthenticated()) {
        if (process.env.NODE_ENV === 'production') {
            res.locals.header.push(getDefaultFavicon(res));
            res.locals.header.push({
                tag: 'link',
                props: {
                    rel: 'stylesheet',
                    type: 'text/css',
                    href: '/hbclient/assets/client.css',
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
        res.locals.footer.push({
            tag: 'script',
            props: {
                src: `${res.baseScriptsURL}/hbclient/assets/client.js`,
            },
        });
        next();
    } else {
        res.redirect('/hbclient/login');
    }
});

clientRouter.get('/hbclient*', (req, res, next) => {
    if (req.isAuthenticated()) {
        routeHandler(routes, req, res, next);
    } else {
        next();
    }
});

clientRouter.get('/hbclient*', async (req, res, next) => {
    if (req.isAuthenticated() && req.routerState) {
        // get component with redux provider and react router
        const component = getBaseComponent(req);
        // get relate js data dependencies
        const { userId, token } = req.query || {};
        let user = userId && token ? { userId, token } : req.user;
        await getDataDependencies(component, async (request) => await graphql(
            schema.getSchema(),
            request.query,
            {
                isAuthenticated: true,
                user,
            },
            request.variables
        ));

        // final render html
        res.status(200).send(renderHtml({
            component,
            store: req.store,
            locals: res.locals,
        }));
    } else {
        next();
    }
});

export default clientRouter;

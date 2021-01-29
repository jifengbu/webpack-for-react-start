import bodyParser from 'body-parser';
import express from 'express';
import useragent from 'express-useragent';
import graphqlHTTP from 'express-graphql';
import morgan from 'morgan';
import path from 'path';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import connectMongo from 'connect-mongo';
import session from 'express-session';

import { post, urls } from 'helpers/api';
import config from '../../config';
import routers from './routers';
import schema from './schema';

const app = express();

app.use(morgan('short'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: 100000000 }));
app.use(useragent.express());

// session
const MongoStore = connectMongo(session);
app.use(session({
    secret: 'whxx_client', // session的密码
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        url: config.dbServer,
        collection: 'sessions_client',
    }),
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use('local', new LocalStrategy({
    usernameField: 'phone',
}, async (phone, password, done) => {
    const user = { phone, password };
    console.log('[login]: LocalStrategy', user);
    const data = await post(urls.login, user) || { msg: '服务器错误' };
    if (!data.success) {
        return done({ message: data.msg });
    }
    return done(null, Object.assign({}, data.context));
}));

passport.serializeUser((user, done) => { // 保存 user 到 sessoon
    console.log('[login]: serializeUser', user, done);
    done(null, user);// 可以通过数据库方式操作
});
passport.deserializeUser(async (user, done) => { // 通过保存的 user 信息到 sessoon 获取 user
    console.log('[login]: deserializeUser', user, done);
    done(null, user);
});

// Static files
app.use(express.static(path.resolve('public')));
app.use(express.static(path.resolve('download')));
app.use(['/hbclient/favicon.ico', '/hbclient/img/*', '/hbclient/html/*', '/hbclient/csl/*', '/hbclient/fonts/*', '/hbclient/assets/*', '/hbclient/js/*'], (req, res) => {
    res.status(404).end();
});

// GraphqQL server
app.use('/hbclient/graphql', graphqlHTTP(req => {
    const { __SUPER_AUTHORIZATION__ } = req.body;
    if (__SUPER_AUTHORIZATION__ && __SUPER_AUTHORIZATION__.user) {
        return {
            schema: schema.getSchema(),
            rootValue: {
                isAuthenticated: true,
                user: __SUPER_AUTHORIZATION__.user,
            },
            graphiql: true,
        };
    }
    return {
        schema: schema.getSchema(),
        rootValue: {
            isAuthenticated: req.isAuthenticated(),
            user: req.user,
            req,
        },
        graphiql: true,
    };
}));

app.use(async (req, res, next) => {
    res.locals.header = [
        {
            tag: 'script',
            content: `
            if (!!window.ActiveXObject || "ActiveXObject" in window) {
                window.alert('IE浏览器存在安全隐患，请使用360安全浏览器。');
            }
            `,
        }, {
            tag: 'title',
            content: '惠水县明田街道数据治理平台',
        },
    ];

    if (process.env.NODE_ENV !== 'production') {
        res.baseScriptsURL = `http://localhost:${config.devPort}`;
        res.locals.header.push({
            tag: 'script',
            props: {
                src: `${res.baseScriptsURL}/webpack-dev-server.js`,
            },
        });
    } else {
        res.baseScriptsURL = '';
    }

    res.locals.header.push({
        tag: 'link',
        props: {
            rel: 'stylesheet',
            type: 'text/css',
            href: `${res.baseScriptsURL}/hbclient/plugins/viewer/viewer.min.css`,
        },
    });
    res.locals.header.push({
        tag: 'link',
        props: {
            rel: 'stylesheet',
            type: 'text/css',
            href: `${res.baseScriptsURL}/hbclient/plugins/layx/layx.css`,
        },
    });

    // footer
    res.locals.footer = [
        {
            tag: 'script',
            props: {
                src: `${res.baseScriptsURL}/hbclient/assets/common.js`,
            },
        }, {
            tag: 'script',
            props: {
                src: `http://api.map.baidu.com/api?v=3.0&ak=${config.baiduMapSK}`,
            },
        }, {
            tag: 'script',
            props: {
                src: `${res.baseScriptsURL}/hbclient/plugins/tianditu/api.js`,
            },
        }, {
            tag: 'script',
            props: {
                src: `${res.baseScriptsURL}/hbclient/plugins/tianditu/d3.js`,
            },
        }, {
            tag: 'script',
            props: {
                src: `${res.baseScriptsURL}/hbclient/plugins/tianditu/ImageOverlay.js`,
            },
        }, {
            tag: 'script',
            props: {
                src: `${res.baseScriptsURL}/hbclient/plugins/tianditu/CarTrack.js`,
            },
        }, {
            tag: 'script',
            props: {
                src: `${res.baseScriptsURL}/hbclient/plugins/tianditu/D3SvgOverlay.js`,
            },
        }, {
            tag: 'script',
            props: {
                src: 'http://lbs.tianditu.gov.cn/api/js4.0/opensource/data/point.js',
            },
        }, {
            tag: 'script',
            props: {
                src: `${res.baseScriptsURL}/hbclient/plugins/viewer/viewer.min.js`,
            },
        }, {
            tag: 'script',
            props: {
                src: `${res.baseScriptsURL}/hbclient/plugins/layx/layx.js`,
            },
        },
    ];
    next();
});

app.use(routers.authRouter);
app.use(routers.clientRouter);
app.use(routers.publicRouter);

app.use((req, res) => {
    res.status(404).end();
});

app.use((error, req, res) => {
    const statusCode = error.statusCode || 500;
    const err = {
        error: statusCode,
        message: error.message,
    };
    if (!res.headersSent) {
        res.status(statusCode).send(err);
    }
});

export default app;

import configureStore from 'helpers/configure-store';
import createHistory from 'history/lib/createHashHistory';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { reduxReactRouter, ReduxRouter } from 'redux-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import RenderStore from './renderStore';

injectTapEventPlugin();

export default function renderRoutes (routes) {
    const store = configureStore(
        reduxReactRouter({ createHistory, routes }),
    );
    window.__renderStore = function (component, div) {
        render(
            <Provider store={store}>
                <RenderStore component={component} />
            </Provider>,
            div,
        );
    };
    render(
        <LocaleProvider locale={zh_CN}>
            <Provider store={store}>
                <ReduxRouter routes={routes} />
            </Provider>
        </LocaleProvider>,
        document.getElementById('view')
    );
}

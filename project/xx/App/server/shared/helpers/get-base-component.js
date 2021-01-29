import React from 'react';
import { Provider } from 'react-redux';
import { ReduxRouter } from 'redux-router';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';

export default (req) => {
    const { store, headers } = req;
    const muiTheme = getMuiTheme({ userAgent: headers['user-agent'] });
    return (
        <LocaleProvider locale={zh_CN}>
            <MuiThemeProvider muiTheme={muiTheme}>
                <Provider store={store}>
                    <ReduxRouter />
                </Provider>
            </MuiThemeProvider>
        </LocaleProvider>
    );
};

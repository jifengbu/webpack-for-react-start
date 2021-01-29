/* eslint-disable no-labels */
import React from 'react';
import { rootDataConnect, apiQuery } from 'relatejs';
import Client from './contents';
import { _, moment, showDialog, showError } from 'utils';
import sideMenus from 'config/side_menu';
import mainMenus from 'config/main_menu';
import routes from 'routers/app';

function getComponentByPathname (routes, pathnames, index = 0) {
    const pathname = pathnames[index];
    const isLast = index === pathnames.length - 1;
    for (const item of routes) {
        if (item.props.path === pathname || item.props.path === `/${pathname}`) {
            if (isLast) {
                return item.props.component || (item.props.children.props && item.props.children.props.component) || item.props.children[0].props.component;
            }
            return getComponentByPathname(item.props.children, pathnames, index + 1);
        }
    }
}

@rootDataConnect()
export default class ClientContainer extends React.Component {
    state = {
        homeLink: '/hbclient/',
        personal: {},
        notifyCount: 0,
        forbidClose: () => false,
        isFullScreen: false,
        activeTopMenu: false,
        activeMainMenu: false,
        activeSideMenu: false,
        activeSideParentMenu: false,
        sideMenu: [],
        themeType: typeof window !== 'undefined' && localStorage.getItem('themeType') || 0,
        isElectron: typeof window !== 'undefined' && navigator.userAgent.toLowerCase().indexOf('electron/') !== -1,
    };
    constructor (props) {
        super(props);
        const push = props.history.push;
        const self = this;
        props.history.push = function (location) {
            if (location.dialog) {
                if (!location.pathname) {
                    return showError('没有指定路由');
                }
                if (location.dialog.refresh) {
                    location.dialog.refresh = {};
                }
                const state = location.state || {};
                const dialogProps = self.getDialogProps();
                const Component = getComponentByPathname(routes, location.pathname.split('/').filter(Boolean));
                const dialog = showDialog(<Component {...dialogProps} dialogState={state} layxRefresh={location.dialog.refresh} isDialog />, location.dialog);
                const goBack = props.history.goBack;
                props.history.goBack = function () {
                    dialog.close();
                    props.history.goBack = goBack;
                };
            } else {
                push(location);
            }
        };
    }
    getDialogProps () {
        const { personal } = this.state;
        return {
            ...this.props,
            rootPersonal: personal,
            hasAuthority: ::this.hasAuthority,
            playSound: ::this.playSound,
            updatePersonal: ::this.updatePersonal,
        };
    }
    componentDidMount () {
        this.updateNotifyCount();
    }
    playSound (soundSrc) {
        document.getElementById('__sound_container').innerHTML = "<audio id='audioPlay' src='" + soundSrc + "' autoplay='autoplay' hidden='true'>";
    }
    updatePersonal (_personal, homeLink = '/hbclient/') {
        const { personal } = this.state;
        this.setState({ personal: { ...personal, ..._personal }, homeLink });
    }
    updateForbidClose (func) {
        this.setState({ forbidClose: func || (() => false) });
    }
    hasAuthority (...authority) {
        const { personal } = this.state;
        return !!_.intersection(personal.authority, authority).length;
    }
    updateNotifyCount (force) {
        const now = moment();
        // 10秒之内不刷新
        if (force || now.diff(this.updateNotifyTime || 0, 's') > 10) {
            apiQuery({
                fragments: {
                    notifyCount: 1,
                },
            }, (result) => {
                if (result.notifyCount !== undefined) {
                    this.updateNotifyTime = now;
                    this.setState({ notifyCount: result.notifyCount });
                }
            })();
        }
    }
    selectTopMenuItem (current) {
        this.setState({ activeTopMenu: current });
    }
    selectMainMenuItem (current) {
        this.setState({ activeMainMenu: current });
    }
    selectSideMenuItem (current) {
        let { activeMainMenu, activeSideParentMenu } = this.state;
        const sideList = sideMenus[activeMainMenu] || [];
        outer: for (const p of sideList) {
            for (const c of (p.children || [])) {
                if (c.key === current) {
                    activeSideParentMenu = p.key;
                    break outer;
                }
            }
        }
        if (!activeSideParentMenu) {
            outer1: for (var m of mainMenus) {
                for (const p of (sideMenus[m.key] || [])) {
                    if (p.key === current) {
                        this.setState({ activeMainMenu: m.key });
                        break outer1;
                    }
                    for (const c of (p.children || [])) {
                        if (c.key === current) {
                            activeSideParentMenu = p.key;
                            break outer1;
                        }
                    }
                }
            }
            if (activeSideParentMenu) {
                this.setState({ activeMainMenu: m.key });
            }
        }
        if (!current) {
            activeSideParentMenu = false;
        }
        this.setState({ activeSideMenu: current, activeSideParentMenu });
    }
    toggleFullScreen () {
        this.setState({ isFullScreen: !this.state.isFullScreen });
    }
    updateThemeType (type) {
        this.setState({ themeType: type });
    }
    render () {
        const {
            personal,
            homeLink,
            notifyCount,
            forbidClose,
            isFullScreen,
            activeTopMenu,
            activeMainMenu,
            activeSideMenu,
            activeSideParentMenu,
            themeType,
            sideMenu,
            isElectron,
        } = this.state;
        return (
            <Client
                {...this.props}
                isFullScreen={isFullScreen}
                rootPersonal={personal}
                isElectron={isElectron}
                homeLink={homeLink}
                forbidClose={forbidClose}
                activeTopMenu={activeTopMenu}
                activeMainMenu={activeMainMenu}
                activeSideMenu={activeSideMenu}
                activeSideParentMenu={activeSideParentMenu}
                selectTopMenuItem={::this.selectTopMenuItem}
                selectMainMenuItem={::this.selectMainMenuItem}
                selectSideMenuItem={::this.selectSideMenuItem}
                hasAuthority={::this.hasAuthority}
                notifyCount={notifyCount}
                themeType={themeType}
                sideMenu={sideMenu}
                playSound={::this.playSound}
                updateNotifyCount={::this.updateNotifyCount}
                updateThemeType={::this.updateThemeType}>
                {
                    React.cloneElement(this.props.children, {
                        rootPersonal: personal,
                        isElectron,
                        notifyCount,
                        themeType,
                        updatePersonal: ::this.updatePersonal,
                        isFullScreen,
                        selectTopMenuItem: ::this.selectTopMenuItem,
                        selectMainMenuItem: ::this.selectMainMenuItem,
                        selectSideMenuItem: ::this.selectSideMenuItem,
                        hasAuthority: ::this.hasAuthority,
                        updateNotifyCount: ::this.updateNotifyCount,
                        updateForbidClose: ::this.updateForbidClose,
                        toggleFullScreen: ::this.toggleFullScreen,
                        updateThemeType: ::this.updateThemeType,
                        playSound: ::this.playSound,
                    })
                }
            </Client>
        );
    }
}

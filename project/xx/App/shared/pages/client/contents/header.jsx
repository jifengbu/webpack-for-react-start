import React from 'react';
import { Menu, Badge, Modal, Radio } from 'antd';
import LinkButton from 'components/button/LinkButton';
import topMenu from 'config/top_menu';
import mainMenu from 'config/main_menu';
import { _, lc, config, confirm, showDialog } from 'utils';
import QRCode from 'qrcode-react';
import styles from './header.less';

import { HEAD_BACKGROUND_COLOR } from '../../../constants/colors';

const MenuItem = Menu.Item;
const MenuDivider = Menu.Divider;
const RadioGroup = Radio.Group;

export default class Header extends React.Component {
    handleTopMenuClick (e) {
        const { updateNotifyCount } = this.props;
        if (e.domEvent.target.tagName !== 'A') {
            this.props.history.push({ dialog: { title: '通知', width: 1200, height: 800 }, pathname: '/hbclient/notifies' });
        }
        updateNotifyCount();
    }
    handleMainMenuClick (e) {
        const { selectTopMenuItem, selectSideMenuItem, selectMainMenuItem, activeMainMenu, updateNotifyCount } = this.props;
        selectTopMenuItem(false);
        selectMainMenuItem(e.key);
        if (e.key !== activeMainMenu) {
            selectSideMenuItem(false);
        }
        updateNotifyCount();
    }
    confirmLogout () {
        confirm({ pre: '要', name: '退出登录' }, () => {
            lc.remove('LOGIN_INFO');
            this.props.history.replace({ pathname: '/hbclient/logout' });
        });
    }
    showAppDownload () {
        const { updateNotifyCount, isElectron } = this.props;
        const url = `${config.apiServer}/hb/weixin/downloadApp`;
        const exeurl = `${config.apiServer}/hb/apps/HBPolice_EXE/惠水县数据治理平台SetUp.exe`;
        const appurl = `${config.apiServer}/hb/apps/HBPolice/HBPolice.apk`;
        showDialog(
            <div className={styles.downloadContainer}>
                <div style={{ minHeight: 20 }} />
                <QRCode value={url} size={250} />
                <a href={appurl} className={styles.downloadUrl} target='_blank'>下载到电脑</a>
                { !isElectron && <a href={exeurl} className={styles.downloadUrl} target='_blank'>下载电脑端安装包</a> }
            </div>,
            { width: 400, height: 450, minimizable: false, maximizable: false, title: '手机App下载' }
        );
    }
    chooseThemeType () {
        const { updateThemeType, themeType } = this.props;
        let type = themeType;
        let newType;
        Modal.confirm({
            title: '主题选择',
            content: (
                <RadioGroup defaultValue={themeType} onChange={(e) => { updateThemeType(e.target.value); newType = e.target.value; }}>
                    <Radio value={'0'}>不忘初心</Radio>
                    <Radio value={'1'}>扫黑除恶</Radio>
                </RadioGroup>
            ),
            onOk: () => {
                localStorage.setItem('themeType', newType);
            },
            onCancel: () => {
                updateThemeType(type);
            },
        });
    }
    openRouteDialog (item) {
        const { history } = this.props;
        history.push({ dialog: { title: item.label, ...(item.options || {}) }, pathname: item.link });
    }
    showTopMenuItem (data) {
        const { hasAuthority, rootPersonal, notifyCount } = this.props;
        const list = [];
        data.forEach(item => {
            const visible = item.auth !== false && (item.auth === undefined || item.auth === true || (_.isFunction(item.auth) ? item.auth(rootPersonal) : hasAuthority(...(item.auth || []))));
            if (visible) {
                list.push(
                    <MenuItem key={item.key} className={item.key === 'personal' ? styles.firstMenuItem : ''}>
                        {
                            item.link === '/hbclient/logout'
                            &&
                            <a onClick={::this.confirmLogout}>{item.label}</a>
                            ||
                            item.key === 'themeType'
                            &&
                            <a onClick={::this.chooseThemeType}>{item.label}</a>
                            ||
                            item.key === 'appDownload'
                            &&
                            <a onClick={::this.showAppDownload}>{item.label}</a>
                            ||
                            <a onClick={this.openRouteDialog.bind(this, item)}>{item.label}</a>
                        }
                        { item.label === '通知' && <Badge count={notifyCount} style={{ backgroundColor: 'red', position: 'absolute', top: -40, right: -40 }} /> }
                    </MenuItem>
                );
                list.push(
                    <MenuDivider key={'_' + item.key} className={styles.line} />
                );
            }
        });
        return _.dropRight(list);
    }
    showMainMenuItem (data) {
        const { hasAuthority, rootPersonal, homeLink } = this.props;
        const list = [];
        data.forEach(item => {
            const visible = item.auth !== false && (item.auth === undefined || item.auth === true || (_.isFunction(item.auth) ? item.auth(rootPersonal) : hasAuthority(...(item.auth || []))));
            if (visible) {
                list.push(
                    <MenuItem key={item.key}>
                        <LinkButton {...this.props} to={item.label === '首页' ? homeLink : item.link}>
                            <div className={styles.mainMenuItem}>
                                <img src={item.img} className={styles.icon} />
                                <p className={styles.iconText}>{item.label}</p>
                            </div>
                        </LinkButton>
                    </MenuItem>
                );
            }
        });
        return list;
    }
    backHome () {
        const { history } = this.props;
        history.push({ pathname: '/hbclient/' });
    }
    render () {
        const { rootPersonal, activeTopMenu, activeMainMenu, themeType } = this.props;
        const { name, head, logo } = rootPersonal;
        return (
            <div className={styles.container} style={{ backgroundImage: HEAD_BACKGROUND_COLOR[themeType || 0] }}>
                <div className={styles.content}>
                    <div className={styles.left} onClick={::this.backHome}>
                        <img src={logo || '/hbclient/img/login/logo.png'} className={styles.logo} />
                        <div className={styles.masterContainer}>
                            <div className={styles.masterName}>
                                惠水县数据治理平台
                            </div>
                            <div className={styles.masterTechnology}>
                                技术支持：贵州申瓯通信电子科技有限公司
                            </div>
                            <div className={styles.masterPhone}>
                                <p>合作电话：0851-85806777</p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.mainMenuContainer}>
                        <Menu className={styles.mainMenu} mode='horizontal' selectedKeys={[activeMainMenu || '']} onClick={::this.handleMainMenuClick}>
                            {this.showMainMenuItem(mainMenu)}
                        </Menu>
                    </div>
                    <div className={styles.right}>
                        <Menu className={styles.menu} mode='horizontal' selectedKeys={[activeTopMenu || '']} onClick={::this.handleTopMenuClick}>
                            {this.showTopMenuItem(topMenu)}
                        </Menu>
                        <Menu className={styles.personalMenu} mode='horizontal' selectedKeys={[activeTopMenu || '']} onClick={::this.handleTopMenuClick}>
                            <MenuItem key={10}>
                                <a onClick={this.openRouteDialog.bind(this, { link: '/hbclient/personal', label: '个人中心', options: { width: 1200, height: 800 } })} >
                                    <img src={head || '/hbclient/img/common/default_head.png'} className={styles.head} />
                                    <span className={styles.client}>{name}</span>
                                </a>
                            </MenuItem>
                        </Menu>
                    </div>
                </div>
            </div>
        );
    }
}

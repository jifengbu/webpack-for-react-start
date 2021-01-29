import React from 'react';
import { Menu } from 'antd';
import LinkButton from 'components/button/LinkButton';
import styles from './sidebar.less';
import sideMenus from 'config/side_menu';
import _ from 'lodash';

const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;

export default class Sidebar extends React.Component {
    state = {
        openKeys: [],
    };
    componentWillMount () {
        this.setState({ openKeys: [ this.props.activeSideParentMenu ? this.props.activeSideParentMenu : '' ] });
    }
    handleClick (e) {
        const { selectTopMenuItem, selectSideMenuItem, updateNotifyCount } = this.props;
        selectTopMenuItem(false);
        selectSideMenuItem(e.key);
        updateNotifyCount();
    }
    onOpenChange (openKeys) {
        const state = this.state;
        const latestOpenKey = openKeys.find(key => !(state.openKeys.indexOf(key) > -1));
        const latestCloseKey = state.openKeys.find(key => !(openKeys.indexOf(key) > -1));

        let nextOpenKeys = [];
        if (latestOpenKey) {
            nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey);
        }
        if (latestCloseKey) {
            nextOpenKeys = this.getAncestorKeys(latestCloseKey);
        }
        this.setState({ openKeys: nextOpenKeys });
    }
    getAncestorKeys (key) {
        const list = key.split('_');
        if (list.length < 2) {
            return [];
        }
        let lastAncestor = list[0];
        const ancestor = [lastAncestor];
        for (let i = 1, len = list.length - 1; i < len; i++) {
            lastAncestor = `${lastAncestor}_${list[i]}`;
            ancestor.push(lastAncestor);
        }
        return ancestor;
    }
    showMenuItem (data) {
        const { hasAuthority, rootPersonal } = this.props;
        const list = [];
        data.forEach(item => {
            const visible = item.auth !== false && (item.auth === undefined || (_.isFunction(item.auth) ? item.auth(rootPersonal) : hasAuthority(...(item.auth || []))));
            if (visible) {
                list.push(
                    item.children &&
                    <SubMenu key={item.key} title={item.image ? <div><img src={item.image} className={styles.icon} /><span className={styles.label}>{item.label}</span></div> : item.label}>
                        { this.showSubMenuItem(item.children) }
                    </SubMenu>
                    ||
                    <MenuItem key={item.key} className={styles.menuItem}>
                        <LinkButton {...this.props} to={item.link} needPassword={item.needPassword} label={item.label} className={styles.menu_button}>{item.image && <img src={item.image} className={styles.icon} />}<span className={styles.label}>{item.label}</span></LinkButton>
                    </MenuItem>
                );
            }
        });
        return list;
    }
    showSubMenuItem (data) {
        const { hasAuthority, rootPersonal } = this.props;
        const list = [];
        data.forEach(item => {
            const visible = item.auth !== false && (item.auth === undefined || (_.isFunction(item.auth) ? item.auth(rootPersonal) : hasAuthority(...(item.auth || []))));
            if (visible) {
                list.push(
                    <MenuItem key={item.key} className={styles.menuItem}>
                        <LinkButton {...this.props} to={item.link} needPassword={item.needPassword} label={item.label} className={styles.menu_button}>{item.image && <img src={item.image} className={styles.icon} />}<span className={styles.subLabel}>{item.label}</span></LinkButton>
                    </MenuItem>
                );
            }
        });
        return list;
    }
    render () {
        const { activeMainMenu, activeSideMenu, themeType } = this.props;
        const { openKeys } = this.state;
        return (
            <aside className={styles.sider}>
                <div className={themeType == 0 && styles.gradient_blue || themeType == 1 && styles.gradient_red}>
                    <Menu
                        className={styles.menu}
                        onClick={::this.handleClick}
                        openKeys={openKeys}
                        onOpenChange={::this.onOpenChange}
                        selectedKeys={[activeSideMenu]}
                        mode='inline'
                        >
                        {this.showMenuItem(sideMenus[activeMainMenu] || [])}
                    </Menu>
                </div>
            </aside>
        );
    }
}

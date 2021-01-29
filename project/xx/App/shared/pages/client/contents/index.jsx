import React from 'react';
import { notification } from 'antd';
import Sidebar from './sidebar';
import Header from './header';
import styles from './index.less';

export default class App extends React.Component {
    componentDidMount () {
        notification.config({
            placement: 'bottomLeft',
            bottom: 30,
            duration: 3,
        });
    }
    render () {
        const { isFullScreen, activeSideMenu, activeTopMenu } = this.props;
        return (
            <div className={styles.container} style={{ visibility: typeof window === 'undefined' ? 'hidden' : 'visible' }}>
                { (!isFullScreen && activeSideMenu) && <Sidebar ref='sidebar' {...this.props} /> }
                { !isFullScreen && <Header ref='header' {...this.props} /> }
                <div className={(isFullScreen || !activeSideMenu) ? (activeTopMenu ? styles.center_content : styles.full_content) : styles.content}>
                    {this.props.children}
                </div>
                <div id='__sound_container' />
            </div>
        );
    }
}

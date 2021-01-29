import React from 'react';
import { Modal } from 'antd';
import styles from './index.less';
import cn from 'classnames';
import _ from 'lodash';

export default class HelpButton extends React.Component {
    showHelp () {
        let title;
        let lines = this.props.info;
        if (!_.isArray(lines)) {
            title = lines.title;
            lines = lines.lines;
        }
        Modal.info({
            title: '帮助',
            content: (
                <div style={{ paddingTop: 10 }}>
                    { title && <p style={{ fontSize: 16, fontWeight: 500 }}>{title}</p> }
                    { lines.map((o, k) => <p key={k} style={{ fontSize: 14 }}>{o}</p>) }
                </div>
            ),
            onOk () {},
        });
    }
    render () {
        const { style } = this.props;
        return (
            <a onClick={::this.showHelp} className={styles.helpContainer}><p className={cn(styles.help, '__filter_click')} style={style}>?</p></a>
        );
    }
}

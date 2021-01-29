import React from 'react';
import { Iframe } from 'components';
import styles from './index.less';

export default class ShowHtml extends React.Component {
    render () {
        const { file } = this.props;
        return (
            <div className={styles.container}>
                {
                    file ?
                        <Iframe src={file} className={styles.iframe} />
                    :
                        <div style={{ color: '#c00000', fontSize: 16 }}>此页面已过期</div>
                }
            </div>
        );
    }
}

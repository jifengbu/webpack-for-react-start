import React from 'react';
import styles from './index.less';
import { ViewerImage } from 'components';

export default class DevelopPage extends React.Component {
    render () {
        return (
            <div className={styles.container}>
                <ViewerImage src={'/hbclient/img/common/build.png'} />
            </div>
        );
    }
}

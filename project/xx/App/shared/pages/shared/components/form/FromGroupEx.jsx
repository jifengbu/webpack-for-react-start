import React from 'react';
import { Row, Col } from 'antd';
import styles from './index.less';

export default class FromGroup extends React.Component {
    render () {
        const { children, editing, width } = this.props;
        return (
            editing &&
            <Row>
                <Col />
                {
                    React.Children.map(children, (item, index) => (
                        <div className={styles.groupEdit} key={index} style={{ width }}>
                            {item}
                        </div>
                    ))
                }
            </Row>
            ||
            <div className={styles.group}>
                { React.Children.map(children, (item, index) => item && React.cloneElement(item, { formGroup: true, key: index })) }
            </div>
        );
    }
}

import React from 'react';
import styles from './index.less';
import cn from 'classnames';

export default class FromGroup extends React.Component {
    render () {
        const { children, editing, className, ...otherProps } = this.props;
        return (
            <div className={cn(!editing ? styles.group : '', className)} {...otherProps}>
                { editing ? children : React.Children.map(children, (item, index) => item && React.cloneElement(item, { formGroup: true, key: index })) }
            </div>
        );
    }
}

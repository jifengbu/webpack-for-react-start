import React from 'react';
import { Switch } from 'antd';

export default class SwitchButton extends React.Component {
    onClick (check) {
        const { onClick, data } = this.props;
        onClick(check, data);
    }
    render () {
        const { checkedChildren, unCheckedChildren, checked } = this.props;
        return (
            <Switch checkedChildren={checkedChildren} unCheckedChildren={unCheckedChildren} checked={checked} onClick={:: this.onClick} />
        );
    }
}

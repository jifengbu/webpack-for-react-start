import React from 'react';
import { Link } from 'react-router';
import { Dropdown } from 'antd';
import { confirmMenuPassword } from 'utils';

export default class LinkButton extends React.Component {
    state = { visible: false };
    async handleLinkClick (e) {
        const { needPassword, label } = this.props;
        if (needPassword) {
            const target = e.target;
            if (!target.needPasswordClicked) {
                e.preventDefault();
                e.stopPropagation();
                if (await confirmMenuPassword(label)) {
                    if (this.props.href) {
                        window.location.href = this.props.href;
                    } else {
                        target.needPasswordClicked = true;
                        const event = document.createEvent('HTMLEvents');
                        event.initEvent('click', true, true);
                        event.eventType = 'message';
                        target.dispatchEvent(event);
                    }
                } else {
                    target.needPasswordClicked = false;
                }
            } else {
                target.needPasswordClicked = false;
            }
        } else {
            const forbidClose = this.props.forbidClose(this.props.to || this.props.href);
            const target = e.target;
            if (forbidClose && !target.forbidClose) {
                e.preventDefault();
                e.stopPropagation();
                if (!await forbidClose()) {
                    if (this.props.href) {
                        window.location.href = this.props.href;
                    } else {
                        target.forbidClose = true;
                        const event = document.createEvent('HTMLEvents');
                        event.initEvent('click', true, true);
                        event.eventType = 'message';
                        target.dispatchEvent(event);
                    }
                } else {
                    target.forbidClose = false;
                }
            } else {
                target.forbidClose = false;
            }
        }
    }
    hideListBar () {
        this.setState({ visible: false });
    }
    handleVisibleChange (flag) {
        this.setState({ visible: flag });
    }
    render () {
        const { href, to, className, children, menu } = this.props;
        const { visible } = this.state;
        return (
            href &&
            <a href={href} onClick={::this.handleLinkClick} className={className}>{children}</a>
            ||
            menu &&
            <Dropdown overlay={menu} placement='bottomCenter' visible={visible} onVisibleChange={::this.handleVisibleChange}>
                <Link to={to} onClick={::this.handleLinkClick} className={className}>{children}</Link>
            </Dropdown>
            ||
            <Link to={to} onClick={::this.handleLinkClick} className={className}>{children}</Link>
        );
    }
}

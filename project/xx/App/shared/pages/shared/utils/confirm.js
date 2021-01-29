import React from 'react';
import _ from 'lodash';
import { Modal, Input, notification } from 'antd';

export function confirm ({ pre, name, post = '', children }, onOk) {
    Modal.confirm({
        title: '确认',
        zIndex: 99999990,
        content: (
            children ||
            <div style={{ paddingTop: 10, fontSize: 14 }}>
                确定{pre}{name && <span style={{ color: 'red' }}>{name}</span>}{post}吗？
            </div>
        ),
        okText: '确定',
        cancelText: '取消',
        onOk,
    });
}
export function success (content) {
    Modal.success({
        title: '提示',
        content,
    });
}
export function error (content) {
    Modal.error({
        title: '错误提示',
        content,
    });
}
export function confirmWithPassword ({ title = '确认', pre, name, post = '', type = '登录' }, onOk) {
    let password = '';
    Modal.confirm({
        title,
        zIndex: 99999990,
        content: (
            <div style={{ paddingTop: 10, fontSize: 14 }}>
                {pre}{name && <span style={{ color: 'red' }}>{name}</span>}{post}需要确认身份，请输入{type}密码。
                <Input style={{ marginTop: 10 }} placeholder={`请输入${type}密码`} maxLength={20}
                    type='password' autoComplete='off' onContextMenu={_.noop} onPaste={_.noop}
                    onCopy={_.noop} onCut={_.noop} onChange={(e) => {
                        password = e.target.value;
                    }}
                    />
            </div>
        ),
        okText: '确定',
        cancelText: '取消',
        onOk: () => onOk(password),
    });
}
export function confirmForbidClose ({ pre, name, post = '' }) {
    return () => new Promise(resolve => {
        Modal.confirm({
            title: '警告',
            zIndex: 99999990,
            content: (
                <div style={{ paddingTop: 10, fontSize: 14 }}>
                    {pre}{name && <span style={{ color: 'red' }}>{name}</span>}{post}，是否坚持离开该页面？
                </div>
            ),
            okText: '确定',
            cancelText: '取消',
            onOk: () => { resolve(false); },
            onCancel: () => { resolve(true); },
        });
    });
}
export function confirmMenuPassword (name) {
    return new Promise(resolve => {
        let password = '';
        Modal.confirm({
            title: '警告',
            zIndex: 99999990,
            content: (
                <div style={{ paddingTop: 10, fontSize: 14 }}>
                    进入模块<span style={{ color: 'red' }}>{name}</span>需要确认身份，请输入密码。
                    <Input style={{ marginTop: 10 }} placeholder={`请输入密码`} maxLength={20}
                        type='password' autoComplete='off' onContextMenu={_.noop} onPaste={_.noop}
                        onCopy={_.noop} onCut={_.noop} onChange={(e) => {
                            password = e.target.value;
                        }}
                        />
                </div>
            ),
            okText: '确定',
            cancelText: '取消',
            className: '__confirm',
            onOk: () => {
                if (password === '123') {
                    resolve(true);
                } else {
                    resolve(false);
                }
            },
            onCancel: () => { resolve(false); },
        });
    });
}
export function handleEditCancel () {
    Modal.confirm({
        title: '提示',
        content: (
            <div style={{ paddingTop: 10, fontSize: 14 }}>
                确定取消吗？
            </div>
        ),
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
            this.setState({ pageData: _.cloneDeep(this.state.origin), editing: false });
        },
    });
}
export function showSuccess (info, title) {
    notification.success({ key: `success${Date.now()}`, description: info, message: title });
}
export function showError (info, title) {
    notification.error({ key: `error${Date.now()}`, description: info, message: title });
}

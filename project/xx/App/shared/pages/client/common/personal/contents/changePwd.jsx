import React from 'react';
import antd_form_create from 'decorators/antd_form_create';
import styles from './index.less';
import { Button, Form } from 'antd';
import { TextFormItem, DetailContainer } from 'components';
import { _, showError, showSuccess, testPassword } from 'utils';

@antd_form_create
export default class ChangePwd extends React.Component {
    state = {
        waiting: false,
    };
    handleReset () {
        this.props.closeChangePasswordModel();
    }
    handleSubmit (e) {
        e.preventDefault();
        const { actions, form } = this.props;
        form.validateFields((errors, value) => {
            if (errors) {
                _.mapValues(errors, (item) => {
                    showError(_.last(item.errors.map((o) => o.message)));
                });
                return;
            }
            this.setState({ waiting: true });
            actions.modifyPassword({
                oldPassword: value.oldPassword,
                newPassword: value.newPassword,
            }, (data) => {
                const { success, msg } = data;
                this.setState({ waiting: false });
                if (success) {
                    showSuccess('修改密码成功');
                    this.setState({ waiting: true });
                    this.props.closeChangePasswordModel();
                } else {
                    showError(msg);
                }
            });
        });
    }
    checkPass (rule, value, callback) {
        if (!testPassword(value)) {
            callback('密码只能由1-20位数字，大小写字母和英文符号组成');
            return;
        }
        const { validateFields } = this.props.form;
        if (value) {
            validateFields(['rePassword'], { force: true });
        }
        callback();
    }
    checkPass2 (rule, value, callback) {
        const { getFieldValue } = this.props.form;
        if (value && value !== getFieldValue('newPassword')) {
            callback('两次输入密码不一致');
        } else {
            callback();
        }
    }
    render () {
        const { form, loading, editing } = this.props;
        const { waiting } = this.state;
        return (
            <DetailContainer title={'修改密码'} {...{ loading, waiting, editing }}>
                <Form className={styles.form}>
                    <TextFormItem form={form} label='原来密码' value={{ oldPassword: '' }} layout={[7, 14]} editing
                        type='password' autoComplete='off' onContextMenu={_.noop} onPaste={_.noop} onCopy={_.noop} onCut={_.noop} />
                    <TextFormItem form={form} label='新密码' value={{ newPassword: '' }} layout={[7, 14]} editing
                        maxLength={20} rules={[ { min: 1, message: '密码至少为1位' }, { validator: ::this.checkPass } ]} type='password' autoComplete='off'
                        onContextMenu={_.noop} onPaste={_.noop} onCopy={_.noop} onCut={_.noop} />
                    <TextFormItem form={form} label='确认新密码' placeholder='两次输入密码保持一致' value={{ rePassword: '' }} layout={[7, 14]} editing
                        maxLength={20} rules={[ { whitespace: true }, { validator: ::this.checkPass2 } ]} type='password' autoComplete='off'
                        onContextMenu={_.noop} onPaste={_.noop} onCopy={_.noop} onCut={_.noop} />
                </Form>
                <div className={styles.buttonInnerContainer}>
                    <Button className={styles.button} type='primary' onClick={::this.handleSubmit}>设置密码</Button>
                    <Button type='ghost' onClick={::this.handleReset}><span style={{ marginLeft: 18 }} />取<span style={{ marginLeft: 18 }} />消<span style={{ marginLeft: 18 }} /></Button>
                </div>
            </DetailContainer>
        );
    }
}

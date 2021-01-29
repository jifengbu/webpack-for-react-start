import React from 'react';
import antd_form_create from 'decorators/antd_form_create';
import styles from './index.less';
import { Button, Form } from 'antd';
import { TextFormItem, DetailContainer } from 'components';
import { _, showError, showSuccess, checkPassword, confirmWithPassword } from 'utils';

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
        const { actions, form, member } = this.props;
        form.validateFields((errors, value) => {
            if (errors) {
                _.mapValues(errors, (item) => {
                    showError(_.last(item.errors.map((o) => o.message)));
                });
                return;
            }
            confirmWithPassword({ pre: '重置成员', name: member.name, post: '的密码' }, (password) => {
                this.setState({ waiting: true });
                actions.modifyMemberPassword({
                    memberId: member.id,
                    password,
                    newPassword: value.newPassword,
                }, (data) => {
                    const { success, msg } = data;
                    this.setState({ waiting: false });
                    if (success) {
                        showSuccess('重置密码成功');
                        this.setState({ waiting: true });
                        this.props.closeChangePasswordModel();
                    } else {
                        showError(msg);
                    }
                });
            });
        });
    }
    render () {
        const { form, loading, editing } = this.props;
        const { waiting } = this.state;
        return (
            <DetailContainer title={'修改密码'} {...{ loading, waiting, editing }}>
                <Form className={styles.form}>
                    <TextFormItem form={form} label='新密码' value={{ newPassword: '' }} layout={[7, 14]} editing
                        maxLength={20} rules={[ { min: 1, message: '密码至少为1位' }, { validator: checkPassword } ]} type='password' autoComplete='off'
                        onContextMenu={_.noop} onPaste={_.noop} onCopy={_.noop} onCut={_.noop} />
                </Form>
                <div className={styles.buttonInnerContainer}>
                    <Button className={styles.button} type='primary' onClick={::this.handleSubmit}>重置密码</Button>
                    <Button type='ghost' onClick={::this.handleReset}><span style={{ marginLeft: 18 }} />取<span style={{ marginLeft: 18 }} />消<span style={{ marginLeft: 18 }} /></Button>
                </div>
            </DetailContainer>
        );
    }
}

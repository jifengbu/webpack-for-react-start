import React from 'react';
import antd_form_create from 'decorators/antd_form_create';
import styles from './index.less';
import { Link } from 'react-router';
import { Button, Form, Modal, Row, Col } from 'antd';
import { TextFormItem } from 'components';
import { _, CO, testPassword, checkEmail, checkVerifyCode, showError } from 'utils';

@antd_form_create
export default class ForgotPwd extends React.Component {
    state = {
        waiting: false,
        timeCount: -1,
    };
    componentDidMount () {
        const now = Date.now();
        if (now < localStorage.VERIFY_END_TIME) {
            this.setState({ timeCount: Math.floor((localStorage.VERIFY_END_TIME - now) / 1000) });
            this.timer = setInterval(::this.updateTimeCount, 1000);
        }
    }
    componentWillUnmount () {
        this.timer && clearInterval(this.timer);
        this.timer = undefined;
    }
    handleReset (e) {
        e.preventDefault();
        this.props.form.resetFields();
    }
    handleSubmit (e) {
        e.preventDefault();
        const { actions, form, history } = this.props;
        form.validateFields((errors, value) => {
            if (errors) {
                _.mapValues(errors, (item) => {
                    showError(_.last(item.errors.map((o) => o.message)));
                });
                return;
            }
            this.setState({ waiting: true });
            actions.forgotPwd(value, (data) => {
                const { success, msg } = data;
                this.setState({ waiting: false });
                if (success) {
                    Modal.success({
                        content: '重置密码成功',
                        onOk: () => {
                            history.push({ pathname: '/hbclient/login', state: { phone: form.getFieldValue('phone') } });
                        },
                    });
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
        if (value && value !== getFieldValue('password')) {
            callback('两次输入密码不一致');
        } else {
            callback();
        }
    }
    updateTimeCount () {
        const timeCount = this.state.timeCount - 1;
        if (timeCount < 0) {
            this.timer && clearInterval(this.timer);
            this.timer = undefined;
        }
        this.setState({ timeCount });
    }
    getVerifyCode () {
        const { actions, form } = this.props;
        const email = form.getFieldValue('email');
        if (!/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(email)) {
            showError('请输入正确的邮箱');
            return;
        }
        localStorage.VERIFY_END_TIME = Date.now() + CO.VERIFY_TIME;
        this.timer = setInterval(::this.updateTimeCount, 1000);
        this.setState({ timeCount: CO.VERIFY_SET_TIME, waiting: true });
        actions.getVerifyCode(email, (data) => {
            const { success, msg } = data;
            if (success) {
                this.setState({ waiting: false });
                Modal.success({
                    content: '验证码已经发送到你的邮箱上，请注意查收',
                });
            } else {
                showError(msg);
                this.timer && clearInterval(this.timer);
                this.timer = undefined;
                this.setState({ waiting: false, timeCount: -1 });
            }
        });
    }
    render () {
        const { form } = this.props;
        const { waiting, timeCount } = this.state;
        return (
            <div className={styles.container} style={{ visibility: typeof window === 'undefined' ? 'hidden' : 'visible' }}>
                <div className={styles.topContainer}>
                    <Link to='/hbclient/login'>
                        <Button className={styles.topButton} loading={waiting}>登录</Button>
                    </Link>
                </div>
                <div className={styles.bottomContainer}>
                    <div className={styles.formContainer}>
                        <Form className={styles.form}>
                            <Row>
                                <Col span={18}>
                                    <TextFormItem form={form} label='邮箱' value={{ email: '' }} layout={[7, 14]} editing
                                        rules={[ { validator: checkEmail } ]} style={{ marginBottom: 0, marginLeft: 50 }} />
                                </Col>
                                <Col span={4}>
                                    <Button type='primary' onClick={::this.getVerifyCode} loading={timeCount > 0} style={{ backgroundColor: timeCount < 0 ? 'rgba(21, 140, 196, 0.8)' : '#8B8386' }} className={timeCount < 0 ? styles.verifyButton : styles.verifyButtonSelected}>
                                        { timeCount < 0 ? '获取验证码' : <span style={{ marginLeft: 10 }}>{'还剩' + timeCount + '秒'}</span> }
                                    </Button>
                                </Col>
                            </Row>
                            <TextFormItem form={form} label='验证码' value={{ verifyCode: '' }} layout={[7, 14]} editing
                                maxLength={6} rules={[ { validator: checkVerifyCode } ]} />
                            <TextFormItem form={form} label='新密码' value={{ password: '' }} layout={[7, 14]} editing
                                maxLength={20} rules={[ { min: 1, message: '密码至少为1位' }, { validator: ::this.checkPass } ]} type='password' autoComplete='off'
                                onContextMenu={_.noop} onPaste={_.noop} onCopy={_.noop} onCut={_.noop} />
                            <TextFormItem form={form} label='确认新密码' placeholder='两次输入密码保持一致' value={{ rePassword: '' }} layout={[7, 14]} editing
                                maxLength={20} rules={[ { whitespace: true }, { validator: ::this.checkPass2 } ]} type='password' autoComplete='off'
                                onContextMenu={_.noop} onPaste={_.noop} onCopy={_.noop} onCut={_.noop} />
                        </Form>
                        <div className={styles.buttonInnerContainer}>
                            <Button className={styles.button} style={{ backgroundColor: 'rgba(21, 140, 196, 0.8)' }} type='primary' onClick={::this.handleSubmit}>重置密码</Button>
                            <Button type='ghost' onClick={::this.handleReset}><span style={{ marginLeft: 10 }} />清<span style={{ marginLeft: 10 }} />空<span style={{ marginLeft: 10 }} /></Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

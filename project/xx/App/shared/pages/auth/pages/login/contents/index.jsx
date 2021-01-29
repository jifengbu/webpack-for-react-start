import React from 'react';
import antd_form_create from 'decorators/antd_form_create';
import styles from './index.less';
import { Button, Form, Checkbox } from 'antd';
import { TextFormItem } from 'components';
import { _, lc, searchMgr, checkTelePhone, showError, getWindowLocationSearch } from 'utils';

@antd_form_create
export default class Login extends React.Component {
    constructor (props) {
        super(props);
        const loginInfo = lc.getObject('LOGIN_INFO', null);
        const { phone, password } = getWindowLocationSearch();
        this.state = {
            waiting: false,
            isAutoLogin: !!loginInfo,
            isLogining: !!loginInfo || (phone && password),
        };
        if (phone && password) {
            return this.login(phone, password, true);
        }
        if (loginInfo) {
            return this.login(loginInfo.phone, loginInfo.password, true);
        }
    }
    login (phone, password, autoLogin) {
        const { actions, history } = this.props;
        const { isAutoLogin } = this.state;
        this.setState({ waiting: true });
        actions.login({ phone, password }, (data) => {
            const { success, msg } = data;
            if (success) {
                if (!autoLogin && isAutoLogin) {
                    lc.setObject('LOGIN_INFO', { phone, password });
                }
                searchMgr.clear();
                history.replace({ pathname: '/hbclient' });
            } else {
                this.setState({ waiting: false });
                showError(msg);
            }
        });
    }
    handleSubmit (e) {
        e.preventDefault();
        const { form } = this.props;
        form.validateFields((errors, value) => {
            if (errors) {
                _.mapValues(errors, (item) => {
                    showError(_.last(item.errors.map((o) => o.message)));
                });
                return;
            }
            this.login(value.phone, value.password);
        });
    }
    handleCheckboxChange (e) {
        this.setState({ isAutoLogin: e.target.checked });
    }
    render () {
        const { waiting, isAutoLogin, isLogining, phone, password } = this.state;
        const { form } = this.props;
        return (
            <div className={styles.container} style={{ visibility: typeof window === 'undefined' ? 'hidden' : 'visible' }}>
                <div className={styles.topContainer}>
                    <div className={styles.loginTop}>
                        <img src='/hbclient/img/login/logo.png' style={{ height: 70 }} />
                        <text style={{ marginLeft: 20, width: 400 }}>惠水县基层治理平台</text>
                    </div>
                </div>
                <div className={styles.bottomContainer}>
                    {
                        !isLogining &&
                        <div className={styles.formContainer}>
                            <Form className={styles.form}>
                                <TextFormItem onPressEnter={::this.handleSubmit}
                                    form={form} label='用户名' value={{ phone }} layout={[7, 12]} editing
                                    maxLength={11} rules={[ { validator: checkTelePhone } ]} />
                                <TextFormItem onPressEnter={::this.handleSubmit}
                                    form={form} label='密码' value={{ password }} layout={[7, 12]} editing
                                    maxLength={20} rules={[ { whitespace: true } ]} type='password' autoComplete='off'
                                    onContextMenu={_.noop} onPaste={_.noop} onCopy={_.noop} onCut={_.noop} />
                            </Form>
                            <div className={styles.formBottomContainer}>
                                <Checkbox className={styles.checkbox} defaultChecked={isAutoLogin} onChange={::this.handleCheckboxChange}>
                                    下次自动登录
                                </Checkbox>
                            </div>
                            <Button className={styles.loginButton} style={{ backgroundColor: 'rgba(21, 140, 196, 0.8)', color: '#fff' }} type='primary' onClick={::this.handleSubmit} loading={waiting}>登 录</Button>
                        </div>
                        ||
                        <div className={styles.autoLogin}>
                            正在登录中，请稍后...
                        </div>
                    }
                </div>
            </div>
        );
    }
}

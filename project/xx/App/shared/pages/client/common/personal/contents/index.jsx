import React from 'react';
import antd_form_create from 'decorators/antd_form_create';
import { Form, Modal } from 'antd';
import { PlainFormItem, DetailContainer, ImageFormItem } from 'components';
import { _, CO, handleEditCancel, showSuccess, showError } from 'utils';
import ChangePwd from './changePwd';
import styles from './index.less';
@antd_form_create
export default class Personal extends React.Component {
    static fragments = {
        personal: 1,
    };
    state = {
        waiting: false,
        editing: false,
        pageData: {},
        changePasswordVisible: false,
    }
    componentWillMount () {
        const { rootPersonal } = this.props;
        this.setState({ pageData: _.cloneDeep(rootPersonal), origin: _.cloneDeep(rootPersonal) });
    }
    componentWillReceiveProps (nextProps) {
        const props = this.props;
        const { personal, rootPersonal } = nextProps;
        if (personal && !_.isEqual(props.personal, personal)) {
            props.updatePersonal(personal);
            this.setState({ pageData: _.cloneDeep(personal), origin: _.cloneDeep(personal) });
        } else if (!_.isEqual(props.rootPersonal, rootPersonal)) {
            this.setState({ pageData: _.cloneDeep(rootPersonal), origin: _.cloneDeep(rootPersonal) });
        }
    }
    handleSubmit (e) {
        e.preventDefault();
        const { editing, origin } = this.state;
        if (editing) {
            const { actions, form, updatePersonal } = this.props;
            form.validateFields((errors, value) => {
                if (errors) {
                    _.mapValues(errors, (item) => {
                        showError(_.last(item.errors.map((o) => o.message)));
                    });
                    return;
                }
                value.birthday && (value.birthday = value.birthday.format('YYYY-MM-DD'));
                value.head === '/hbclient/img/common/default_head.png' && (value.head = '');

                _.forIn(value, (v, k) => {
                    if (_.isEqual(origin[k], v)) {
                        delete value[k];
                    }
                });
                if (!_.keys(value).length) {
                    showError('信息没有任何改变，无需修改');
                    return;
                }
                actions.modifyPersonalInfo(value, (data) => {
                    this.setState({ waiting: false });
                    if (data.success) {
                        this.setState({ editing: false, pageData: data.context });
                        updatePersonal(data.context);
                        showSuccess('修改成功');
                    } else {
                        showError(data.msg);
                    }
                });
            });
        } else {
            this.setState({ editing: true });
        }
    }
    handleImageChange (url) {
        const { pageData } = this.state;
        pageData.head = url;
        this.setState({ pageData });
    }

    showChangePasswordModel () {
        this.setState({ changePasswordVisible: true });
    }
    closeChangePasswordModel () {
        this.setState({ changePasswordVisible: false });
    }

    render () {
        const { loading, rootPersonal, form } = this.props;
        const { waiting, editing, pageData, changePasswordVisible } = this.state;
        const { head, phone, name, authority } = pageData;

        return (
            <DetailContainer title='个人信息' {...{ loading, waiting, editing }} buttons={[
                    { text: '取消修改', onClick: handleEditCancel.bind(this), visible: editing },
                    { text: !editing ? '修改' : '确认修改', onClick: ::this.handleSubmit },
                    { text: '修改登陆密码', onClick: ::this.showChangePasswordModel, visible: !editing },
            ]} >
                <Form>
                    <ImageFormItem form={form} label='头像' value={{ head }} classNames={[styles.headContainer, styles.head]} editing={editing} required={false} />
                    <PlainFormItem label='登录用户名' value={phone} />
                    <PlainFormItem label='姓名' value={name} />
                    { authority && <PlainFormItem label='拥有权限' value={authority.map(o => CO.AH_MAP[o]).filter(o => !!o).join('、')} /> }
                </Form>
                {
                    changePasswordVisible &&
                    <Modal visible closable={false} footer={null} >
                        <ChangePwd actions={this.props.actions} history={this.props.history} rootPersonal={rootPersonal} closeChangePasswordModel={::this.closeChangePasswordModel} />
                    </Modal>
                }
            </DetailContainer>
        );
    }
}

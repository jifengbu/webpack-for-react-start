import React from 'react';
import antd_form_create from 'decorators/antd_form_create';
import { Form } from 'antd';
import { TextFormItem, SearchFormItem, SearchMultiFormItem, SelectFormItem, ImageFormItem, RadioFormItem, DetailContainer } from 'components';
import { _, CO, checkPassword, handleEditCancel, checkTelePhone, checkEmail, showSuccess, showError } from 'utils';
import SelectOrganization from 'pages/SelectOrganization';
import styles from './index.less';

@antd_form_create
export default class MemberDetail extends React.Component {
    static fragments = {
        member: 1,
        roles: 1,
    };
    state = {
        waiting: false,
        editing: this.props.editing || this.props.operType === 0,
        pageData: {},
    }
    componentWillReceiveProps (nextProps) {
        if (this.props.operType === 1) {
            const { member } = nextProps;
            if (!_.isEqual(member, this.props.member)) {
                this.setState({
                    pageData: _.cloneDeep(member),
                    origin: _.cloneDeep({
                        ...member,
                        organizationId: (member.organization || {}).id,
                        roleId: (member.role || {}).id,
                        visibleOrganizationIds: _.map(member.visibleOrganizations, o => o.id),
                    }),
                });
            }
        }
    }
    handleSubmit (e) {
        e.preventDefault();
        const { origin } = this.state;
        const { actions, form, history, operType, memberId, roles } = this.props;
        const sumbit = operType === 0 ? actions.createMember : actions.modifyMember;
        form.validateFields((errors, value) => {
            if (errors) {
                _.mapValues(errors, (item) => {
                    showError(_.last(item.errors.map((o) => o.message)));
                });
                return;
            }
            value.roleId = _.find(roles.list, o => o.name == value.roleId).id;
            value.authority = _.map(value.authority, o => _.findKey(CO.AH_MAP, k => k === o) * 1);
            value.organizationId = this.organizationForm.getValue().id;
            if (operType === 1) {
                _.forIn(value, (v, k) => {
                    if (_.isEqual(origin[k], v)) {
                        delete value[k];
                    }
                });
                if (!_.keys(value).length) {
                    showError('信息没有任何改变，无需修改');
                    this.setState({ editing: false });
                    return;
                }
                value.memberId = memberId;
                value.visibleOrganizations = value.visibleOrganizationIds;
                delete value.visibleOrganizationIds;
            }
            this.setState({ waiting: true });
            sumbit(value, (data) => {
                this.setState({ waiting: false });
                if (data.success) {
                    showSuccess((operType === 0 ? '创建' : '修改') + '成功');
                    this.props.table && this.props.table.update(operType === 0);
                    this.props.updateTreeList && this.props.updateTreeList(data.context);
                    history.goBack();
                } else {
                    showError(data.msg);
                }
            });
        });
    }
    getEditVisible (rootPersonal, record) {
        if (!record.role) {
            return false;
        }
        const { userId, authority, role } = rootPersonal;
        const selfIsSuperAdmin = role.isSuperAdmin; // 自己是管理员
        const targetIsSuperAdmin = record.role.isSuperAdmin; // 操作对象是管理员
        const isSelf = userId === record.id; // 是否是本人
        const isAuthExcluded = _.difference(record.authority, authority).length > 0 || _.isEqual(_.sortBy(record.authority), _.sortBy(authority)); // 权限等于或者超出自己
        const isParent = _.includes(record.parents, userId); // 我是否是对方的上级
        if (isSelf) { // 不能修改自己
            return false;
        }
        if (isParent) { // 如果我是对方的上级，则可以修改
            return true;
        }
        if (targetIsSuperAdmin) { // 如果对方是管理员，则不能修改
            return false;
        }
        if (selfIsSuperAdmin) { // 如果自己是管理员，可以修改除自己之外的任何人
            return true;
        }
        if (isAuthExcluded) { // 如果对方的权限超过自己，则不能修改
            return false;
        }
        return true;
    }
    render () {
        const { form, history, loading, operType, rootPersonal, hasAuthority, roles = {}, parentOrganization } = this.props;
        const { waiting, editing, pageData } = this.state;
        const { organization = {}, role = {}, head, name, phone, email, sex = 0, authority, policeCode, visibleOrganizations, position, parent } = pageData;
        const roleOptions = _.map(roles.list, o => o.name);
        return (
            <DetailContainer title='成员信息' {...{ history, loading, waiting, editing, operType }} buttons={[
                    { text: '取消修改', onClick: handleEditCancel.bind(this), visible: operType === 1 && editing },
                { text: operType === 0 ? '创建成员' : !editing ? '修改' : '确认修改', onClick: :: this.handleSubmit, visible: operType === 0 || (hasAuthority(CO.AH_MODIFY_MEMBER) && this.getEditVisible(rootPersonal, pageData)) },
            ]} >
                <Form>
                    {
                        parentOrganization && <SearchFormItem form={form} label='所在机构' value={{ parentOrganization }} name='name' ref={(ref) => { this.organizationForm = ref; }} />
                        ||
                        organization && <SearchFormItem form={form} label='所在机构' value={{ organization }} name='name' SelectComponent={SelectOrganization} editing={editing} ref={(ref) => { this.organizationForm = ref; }} />
                        ||
                        <SearchFormItem form={form} label='所在机构' value={{ parentId: parent }} name='name' SelectComponent={SelectOrganization} editing={editing} ref={(ref) => { this.organizationForm = ref; }} />
                    }
                    <SearchMultiFormItem required={false} ref={(ref) => { this.visibleOrganizationsForm = ref; }} form={form} label='管理的组织机构' value={{ visibleOrganizationIds: visibleOrganizations }} name='name' SelectComponent={SelectOrganization} editing={editing} />
                    <SelectFormItem
                        form={form} label='角色名称:'
                        value={{ roleId: role.name }}
                        options={roleOptions}
                        editing={editing}
                        optionFilterProp='children'
                        placeholder='搜索选择角色'
                        showSearch
                        filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        />
                    <ImageFormItem form={form} label='头像' value={{ head }} classNames={[styles.headContainer, styles.head]} editing={editing} required={false} />
                    <TextFormItem form={form} label='姓名' value={{ name }} maxLength={10} editing={editing} />
                    <TextFormItem form={form} label='手机号码' value={{ phone }} editing={editing} maxLength={11} rules={[ { validator: checkTelePhone } ]} />
                    <TextFormItem form={form} label='邮箱' value={{ email }} editing={editing} rules={[ { validator: checkEmail } ]} required={false} />
                    <TextFormItem form={form} label='职位' value={{ position }} editing={editing} required={false} />
                    { operType === 0 && <TextFormItem form={form} label='登录密码' value={{ password: '' }} placeholder='请输入登录密码，不输入默认为登录电话的后六位' maxLength={20} rules={[ { validator: checkPassword } ]} editing={editing} required={false} /> }
                    { rootPersonal.policeCode && <TextFormItem form={form} label='警员编号' value={{ policeCode }} maxLength={6} editing={editing} required={false} /> }
                    <RadioFormItem form={form} label='性别' value={{ sex }} titles={['男', '女']} editing={editing} />
                    { operType === 1 && <SelectFormItem form={form} mode='multiple' label='用户拥有权限' value={{ authority }} options={CO.AH_MAP} editing={editing} />}
                </Form>
            </DetailContainer>
        );
    }
}

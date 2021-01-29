import React from 'react';
import antd_form_create from 'decorators/antd_form_create';
import { Form } from 'antd';
import { TextFormItem, DetailContainer, SelectFormItem } from 'components';
import { _, CO, handleEditCancel, showSuccess, showError } from 'utils';

@antd_form_create
export default class RoleDetail extends React.Component {
    static fragments = {
        role: 1,
    };
    state = {
        waiting: false,
        editing: this.props.editing || false,
        pageData: {},
    }
    componentWillReceiveProps (nextProps) {
        if (this.props.operType === 1) {
            const { role } = nextProps;
            if (!_.isEqual(role, this.props.role)) {
                this.setState({ pageData: _.cloneDeep(role), origin: _.cloneDeep(role) });
            }
        }
    }
    handleSubmit (e) {
        e.preventDefault();
        const { editing, origin } = this.state;
        if (editing) {
            const { actions, form, history, operType, roleId } = this.props;
            const sumbit = operType === 0 ? actions.createRole : actions.modifyRole;
            form.validateFields((errors, value) => {
                if (errors) {
                    _.mapValues(errors, (item) => {
                        showError(_.last(item.errors.map((o) => o.message)));
                    });
                    return;
                }
                value.authority = _.map(value.authority, o => _.findKey(CO.AH_MAP, k => k === o) * 1);
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
                    value.roleId = roleId;
                }
                this.setState({ waiting: true });
                sumbit(value, (data) => {
                    this.setState({ waiting: false });
                    if (data.success) {
                        showSuccess((operType === 0 ? '创建' : '修改') + '成功');
                        this.props.table.update(operType === 0);
                        history.goBack();
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
        pageData.image = url;
        this.setState({ pageData });
    }
    render () {
        const { form, history, loading, operType, hasAuthority } = this.props;
        const { waiting, editing, pageData } = this.state;
        const { name, description, authority } = pageData;
        return (
            <DetailContainer title='角色管理' {...{ history, loading, waiting, editing, operType }} buttons={[
                    { text: '取消修改', onClick: handleEditCancel.bind(this), visible: operType === 1 && editing },
                    { text: operType === 0 ? '确认新增' : !editing ? '修改' : '确认修改', onClick: ::this.handleSubmit, visible: operType === 0 || hasAuthority(CO.AH_MODIFY_ROLE) },
            ]} >
                <Form>
                    <TextFormItem form={form} label='角色名称' value={{ name }} editing={editing} />
                    <TextFormItem form={form} label='角色描述' value={{ description }} editing={editing} rows={5} required={false} />
                    <SelectFormItem form={form} mode='multiple' label='用户拥有权限' value={{ authority }} options={CO.AH_MAP} editing={editing} />
                </Form>
            </DetailContainer>
        );
    }
}

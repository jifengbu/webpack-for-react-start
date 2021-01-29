import React from 'react';
import antd_form_create from 'decorators/antd_form_create';
import { Form } from 'antd';
import { TextFormItem, DetailContainer, SelectFormItem, SearchFormItem, NumberFormItem, ImageFormItem, LocateFormItem, PlainFormItem } from 'components';
import { _, CO, handleEditCancel, showSuccess, showError } from 'utils';
import styles from './index.less';
import SelectOrganization from 'pages/SelectOrganization';

@antd_form_create
export default class OrganizationDetail extends React.Component {
    static fragments = {
        organization: 1,
    };
    state = {
        waiting: false,
        editing: this.props.editing || false,
        pageData: {},
    }
    componentWillReceiveProps (nextProps) {
        if (this.props.operType === 1) {
            const { organization } = nextProps;
            if (!_.isEqual(organization, this.props.organization)) {
                this.setState({ pageData: _.cloneDeep(organization), origin: _.cloneDeep(organization) });
            }
        }
    }
    handleSubmit (e) {
        e.preventDefault();
        const { editing, origin } = this.state;
        if (editing) {
            const { actions, form, history, operType, organizationId, parentId } = this.props;
            const sumbit = operType === 0 ? actions.createOrganization : actions.modifyOrganization;
            form.validateFields((errors, value) => {
                if (errors) {
                    _.mapValues(errors, (item) => {
                        showError(_.last(item.errors.map((o) => o.message)));
                    });
                    return;
                }
                const { address, location, detailAddress } = this.locateFormItem && this.locateFormItem.getValue() || {};
                value.address = address;
                value.location = location;
                value.detailAddress = detailAddress;
                value.authority = _.map(value.authority, o => _.findKey(CO.AH_MAP, k => k === o) * 1);
                value.type = _.findKey(CO.TS_ORGANIZATION_YPES, o => o === value.type);
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
                    value.organizationId = organizationId;
                }
                if (parentId) {
                    value.parentId = parentId;
                }
                if (this.organizationForm) {
                    value.parentId = this.organizationForm && this.organizationForm.getValue().id;
                }
                this.setState({ waiting: true });
                sumbit(value, (data) => {
                    this.setState({ waiting: false });
                    if (data.success) {
                        showSuccess((operType === 0 ? '创建' : '修改') + '成功');
                        this.props.update && this.props.update(data.context);
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
        const { form, history, loading, operType, hasAuthority, rootPersonal, parentName, propsType } = this.props;
        const { waiting, editing, pageData } = this.state;
        const { name, description, level, type, postNumber, image, address, location, detailAddress, parent } = pageData;
        const isSuperAdmin = rootPersonal && rootPersonal.role && rootPersonal.role.isSuperAdmin;
        return (
            <DetailContainer title='组织机构创建' {...{ history, loading, waiting, editing, operType }} buttons={[
                        { text: '取消修改', onClick: handleEditCancel.bind(this), visible: operType === 1 && editing },
                        { text: operType === 0 ? '确认新增' : !editing ? '修改' : '确认修改', onClick: ::this.handleSubmit, visible: operType === 0 || hasAuthority(CO.AH_MODIFY_ORGANIZATION) },
            ]} >
                <Form>
                    {
                            parent && <SearchFormItem form={form} label='上级机构' value={{ parentId: parent }} name='name' SelectComponent={SelectOrganization} editing={editing} ref={(ref) => { this.organizationForm = ref; }} />
                        ||
                        <PlainFormItem label='上级机构'>{parentName}</PlainFormItem>
                    }
                    <TextFormItem form={form} label={propsType ? '网格名称' : '机构名称'} value={{ name }} editing={editing} />
                    { isSuperAdmin && <NumberFormItem form={form} label='等级' disabled={propsType} min={0} max={10000} step={1} value={{ level }} editing={editing} required={false} /> }
                    { isSuperAdmin && <SelectFormItem form={form} label='类型' disabled={propsType} value={{ type: propsType || type }} options={CO.TS_ORGANIZATION_YPES} editing={editing} required={false} /> }
                    <TextFormItem form={form} label='描述' value={{ description }} editing={editing} required={false} />
                    <TextFormItem form={form} label='邮政编码' value={{ postNumber }} disabled={propsType} editing={editing} required={false} />
                    <ImageFormItem form={form} label='图片' value={{ image }} classNames={[styles.headContainer, styles.head]} editing={editing} required={false} />
                    <LocateFormItem form={form} label='地址' editing={editing} address={address} location={location} detailAddress={detailAddress} ref={ref => { this.locateFormItem = ref; }} />
                </Form>
            </DetailContainer>
        );
    }
}

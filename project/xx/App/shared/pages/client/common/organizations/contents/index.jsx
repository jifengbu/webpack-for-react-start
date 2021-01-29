import React from 'react';
import antd_form_create from 'decorators/antd_form_create';
import { OrganizationTreeList, DateFormItem, DetailContainer, SelectFormItem, SearchFormItem, NumberFormItem, TextFormItem, ImageFormItem, LocateFormItem, SearchMultiFormItem, RadioFormItem } from 'components';
import { _, CO, download, confirmWithPassword, showSuccess, showError, config, handleEditCancel, urlParam, checkTelePhone, checkEmail, checkPassword, showDialog } from 'utils';
import { Form, Modal, Upload, Icon } from 'antd';
import { apiQuery } from 'relatejs';
import styles from './index.less';
import SelectOrganization from 'pages/SelectOrganization';

const { Dragger } = Upload;

@antd_form_create
export default class Organizations extends React.Component {
    static fragments = {
        organizationTree: 1,
        roles: 1,
    };
    state = {
        pageData: {},
        showTreeList: true,
        editing: false,
        operType: 1,
    };
    componentWillReceiveProps (nextProps) {
        const { organizationTree } = nextProps;
        if (!_.isEqual(organizationTree, this.props.organizationTree)) {
            const item = (organizationTree.list || [])[0];
            item && this.showDetail(null, item);
        }
    }
    handleSubmit (e) {
        e.preventDefault();
        const { editing, origin, operType } = this.state;
        if (editing) {
            const { actions, form } = this.props;
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
                value.type = _.findKey(CO.TS_ORGANIZATION_YPES, o => value.type == o);
                !value.type && (value.type = '');
                if (operType === 1) {
                    _.forIn(value, (v, k) => {
                        if (_.isEqual(origin[k], v)) {
                            delete value[k];
                        }
                    }); ;
                    if (!_.keys(value).length) {
                        showError('信息没有任何改变，无需修改');
                        this.setState({ editing: false });
                        return;
                    }
                    console.log('=======', JSON.stringify(value));
                    value.organizationId = origin.id;
                }
                value.parentId = this.organizationForm && this.organizationForm.getValue().id;
                this.setState({ waiting: true });
                sumbit(value, (data) => {
                    if (data.success) {
                        const organization = data.context;
                        this.setState({
                            pageData: _.cloneDeep(organization),
                            origin: _.cloneDeep({ ...organization, parentId: (organization.parent || {}).id }),
                            waiting: false,
                        });
                        if (operType === 1) {
                            showSuccess(`修改成功`);
                            this.setState({ editing: false });
                            if (organization.name !== this.data.name) {
                                this.data.name = organization.name;
                                this.list.update(organization.id);
                            }
                        } else {
                            showSuccess(`创建成功`);
                            this.setState({ editing: false, operType: 1 });
                            this.data.children = (this.data.children || []);
                            this.data.children.push({ name: organization.name, id: organization.id, isLeaf: true });
                            this.list.update(organization.id);
                        }
                    } else {
                        this.setState({ waiting: false });
                        showError(data.msg);
                    }
                });
            });
        } else {
            this.setState({ editing: true, operType: 1 });
        }
    }
    modifyMember (e) {
        e.preventDefault();
        const { origin, editing, operType } = this.state;
        const { actions, form, roles } = this.props;
        const sumbit = actions.modifyMember;
        if (editing) {
            form.validateFields((errors, value) => {
                if (errors) {
                    _.mapValues(errors, (item) => {
                        showError(_.last(item.errors.map((o) => o.message)));
                    });
                    return;
                }
                value.roleId = _.find(roles.list, o => o.name == value.roleId).id;
                value.authority = _.map(value.authority, o => _.findKey(CO.AH_MAP, k => k === o) * 1);
                if (operType === 1) {
                    _.forIn(value, (v, k) => {
                        if (_.isEqual(origin[k], v)) {
                            delete value[k];
                        }
                        if (k === 'roleId' && _.isEqual((origin.role || {}).id, v)) {
                            delete value[k];
                        }
                    });
                    if (!_.keys(value).length) {
                        showError('信息没有任何改变，无需修改');
                        this.setState({ editing: false });
                        return;
                    }
                    value.memberId = this.data.id;
                    value.visibleOrganizations = value.visibleOrganizationIds;
                    delete value.visibleOrganizationIds;
                }
                this.setState({ waiting: true });
                sumbit(value, (data) => {
                    this.setState({ waiting: false });
                    if (data.success) {
                        const member = data.context;
                        showSuccess('修改成功');
                        this.setState({ editing: false, pageData: member });
                        if (member.name !== this.data.name) {
                            this.data.name = member.name;
                            this.list.update(member.organization.id);
                        }
                    } else {
                        showError(data.msg);
                    }
                });
            });
        } else {
            this.setState({ editing: true, operType: 1 });
        }
    }
    updateAfterCreate (organization) {
        this.data.children = (this.data.children || []);
        this.data.children.push({ name: organization.name, id: organization.id, isLeaf: true });
        this.list.update(organization.id);
    }
    updateAfterCreateMember (member) {
        this.data.children = (this.data.children || []);
        this.data.children.push({ name: member.name, phone: member.phone, id: member.id, type: 'member', isLeaf: true });
        this.list.update(member.id);
    }
    removeOrganization () {
        const { pageData, organizationType } = this.state;
        if (organizationType == 2) {
            confirmWithPassword({ pre: '确定要删除', name: `${pageData.name}` }, (password) => {
                const { actions } = this.props;
                actions.removeMember(pageData.id, password, (data) => {
                    if (!data.success) {
                        showError(data.msg);
                    } else {
                        showSuccess('删除成功');
                        const index = _.findIndex(this.parent.children, o => o.id === this.data.id);
                        this.parent.children.splice(index, 1);
                        this.list.update(this.parent.id);
                        if (this.parent.children.length) {
                            this.showDetail(this.parent, this.parent.children[index] || this.parent.children[index - 1]);
                        } else {
                            this.showDetail(this.list.getNode(this.parent.parentId), this.parent);
                        }
                    }
                });
            });
        } else {
            confirmWithPassword({ pre: '删除组织机构：', name: `${pageData.name}` }, (password) => {
                const { actions } = this.props;
                actions.removeOrganization(pageData.id, password, (data) => {
                    if (!data.success) {
                        showError(data.msg);
                    } else {
                        showSuccess('删除成功');
                        const index = _.findIndex(this.parent.children, o => o.id === this.data.id);
                        this.parent.children.splice(index, 1);
                        this.list.update(this.parent.id);
                        if (this.parent.children.length) {
                            this.showDetail(this.parent, this.parent.children[index] || this.parent.children[index - 1]);
                        } else {
                            this.showDetail(this.list.getNode(this.parent.parentId), this.parent);
                        }
                    }
                });
            });
        }
    }
    update () {
        this.props.refresh(() => {
            this.setState({ showTreeList: false }, () => {
                this.setState({ showTreeList: true });
            });
        });
    }
    showDetail (parent, data) {
        this.parent = parent;
        this.data = data;
        const { pageData } = this.state;
        if (pageData.id === data.id) {
            return;
        }
        if (data.type !== 'member') {
            this.setState({ organizationType: 1 });
        } else {
            this.setState({ organizationType: 2 });
        }
        this.setState({ waiting: true, editing: false }, () => {
            if (data.type !== 'member') {
                apiQuery({
                    fragments: { organization: 1 },
                    variables: {
                        organization: { data: { value: { organizationId: data.id }, type: 'JSON!' } },
                    },
                }, (result) => {
                    const organization = result.organization || {};
                    this.setState({
                        pageData: _.cloneDeep(organization),
                        origin: _.cloneDeep({ ...organization, parentId: (organization.parent || {}).id }),
                        waiting: false,
                    });
                })();
            } else {
                apiQuery({
                    fragments: { member: 1 },
                    variables: {
                        member: { data: { value: { memberId: data.id }, type: 'JSON!' } },
                    },
                }, (result) => {
                    const member = result.member || {};
                    this.setState({
                        pageData: _.cloneDeep(member),
                        origin: _.cloneDeep(member),
                        waiting: false,
                    });
                })();
            }
        });
    }
    excelExport () {
        const { rootPersonal } = this.props;
        const { pageData } = this.state;
        const params = {
            userId: rootPersonal.userId,
            organizationId: pageData.id,
        };
        download(`${config.apiServer}/hb/api/member/getOrganizationExports?${urlParam(params)}`, '组织机构表.xlsx');
    }
    importExport () {
        const { rootPersonal } = this.props;
        const { pageData } = this.state;
        const update = this.update.bind(this);
        const props = {
            name: 'file',
            multiple: true,
            action: `/hb/api/member/uploadOrganizationExcel`,
            data: { userId: rootPersonal.userId, organizationId: pageData.id || '' },
            onChange (info) {
                const { status } = info.file;
                if (status === 'done') {
                    const { response } = info.file;
                    if (response.success) {
                        showSuccess(`${info.file.name}上传成功`);
                        update();
                        modal.destroy();
                    } else {
                        response.context && response.context.errorExcelUrl && download(response.context.errorExcelUrl, '错误表.xlsx');
                        showError(`${response.msg}`);
                    }
                } else if (status === 'error') {
                    showError(`${info.file.name}上传失败`);
                }
            },
        };
        const excle_url = `${config.apiServer}/hb/template/组织机构表.xlsx`;
        const modal = Modal.info({
            title: '文件导入',
            content: (
                <div className={styles.upload}>
                    <a className={styles.download} onClick={() => download(excle_url, '组织机构表.xlsx')} target='_blank'>下载模板</a>
                    <Dragger {...props} className={styles.dragger}>
                        <p className='ant-upload-drag-icon'>
                            <Icon type='receiveFiles' />
                        </p>
                        <p className='ant-upload-text'>文件拖入此处上传或者点击手动上传</p>
                    </Dragger>
                </div>
            ),
            onOk () {},
            okText: '关闭',
            width: 600,
        });
    }
    createChildOrganization () {
        const { pageData } = this.state;
        const { history } = this.props;
        history.push({ dialog: { title: '创建下级组织机构', full: false }, pathname: '/hbclient/organizations/detail', state: { update: ::this.updateAfterCreate, operType: 0, editing: true, parentId: pageData.id, parentName: pageData.name } });
    }
    createOrganizationMember () {
        const { history } = this.props;
        const { pageData } = this.state;
        history.push({ dialog: { title: '创建机构人员', full: false }, pathname: '/hbclient/members/detail', state: { operType: 0, updateTreeList: ::this.updateAfterCreateMember, parentOrganization: pageData, editing: true } });
    }
    render () {
        const { form, loading, hasAuthority, rootPersonal, organizationTree = {}, origin = {}, roles = {} } = this.props;
        const { waiting, editing, pageData, operType, showTreeList, organizationType = 1 } = this.state;
        const { name, level, type, parent, description, postNumber, image, address, location, detailAddress,
            contactMan, contactPhone, businessLicenseNo, investmentAmount, buildTime, products, businessCase, industry,
            totalArea, area, rentType, transformationPlan, organization, visibleOrganizations, role = {}, head, phone, email,
            sex = 0, position, authority, policeCode,
        } = pageData;
        const roleOptions = _.map(roles.list, o => o.name);
        const isSuperAdmin = rootPersonal && rootPersonal.role && rootPersonal.role.isSuperAdmin;
        return (
            <div className={styles.container}>
                <div className={styles.OrganizationTreeList}>
                    { showTreeList && <OrganizationTreeList ref={(ref) => { this.list = ref; }} treeData={organizationTree.list || []} doPress={::this.showDetail} hasMember /> }
                </div>
                <DetailContainer title='详情' {...{ loading, waiting, editing }} buttons={[
                        { text: '取消', onClick: handleEditCancel.bind(this), visible: editing },
                        { text: '创建机构人员', onClick: ::this.createOrganizationMember, visible: organizationType === 1 && hasAuthority(CO.AH_CREATE_MEMBER) && ((operType === 0 && editing) || !editing) && type !== 'grid' },
                        { text: !editing ? '创建下级机构' : '立即创建', onClick: !editing ? ::this.createChildOrganization : ::this.handleSubmit, visible: organizationType === 1 && hasAuthority(CO.AH_CREATE_ORGANIZATION) && ((operType === 0 && editing) || !editing) },
                        { text: !editing ? '修改' : '确认修改', onClick: organizationType === 2 ? ::this.modifyMember : ::this.handleSubmit, visible: hasAuthority(CO.AH_MODIFY_ORGANIZATION) && ((operType === 1 && editing) || !editing) },
                        { text: '删除', onClick: ::this.removeOrganization, visible: hasAuthority(CO.AH_REMOVE_ORGANIZATION) && !editing },
                        { text: '导入机构', onClick: ::this.importExport, visible: hasAuthority(CO.AH_CREATE_ORGANIZATION) && !editing },
                        { text: '导出机构', onClick: ::this.excelExport, visible: hasAuthority(CO.AH_CREATE_ORGANIZATION) && !editing },
                ]} >
                    {
                        organizationType === 1 &&
                        <Form>
                            { parent && <SearchFormItem form={form} label='上级机构' value={{ parent }} name='name' ref={(ref) => { this.organizationForm = ref; }} /> }
                            <TextFormItem form={form} label='机构名称' value={{ name }} editing={editing} />
                            { isSuperAdmin && <NumberFormItem form={form} label='等级' min={0} max={10000} step={1} value={{ level }} editing={editing} required={false} /> }
                            { isSuperAdmin && <SelectFormItem form={form} label='类型' value={{ type }} options={CO.TS_ORGANIZATION_YPES} editing={editing} required={false} /> }
                            <TextFormItem form={form} label='描述' value={{ description }} editing={editing} required={false} />
                            <TextFormItem form={form} label='邮政编码' value={{ postNumber }} editing={editing} required={false} />
                            <ImageFormItem form={form} label='图片' value={{ image }} classNames={[styles.headContainer, styles.head]} editing={editing} required={false} />
                            <LocateFormItem form={form} label='地址' editing={editing} address={address} location={location} detailAddress={detailAddress} ref={ref => { this.locateFormItem = ref; }} />
                        </Form>
                    }
                    {
                        (parent && parent.name === '工厂') &&
                        <Form>
                            { parent && <SearchFormItem form={form} label='上级机构' value={{ parent }} name='name' SelectComponent={SelectOrganization} editing={editing && origin.id !== pageData.id} ref={(ref) => { this.organizationForm = ref; }} /> }
                            <TextFormItem form={form} label='机构名称' value={{ name }} editing={editing} />
                            { isSuperAdmin && <NumberFormItem form={form} label='等级' min={0} max={10000} step={1} value={{ level }} editing={editing} required={false} /> }
                            { isSuperAdmin && <SelectFormItem form={form} label='类型' value={{ type }} options={CO.TS_ORGANIZATION_YPES} editing={editing} required={false} /> }
                            <SelectFormItem form={form} label='招工情况' value={{ description }} options={['招工', '不招工', '无招工计划']} editing={editing} required={false} />
                            <TextFormItem form={form} label='联系人' value={{ contactMan }} editing={editing} required={false} />
                            <TextFormItem form={form} label='联系电话' value={{ contactPhone }} editing={editing} required={false} />
                            <TextFormItem form={form} label='营业执照代码' value={{ businessLicenseNo }} editing={editing} required={false} />
                            <TextFormItem form={form} label='总投资(万元)' value={{ investmentAmount }} editing={editing} required={false} />
                            <DateFormItem form={form} label='建成投产时间' value={{ buildTime }} editing={editing} showTime={{ format: 'HH:mm' }} format='YYYY-MM-DD HH:mm' required={false} />
                            <TextFormItem form={form} label='主要产品或业务' value={{ products }} editing={editing} required={false} />
                            <TextFormItem form={form} label='经营情况' value={{ businessCase }} editing={editing} required={false} />
                            <TextFormItem form={form} label='所属行业' value={{ industry }} editing={editing} required={false} />
                            <TextFormItem form={form} label='占地面积（亩）' value={{ totalArea }} editing={editing} required={false} />
                            <TextFormItem form={form} label='厂房面积（㎡）' value={{ area }} editing={editing} required={false} />
                            <SelectFormItem form={form} label='是否是租用厂房' value={{ rentType }} options={['是', '否']} editing={editing} required={false} />
                            <SelectFormItem form={form} label='是否有技改计划' value={{ transformationPlan }} options={['是', '否']} editing={editing} required={false} />
                            <TextFormItem form={form} label='邮政编码' value={{ postNumber }} editing={editing} required={false} />
                            <ImageFormItem form={form} label='图片' value={{ image }} classNames={[styles.headContainer, styles.head]} editing={editing} required={false} />
                            <LocateFormItem form={form} label='地址' editing={editing} address={address} location={location} detailAddress={detailAddress} ref={ref => { this.locateFormItem = ref; }} />
                        </Form>
                    }
                    {
                        organizationType === 2 &&
                        <Form>
                            <SearchFormItem form={form} label='所在机构' value={{ organization }} name='name' />
                            <SearchMultiFormItem required={false} ref={(ref) => { this.visibleOrganizationsForm = ref; }} form={form} label='管理的组织机构' value={{ visibleOrganizations }} name='name' SelectComponent={SelectOrganization} editing={editing} />
                            { operType === 1 && <SelectFormItem form={form} label='角色名称' value={{ roleId: role.name }} name='name' options={roleOptions} editing={editing} />}
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
                    }
                </DetailContainer>
            </div>
        );
    }
}

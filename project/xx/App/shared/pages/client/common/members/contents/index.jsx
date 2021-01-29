import React from 'react';
import { Modal, Upload, Icon } from 'antd';
import { TableContainer, PlainTable } from 'components';
import { _, CO, download, searchMgr, urlParam, config, showSuccess, showError, confirmWithPassword } from 'utils';
import styles from './index.less';
const { Dragger } = Upload;

function getEditVisible (rootPersonal, record) {
    const { userId, authority, role } = rootPersonal;
    const selfIsSuperAdmin = role.isSuperAdmin; // 自己是管理员
    const targetIsSuperAdmin = record.role.isSuperAdmin; // 操作对象是管理员
    const isSelf = userId === record.id; // 是否是本人
    const isAuthExcluded = !!_.difference(record.authority, authority).length || _.isEqual(_.sortBy(record.authority), _.sortBy(authority)); // 权限等于或者超出自己
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
const getColumns = (rootPersonal, self, hasAuthority) => [{
    title: '头像',
    dataIndex: 'head',
    render: (data = '/hbclient/img/common/default_head.png') => <span><img src={data} style={{ width: 60, height: 60 }} /></span>,
    width: 100,
}, {
    title: '操作',
    buttons: [
        { text: '修改', onClick: ::self.modifyMember, visible: hasAuthority(CO.AH_MODIFY_MEMBER) },
        { text: '删除', onClick: ::self.removeMember, visible: hasAuthority(CO.AH_REMOVE_MEMBER) },
        { text: '详情', onClick: ::self.showMember },
    ],
    width: 150,
}, {
    title: '用户名',
    width: 150,
    dataIndex: 'name',
}, {
    title: '电话号码',
    width: 150,
    dataIndex: 'phone',
}, {
    title: '角色',
    dataIndex: 'role',
    render: (data) => data.name,
    width: 200,
}, {
    title: '拥有权限',
    dataIndex: 'authority',
    render: (data) => {
        let list = _.intersection(data, rootPersonal.authority).map(o => CO.AH_MAP[o]).filter(o => !!o);
        let hasMore = '';
        if (list.length > 3) {
            list = list.slice(0, 3);
            hasMore = '...';
        }
        return list.join('、') + hasMore;
    },
    width: 200,
}, {
    title: '组织机构',
    dataIndex: 'organization',
    render: (data) => data && data.name,
    width: 200,
}];
const getServiceColumns = (rootPersonal, self, hasAuthority) => [{
    title: '序号',
    dataIndex: '',
    key: 'index',
    render: (data, record, index) => <span>{index + 1}</span>,
    width: 80,
}, {
    title: '操作',
    buttons: [
        { text: '修改', onClick: ::self.modifyMember, visible: data => hasAuthority(CO.AH_MODIFY_MEMBER) && getEditVisible(rootPersonal, data) },
    ],
    width: 100,
}, {
    title: '头像',
    dataIndex: 'head',
    render: (data = '/hbclient/img/common/default_head.png') => <span><img src={data} style={{ width: 60, height: 60 }} /></span>,
    width: 100,
}, {
    title: '姓名',
    width: 100,
    dataIndex: 'name',
}, {
    title: '电话',
    width: 120,
    dataIndex: 'phone',
}, {
    title: '职务/角色',
    dataIndex: 'role',
    render: (data) => data.name,
    width: 100,
}, {
    title: '组织机构',
    dataIndex: 'organization',
    render: (data) => data && data.name,
    width: 200,
}, {
    title: '邮箱',
    dataIndex: 'email',
    width: 150,
}];

export default class Members extends React.Component {
    static fragments = {
        members: 1,
    };
    onSearch (keyword) {
        searchMgr.set('members', { keyword });
        this.table.resetPageNo();
        this.props.refresh();
    }
    showCreateMember () {
        const { history, members, memberType } = this.props;
        history.push({ dialog: { title: '成员信息' }, pathname: '/hbclient/members/detail', state: { table: this.table, operType: 0, members, editing: true, memberType } });
    }
    showMember (record) {
        const { history, members, memberType } = this.props;
        history.push({ dialog: { title: '成员信息' }, pathname: '/hbclient/members/detail', state: { table: this.table, operType: 1, memberId: record.id, record, members, memberType } });
    }
    modifyMember (record) {
        const { history, members, memberType } = this.props;
        history.push({ dialog: { title: '成员信息' }, pathname: '/hbclient/members/detail', state: { table: this.table, operType: 1, memberId: record.id, record, members, editing: true, memberType } });
    }
    removeMember (record) {
        confirmWithPassword({ pre: '确定要删除', name: `${record.name}` }, (password) => {
            const { actions } = this.props;
            actions.removeMember(record.id, password, (data) => {
                if (!data.success) {
                    showError(data.msg);
                } else {
                    showSuccess('删除成功');
                    this.table.resetPageNo();
                    this.props.refresh();
                }
            });
        });
    }
    excelExport () {
        const { rootPersonal } = this.props;
        const params = {
            userId: rootPersonal.userId,
        };
        download(`${config.apiServer}/hb/api/member/getMemberExports?${urlParam(params)}`, '职员表.xlsx');
    }
    importExport () {
        const { rootPersonal } = this.props;
        const props = {
            name: 'file',
            multiple: true,
            action: `/hb/api/member/uploadMemberExcel`,
            data: { userId: rootPersonal.userId },
            onChange (info) {
                const { status } = info.file;
                if (status === 'done') {
                    const { response } = info.file;
                    if (response.success) {
                        showSuccess(`${info.file.name}上传成功`);
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
        const excle_url = `${config.apiServer}/hb/template/职员表.xlsx`;
        const modal = Modal.info({
            title: '文件导入',
            content: (
                <div className={styles.upload}>
                    <a className={styles.download} onClick={() => download(excle_url, '人员报表.xlsx')} target='_blank'>下载模板</a>
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
    render () {
        const { members = {}, rootPersonal, hasAuthority, toggleFullScreen, isFullScreen, history, memberType } = this.props;
        let titleType = memberType === 'serviceRankMembers' && '服务队伍成员' || memberType === 'systemMember' && '成员列表' || '';
        let perColumns = memberType === 'serviceRankMembers' && getServiceColumns(rootPersonal, this, hasAuthority) || memberType === 'systemMember' && getColumns(rootPersonal, this, hasAuthority) || '';
        return (
            <TableContainer
                title={titleType}
                isFullScreen={isFullScreen}
                toggleFullScreen={toggleFullScreen}
                onSearch={::this.onSearch}
                historys={history}
                searchDefaultValue={searchMgr.get('members').keyword}
                buttons={[
                    { text: '添加', onClick: ::this.showCreateMember, visible: hasAuthority(CO.AH_CREATE_MEMBER) },
                    { text: '导入', onClick: ::this.importExport },
                    { text: '导出', onClick: ::this.excelExport },
                ]}
                >
                <PlainTable
                    {...this.props}
                    ref={(ref) => { this.table = ref; }}
                    columns={perColumns}
                    data={members} />
            </TableContainer>
        );
    }
}

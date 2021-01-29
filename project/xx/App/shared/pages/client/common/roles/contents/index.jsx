import React from 'react';
import { TableContainer, PlainTable } from 'components';
import { Modal, Upload, Icon } from 'antd';
import styles from './index.less';
import { _, CO, download, searchMgr, confirmWithPassword, showSuccess, showError, urlParam, config } from 'utils';

const { Dragger } = Upload;

const getColumns = (self, hasAuthority) => [{
    title: '序号',
    dataIndex: '',
    key: 'index',
    render: (data, record, index) => <span>{index + 1}</span>,
    width: 80,
}, {
    title: '角色名称',
    width: 150,
    dataIndex: 'name',
}, {
    title: '角色描述',
    dataIndex: 'description',
    width: 150,
}, {
    title: '拥有权限',
    dataIndex: 'authority',
    render: (data) => {
        let list = _.map(data, o => CO.AH_MAP[o]).filter(o => !!o);
        let hasMore = '';
        if (list.length > 5) {
            list = list.slice(0, 5);
            hasMore = '...';
        }
        return list.join('、') + hasMore;
    },
    width: 300,
}, {
    title: '操作',
    buttons: [
        { text: '删除', onClick: ::self.removeRole, visible: hasAuthority(CO.AH_REMOVE_ROLE) },
        { text: '修改', onClick: ::self.modifyRole, visible: hasAuthority(CO.AH_MODIFY_ROLE) },
    ],
    width: 150,
}];

export default class Roles extends React.Component {
    static fragments = {
        roles: 1,
    };
    onSearch (keyword) {
        searchMgr.set('roles', { keyword });
        this.table.resetPageNo();
        this.props.refresh();
    }
    removeRole (record) {
        confirmWithPassword({ pre: '确定要删除角色', name: `${record.name}` }, (password) => {
            const { actions } = this.props;
            actions.removeRole(record.id, password, (data) => {
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
    showCreateRole () {
        const { history, roles } = this.props;
        history.push({ dialog: { title: '角色管理' }, pathname: '/hbclient/roles/detail', state: { table: this.table, operType: 0, roles, editing: true } });
    }
    modifyRole (record) {
        const { history, roles } = this.props;
        history.push({ dialog: { title: '角色管理' }, pathname: '/hbclient/roles/detail', state: { table: this.table, operType: 1, roleId: record.id, record, roles, editing: true } });
    }
    excelExport () {
        const { rootPersonal } = this.props;
        const params = {
            userId: rootPersonal.userId,
        };
        download(`${config.apiServer}/hb/api/member/getRoleExports?${urlParam(params)}`, '角色表.xlsx');
    }
    importExport () {
        const { rootPersonal } = this.props;
        const props = {
            name: 'file',
            multiple: true,
            action: `/hb/api/member/uploadRoleExcel`,
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
        const excle_url = `${config.apiServer}/hb/template/角色表.xlsx`;
        const modal = Modal.info({
            title: '文件导入',
            content: (
                <div className={styles.upload}>
                    <p style={{ textAlign: 'left', width: 450, fontWeight: '600' }}>模板示例:</p>
                    <a className={styles.download} onClick={() => download(excle_url, '角色表.xlsx')} target='_blank'>下载模板</a>
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
        const { roles = {}, hasAuthority, toggleFullScreen, isFullScreen, history } = this.props;
        return (
            <TableContainer
                title={'角色管理'}
                isFullScreen={isFullScreen}
                toggleFullScreen={toggleFullScreen}
                onSearch={::this.onSearch}
                historys={history}
                searchDefaultValue={searchMgr.get('roles').keyword}
                buttons={[
                    { text: '新增', onClick: ::this.showCreateRole, visible: hasAuthority(CO.AH_CREATE_ROLE) },
                    { text: '导出', onClick: ::this.excelExport },
                    { text: '导入', onClick: ::this.importExport },
                ]}
                >
                <PlainTable
                    {...this.props}
                    ref={(ref) => { this.table = ref; }}
                    columns={getColumns(this, hasAuthority)}
                    data={roles} />
            </TableContainer>
        );
    }
}

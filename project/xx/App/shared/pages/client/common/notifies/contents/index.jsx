import React from 'react';
import { Button } from 'antd';
import { TableContainer, PlainTable } from 'components';
import { showError } from 'utils';
import styles from './index.less';

const getColumn = (self) => [{
    title: '信息标题',
    dataIndex: 'data',
    render: (data) => data.msg,
    width: 200,
}, {
    title: '时间',
    dataIndex: 'createTime',
    width: 300,
}, {
    title: '操作',
    dataIndex: '',
    key: 'x',
    className: '__filter_click',
    render: (data) => {
        return (
            <div className='__filter_click'>
                <Button className='__filter_click' onClick={() => self.readNotify(data, true)} size='small' type='dashed'>标记已读</Button>
                { (data.data.taskId || data.data.lawId) && <Button style={{ marginLeft: 20 }} className='__filter_click' onClick={() => self.dealTask(data, true)} size='small'>立即处理</Button> }
            </div>
        );
    },
    width: 300,
}];

export default class Notifies extends React.Component {
    static fragments = {
        notifies: 1,
    };
    readNotify (notify) {
        const { actions, updateNotifyCount } = this.props;
        actions.removeNotify(notify.id, (data) => {
            if (data.success) {
                updateNotifyCount(true);
                this.props.refresh();
            } else {
                showError(data.msg);
            }
        });
    }
    dealTask (notify) {
        const { actions, updateNotifyCount, history } = this.props;
        const { taskId, lawId, type } = notify.data;
        if (type === 1) {
            history.push({ dialog: { title: '空巢老人预警' }, pathname: '/hbclient/earlyWarning?peopleType=lastAppearOnScreenByOldMan', state: { preShowVisible: true, preTaskId: taskId } });
        } else if (type === 2) {
            history.push({ dialog: { title: '留守儿童预警' }, pathname: '/hbclient/earlyWarning?peopleType=lastAppearOnScreenByChild', state: { preShowVisible: true, preTaskId: taskId } });
        } else if (type === 3) {
            history.push({ dialog: { title: '布控人员预警' }, pathname: '/hbclient/earlyWarning?peopleType=importantControlPeople', state: { preShowVisible: true, preTaskId: taskId } });
        } else if (type === 4) {
            history.push({ dialog: { title: '尿检人员预警' }, pathname: '/hbclient/earlyWarning?peopleType=uroscopyControlPeople', state: { preShowVisible: true, preTaskId: taskId } });
        } else if (type === 5) {
            history.push({ dialog: { title: '精神病人外出预警' }, pathname: '/hbclient/earlyWarning?peopleType=insanityControlPeople', state: { preShowVisible: true, preTaskId: taskId } });
        } else {
            if (type === 'MT_PUBLISH_LAW_NF') {
                history.push({ dialog: { title: '案宗详情' }, pathname: '/hbclient/law/detail', state: { operType: 1, lawId } });
            } else {
                history.push({ dialog: { title: '事件列表' }, pathname: '/hbclient/tasks', state: { preShowVisible: true, preTaskId: taskId } });
            }
        }

        actions.removeNotify(notify.id, (data) => {
            if (data.success) {
                updateNotifyCount(true);
                this.props.refresh();
            } else {
                showError(data.msg);
            }
        });
    }
    render () {
        const { notifies = {}, history, isFullScreen, toggleFullScreen, notifyCount } = this.props;
        return (
            <TableContainer
                title={'通知列表'}
                isFullScreen={isFullScreen}
                toggleFullScreen={toggleFullScreen}
                history={history}
                notifyCount={notifyCount}>
                <PlainTable
                    {...this.props}
                    tableHeightOffset={160}
                    ref={(ref) => { this.table = ref; }}
                    columns={getColumn(this)}
                    data={notifies}
                    loadListPage={::this.props.loadListPage}
                    className={styles.table} />
            </TableContainer>
        );
    }
}

import React from 'react';
import styles from './index.less';
import Detail from './detail';
import { Anchor } from 'antd';
import { PlainTable } from 'components';
import { CO } from 'utils';
const { Link } = Anchor;

const columns = [{
    title: '序号',
    dataIndex: '',
    key: 'index',
    render: (data, record, index) => <span>{index + 1}</span>,
    width: 80,
}, {
    title: '最近一次访问日期',
    dataIndex: 'record',
    render: (data) => data.lastVisitTime,
    width: 100,
}, {
    title: '下次访问日期',
    dataIndex: '',
    render: (data) => data.record && data.record.nextVisitTime || '暂无信息',
    width: 100,
}, {
    title: '访问事由',
    dataIndex: '',
    render: (data) => data.record && data.record.controlRecord || '暂无信息',
    width: 100,
}];

const getColumns = (self, hasAuthority) => [{
    title: '序号',
    dataIndex: '',
    key: 'index',
    render: (data, record, index) => <span>{index + 1}</span>,
    width: 80,
}, {
    title: '操作',
    buttons: [
        { text: '查看详情', onClick: ::self.showDetail, visible: hasAuthority(CO.AH_LOOK_PEOPLE) },
    ],
    width: 100,
}, {
    title: '头像',
    dataIndex: 'head',
    render: (data = '/hbclient/img/common/default_head.png') => <span><img src={data} style={{ width: 60, height: 60 }} /></span>,
    width: 80,
}, {
    title: '姓名',
    dataIndex: 'name',
    width: 100,
}, {
    title: '身份证号',
    dataIndex: 'idNo',
    width: 190,
}, {
    title: '电话',
    dataIndex: 'phone',
    width: 130,
}, {
    title: '就业情况',
    dataIndex: 'workType',
    render: (data = 0) => CO.TS_WORK_TYPES[data],
    width: 100,
}, {
    title: '所在岗位',
    dataIndex: 'jobs',
    width: 150,
}, {
    title: '拥有技能',
    dataIndex: 'skills',
    render: (data) => data.join(', '),
    width: 150,
}, {
    title: '出生日期',
    dataIndex: 'birthday',
    width: 120,
}, {
    title: '性別',
    dataIndex: 'sex',
    render: (data) => ['男', '女'][data] || '未知',
    width: 120,
}, {
    title: '民族',
    dataIndex: 'nation',
    width: 120,
}, {
    title: '文化程度',
    dataIndex: 'education',
    render: (data = 0) => CO.TS_EDUCATIONS[data],
    width: 120,
}, {
    title: '政治面貌',
    dataIndex: 'political',
    render: (data = 0) => CO.TS_POLITICALS[data],
    width: 120,
}];

const fireColumns = (self, hasAuthority) => [{
    title: '操作',
    buttons: [
        { text: '查看详情', onClick: ::self.showFireDetail, visible: hasAuthority(CO.AH_REMOVE_ROLE) },
    ],
    width: 150,
}, {
    title: '公司名称',
    dataIndex: 'companyName',
    width: 100,
}, {
    title: '职位名称',
    dataIndex: 'postName',
    width: 100,
}, {
    title: '技能要求',
    dataIndex: 'skills',
    render: (data) => data && data.length > 0 && data.join(';'),
    width: 100,
}, {
    title: '公司地址',
    dataIndex: 'address',
    width: 150,
}, {
    title: '招聘的人数',
    dataIndex: 'count',
    width: 100,
    unit: '人',
}];

export default class HomeOrganizationDetail extends React.Component {
    static fragments = {
        organization: 1,
        peoples: 1,
        visits: 1,
        recruits: 1,
    };
    componentDidMount () {
        this.historyCount = 1;
    }
    onAnchorChange (link) {
        this.historyCount++;
    }
    showDetail (people) {
        const { history } = this.props;
        history.push({ dialog: { title: `${people.name}的信息` }, pathname: '/hbclient/personDetail', state: { peopleId: people.id } });
    }
    showFireDetail (recruit) {
        const { history } = this.props;
        history.push({ dialog: { title: '招工列表' }, pathname: '/hbclient/organizations/recruit', state: { recruitId: recruit.id, skills: recruit.skills } });
    }
    render () {
        const { organization = {}, peoples = {}, visits = {}, recruits = {}, hasAuthority } = this.props;
        const { type } = organization;
        return (
            <div className={styles.container}>
                <div className={styles.content}>
                    <Anchor className={styles.anchor} onChange={::this.onAnchorChange}>
                        <Link href='#detail' title='详细信息' />
                        <Link href='#members' title='成员信息' />
                        { false && <Link href='#record' title='走访记录' />}
                        <Link href='#fire' title='招工信息' />
                    </Anchor>
                    <div id='detail' className={styles.tableContainer}>
                        <div className={styles.label}>详细信息</div>
                        <Detail type={type} data={organization} />
                    </div>
                    <div id='members' className={styles.tableContainer}>
                        <div className={styles.label}>成员信息</div>
                        <PlainTable
                            {...this.props}
                            loadListPage={::this.props.loadListPageMember}
                            ref={(ref) => { this.memberTable = ref; }}
                            columns={getColumns(this, hasAuthority)}
                            data={peoples} />
                    </div>
                    { false && <div id='record' className={styles.tableContainer}>
                        <div className={styles.label}>走访记录</div>
                        <PlainTable
                            {...this.props}
                            loadListPage={::this.props.loadListPageVisit}
                            ref={(ref) => { this.recordTable = ref; }}
                            columns={columns}
                            data={visits} />
                    </div>}
                    <div id='fire' className={styles.tableContainer}>
                        <div className={styles.label}>招工信息</div>
                        <PlainTable
                            {...this.props}
                            loadListPage={::this.props.loadListPageFire}
                            ref={(ref) => { this.fireTable = ref; }}
                            columns={fireColumns(this, hasAuthority)}
                            data={recruits} />
                    </div>
                </div>
            </div>
        );
    }
}

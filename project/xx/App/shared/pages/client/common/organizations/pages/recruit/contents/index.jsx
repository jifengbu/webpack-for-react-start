import React from 'react';
import styles from './index.less';
import { DetailContainer, PlainTable } from 'components';
import { _ } from 'utils';
const columns = [{
    title: '照片',
    dataIndex: 'head',
    render: (data) => <img src={data} style={{ width: 140, height: 170 }} />,
    width: 100,
}, {
    title: '姓名',
    dataIndex: 'name',
    width: 100,
}, {
    title: '联系方式',
    dataIndex: 'phone',
    width: 100,
}, {
    title: '年龄',
    dataIndex: 'age',
    width: 100,
}, {
    title: '性别',
    dataIndex: 'sex',
    render: (data) => data == 0 ? '男' : '女',
    width: 100,
}, {
    title: '拥有的技能',
    dataIndex: 'skills',
    render: (data = []) => data.length > 0 && data.join(';'),
    width: 100,
}];

export default class RecruitDetail extends React.Component {
    static fragments = {
        recruit: 1,
    };
    state = {
        pageData: {},
    }
    componentWillReceiveProps (nextProps) {
        const { recruit } = nextProps;
        if (!_.isEqual(recruit, this.props.recruit)) {
            this.setState({ pageData: _.cloneDeep(recruit) });
        }
    }
    onRowClick (record) {
        const { history } = this.props;
        history.push({ dialog: { title: `${record.name}的信息` }, pathname: '/hbclient/personDetail', state: { peopleId: record.id } });
    }
    render () {
        const { history, peoples = {} } = this.props;
        const { pageData } = this.state;
        const { companyName, postName, skills = [], address, count } = pageData;
        return (
            <DetailContainer title='招工详情' {...{ history }}>
                <div className={styles.title}>{companyName}</div>
                <div className={styles.address}>公司地址：{address || '暂无数据'}</div>
                <div className={styles.top}>
                    <div className={styles.item}>招聘职位：{postName}</div>
                    <div className={styles.item}>招聘人数：{count}</div>
                </div>
                <div className={styles.label}>职位要求：</div>
                {
                    skills.map((o, k) => <div className={styles.skill} key={k}>{k + 1}、{o}</div>)
                }
                <div className={styles.people}>匹配到的待业人员：</div>
                <PlainTable
                    {...this.props}
                    ref={(ref) => { this.table = ref; }}
                    columns={columns}
                    data={peoples}
                    onRowClick={::this.onRowClick} />
            </DetailContainer>
        );
    }
}

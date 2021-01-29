import React from 'react';
import { TableContainer, PlainTable } from 'components';
import { searchMgr } from 'utils';
import _ from 'lodash';
import { Input } from 'antd';

const getColumns = (self) => [{
    title: '序号',
    dataIndex: '',
    key: 'index',
    render: (data, record, index) => <span>{index + 1}</span>,
    width: 80,
}, {
    title: '姓名',
    width: 150,
    dataIndex: 'name',
}, {
    title: '组织机构',
    dataIndex: 'organization',
    render: (data) => data && data.name,
    width: 100,
}, {
    title: '电话',
    dataIndex: 'phone',
    width: 150,
}];

export default class Members extends React.Component {
    static fragments = {
        members: 1,
    };
    state = {
        selectedIds: this.props.selectedIds,
        date: '',
    };
    componentWillReceiveProps (nextProps) {
        if (this.props.selectedIds != nextProps.selectedIds) {
            this.setState({ selectedIds: nextProps.selectedIds });
        }
    }
    componentDidMount () {
        this.props.setRef && this.props.setRef(this);
    }
    onSearch (keyword) {
        searchMgr.set('selectMember', { keyword });
        this.table.resetPageNo();
        this.props.refresh();
    }
    onInvertSelection () {
        const { members = {}, changeSelectOkButton } = this.props;
        const selectedRows = _.filter(members.list, o => _.indexOf(selectedRows, o.id) != -1);
        changeSelectOkButton && changeSelectOkButton(_.uniq(_.map(_.difference(members.list, selectedRows))));
        this.setState({ selectedIds: _.uniq(_.map(_.difference(members.list, selectedRows), 'id')) });
    }
    onAllSelect () {
        const { members = {}, changeSelectOkButton } = this.props;
        const selectedRows = _.map(members.list);
        changeSelectOkButton && changeSelectOkButton(selectedRows);
        this.setState({ selectedIds: _.map(selectedRows, o => o.id) });
    }
    value () {
        return this.state.date;
    }
    render () {
        const { selectedIds } = this.state;
        const { members = {}, rejectIds, multi, onSelect, toggleFullScreen, isFullScreen, history, needButton = true, showInput = false } = this.props;
        const rowSelection = {
            columnTitle: '12',
            type: multi ? 'checkbox' : 'radio',
            selectedRowKeys: selectedIds,
            onSelect: (record, selected, selectedRows) => {
                this.setState({ selectedIds: _.map(selectedRows, o => o.id) });
                onSelect(selectedRows);
            },
            getCheckboxProps: record => ({
                disabled: _.includes(rejectIds, record.id),
            }),
            hideDefaultSelections: true,
        };
        return (
            <TableContainer
                toggleFullScreen={toggleFullScreen}
                isFullScreen={isFullScreen}
                onSearch={::this.onSearch}
                historys={history}
                searchDefaultValue={searchMgr.get('selectMember').keyword}
                buttons={needButton && [
                    { text: '本页全选', onClick: ::this.onAllSelect },
                    { text: '反选', onClick: ::this.onInvertSelection, visible: false },
                ]}
                >
                {showInput && <Input style={{ width: '500px', margin: 10, alignSelf: 'center' }} onChange={(e) => this.setState({ date: e.target.value })} addonBefore='走访周期：' addonAfter='天' placeholder='输入走访周期：如三天，就输入数字3' />}
                <PlainTable
                    {...this.props}
                    tableHeightOffset={180}
                    ref={(ref) => { this.table = ref; }}
                    columns={getColumns(this)}
                    data={members}
                    rowSelection={rowSelection} />
            </TableContainer>
        );
    }
}

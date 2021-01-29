import React from 'react';
import { TableContainer, PlainTable } from 'components';
import { _, searchMgr } from 'utils';

const getColumns = (self) => [{
    title: '序号',
    dataIndex: '',
    key: 'index',
    render: (data, record, index) => <span>{index + 1}</span>,
    width: 80,
}, {
    title: '机构名称',
    width: 150,
    dataIndex: 'name',
}, {
    title: '上级机构',
    dataIndex: 'parent',
    render: (data) => data && data.name,
    width: 100,
}];

export default class Organizations extends React.Component {
    static fragments = {
        organizations: 1,
    };
    state = {
        selectedIds: this.props.selectedIds,
    };
    componentWillReceiveProps (nextProps) {
        if (this.props.selectedIds != nextProps.selectedIds) {
            this.setState({ selectedIds: nextProps.selectedIds });
        }
    }
    onSearch (keyword) {
        searchMgr.set('selectOrganization', { keyword });
        this.table.resetPageNo();
        this.props.refresh();
    }
    onInvertSelection () {
        const { organizations = {}, changeSelectOkButton } = this.props;
        const selectedRows = _.filter(organizations.list, o => _.indexOf(selectedRows, o.id) != -1);
        changeSelectOkButton && changeSelectOkButton(_.uniq(_.map(_.difference(organizations.list, selectedRows))));
        this.setState({ selectedIds: _.uniq(_.map(_.difference(organizations.list, selectedRows), 'id')) });
    }
    onAllSelect () {
        const { organizations = {}, changeSelectOkButton } = this.props;
        const selectedRows = _.map(organizations.list);
        changeSelectOkButton && changeSelectOkButton(selectedRows);
        this.setState({ selectedIds: _.map(selectedRows, o => o.id) });
    }
    render () {
        const { selectedIds } = this.state;
        const { organizations = {}, rejectIds, multi, onSelect, toggleFullScreen, isFullScreen, history, needButton = true } = this.props;
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
                searchDefaultValue={searchMgr.get('selectOrganization').keyword}
                buttons={needButton && [
                    { text: '本页全选', onClick: ::this.onAllSelect },
                    { text: '反选', onClick: ::this.onInvertSelection, visible: false },
                ]}
                >
                <PlainTable
                    {...this.props}
                    tableHeightOffset={200}
                    ref={(ref) => { this.table = ref; }}
                    columns={getColumns(this)}
                    data={organizations}
                    rowSelection={rowSelection} />
            </TableContainer>
        );
    }
}

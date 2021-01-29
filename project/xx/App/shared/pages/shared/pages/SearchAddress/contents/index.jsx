import React from 'react';
import { PlainTable, TableContainer } from 'components';
import { searchMgr } from 'utils';
import styles from './index.less';
import _ from 'lodash';

const columns = [{
    title: '名称',
    dataIndex: 'name',
    width: 150,
}, {
    title: '地址全名',
    dataIndex: 'address',
    width: 150,
},
];

export default class SearchAddress extends React.Component {
    static fragments = {
        searchAddress: {
            id: 1,
            isLeaf: 1,
            code: 1,
            parentCode: 1,
            name: 1,
            address: 1,
            level: 1,
        },
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
        searchMgr.set('searchAddress', { keyword });
        this.table.resetPageNo();
        this.props.refresh();
        this.props.onSearch();
    }
    render () {
        const { selectedIds } = this.state;
        const { searchAddress = [], rejectIds, onSelect, toggleFullScreen, isFullScreen, history } = this.props;
        const rowSelection = {
            type: 'radio',
            selectedRowKeys: selectedIds,
            onSelect: (record, selected, selectedRows) => {
                this.setState({ selectedIds: _.map(selectedRows, o => o.id) });
                onSelect(selectedRows);
            },
            getCheckboxProps: record => ({
                disabled: _.includes(rejectIds, record.id),
            }),
        };
        return (
            <TableContainer
                toggleFullScreen={toggleFullScreen}
                isFullScreen={isFullScreen}
                onSearch={::this.onSearch}
                historys={history}
                searchDefaultValue={searchMgr.get('searchAddress').keyword}
                >
                <PlainTable
                    {...this.props}
                    tableHeightOffset={150}
                    className={styles.tableContainer}
                    ref={(ref) => { this.table = ref; }}
                    columns={columns}
                    dataSource={searchAddress}
                    rowSelection={rowSelection} />
            </TableContainer>
        );
    }
}

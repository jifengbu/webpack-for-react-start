import React from 'react';
import { Table, Button } from 'antd';
import cn from 'classnames';
import { fixColumns } from './config';
import styles from './index.less';
import _ from 'lodash';

export default class PlainPageTable extends React.Component {
    static defaultProps = {
        listName: 'list',
        className: styles.container,
    };
    state = {
        current: 1,
        selectIndex: -1,
        lastCurrent: -1,
    };
    componentWillReceiveProps (nextProps) {
        const { listName, pageSize } = this.props;
        if (this.loadingMore) {
            this.loadingMore = false;
            const list = nextProps.data;
            const length = _.isArray(list) ? list.length : (list[listName] || []).length;
            this.setState({ current: Math.floor((length - 1) / pageSize) + 1 });
        }
    }
    resetPageNo () {
        this.setState({ current: 1, selectIndex: -1, lastCurrent: -1 });
    }
    onRowClick (record, index, event) {
        const classNames = (event.target.className || '').split(' ');
        if (!_.includes(classNames, 'ant-table-selection-column') && !_.includes(classNames, '__filter_click')) {
            const { onRowClick } = this.props;
            const { current } = this.state;
            if (onRowClick) {
                this.setState({ selectIndex: index, lastCurrent: current });
                onRowClick(record, index, event);
            }
        }
    }
    onRow (record, index) {
        return {
            onClick: this.onRowClick.bind(this, record, index),
        };
    }
    rowClassName (record, index) {
        const { rowClassName } = this.props;
        const { current, lastCurrent, selectIndex } = this.state;
        return current === lastCurrent && selectIndex === index ? '__last_selected' : rowClassName ? rowClassName(record, index) : '';
    }
    loadMore (key) {
        const { relate, loadMore } = this.props;
        const page = relate.getPageAttribute(key);
        if (!page) {
            loadMore(1, () => { this.loadingMore = true; });
        } else if (page.hasMore) {
            loadMore(page.pageNo + 1, () => { this.loadingMore = true; });
        }
    }
    render () {
        const { current } = this.state;
        const {
            data,
            columns,
            pageSize,
            listName,
            loading,
            loadingMore,
            noFooter,
            className,
            rowKey,
            isFullScreen,
            rowSelection,
            expandedRowRender,
            scrollY = false,
            tableHeightOffset = 0,
            /* eslint-disable */
            onRowClick,
            /* eslint-enable */
            relate,
            isDialog,
            ...otherProps
        } = this.props;
        const total = _.isArray(data) ? data.length : (data[listName] || []).length;
        const pagination = {
            total,
            current,
            pageSize,
            itemRender: (current, elementType, originalElement) => {
                if (elementType === 'prev') {
                    return null;
                }
                if (elementType === 'next') {
                    const key = listName;
                    const page = relate.getPageAttribute(key);
                    const hasMore = !page ? total === pageSize : page.hasMore;
                    return hasMore ? <Button style={{ marginRight: 20 }} onClick={this.loadMore.bind(this, key)}>更多</Button> : null;
                }
                return originalElement;
            },
            onChange: (current) => {
                this.setState({ current });
            },
        };
        const xscroll = _.sumBy(columns, o => o.width) + (rowSelection ? 70 : 0);
        const yscroll = document.body.clientHeight - (isFullScreen ? 250 : 350) - tableHeightOffset + (isDialog ? 80 : 0); ;
        return (
            <div className={cn(className, styles.table, styles.pageTable)}>
                <Table
                    bordered
                    rowKey={(record, key) => rowKey ? rowKey(record, key) : _.isNil(record.id) ? key : record.id}
                    columns={fixColumns(columns)}
                    loading={loading || loadingMore}
                    pagination={noFooter !== true && pagination}
                    dataSource={_.isArray(data) ? data : data[listName]}
                    {...otherProps}
                    bodyStyle={{ maxHeight: yscroll, minHeight: yscroll }}
                    rowSelection={rowSelection}
                    expandedRowRender={expandedRowRender}
                    rowClassName={::this.rowClassName}
                    scroll={scrollY ? { x: xscroll } : { x: xscroll, y: yscroll }}
                    onRow={::this.onRow} />
            </div>
        );
    }
}

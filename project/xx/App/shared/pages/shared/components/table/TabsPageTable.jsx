import React from 'react';
import { Table, Tabs, Button } from 'antd';
import _ from 'lodash';
import cn from 'classnames';
import styles from './index.less';
import { fixColumns } from './config';
const TabPane = Tabs.TabPane;

export default class TabsPageTable extends React.Component {
    static defaultProps = {
        className: styles.container,
        listName: 'list',
    };
    state = {
        activeType: _.keys(this.props.tables)[0],
        currents: _.mapValues(this.props.tables, () => 1),
        selectIndexes: _.mapValues(this.props.tables, () => -1),
        lastCurrents: _.mapValues(this.props.tables, () => 1),
    };
    componentWillReceiveProps (nextProps) {
        const { currents, activeType } = this.state;
        const { tables, listName, pageSize } = this.props;
        if (this.loadingMore) {
            this.loadingMore = false;
            const list = nextProps.data[activeType];
            const length = _.isArray(list) ? list.length : (list[tables[activeType].listName || listName] || []).length;
            currents[activeType] = Math.floor((length - 1) / pageSize) + 1;
            this.setState({ currents });
        }
    }
    resetPageNo () {
        this.setState({
            currents: _.mapValues(this.props.tables, () => 1),
            selectIndexes: _.mapValues(this.props.tables, () => -1),
            lastCurrents: _.mapValues(this.props.tables, () => -1),
        });
    }
    onRowClick (record, index, event) {
        const { onRowClick, hasOnlyClick } = this.props;
        const classNames = (_.get(event, 'target.className') || '').split(' ');
        if (hasOnlyClick) {
            if (_.includes(classNames, '__only_click')) {
                const { activeType, currents, selectIndexes } = this.state;
                selectIndexes[activeType] = index;
                if (onRowClick) {
                    this.setState({ selectIndexes, lastCurrents: currents });
                    onRowClick(record, index, activeType, event);
                }
            }
        } else if (!_.includes(classNames, 'ant-table-selection-column') && !_.includes(classNames, '__filter_click')) {
            const { activeType, currents, selectIndexes } = this.state;
            selectIndexes[activeType] = index;
            if (onRowClick) {
                this.setState({ selectIndexes, lastCurrents: currents });
                onRowClick(record, index, activeType, event);
            }
        }
    }
    onRow (record, index) {
        return {
            onClick: this.onRowClick.bind(this, record, index),
        };
    }
    rowClassName (type, record, index) {
        const { rowClassName } = this.props;
        const { currents, lastCurrents, selectIndexes } = this.state;
        return currents[type] === lastCurrents[type] && selectIndexes[type] === index ? '__last_selected' : rowClassName ? rowClassName(record, index) : '';
    }
    onTabsChange (key) {
        const { onTabsChange } = this.props;
        this.setState({ activeType: key });
        onTabsChange && onTabsChange(key);
    }
    loadMore (type, key) {
        const { relate, loadMore } = this.props;
        const page = relate.getPageAttribute(key);
        if (!page) {
            loadMore(type, 1, () => { this.loadingMore = true; });
        } else if (page.hasMore) {
            loadMore(type, page.pageNo + 1, () => { this.loadingMore = true; });
        }
    }
    render () {
        const { currents, activeType } = this.state;
        const {
            tables,
            data,
            columns,
            pageSize,
            listName,
            loading,
            loadingMore,
            rowSelection,
            noFooter,
            className,
            rowKey,
            isFullScreen,
            tableHeightOffset = 0,
            /* eslint-disable */
            onRowClick,
            /* eslint-enable */
            relate,
            ...otherProps
        } = this.props;
        const pagination = (total, type) => ({
            total,
            showSizeChanger: false,
            pageSize,
            current: currents[type],
            itemRender: (current, elementType, originalElement) => {
                if (elementType === 'prev') {
                    return null;
                }
                if (elementType === 'next') {
                    const key = tables[type].listName || (type + '.' + listName);
                    const page = relate.getPageAttribute(key);
                    const hasMore = !page ? total === pageSize : page.hasMore;
                    return hasMore ? <Button style={{ marginRight: 20 }} onClick={this.loadMore.bind(this, type, key)}>更多</Button> : null;
                }
                return originalElement;
            },
            onChange: (current) => {
                currents[type] = current;
                this.setState({ currents });
            },
        });
        return (
            <div className={cn(className, styles.table, styles.pageTable)}>
                <Tabs type='card' onChange={::this.onTabsChange} activeKey={activeType}>
                    {
                        _.map(tables, (item, type) => {
                            const list = data[type] || [];
                            const dataSource = _.isArray(list) ? list : list[item.listName || listName] || [];
                            const realColumns = fixColumns(item.columns || columns);
                            const xscroll = _.sumBy(realColumns, o => o.width) + (rowSelection ? 70 : 0);
                            const yscroll = document.body.clientHeight - (isFullScreen ? 260 : 360) - tableHeightOffset;
                            return (
                                <TabPane tab={item.label} key={type}>
                                    <Table
                                        bordered
                                        rowKey={(record, key) => rowKey ? rowKey(record, key) : _.isNil(record.id) ? key : record.id}
                                        loading={loading || loadingMore}
                                        columns={realColumns}
                                        dataSource={dataSource}
                                        rowSelection={item.rowSelection || rowSelection}
                                        pagination={noFooter !== true && item.noFooter !== true && pagination(dataSource.length, type)}
                                        {...otherProps}
                                        bodyStyle={{ maxHeight: yscroll, minHeight: yscroll }}
                                        scroll={{ x: xscroll, y: yscroll }}
                                        rowClassName={this.rowClassName.bind(this, type)}
                                        onRow={::this.onRow} />
                                </TabPane>
                            );
                        })
                    }
                </Tabs>
            </div>
        );
    }
}

import React from 'react';
import { Table, Tabs } from 'antd';
import _ from 'lodash';
import cn from 'classnames';
import styles from './index.less';
import { fixColumns } from './config';
const TabPane = Tabs.TabPane;

export default class TabsTable extends React.Component {
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
    resetPageNo () {
        this.setState({
            currents: _.mapValues(this.props.tables, () => 1),
            selectIndexes: _.mapValues(this.props.tables, () => -1),
            lastCurrents: _.mapValues(this.props.tables, () => -1),
        });
    }
    onRowClick (record, index, event) {
        const classNames = (event.target.className || '').split(' ');
        if (!_.includes(classNames, 'ant-table-selection-column') && !_.includes(classNames, '__filter_click')) {
            const { onRowClick } = this.props;
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
    render () {
        const { currents, activeType } = this.state;
        const {
            tables,
            data,
            columns,
            pageSize,
            listName,
            loading,
            loadingPage,
            loadListPage,
            rowSelection,
            noFooter,
            className,
            rowKey,
            isFullScreen,
            tableHeightOffset = 0,
            /* eslint-disable */
            onRowClick,
            /* eslint-enable */
            ...otherProps
        } = this.props;
        const pagination = (total, type) => ({
            total,
            showSizeChanger: false,
            pageSize,
            current: currents[type],
            onChange: (current) => {
                currents[type] = current;
                this.setState({ currents });
                loadListPage && loadListPage(type, current - 1);
            },
        });
        return (
            <div className={cn(className, styles.table)}>
                <Tabs type='card' onChange={::this.onTabsChange} activeKey={activeType}>
                    {
                        _.map(tables, (item, type) => {
                            const list = data[type] || [];
                            const realColumns = fixColumns(item.columns || columns);
                            const xscroll = _.sumBy(realColumns, o => o.width) + (rowSelection ? 70 : 0);
                            const yscroll = document.body.clientHeight - (isFullScreen ? 260 : 360) - tableHeightOffset;
                            return (
                                <TabPane tab={item.label} key={type}>
                                    <Table
                                        bordered
                                        rowKey={(record, key) => rowKey ? rowKey(record, key) : _.isNil(record.id) ? key : record.id}
                                        loading={loading || loadingPage}
                                        columns={realColumns}
                                        dataSource={_.isArray(list) ? list : list[listName]}
                                        rowSelection={item.rowSelection || rowSelection}
                                        pagination={noFooter !== true && item.noFooter !== true && pagination(_.isArray(list) ? list.length : list.count, type)}
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

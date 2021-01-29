import React from 'react';
import { Table, Modal, Button, InputNumber } from 'antd';
import cn from 'classnames';
import { fixColumns } from './config';
import { showError } from 'utils';
import styles from './index.less';
import _ from 'lodash';

export default class PlainTable extends React.Component {
    static defaultProps = {
        className: styles.container,
    };
    state = {
        current: 1,
        selectIndex: -1,
        lastCurrent: -1,
    };
    update (force) {
        if (force) {
            this.resetPageNo();
            this.props.refresh();
        } else {
            this.forceUpdate();
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
    modifyPageSize () {
        let { pageSize, modifyPageSize } = this.props;
        Modal.confirm({
            title: '修改每页显示条数',
            content: (
                <div>
                    每页显示条数：
                    <InputNumber style={{ marginTop: 10, marginLeft: 28, width: 200 }} defaultValue={pageSize} placeholder='请填写修改条数' maxLength={2}
                        precision={0} onChange={(value) => { pageSize = value; }} min={1} step={10} max={99} />
                </div>
            ),
            okText: '确定',
            cancelText: '取消',
            onOk: () => new Promise((resolve, reject) => {
                if (!pageSize) {
                    showError('每页显示条数必须大于0');
                    reject();
                    return;
                }
                modifyPageSize(pageSize);
                resolve();
            }),
        });
    }
    render () {
        const { current } = this.state;
        const {
            columns,
            pageSize,
            data,
            loading,
            loadingPage,
            loadListPage,
            noFooter,
            showSizeChanger,
            pageSizeOptions,
            className,
            rowSelection,
            rowKey,
            isFullScreen,
            scrollY = false,
            tableHeightOffset = 0,
            modifyPageSize,
            /* eslint-disable */
            onRowClick,
            /* eslint-enable */
            isDialog,
            ...otherProps
        } = this.props;
        const pagination = {
            total: (data || {}).count,
            current,
            style: { marginRight: 10 },
            pageSize,
            showSizeChanger,
            pageSizeOptions,
            preButton: modifyPageSize && <Button className={styles.preButton} loading={loading} onClick={::this.modifyPageSize}>每页显示{pageSize}条</Button>,
            onChange: (current) => {
                this.setState({ current });
                loadListPage && loadListPage(current - 1);
            },
        };
        const footer = (data || {}).summary && (() => <div className={styles.summary}><span>{data.summary}</span></div>);
        const xscroll = _.sumBy(columns, o => o.width) + (rowSelection ? 70 : 0);
        const yscroll = document.body.clientHeight - (isFullScreen ? 240 : 340) - (this.props.footer || footer ? 80 : 0) - tableHeightOffset + (isDialog ? 80 : 0);
        return (
            <div className={cn(className, styles.table)}>
                <Table
                    bordered
                    rowKey={(record, key) => rowKey ? rowKey(record, key) : _.isNil(record.id) ? key : record.id}
                    columns={fixColumns(columns)}
                    loading={loading || loadingPage}
                    pagination={noFooter !== true && pagination}
                    dataSource={(data || {}).list}
                    bodyStyle={{ maxHeight: yscroll, minHeight: yscroll }}
                    rowSelection={rowSelection}
                    rowClassName={::this.rowClassName}
                    scroll={scrollY ? { x: xscroll } : { x: xscroll, y: yscroll }}
                    onRow={::this.onRow}
                    footer={footer}
                    {...otherProps}
                    />
            </div>
        );
    }
}

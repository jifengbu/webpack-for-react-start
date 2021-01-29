import React from 'react';
import { TableContainer, PlainTable } from 'components';
import styles from './index.less';
import { _, searchMgr } from 'utils';

export default class Laws extends React.Component {
    static fragments = {
        excelDatas: 1,
    };
    componentWillMount () {
        this.columns = [];
    }
    componentWillReceiveProps (nextProps) {
        const props = this.props;
        const { excelDatas = {} } = nextProps;
        if (!(props.excelDatas || {}).title && excelDatas.title) {
            for (const k in excelDatas.title) {
                let item = {
                    title: excelDatas.title[k],
                    key: k,
                    dataIndex: k,
                    width: 150,

                };
                this.columns.push(item);
            }
        }
    }
    render () {
        const { excelDatas = {}, toggleFullScreen, isFullScreen, history, type } = this.props;
        return (
            <TableContainer
                title={type}
                isFullScreen={isFullScreen}
                toggleFullScreen={toggleFullScreen}
                historys={history}
                >
                <PlainTable
                    {...this.props}
                    ref={(ref) => { this.table = ref; }}
                    columns={this.columns}
                    data={excelDatas} />
            </TableContainer>
        );
    }
}

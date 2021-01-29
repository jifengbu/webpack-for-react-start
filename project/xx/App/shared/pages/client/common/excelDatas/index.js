import React from 'react';
import { dataConnect } from 'relatejs';
import { bindActionCreators } from 'redux';
import { needLoadPage, showError } from 'utils';
import * as lawActions from 'actions/laws';
import LawList from './contents';

@dataConnect(
    (state, props) => {
        const { filename, type, sheetIndex = 0, titleIndex = 1 } = props.dialogState || state.router.location.state || state.router.location.query;
        return { filename, type, sheetIndex, titleIndex, pageSize: 20 };
    },
    (dispatch) => ({
        actions: bindActionCreators(lawActions, dispatch),
    }),
    (props) => ({
        fragments: LawList.fragments,
        variablesTypes: {
            excelDatas: {
                data: 'JSON!',
            },
        },
        initialVariables: {
            excelDatas: {
                data: {
                    pageNo: 0,
                    pageSize: props.pageSize,
                    filename: props.filename,
                    sheetIndex: props.sheetIndex,
                    titleIndex: props.titleIndex,
                },
            },
        },
    })
)
export default class LawListContainer extends React.Component {
    componentDidMount () {
        !this.props.isDialog && this.props.selectSideMenuItem('law');
    }
    refresh () {
        const { relate, pageSize, filename, sheetIndex, titleIndex } = this.props;
        relate.refresh({
            variables: {
                excelDatas: {
                    data: {
                        pageNo: 0,
                        pageSize,
                        filename,
                        sheetIndex,
                        titleIndex,
                    },
                },
            },
            callback (data) {
                if (!data.laws) {
                    showError('没有相关信息');
                }
            },
        });
    }
    loadListPage (pageNo) {
        const { relate, pageSize, excelDatas, filename, sheetIndex, titleIndex } = this.props;
        const property = 'list';
        if (needLoadPage(excelDatas, property, pageNo, pageSize)) {
            relate.loadPage({
                variables: {
                    excelDatas: {
                        data: {
                            pageNo,
                            pageSize,
                            filename,
                            sheetIndex,
                            titleIndex,
                        },
                    },
                },
                property,
            });
        }
    }
    render () {
        return (
            <LawList {...this.props} refresh={::this.refresh} loadListPage={::this.loadListPage} />
        );
    }
}

import React from 'react';
import { dataConnect } from 'relatejs';
import { searchMgr, needLoadPage, showError } from 'utils';
import SelectMember from './contents';

@dataConnect(
    (state) => ({ pageSize: 20 }),
    null,
    (props) => ({
        fragments: SelectMember.fragments,
        variablesTypes: {
            members: {
                data: 'JSON!',
            },
        },
        initialVariables: {
            members: {
                data: {
                    pageNo: 0,
                    pageSize: props.pageSize,
                    keyword: searchMgr.get('selectMember').keyword,
                    ...(props.params || {}),
                },
            },
        },
    })
)
export default class SelectMemberContainer extends React.Component {
    refresh () {
        const { relate, pageSize, params = {} } = this.props;
        relate.refresh({
            variables: {
                members: {
                    data: {
                        pageNo: 0,
                        pageSize,
                        keyword: searchMgr.get('selectMember').keyword,
                        ...params,
                    },
                },
            },
            callback (data) {
                if (!data.members) {
                    showError('没有相关信息');
                }
            },
        });
    }
    loadListPage (pageNo) {
        const { relate, pageSize, members, params = {} } = this.props;
        const property = 'list';
        if (needLoadPage(members, property, pageNo, pageSize)) {
            relate.loadPage({
                variables: {
                    members: {
                        data: {
                            pageNo,
                            pageSize,
                            keyword: searchMgr.get('selectMember').keyword,
                            ...params,
                        },
                    },
                },
                property,
            });
        }
    }
    render () {
        return (
            <SelectMember {...this.props} refresh={::this.refresh} loadListPage={::this.loadListPage} />
        );
    }
}

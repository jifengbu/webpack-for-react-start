import React from 'react';
import { dataConnect } from 'relatejs';
import { bindActionCreators } from 'redux';
import * as memberActions from 'actions/members';
import { needLoadPage, searchMgr, showError } from 'utils';
import Members from './contents';

@dataConnect(
    (state, props) => {
        const { memberType } = props.dialogState || state.router.location.state || state.router.location.query;
        return { pageSize: 20, memberType };
    },
    (dispatch) => ({
        actions: bindActionCreators(memberActions, dispatch),
    }),
    (props) => ({
        fragments: Members.fragments,
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
                    keyword: searchMgr.get('members').keyword,
                },
            },
        },
    })
)
export default class MembersContainer extends React.Component {
    refresh () {
        const { relate, pageSize } = this.props;
        relate.refresh({
            variables: {
                members: {
                    data: {
                        pageNo: 0,
                        pageSize,
                        keyword: searchMgr.get('members').keyword,
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
        const { relate, pageSize, members } = this.props;
        const property = 'list';
        if (needLoadPage(members, property, pageNo, pageSize)) {
            relate.loadPage({
                variables: {
                    members: {
                        data: {
                            pageNo,
                            pageSize,
                            keyword: searchMgr.get('members').keyword,
                        },
                    },
                },
                property,
            });
        }
    }
    render () {
        return (
            <Members {...this.props} refresh={::this.refresh} loadListPage={::this.loadListPage} />
        );
    }
}

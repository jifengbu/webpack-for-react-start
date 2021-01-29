import React from 'react';
import { dataConnect } from 'relatejs';
import { bindActionCreators } from 'redux';
import * as roleActions from 'actions/roles';
import { needLoadPage, searchMgr, showError } from 'utils';
import Roles from './contents';

@dataConnect(
    (state) => ({ pageSize: 20 }),
    (dispatch) => ({
        actions: bindActionCreators(roleActions, dispatch),
    }),
    (props) => ({
        fragments: Roles.fragments,
        variablesTypes: {
            roles: {
                data: 'JSON!',
            },
        },
        initialVariables: {
            roles: {
                data: {
                    pageNo: 0,
                    pageSize: props.pageSize,
                    keyword: searchMgr.get('roles').keyword,
                },
            },
        },
    })
)
export default class RolesContainer extends React.Component {
    componentDidMount () {
        !this.props.isDialog && this.props.selectSideMenuItem('roles');
    }
    refresh () {
        const { relate, pageSize } = this.props;
        relate.refresh({
            variables: {
                roles: {
                    data: {
                        pageNo: 0,
                        pageSize,
                        keyword: searchMgr.get('roles').keyword,
                    },
                },
            },
            callback (data) {
                if (!data.roles) {
                    showError('没有相关信息');
                }
            },
        });
    }
    loadListPage (pageNo) {
        const { relate, pageSize, roles } = this.props;
        const property = 'list';
        if (needLoadPage(roles, property, pageNo, pageSize)) {
            relate.loadPage({
                variables: {
                    roles: {
                        data: {
                            pageNo,
                            pageSize,
                            keyword: searchMgr.get('roles').keyword,
                        },
                    },
                },
                property,
            });
        }
    }
    render () {
        return (
            <Roles {...this.props} refresh={::this.refresh} loadListPage={::this.loadListPage} />
        );
    }
}

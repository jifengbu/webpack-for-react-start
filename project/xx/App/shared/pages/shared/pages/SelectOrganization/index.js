import React from 'react';
import { dataConnect } from 'relatejs';
import { searchMgr, needLoadPage, showError } from 'utils';
import SelectOrganization from './contents';

@dataConnect(
    (state) => ({ pageSize: 20 }),
    null,
    (props) => ({
        fragments: SelectOrganization.fragments,
        variablesTypes: {
            organizations: {
                data: 'JSON!',
            },
        },
        initialVariables: {
            organizations: {
                data: {
                    pageNo: 0,
                    pageSize: props.pageSize,
                    keyword: searchMgr.get('selectOrganization').keyword,
                    ...(props.params || {}),
                },
            },
        },
    })
)
export default class SelectOrganizationContainer extends React.Component {
    refresh () {
        const { relate, pageSize, params = {} } = this.props;
        relate.refresh({
            variables: {
                organizations: {
                    data: {
                        pageNo: 0,
                        pageSize,
                        keyword: searchMgr.get('selectOrganization').keyword,
                        ...params,
                    },
                },
            },
            callback (data) {
                if (!data.organizations) {
                    showError('没有相关信息');
                }
            },
        });
    }
    loadListPage (pageNo) {
        const { relate, pageSize, organizations, params = {} } = this.props;
        const property = 'list';
        if (needLoadPage(organizations, property, pageNo, pageSize)) {
            relate.loadPage({
                variables: {
                    organizations: {
                        data: {
                            pageNo,
                            pageSize,
                            keyword: searchMgr.get('selectOrganization').keyword,
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
            <SelectOrganization {...this.props} refresh={::this.refresh} loadListPage={::this.loadListPage} />
        );
    }
}

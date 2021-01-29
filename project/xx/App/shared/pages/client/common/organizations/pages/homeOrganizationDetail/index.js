import React from 'react';
import { dataConnect } from 'relatejs';
import HomeOrganizationDetail from './contents';
import { showError, needLoadPage } from 'utils';

@dataConnect(
    (state, props) => {
        const { organizationId, backHome } = props.dialogState || state.router.location.state || state.router.location.query;
        return { organizationId, pageSize: 10, backHome };
    },
    null,
    (props) => {
        return {
            fragments: HomeOrganizationDetail.fragments,
            variablesTypes: {
                organization: {
                    data: 'JSON!',
                },
                peoples: {
                    data: 'JSON!',
                },
                visits: {
                    data: 'JSON!',
                },
                recruits: {
                    data: 'JSON!',
                },
            },
            initialVariables: {
                organization: {
                    data: {
                        organizationId: props.organizationId,
                    },
                },
                peoples: {
                    data: {
                        pageNo: 0,
                        pageSize: props.pageSize,
                        factoryId: props.organizationId,
                    },
                },
                visits: {
                    data: {
                        pageNo: 0,
                        pageSize: props.pageSize,
                    },
                },
                recruits: {
                    data: {
                        pageNo: 0,
                        pageSize: props.pageSize,
                        factoryId: props.organizationId,
                    },
                },
            },
        };
    }
)
export default class HomeOrganizationDetailContainer extends React.Component {
    refresh () {
        const { relate, pageSize, organizationId } = this.props;
        relate.refresh({
            variables: {
                peoples: {
                    data: {
                        pageNo: 0,
                        pageSize,
                        factoryId: organizationId,
                    },
                },
                visits: {
                    data: {
                        pageNo: 0,
                        pageSize,
                    },
                },
                recruits: {
                    data: {
                        pageNo: 0,
                        pageSize,
                        factoryId: organizationId,
                    },
                },
            },
            callback (data) {
                if (!data.peoples) {
                    showError('没有相关信息');
                }
            },
        });
    }
    loadListPageMember (pageNo) {
        const { relate, pageSize, peoples, organizationId } = this.props;
        const property = 'list';
        if (needLoadPage(peoples, property, pageNo, pageSize)) {
            relate.loadPage({
                variables: {
                    peoples: {
                        data: {
                            pageNo,
                            pageSize,
                            factoryId: organizationId,
                        },
                    },
                },
                property,
            });
        }
    }
    loadListPageVisit (pageNo) {
        const { relate, pageSize, visits } = this.props;
        const property = 'list';
        if (needLoadPage(visits, property, pageNo, pageSize)) {
            relate.loadPage({
                variables: {
                    visits: {
                        data: {
                            pageNo,
                            pageSize,
                        },
                    },
                },
                property,
            });
        }
    }
    loadListPageFire (pageNo) {
        const { relate, pageSize, recruits, organizationId } = this.props;
        const property = 'list';
        if (needLoadPage(recruits, property, pageNo, pageSize)) {
            relate.loadPage({
                variables: {
                    recruits: {
                        data: {
                            pageNo,
                            pageSize,
                            factoryId: organizationId,
                        },
                    },
                },
                property,
            });
        }
    }
    render () {
        return (
            <HomeOrganizationDetail {...this.props} refresh={::this.refresh} loadListPageMember={::this.loadListPageMember} loadListPageVisit={::this.loadListPageVisit} loadListPageFire={::this.loadListPageFire} />
        );
    }
}

import React from 'react';
import { dataConnect } from 'relatejs';
import { bindActionCreators } from 'redux';
import * as organizationActions from 'actions/organizations';
import * as memberActions from 'actions/members';
import { showError } from 'utils';
import Organizations from './contents';

@dataConnect(
    (state) => ({ pageSize: 20 }),
    (dispatch) => ({
        actions: bindActionCreators({ ...organizationActions, ...memberActions }, dispatch),
    }),
    (props) => ({
        fragments: Organizations.fragments,
        variablesTypes: {
            organizationTree: {
                data: 'JSON!',
            },
            roles: {
                data: 'JSON!',
            },
        },
        initialVariables: {
            organizationTree: {
                data: {
                    parentId: props.parentId,
                    hasMember: true,
                },
            },
            roles: {
                data: {},
            },
        },
    })
)
export default class OrganizationsContainer extends React.Component {
    componentDidMount () {
        !this.props.isDialog && this.props.selectSideMenuItem('organizations');
    }
    refresh (cb) {
        const { relate, parentId } = this.props;
        relate.refresh({
            variables: {
                organizationTree: {
                    data: {
                        parentId,
                        hasMember: true,
                    },
                },
                roles: {
                    data: {},
                },
            },
            callback (data) {
                cb && cb(data);
                if (!data.organizationTree) {
                    showError('没有相关信息');
                }
            },
        });
    }
    render () {
        return (
            <Organizations {...this.props} refresh={::this.refresh} />
        );
    }
}

import React from 'react';
import { dataConnect } from 'relatejs';
import { bindActionCreators } from 'redux';
import * as organizationActions from 'actions/organizations';
import OrganizationDetail from './contents';

@dataConnect(
    (state, props) => {
        const { update, operType, organizationId, record, editing, parentId, parentName, propsType } = props.dialogState || state.router.location.state || state.router.location.query;
        return { update, operType: operType * 1, organizationId, record, editing, parentId, parentName, propsType };
    },
    (dispatch) => ({
        actions: bindActionCreators(organizationActions, dispatch),
    }),
    (props) => {
        return {
            manualLoad: !!props.organization || !props.organizationId,
            fragments: OrganizationDetail.fragments,
            variablesTypes: {
                organization: {
                    data: 'JSON!',
                },
            },
            initialVariables: {
                organization: {
                    data: {
                        organizationId: props.organizationId,
                    },
                },
            },
            mutations: {
                modifyOrganization ({ state, data }) {
                    if (data.success) {
                        Object.assign(props.record, data.context);
                    }
                },
            },
        };
    }
)
export default class OrganizationDetailContainer extends React.Component {
    render () {
        return (
            <OrganizationDetail {...this.props} />
        );
    }
}

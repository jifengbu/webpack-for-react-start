import React from 'react';
import { dataConnect } from 'relatejs';
import { bindActionCreators } from 'redux';
import * as roleActions from 'actions/roles';
import RoleDetail from './contents';

@dataConnect(
    (state, props) => {
        const { table, operType, roleId, record, editing } = props.dialogState || state.router.location.state || state.router.location.query;
        return { table, operType: operType * 1, roleId, record, editing };
    },
    (dispatch) => ({
        actions: bindActionCreators(roleActions, dispatch),
    }),
    (props) => {
        return {
            manualLoad: !!props.role || !props.roleId,
            fragments: RoleDetail.fragments,
            variablesTypes: {
                role: {
                    data: 'JSON!',
                },
            },
            initialVariables: {
                role: {
                    data: {
                        roleId: props.roleId,
                    },
                },
            },
            mutations: {
                modifyRole ({ state, data }) {
                    if (data.success) {
                        Object.assign(props.record, data.context);
                    }
                },
            },
        };
    }
)
export default class RoleDetailContainer extends React.Component {
    render () {
        return (
            <RoleDetail {...this.props} />
        );
    }
}

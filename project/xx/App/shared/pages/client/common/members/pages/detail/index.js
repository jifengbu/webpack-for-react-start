import React from 'react';
import { dataConnect } from 'relatejs';
import { bindActionCreators } from 'redux';
import * as memberActions from 'actions/members';
import MemberDetail from './contents';

@dataConnect(
    (state, props) => {
        const { table, updateTreeList, operType, memberId, record, members, editing, parentOrganization } = props.dialogState || state.router.location.state || state.router.location.query;
        return { table, updateTreeList, operType: operType * 1, memberId, record, members, editing, parentOrganization };
    },
    (dispatch) => ({
        actions: bindActionCreators(memberActions, dispatch),
    }),
    (props) => {
        return {
            fragments: MemberDetail.fragments,
            variablesTypes: {
                member: {
                    data: 'JSON!',
                },
                roles: {
                    data: 'JSON!',
                },
            },
            initialVariables: {
                member: {
                    data: {
                        memberId: props.memberId,
                    },
                },
                roles: {
                    data: {},
                },
            },
            mutations: {
                modifyMember ({ state, data }) {
                    if (data.success && props.record) {
                        Object.assign(props.record, data.context);
                    }
                },
                removeMember ({ state, data, _ }) {
                    if (data.success && props.members) {
                        props.members.count--;
                        _.remove(props.members.list, (item) => item.id === props.memberId);
                    }
                },
            },
        };
    }
)
export default class MemberDetailContainer extends React.Component {
    render () {
        return (
            <MemberDetail {...this.props} />
        );
    }
}

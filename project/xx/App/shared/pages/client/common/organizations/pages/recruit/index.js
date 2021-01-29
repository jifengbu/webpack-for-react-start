import React from 'react';
import { dataConnect } from 'relatejs';
import RecruitDetail from './contents';

@dataConnect(
    (state, props) => {
        const { recruitId, skills } = props.dialogState || state.router.location.state || state.router.location.query;
        return { recruitId, pageSize: 20, skills };
    },
    null,
    (props) => {
        return {
            fragments: RecruitDetail.fragments,
            variablesTypes: {
                recruit: {
                    data: 'JSON!',
                },
                peoples: {
                    data: 'JSON!',
                },
            },
            initialVariables: {
                recruit: {
                    data: {
                        recruitId: props.recruitId,
                    },
                },
                peoples: {
                    data: {
                        pageNo: 0,
                        pageSize: props.pageSize,
                        peopleType: 'unemployeds',
                        skills: props.skills,
                    },
                },
            },
        };
    }
)
export default class RecruitDetailContainer extends React.Component {
    render () {
        return (
            <RecruitDetail {...this.props} />
        );
    }
}

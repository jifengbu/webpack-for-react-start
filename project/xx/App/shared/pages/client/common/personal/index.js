import React from 'react';
import { dataConnect } from 'relatejs';
import { bindActionCreators } from 'redux';
import * as personalActions from 'actions/personals';
import Personal from './contents';

@dataConnect(
    (state) => ({}),
    (dispatch) => ({
        actions: bindActionCreators(personalActions, dispatch),
    }),
    (props) => ({
        fragments: Personal.fragments,
    })
)
export default class PersonalContainer extends React.Component {
    render () {
        return (
            <Personal {...this.props} />
        );
    }
}

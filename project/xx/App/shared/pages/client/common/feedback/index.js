import React from 'react';
import { dataConnect } from 'relatejs';
import { bindActionCreators } from 'redux';
import * as personalActions from 'actions/personals';
import Feedback from './contents';

@dataConnect(
    null,
    (dispatch) => ({
        actions: bindActionCreators(personalActions, dispatch),
    }),
)
export default class FeedbackContainer extends React.Component {
    render () {
        return (
            <Feedback {...this.props} />
        );
    }
}

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as personalActions from 'actions/personals';

import Register from './contents';

@connect(
    (state) => ({}),
    (dispatch) => ({
        actions: bindActionCreators(personalActions, dispatch),
    }),
)
export default class RegisterContainer extends React.Component {
    render () {
        return (
            <Register {...this.props} />
        );
    }
}

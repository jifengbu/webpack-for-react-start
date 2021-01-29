import { connect } from 'react-redux';
import React from 'react';
import { bindActionCreators } from 'redux';
import * as personalActions from 'actions/personals';
import Login from './contents';

@connect(
    (state) => ({ phone: state.router.location.state ? state.router.location.state.phone : '' }),
    (dispatch) => ({
        actions: bindActionCreators(personalActions, dispatch),
    }),
)
export default class LoginContainer extends React.Component {
    render () {
        return (
            <Login {...this.props} />
        );
    }
}

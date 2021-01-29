import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as personalActions from 'actions/personals';
import ForgotPwd from './contents';

@connect(
    (state) => ({}),
    (dispatch) => ({
        actions: bindActionCreators(personalActions, dispatch),
    }),
)
export default class ForgotPwdContainer extends React.Component {
    render () {
        return (
            <ForgotPwd {...this.props} />
        );
    }
}

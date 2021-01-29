import React from 'react';
import { dataConnect } from 'relatejs';
import { bindActionCreators } from 'redux';
import * as settingActions from 'actions/settings';
import Setting from './contents';

@dataConnect(
    (state) => ({}),
    (dispatch) => ({
        actions: bindActionCreators(settingActions, dispatch),
    }),
    (props) => ({
        fragments: Setting.fragments,
        variablesTypes: {
            setting: {
                data: 'JSON!',
            },
        },
        initialVariables: {
            setting: {
                data: {},
            },
        },
    })
)
export default class PersonalContainer extends React.Component {
    render () {
        return (
            <Setting {...this.props} />
        );
    }
}

import React from 'react';
import { dataConnect } from 'relatejs';
import { bindActionCreators } from 'redux';
import * as notifyActions from 'actions/notifies';
import Notifies from './contents';
import { needLoadPage } from 'utils';

@dataConnect(
    null,
    (dispatch) => ({
        actions: bindActionCreators(notifyActions, dispatch),
    }),
    (props) => ({
        fragments: Notifies.fragments,
        variablesTypes: {
            notifies: {
                data: 'JSON!',
            },
        },
        initialVariables: {
            notifies: {
                data: {},
            },
        },
    })
)
export default class NotifiesContainer extends React.Component {
    refresh () {
        const { relate } = this.props;
        relate.refresh({
            variables: {
                notifies: {
                    data: {},
                },
            },
        });
    }
    loadListPage (pageNo) {
        const { relate, pageSize, notifies } = this.props;
        const property = 'list';
        if (needLoadPage(notifies, property, pageNo, pageSize)) {
            relate.loadPage({
                variables: {
                    notifies: {
                        data: {},
                    },
                },
                property,
            });
        }
    }
    render () {
        return (
            <Notifies {...this.props} refresh={:: this.refresh} loadListPage={:: this.loadListPage} />
        );
    }
}

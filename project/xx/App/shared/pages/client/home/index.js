import React from 'react';
import { dataConnect } from 'relatejs';
import Home from './contents';

@dataConnect(
    (state) => ({}),
    null,
    (props) => ({
        fragments: Home.fragments,
        variablesTypes: {
            statistics: {
                data: 'JSON!',
            },
        },
        initialVariables: {
            statistics: {
                data: {},
            },
        },
    })
)

export default class HomeContainer extends React.Component {
    componentDidMount () {
        this.props.selectSidebarMenuItem('home');
    }
    render () {
        return (
            <Home {...this.props} />
        );
    }
}

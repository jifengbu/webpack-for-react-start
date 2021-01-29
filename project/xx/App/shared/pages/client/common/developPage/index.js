import React from 'react';
import { dataConnect } from 'relatejs';
import DevelopPage from './contents';

@dataConnect(
    (state) => ({ pageSize: 20 }),
)
export default class DevelopPageContainer extends React.Component {
    componentDidMount () {
        !this.props.isDialog && this.props.selectSideMenuItem('developPage');
    }
    render () {
        return (
            <DevelopPage {...this.props} />
        );
    }
}

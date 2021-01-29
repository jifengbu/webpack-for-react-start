import React from 'react';
import { rootDataConnect } from 'relatejs';

@rootDataConnect()
export default class WrappedContainer extends React.Component {
    render () {
        return this.props.component;
    }
}

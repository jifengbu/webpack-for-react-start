import React from 'react';
import { dataConnect } from 'relatejs';
import ShowHtml from './contents';

@dataConnect(
    (state, props) => {
        const { file } = props.dialogState || state.router.location.state || state.router.location.query;
        return { file };
    },
    null
)
export default class ShowHtmlContainer extends React.Component {
    render () {
        return (
            <ShowHtml {...this.props} />
        );
    }
}

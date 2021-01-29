import React from 'react';

export default class ViewerImage extends React.Component {
    showImageViewer () {
        let viewer = new window.Viewer(this.img, {
            toolbar: false,
            navbar: false,
        });
        viewer.show();
    }
    render () {
        const { className, style, src } = this.props;
        return (
            <img src={src} ref={(ref) => { this.img = ref; }} onClick={::this.showImageViewer} className={className} style={style} />
        );
    }
}

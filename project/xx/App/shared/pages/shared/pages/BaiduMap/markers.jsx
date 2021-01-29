import React from 'react';
export default class BaiduMapMarkersContainer extends React.Component {
    static defaultProps = {
        id: 'baidu_map_container',
    };
    componentDidMount () {
        const { id, title, initLocation, markers } = this.props;
        const point = initLocation || new BMap.Point(106.7091771, 26.62990674);
        const marker = new BMap.Marker(point);
        const self = this;
        marker.setZIndex(10000);
        marker.setTitle(title);
        marker.disableDragging();

        const map = new BMap.Map(id);
        map.enableScrollWheelZoom();
        map.enableInertialDragging();
        map.enableContinuousZoom();

        map.centerAndZoom(point, 5);
        // map.addOverlay(marker);
        markers.branchShopList.forEach((item) => {
            const _point = new BMap.Point(item.location[0], item.location[1]);
            const _marker = new BMap.Marker(_point);
            map.addOverlay(_marker);
        });
        markers.agentList.forEach((item) => {
            const _point = new BMap.Point(item.location[0], item.location[1]);
            const _marker = new BMap.Marker(_point);
            map.addOverlay(_marker);
        });
        // 添加添加事件的回调
        this.onClick = function (e) {
            self.hasClick = true;
            marker.setPosition(e.point);
        };

        // 定位
        if (!initLocation) {
            const geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(function (r) {
                if (this.getStatus() == BMAP_STATUS_SUCCESS && !self.hasClick) {
                    marker.setPosition(r.point);
                    map.panTo(r.point);
                }
            }, { enableHighAccuracy: true });
        }

        // 添加城市列表控件
        this.cityListControl = new BMap.CityListControl({
            anchor: BMAP_ANCHOR_TOP_LEFT,
            offset: new BMap.Size(60, 20),
        });
        map.addControl(this.cityListControl);

        // 添加版权控件
        const cr = new BMap.CopyrightControl({ anchor: BMAP_ANCHOR_BOTTOM_RIGHT });
        map.addControl(cr);
        const bs = map.getBounds();
        cr.addCopyright({ id: 1, content: "<a style='font-size:14px;color:red'>文华信息版权所有</a>", bounds: bs });

        // 添加缩放控件
        const navigationControl = new BMap.NavigationControl({
            anchor: BMAP_ANCHOR_TOP_LEFT,
            type: BMAP_NAVIGATION_CONTROL_LARGE,
            enableGeolocation: true,
        });
        map.addControl(navigationControl);
        this.marker = marker;
        this.map = map;
    }
    render () {
        const { id, className } = this.props;
        return (
            <div id={id} className={className} />
        );
    }
}

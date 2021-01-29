/* eslint-disable no-inner-declarations */
import React from 'react';
import _ from 'lodash';

export default class BaiduMapContainer extends React.Component {
    static defaultProps = {
        id: 'baidu_map_container',
    };
    componentDidMount () {
        const { id, hierarchy = 18, theme = 'normal', mapType = 0, markerArr, initLocation, onSelect, enable, closeModal, initAddress, needAddress, needLabel = true, onClickPoint } = this.props;
        const MAP_TYPE = [BMAP_NORMAL_MAP, BMAP_SATELLITE_MAP, BMAP_HYBRID_MAP]; // eslint-disable-line no-undef
        const map = new BMap.Map(id, { mapType: MAP_TYPE[mapType], enableMapClick: false });
        const point = new BMap.Point(...(initLocation || [106.693355, 26.224622]));
        this.map = map;
        this.point = point;
        map.centerAndZoom(point, hierarchy); // 初始化地图,设置中心点坐标和地图级别。
        map.enableScrollWheelZoom(); // 启用滚轮放大缩小
        map.enableInertialDragging();// 启用地图惯性拖拽
        map.enableContinuousZoom(); // 启用连续缩放效果
        map.setMapStyle({
            style: theme, // 引入主题
        });
        map.setMapStyle({
            style: 'midnight',
        });
        if (markerArr && markerArr.length > 0) {
            const marker = [];
            const info = [];
            const id = [];
            _.forEach(markerArr, (o, k) => {
                const p0 = o.point.split(',')[0]; //
                const p1 = o.point.split(',')[1]; // 按照原数组的point格式将地图点坐标的经纬度分别提出来
                point[k] = new window.BMap.Point(p0, p1); // 循环生成新的地图点
                if (o.image) {
                    let myIcon = new BMap.Icon(o.image, new BMap.Size(50, 50));
                    myIcon.setImageSize(new BMap.Size(40, 40));
                    marker[k] = new BMap.Marker(point[k], { icon: myIcon });
                } else {
                    marker[k] = new window.BMap.Marker(point[k]); // 按照地图点坐标生成标记
                }
                map.addOverlay(marker[k]);
                if (needLabel) {
                    const label = new window.BMap.Label(o.title, { offset: new BMap.Size(20, -10) });
                    marker[k].setLabel(label);
                }
                let str = '<p style=’font-size:12px;lineheight:1.8em;’>';
                if (o.title) {
                    str += o.title;
                }
                if (o.address) {
                    str += '</br>地址：' + o.address;
                }
                if (o.tel) {
                    str += '</br> 电话：' + o.tel;
                }
                if (o.problem) {
                    str += '</br> 案件类型：' + o.problem;
                }
                if (o.url) {
                    str += '</br></p><div style=‘width:220px;height:100px;background-image:url(' + o.url + ');background-repeat:no-repeat;background-position:center;background-size:contain;’ />';
                } else {
                    str += '</br></p>';
                }
                info[k] = new window.BMap.InfoWindow(str);
                id[k] = o.id || 'id';
            });
            _.forEach(marker, (o, k) => {
                o.addEventListener('mouseover', function () {
                    o.openInfoWindow(info[k]);
                });
                o.addEventListener('click', function () {
                    if (onClickPoint) {
                        onClickPoint(id[k]);
                    } else {
                        console.log('Error: onClickPoint is not defined!');
                    }
                });
            });
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

        // 添加缩放控件
        const navigationControl = new BMap.NavigationControl({
            anchor: BMAP_ANCHOR_TOP_LEFT,
            type: BMAP_NAVIGATION_CONTROL_LARGE,
            enableGeolocation: true,
        });
        map.addControl(navigationControl);

        if (onSelect) {
            const marker = new BMap.Marker(point);
            const self = this;

            map.addOverlay(marker);
            // 添加添加事件的回调
            this.onClick = function (e) {
                self.hasClick = true;
                marker.setPosition(e.point);
            };

            // 定位
            if (!initLocation && !initAddress) {
                const geolocation = new BMap.Geolocation();
                geolocation.getCurrentPosition(function (r) {
                    if (this.getStatus() == BMAP_STATUS_SUCCESS && !self.hasClick) {
                        marker.setPosition(r.point);
                        map.panTo(r.point);
                    }
                }, { enableHighAccuracy: true });
            } else if (initLocation) {
                marker.setPosition(initLocation);
                map.panTo(initLocation);
            } else {
                map.setCenter(initAddress);
            }

            // 添加定位控件
            const geolocationControl = new BMap.GeolocationControl();
            geolocationControl.addEventListener('locationSuccess', function (e) {
                marker.setPosition(e.point);
            });
            geolocationControl.addEventListener('locationError', function (e) {
                console.log(e.message);
            });
            this.geolocationControl = geolocationControl;

            // 自定义完成控件
            function DoneControl () {
                this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
                this.defaultOffset = new BMap.Size(10, 10);
            }
            DoneControl.prototype = new BMap.Control();
            DoneControl.prototype.initialize = function (m) {
                const div = document.createElement('div');
                const text = document.createTextNode('确定');
                div.appendChild(text);
                div.style.cursor = 'pointer';
                div.style.padding = '10px 20px 10px 20px';
                div.style.border = '1px solid gray';
                div.style.backgroundColor = '#30C1B2';
                div.style.color = '#FFFFFF';
                div.style.fontSize = '20px';
                div.onclick = function (e) {
                    closeModal && closeModal();
                    const gc = new BMap.Geocoder();
                    gc.getLocation(marker.getPosition(), function (rs) {
                        if (needAddress) {
                            var addComp = rs.addressComponents;
                            onSelect(rs, addComp.district + addComp.street + addComp.streetNumber);
                        } else {
                            onSelect(rs);
                        }
                    });
                };
                m.getContainer().appendChild(div);
                return div;
            };
            this.doneControl = new DoneControl();
            if (enable) {
                map.addEventListener('click', this.onClick);
                map.addControl(this.geolocationControl);
                map.addControl(this.doneControl);
            }
            this.marker = marker;
        }
    }
    componentWillReceiveProps (nextProps) {
        const props = this.props;
        const { initLocation, title, enable, markerArr, needLabel = true, onClickPoint } = nextProps;
        if (initLocation) {
            setTimeout(() => {
                !!this.marker && this.marker.setPosition(initLocation);
                !!this.map && this.map.setCenter(initLocation);
            }, 100);
        }
        if (props.title !== title) {
            this.marker.setTitle(title);
        }
        if (enable !== props.enable) {
            if (enable) {
                this.map.addEventListener('click', this.onClick);
                this.map.addControl(this.geolocationControl);
                this.map.addControl(this.doneControl);
            } else {
                this.map.removeEventListener('click', this.onClick);
                this.map.removeControl(this.geolocationControl);
                this.map.removeControl(this.doneControl);
            }
        }
        if (markerArr && markerArr.length > 0) {
            const marker = [];
            const info = [];
            const id = [];
            _.forEach(markerArr, (o, k) => {
                const p0 = o.point.split(',')[0]; //
                const p1 = o.point.split(',')[1]; // 按照原数组的point格式将地图点坐标的经纬度分别提出来
                this.point[k] = new window.BMap.Point(p0, p1); // 循环生成新的地图点
                if (o.image) {
                    let myIcon = new BMap.Icon(o.image, new BMap.Size(50, 50));
                    myIcon.setImageSize(new BMap.Size(40, 40));
                    marker[k] = new BMap.Marker(this.point[k], { icon: myIcon });
                } else {
                    marker[k] = new window.BMap.Marker(this.point[k]); // 按照地图点坐标生成标记
                }
                this.map.addOverlay(marker[k]);
                if (needLabel) {
                    const label = new window.BMap.Label(o.title, { offset: new BMap.Size(20, -10) });
                    marker[k].setLabel(label);
                }
                let str = '<p style=’font-size:12px;lineheight:1.8em;’>';
                if (o.title) {
                    str += o.title;
                }
                if (o.address) {
                    str += '</br>地址：' + o.address;
                }
                if (o.tel) {
                    str += '</br> 电话：' + o.tel;
                }
                if (o.problem) {
                    str += '</br> 案件类型：' + o.problem;
                }
                if (o.url) {
                    str += '</br></p><div style=‘width:220px;height:100px;background-image:url(' + o.url + ');background-repeat:no-repeat;background-position:center;background-size:contain;’ />';
                } else {
                    str += '</br></p>';
                }
                info[k] = new window.BMap.InfoWindow(str);
                id[k] = o.id || 'id';
            });
            _.forEach(marker, (o, k) => {
                o.addEventListener('mouseover', function () {
                    o.openInfoWindow(info[k]);
                });
                o.addEventListener('click', function () {
                    if (onClickPoint) {
                        onClickPoint(id[k]);
                    } else {
                        console.log('Error: onClickPoint is not defined!');
                    }
                });
            });
        }
    }
    clearAll () {
        this.map.clearOverlays();
    }
    render () {
        const { id, className } = this.props;
        return (
            <div id={id} className={className} />
        );
    }
}

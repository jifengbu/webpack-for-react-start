/* eslint-disable no-undef */
import React from 'react';
import _ from 'lodash';
import { Button, DatePicker, Icon } from 'antd';
import styles from './index.less';
import { showError, CO } from 'utils';
import moment from 'moment';
const { RangePicker } = DatePicker;

function GetDistance (lat1, lng1, lat2, lng2) {
    var radLat1 = lat1 * Math.PI / 180.0;
    var radLat2 = lat2 * Math.PI / 180.0;
    var a = radLat1 - radLat2;
    var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
           Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137; // EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000;
    return s;
};

let index = 0;
let time = [];
let second = 0;
let countries = [];
export default class TiandiMapContainer extends React.Component {
    static defaultProps = {
        id: 'tiandi_map_container',
    };
    state = {
        handler: {},
        startTime: moment(),
        endTime: moment(),
        needpause: false,
    }
    componentDidMount () {
        let { id, zoom = 17, markerArr = [], initLocation, onClickPoint, needLabel = true, motionTrail, head, mapData } = this.props;
        this.markers = [];
        this.infos = [];
        this.labels = [];

        // 影像底图url
        var imageURL = 'http://t0.tianditu.gov.cn/img_w/wmts?' +
            'SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default' +
            '&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}' +
            '&tk=87cd9d4b9ec808311a737cdacc238ccc';
        // 影像注记url
        var imageURLT = 'http://t0.tianditu.gov.cn/cia_w/wmts?' +
            'SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles' +
            '&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}' +
            '&tk=87cd9d4b9ec808311a737cdacc238ccc';
        // 影像底图图层
        var lay = new T.TileLayer(imageURL, { minZoom: 1, maxZoom: 18 });
        // 影像注记图层
        var lay2 = new T.TileLayer(imageURLT, { minZoom: 1, maxZoom: 18 });
        var config = { layers: [lay, lay2] };
        this.map = new T.Map(id, config);
        var lnglat = initLocation ? new T.LngLat(initLocation[0], initLocation[1]) : new T.LngLat(106.68243, 26.22207);
        this.map.centerAndZoom(lnglat, zoom);

        // 禁用双击放大
        this.map.disableDoubleClickZoom();

        var zoomControl = new T.Control.Zoom({ position: T_ANCHOR_TOP_LEFT });
        var scaleControl = new T.Control.Scale({ position: T_ANCHOR_BOTTOM_LEFT });

        // 添加缩放控件;
        this.map.addControl(zoomControl);

        // 添加标尺控件;
        this.map.addControl(scaleControl);

        // 添加覆盖图片
        var bd = new T.LngLatBounds(
               new T.LngLat(106.67985, 26.21905),
               new T.LngLat(106.68501, 26.22510));
        this.img = new T.ImageOverlay('/hbclient/img/map_wangge.png', bd, {
            opacity: 1,
        });
        this.map.addOverLay(this.img);

        var bd1 = new T.LngLatBounds(
            new T.LngLat(106.68878, 26.26923),
            new T.LngLat(106.69428, 26.27297));
        this.img1 = new T.ImageOverlay('/hbclient/img/map_longquan.png', bd1, {
            opacity: 1,
        });
        this.map.addOverLay(this.img1);

        var bd2 = new T.LngLatBounds(
            new T.LngLat(106.67295, 26.21340),
            new T.LngLat(106.67679, 26.21700));
        this.img2 = new T.ImageOverlay('/hbclient/img/country/10.png', bd2, {
            opacity: 1,
        });
        this.map.addOverLay(this.img2);

        var bd3 = new T.LngLatBounds(
            new T.LngLat(106.67774, 26.22663),
            new T.LngLat(106.68029, 26.22917));
        this.img3 = new T.ImageOverlay('/hbclient/img/country/11.png', bd3, {
            opacity: 1,
        });
        this.map.addOverLay(this.img3);

        this.inintMarkArr(markerArr, needLabel, onClickPoint, mapData);

        if (motionTrail && motionTrail.length > 0) {
            let datas = [];
            motionTrail.forEach(item => {
                let tmp = item.split(',');
                let lnlat = new T.LngLat(tmp[0], tmp[1]);
                datas.push(lnlat);
            });
            for (var i = 0; i < motionTrail.length; i++) {
                let tmp1 = motionTrail[i].split(',');
                if (motionTrail[i + 1]) {
                    let tmp2 = motionTrail[i + 1].split(',');
                    let tmpDistance = GetDistance(tmp1[1], tmp1[0], tmp2[1], tmp2[0]) * 1;
                    let tmpTime = tmpDistance / 0.3 * 10;
                    tmpTime = Math.floor(tmpTime) === 0 ? Math.ceil(tmpTime) : Math.floor(tmpTime);
                    time.push(tmpTime);
                }
            }
            let _CarTrack = new T.CarTrack(this.map, {
                interval: 10,
                speed: 0.3,
                dynamicLine: true,
                carstyle: { display: false, iconUrl: head || '/hbclient/img/map/workMan.png', width: 52, height: 52 },
                polylinestyle: { color: '#2C64A7', weight: 5, opacity: 0.9 },
                Datas: datas,
            });
            this._CarTrack = _CarTrack;
        }
        // 绘制多边形覆盖层
        this.polygonByBuilding(this.props.buildings);
        this.polygonByGrid(this.props.grids);

        // 创建标注工具对象
        var toolConfig = {
            showLabel: true,
            color: 'blue', weight: 3, opacity: 0.5, fillColor: '#FFFFFF', fillOpacity: 0.5,
        };
        var polygonTool = new T.PolygonTool(this.map, toolConfig);
        this.polygonTool = polygonTool;
        this.default = {
            markerArr,
            needLabel,
            onClickPoint,
        };
    }
    componentWillReceiveProps (nextProps) {
        const { markerArr, needLabel = true, onClickPoint, buildings, panTo, mapData, grids } = nextProps;
        // 指定地图中心点到指定位置
        if (panTo && panTo.length === 2) {
            this.map.panTo(new T.LngLat(panTo[0], panTo[1]), 17);
            this.clearOverlays();
        }
        // 绘制多边形覆盖层
        if (!_.isEqual(buildings, this.props.buildings)) {
            this.polygonByBuilding(buildings);
        }
        if (!_.isEqual(grids, this.props.grids)) {
            this.polygonByGrid(grids);
        }
        if (markerArr && !_.isEqual(this.props.markerArr, markerArr)) {
            this.inintMarkArr(markerArr, needLabel, onClickPoint, mapData);
        }
    }
    inintMarkArr (markerArr, needLabel = true, onClickPoint, mapData) {
        // 修改图标
        let icon = new T.Icon({
            iconUrl: 'http://api.tianditu.gov.cn/img/map/markerA.png',
            iconSize: new T.Point(40, 40),
        });
        if (markerArr && markerArr.length > 0) {
            _.forEach(markerArr, (o, k) => {
                const p0 = o.point.split(',')[0];
                const p1 = o.point.split(',')[1];
                var latlng = new T.LngLat(p0, p1);
                if (o.image) {
                    icon = new T.Icon({
                        iconUrl: o.image,
                        iconSize: new T.Point(40, 40),
                    });
                }
                let marker = new T.Marker(latlng, { icon: icon });
                this.markers.push(marker);
                this.map.addOverLay(marker);

                // 添加标注内容
                if (needLabel) {
                    let labelItem = new T.Label({
                        text: o.title,
                        position: latlng,
                        offset: new T.Point(-9, -30),
                    });
                    this.labels.push(labelItem);
                    this.map.addOverLay(labelItem);
                }

                // 添加信息窗口
                let info = new T.InfoWindow();
                this.infos.push(info);
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
                info.setContent(str);
                // 添加标注点鼠标移入事件
                marker.addEventListener('mouseover', function () {
                    marker.openInfoWindow(info);
                });
                // 添加标注点鼠标移出事件
                marker.addEventListener('mouseout', function () {
                    marker.closeInfoWindow();
                });
                // 添加标注点点击事件
                marker.addEventListener('click', function () {
                    onClickPoint && onClickPoint(o);
                });
            });
        }
        if (mapData) {
            d3.json(mapData, (data) => {
                countries = data.features;
                let countriesOverlay = new T.D3Overlay(this.initGeo, this.initRedraw);
                this.map.addOverLay(countriesOverlay);
                countriesOverlay.bringToBack();
            });
        }
    }

    // 初始化geo相关
    initGeo (sel, transform) {
        let projection = d3.geo.mercator().center([106.703340, 25.805450]).scale(14000).translate([1200, 3050]);
        let path = d3.geo.path().projection(projection);
        let upd = sel.selectAll('path.geojson').data(countries);
        upd.enter()
            .append('path')
            .attr('class', 'geojson')
            .attr('stroke', 'black')
            .attr('fill', function (d, i) {
                return d3.hsl(Math.random() * 360, 0.9, 0.5);
            })
            .attr('fill-opacity', '0.5');
        sel.selectAll('text')
            .data(countries)
            .enter()
            .append('text')
            .attr('transform', function (d, i) {
                return 'translate(' + (path.centroid(d)[0] - 10) + ',' + path.centroid(d)[1] + ')';
            })
            .text(function (d) {
                return d.properties.name;
            })
            .attr('font-size', 12);
        sel.selectAll('rect')
            .on('click', function (d, i) {
                console.log(`${d.properties.name}`);
            });
    }
    initRedraw (sel, transform) {
        sel.selectAll('path.geojson').each(
            function (d, i) {
                d3.select(this).attr('d', transform.pathFromGeojson);
            }
        );
    }

    // 点工具
    openMarkerTool () {
        let { handler } = this.state;
        if (handler.close) {
            handler.close();
        }
        handler = new T.MarkTool(this.map, { follow: true });
        handler.open();
        this.setState({ handler });
    }
    // 网格描边
    polygonByGrid (grids) {
        const { onClickPoint } = this.props;
        if (grids && grids.length > 0) {
            _.forEach(grids, (grid, index) => {
                if (grid.buildingPoints && grid.buildingPoints.length > 0) {
                    let polygonPoints = [];
                    let polygonPoint;
                    _.forEach(grid.buildingPoints, (item) => {
                        let locations = item.split(',');
                        polygonPoint = new T.LngLat(locations[0], locations[1]);
                        polygonPoints.push(polygonPoint);
                    });

                    let labelItem = new T.Label({
                        text: grid.name,
                        position: new T.LngLat(grid.location[0], grid.location[1]),
                        offset: new T.Point(-40, -20),
                    });
                    labelItem.setFontColor('white');
                    labelItem.setBackgroundColor('');
                    labelItem.setBorderColor('');
                    labelItem.setFontSize(12);
                    this.map.addOverLay(labelItem);

                    let polygon = new T.Polygon(polygonPoints, {
                        opacity: 0.7,
                        fillOpacity: 0.7,
                        color: '#fff',
                        fillColor: CO.MAP_COLORS[index],
                    });
                    polygon.addEventListener('click', () => {
                        onClickPoint && onClickPoint({ id: grid.id, type: 'grid' });
                    });
                    this.map.addOverLay(polygon);
                }
            });
        }
    }
    // 楼栋描边
    polygonByBuilding (buildings) {
        const { onClickPoint } = this.props;
        if (buildings && buildings.length > 0) {
            _.forEach(buildings, (building) => {
                if (building.buildingPoints && building.buildingPoints.length > 0) {
                    let polygonPoints = [];
                    // 添加信息窗口
                    let str = `<p style=’font-size:12px;lineheight:1.8em;’>${building.name}</br>
                        ${typeof building.familyCount !== 'undefined' ? '家庭：' + building.familyCount + '户</br>' : ''}
                        ${typeof building.peopleCount !== 'undefined' ? '人口：' + building.peopleCount + '人</br>' : ''}
                        ${typeof building.stayOlderCount !== 'undefined' ? '关爱人员：' + building.careCount + '人</br>' : ''}
                        ${typeof building.stayOlderCount !== 'undefined' ? '关注人员：' + building.controlPeopleCount + '人</br></p>' : ''}`;
                    let point = new T.Point(0, -30);
                    let info = new T.InfoWindow(str);
                    info.setOffset(point);

                    let polygonPoint;
                    _.forEach(building.buildingPoints, (item) => {
                        let locations = item.split(',');
                        polygonPoint = new T.LngLat(locations[0], locations[1]);
                        polygonPoints.push(polygonPoint);
                    });

                    let labelItem = new T.Label({
                        text: building.name,
                        position: polygonPoint,
                        offset: new T.Point(-9, -10),
                    });
                    labelItem.setBackgroundColor('rgba(0,0,0,0.3)');
                    labelItem.setBorderColor('rgba(0,0,0,0)');
                    labelItem.setFontColor('white');

                    this.map.addOverLay(labelItem);

                    let polygon = new T.Polygon(polygonPoints, {
                        opacity: 0,
                        fillOpacity: 0,
                        color: 'yellow',
                        fillColor: 'yellow',
                    });
                    polygon.addEventListener('click', () => {
                        onClickPoint && onClickPoint({ id: building.id, type: 'building', hasGrids: building.hasGrids });
                    });
                    polygon.addEventListener('mouseover', () => {
                        polygon.setFillOpacity(0.3);
                        polygon.setOpacity(0.3);
                        polygon.openInfoWindow(info);
                    });
                    polygon.addEventListener('mouseout', () => {
                        polygon.setFillOpacity(0);
                        polygon.setOpacity(0);
                        polygon.closeInfoWindow();
                    });
                    this.map.addOverLay(polygon);
                }
            });
        }
    }
    // 地图重置
    clearOverlays () {
        const { markerArr, needLabel, onClickPoint } = this.default;
        this.map.clearOverLays();
        // 添加覆盖图片
        this.overlay = this.map.addOverLay(this.img);
        this.overlay1 = this.map.addOverLay(this.img1);
        this.overlay2 = this.map.addOverLay(this.img2);
        this.overlay3 = this.map.addOverLay(this.img3);
        this.inintMarkArr(markerArr, needLabel, onClickPoint);
        this.polygonByBuilding(this.props.buildings);
    }
     // 描边工具
    openPolygonTool () {
        let { handler } = this.state;
        if (handler) {
            handler.close();
        }
        handler = new T.PolygonTool(this.map);
        handler.open();
    }
    onSubmit () {
        const { onSelect, initLocation, needAddress, closeModal } = this.props;
        const { handler } = this.state;
        const gc = new BMap.Geocoder();
        if (!handler.close && initLocation) {
            const marker = new BMap.Marker(initLocation);
            gc.getLocation(marker.getPosition(), function (rs) {
                if (needAddress) {
                    var addComp = rs.addressComponents;
                    onSelect(rs, addComp.district + addComp.street + addComp.streetNumber);
                } else {
                    onSelect(rs);
                }
            });
        }
        const point = handler.getMarkControlPoint();
        if (point) {
            const baiduPoint = new window.BMap.Point(point.lng, point.lat);
            const marker = new window.BMap.Marker(baiduPoint);
            gc.getLocation(marker.getPosition(), function (rs) {
                if (needAddress) {
                    var addComp = rs.addressComponents;
                    onSelect(rs, addComp.district + addComp.street + addComp.streetNumber);
                } else {
                    onSelect(rs);
                }
            });
        } else {
            showError('请先标注点');
        }
        closeModal && closeModal();
    }
    onSelect () {
        const { initLocation } = this.props;
        if (initLocation) {
            this.clearOverlays();
            this.openMarkerTool();
        } else {
            this.openMarkerTool();
        }
    }
    doSearch () {
        this.setState({ });
    }
    addMarker () {
        const { motionTrail, inoutInfo } = this.props;
        const { image, time } = inoutInfo[index];
        const p0 = motionTrail[index].split(',')[0];
        const p1 = motionTrail[index].split(',')[1];
        var latlng = new T.LngLat(p0, p1);
        let marker = new T.Marker(latlng);
        this.markers.push(marker);
        this.map.addOverLay(marker);
        let info = new T.InfoWindow();
        this.infos.push(info);
        let str = `<p style='display:flex;flex-direction:column;justify-content: center;align-items: center;font-size:12px;'><img src=${image} style='width:80px;height:80px;' /></br></br>时间：${moment(time).format('YYYY-MM-DD HH:mm:ss')}</p>`;
        info.setContent(str);
        // 添加标注点鼠标移入事件
        marker.openInfoWindow(info);
    }
    tick () {
        if (index === 0 && second === 0) {
            this.addMarker();
        }
        if (typeof time[index] === 'undefined') {
            this.addMarker();
            second = 0;
            index++;
        }
        if (second == time[index]) {
            this.addMarker();
            second = 0;
            index++;
        }
        if (index > time.length) {
            index = 0;
            this.stop();
        }
        second++;
        this.setState({});
    }
    start () {
        if (index === 0) {
            this.clearOverlays();
        }
        this._CarTrack.start();
        this.timer = setInterval(() => this.tick(), 1000);
        this.setState({ needpause: true });
    }
    pause () {
        this._CarTrack.pause();
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        this.setState({ needpause: false });
    }
    stop () {
        this._CarTrack.stop();
        index = 0;
        second = 0;
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        this.setState({ needpause: false });
    }
    render () {
        const { id, className, enable, initLocation, motionTrail } = this.props;
        const { handler = {}, needpause } = this.state;
        const isInOutRecord = motionTrail && motionTrail.length > 0;
        return (
            <div className={isInOutRecord ? styles._container : styles.container}>
                <div id={id} className={className} />
                {
                    enable &&
                    <div className={styles.button}>
                        <Button className={styles.item} onClick={::this.onSubmit}>确认</Button>
                        <Button className={styles.item} onClick={::this.onSelect}>{initLocation || handler.close ? '重新选点' : '选点'}</Button>
                    </div>
                }
                {
                    isInOutRecord &&
                    <div className={styles.isInOutRecord}>
                        <div className={styles.row}>
                            <div className={styles.label}>日期：</div>
                            <div style={{ width: 235 }}><RangePicker placeholder={['开始日期', '结束日期']} onChange={(value) => { this.setState({ startTime: moment(value[0]), endTime: moment(value[1]) }); }} disabledTime={(current) => current > moment()} format='YYYY-MM-DD' /></div>
                            <Button style={{ marginLeft: 15 }} onClick={::this.doSearch}>搜索</Button>
                        </div>
                        <div className={styles.recordButton}>
                            { !needpause && <Button className={styles.bottmButton} onClick={::this.start}><div className={styles.title}>开始</div><Icon className={styles.icon} type='caret-right' /></Button>}
                            { needpause && <Button className={styles.bottmButton} onClick={::this.pause}><div className={styles.title}>暂停</div><Icon className={styles.icon} type='pause' /></Button>}
                            <Button className={styles.bottmButton} onClick={::this.stop}><div className={styles.title}>重置</div><Icon className={styles.icon} type='reload' /></Button>
                        </div>
                    </div>
                }
            </div>
        );
    }
  };

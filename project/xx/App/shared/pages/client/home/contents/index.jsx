import React from 'react';
import _ from 'lodash';
import styles from './index.less';
import Echarts from 'echarts-for-react';
import echarts from 'echarts';
import moment from 'moment';

export default class Home extends React.Component {
    static fragments = {
        personal: 1,
        statistics: 1,
    };
    state = {
        index: 0,
        memberData: {},
        dispatchFiles: {},
        eachTypeData: {},
        pieTypeData: {},
        timeLineData: {},

    };

    componentWillMount () {
        const { personal, updatePersonal } = this.props;
        personal && updatePersonal(personal);
    }
    componentWillReceiveProps (nextProps) {
        const props = this.props;
        const { personal } = nextProps;
        if (personal && !_.isEqual(props.personal, personal)) {
            props.updatePersonal(personal);
        }
        this.initMembers();
        this.initDispatchFiles();
        this.initEachType();
        this.initPieType();
        this.initTimeLineType();
        this.initCurrentTime();
    }
    /**
    * 当前时间
    */
    initCurrentTime () {
        let that = this;
        let t = null;
        t = setTimeout(time, 1000); // 开始运行
        function time () {
            clearTimeout(t);
            let showTime = moment().format('YYYY年MM月DD日-HH时mm分ss秒');
            that.setState({ showTime });
            t = setTimeout(time, 1000); // 设定定时器，循环运行
        }
    }
    initMembers () {
        const { statistics = {} } = this.props;
        // option 选项
        let option = {
            title: {
                text: '各科室成员',
                textStyle: {
                    color: '#ccc',
                    fontSize: 16,
                },
                top: '5%',
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                },
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true,
            },
            xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01],
                axisLine: {
                    lineStyle: {
                        width: 3,
                    },
                },
                axisTick: {
                    show: false,
                },
                splitLine: {// 坐标轴在 grid 区域中的分隔线
                    show: false,
                },
                axisLabel: {
                    color: '#ccc',
                    fontSize: 16,
                },
            },
            yAxis: {
                type: 'category',
                data: statistics.organizations,
                axisLine: {
                    lineStyle: {
                        width: 3,
                    },
                },
                axisLabel: {
                    color: '#ccc',
                    fontSize: 16,

                },
                axisTick: {
                    show: false,
                },
            },
            series: [
                {
                    // name: '2020年',
                    type: 'bar',
                    barWidth: '45%',
                    data: statistics.memberCount,
                    itemStyle: {
                        normal: {
                            barBorderRadius: [0, 30, 30, 0],
                            color: {// 渐变
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 1,
                                y2: 1,
                                colorStops: [
                                    {
                                        offset: 0, color: '#5359ef', // 0% 处的颜色
                                    },
                                    {
                                        offset: 1, color: '#4e9efb', // 100% 处的颜色
                                    },
                                ],
                                global: false, // 缺省为 false
                            },
                        },
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'right',
                            textStyle: {
                                color: '#fff', // color of value
                                fontSize: 14,
                            },
                        },
                    },
                },
            ],
        };

        this.setState({
            memberData: option,
        });
    }
    initDispatchFiles () {
        const { statistics = {} } = this.props;
        // option 选项
        let dispatchFiles = {
            title: {
                text: '各科室发文总数',
                textStyle: {
                    color: '#ccc',
                    fontSize: 16,
                },
                top: '3%',
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '1%',
                containLabel: true,
            },
            tooltip: {
                trigger: 'axis',
            },
            xAxis: {// x轴
                type: 'category', // 类目轴
                data: statistics.organizations,
                boundaryGap: false, // 紧挨边缘
                axisLabel: {
                    color: '#4c9bfb',
                    fontSize: 14,
                },
                axisLine: {
                    lineStyle: {
                        color: '#ccc',
                    },
                },
                axisTick: {
                    show: false,
                },
            },
            yAxis: {
                type: 'value',
                scale: true, // 缩放: 脱离 0 值比例
                axisLabel: {
                    color: '#4c9bfb',
                    fontSize: 14,
                },
                splitLine: {// 坐标轴在 grid 区域中的分隔线
                    show: false,
                },
                axisLine: {
                    lineStyle: {
                        color: '#ccc',
                    },
                },
                axisTick: {
                    show: false,
                },
            },
            series: [
                {
                    type: 'line', // 折线图
                    stack: 'all', // 堆叠图
                    data: statistics.filesCount,
                    // data: [2000, 2200, 1000, 1000, 700, 450, 800, 1300, 700, 800, 500, 900],
                    smooth: true, // 平滑
                    lineStyle: {// 线样式
                        normal: {
                            color: '#326de3', // 颜色
                        },
                    },
                    areaStyle: {// 填充风格
                        normal: {
                            color: '#213a68',
                        },

                    },
                },
            ],
        };
        this.setState({
            dispatchFiles,
        });
    }
    // 右边时间折线图
    initEachType () {
        const { statistics = {} } = this.props;
        const { fileDataByDepartment = [] } = statistics;
        let aa = _.map(fileDataByDepartment, o => o.data) || {};
        let data = _.map(aa[0], o => o.day).reverse() || {};// x轴data数据
        let count1 = _.map(aa[0], o => o.count).reverse() || {};// line1 data数据
        let count2 = _.map(aa[1], o => o.count).reverse() || {};// line2 data数据
        let count3 = _.map(aa[2], o => o.count).reverse() || {};// line3 data数据
        let count4 = _.map(aa[3], o => o.count).reverse() || {};// line4 data数据
        let count5 = _.map(aa[4], o => o.count).reverse() || {};// line5 data数据
        const names = fileDataByDepartment.map(item => item.department);// line names
        // option 选项
        let timeLineData = {
            color: ['#458FE3', '#48C964', '#FFAE37', '#FB8989', '#CA89FB'],
            title: {
                top: '3%',
                text: '各科室发文总数趋势',
                textStyle: {
                    color: '#ccc',
                    fontSize: 16,
                },
            },
            tooltip: {
                // show: true
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                },
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true,
            },
            xAxis: {
                type: 'category',
                axisTick: { show: false },
                axisLabel: {
                    textStyle: { color: '#5793f3', fontSize: 16 },
                },
                axisLine: {
                    // onZero: false, // X轴脱离Y轴0刻度
                    lineStyle: { color: '#707070' },
                },
                data,
            },
            yAxis: {
                nameTextStyle: {
                    color: '#707070', fontSize: 14,
                },
                axisLabel: {
                    textStyle: { color: '#5793f3', fontSize: 18 },
                    showMaxLabel: false,
                },
                axisLine: {
                    lineStyle: { color: '#707070' },
                },
                // axisTick: { show: false },
                splitLine: { show: false },
                axisTick: { show: false },
                boundaryGap: [0, 0.1],
            },
            series: [
                {
                    name: names[0], // 科信处
                    type: 'line',
                    symbolSize: 14,
                    // data: [10, 3, 12, 0, 5]
                    data: count1,
                },
                {
                    name: names[1],
                    type: 'line',
                    symbolSize: 14,
                    // data: [7, 8, 9, 7, 19]
                    data: count2,
                },
                {
                    name: names[2],
                    type: 'line',
                    symbolSize: 14,
                    // data: [17, 8, 9, 7, 19]
                    data: count3,
                },
                {
                    name: names[3],
                    type: 'line',
                    symbolSize: 14,
                    // data: [20, 8, 9, 7, 19]
                    data: count4,
                },
                {
                    name: names[4],
                    type: 'line',
                    symbolSize: 14,
                    // data: [12, 8, 9, 7, 19]
                    data: count5,
                },
            ],
        };
        this.setState({
            timeLineData,
        });
    }
    // 饼状图
    initPieType () {
        const { statistics = {} } = this.props;

        let tmpCount = _.map(statistics.eachTypeCount, o => o.count);
        let total = _.sum(tmpCount);
        let tmpName = _.map(statistics.eachTypeCount, o => o._id);
        let data = [];
        tmpName.forEach((item, index) => {
            data.push({
                name: item,
                value: tmpCount[index],
            });
        });
        const name = data[0] ? data[0].name : {};
        // option 选项
        let pieTypeData = {

            title: {
                text: '各发件类型占比',
                textStyle: {
                    color: '#ccc',
                    fontSize: 16,
                },
                top: '3%',
            },
            /*  grid: {
                left: '3%',
                right: '4%',
                bottom: '0%',
                containLabel: true
            }, */
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true,
            },
            color: ['#1089E7', '#F57474', '#56D0E3', '#F8B448', '#8B78F6'],
            tooltip: {
                trigger: 'item',
                // formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
                bottom: 0,
                left: '20%',
                data: [name],
                textStyle: {
                    color: 'rgba(255,255,255,.5)',
                    fontSize: '10',
                },
            },
            series: [
                {
                    type: 'pie',
                    name: 'html',
                    data: data,
                    label: {
                        normal: {
                            show: true, // 显示文字
                            // formatter: '1号店' 决定文字显示的内容
                            formatter: function (arg) { // 回调函数
                                // return arg.name + '平台' + arg.value + '元\n' + arg.percent + '%';
                                return arg.name;
                            },
                        },
                    },
                    // radius: '60%' // 饼图的半径
                    radius: ['50', '75%'], // 第 0 个元素代表的是内圆的半径，第 1 个元素外圆的半径
                    roseType: 'radius',
                    selectedMode: 'single',
                },
            ],
        };
        this.setState({
            pieTypeData,
        });
    }
    // 中间总发文折线图
    initTimeLineType () {
        const { statistics = {} } = this.props;
        const { fileData = [] } = statistics;
        console.log(fileData);
        const data = fileData.map(item => item.day).reverse();// x轴data数据
        const lineData = fileData.map(item => item.count).reverse();// series系列的折线图data
        // option选项
        let eachTypeData = {
            grid: {
                left: '3%',
                right: '4%',
                bottom: '1%',
                containLabel: true,
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    // console.log(params);
                    const param = params[0];
                    // var date = new Date(params.name);
                    // return date.getFullYear() + '/' +  date.getDate() + '/' + (date.getMonth() + 1);
                    return param.value + '份';
                },
                axisPointer: {
                    animation: false,
                    type: 'cross',
                    label: {
                        color: '#fff',
                        backgroundColor: '#707070',
                    },
                },
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                splitLine: {
                    show: false,
                },
                axisLabel: {// 坐标轴刻度标签的相关设置
                    show: true, // 是否显示刻度标签(值)
                    color: '#f2f2f2',
                    margin: 8,
                    fontSize: 14,
                },

                axisLine: {// 坐标轴轴线相关设置
                    lineStyle: {// 线的样式
                        color: '#ccc', // 颜色
                    },
                },
                axisTick: {// 坐标轴刻度相关设置。
                    show: false, // 不显示刻度
                },
                // data: ['2019-1-1', '2019-2-1', '2019-3-1', '2019-4-1', '2019-5-1']
                data,
            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, '10%'],
                splitLine: {
                    show: false,
                },
                axisLabel: {// 坐标轴刻度标签的相关设置
                    show: true, // 是否显示刻度标签(值)
                    color: '#f2f2f2',
                    fontSize: 14,
                },
                axisTick: {// 坐标轴刻度相关设置。
                    show: false, // 不显示刻度
                },
                axisLine: {// 坐标轴轴线相关设置
                    lineStyle: {// 线的样式
                        color: '#ccc', // 颜色
                    },
                },

            },
            series: [{
                // name: '模拟数据',
                type: 'line',
                // showSymbol: false,
                // symbolSize: 14,
                // hoverAnimation: false,
                // data: [10, 20, 10, 40, 50, 20, 10, 20, 49, 20, 11, 23, 24, 33, 12, 22, 2, 1, 6, 4, 19, 23, 18, 22, 21, 20, 10, 30, 40, 42],
                data: lineData,
                lineStyle: {// 线样式
                    normal: {
                        color: '#326de3', // 颜色
                        type: 'solid', // 类型 dashed dotted solid
                    },
                },
                smooth: true,
                /* areaStyle: {// 填充风格
                    normal: {
                        color: 'pink'
                    }
                } */
            }],
        };
        this.setState({
            eachTypeData,
        });
    }
    render () {
        const { memberData, dispatchFiles, eachTypeData, pieTypeData, timeLineData, showTime = '' } = this.state;
        const { statistics = {} } = this.props;
        return (
            <div className={styles.container} id='main'>
                <div className={styles.title_bg}>
                    <p className={styles.title}>公安局协同办公系统</p>
                    <div className={styles.showTime}>当前时间：{showTime}</div>
                </div>
                <div className={styles.main}>
                    <div className={styles.leftContainer} >
                        <div className={styles.panel}>
                            <Echarts style={{ height: '370px' }} option={memberData} />
                            <div className={styles.panelFooter} />
                        </div>
                        <div className={styles.panel}>
                            <Echarts style={{ height: '370px' }} option={dispatchFiles} />
                            <div className={styles.panelFooter} />
                        </div>
                    </div>
                    <div className={styles.middleContainer}>

                        <div className={styles.middleContainerContent}>
                            <div className={styles.no}>
                                <div className={styles.noHd}>
                                    <ul>
                                        <li>{statistics.dayDispatchCount}</li>
                                        <li>{statistics.monthDispatchCount}</li>
                                        <li>{statistics.totalDispatchCount}</li>
                                    </ul>
                                </div>
                                <div className={styles.noBd}>
                                    <ul>
                                        <li>24小时内发文数/份</li>
                                        <li>30日内发文数/份</li>
                                        <li>总发文数/份</li>
                                    </ul>
                                </div>
                            </div>
                            <div className={styles.map}>
                                <Echarts style={{ height: '520px' }} option={eachTypeData} ref={(e) => { this.echartsReact = e; }} notMerge={false} lazyUpdate />
                                <h3>总发文数趋势</h3>
                            </div>
                        </div>
                        <div />
                    </div>
                    <div className={styles.rightContainer}>
                        <div className={styles.panel}>
                            <Echarts style={{ height: '370px' }} option={timeLineData} />
                            <div className={styles.panelFooter} />
                        </div>
                        <div className={styles.panel}>
                            <Echarts style={{ height: '370px' }} option={pieTypeData} />
                            <div className={styles.panelFooter} />
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}


export default [
    {
        label: '首页',
        key: 'home',
        link: '/hbclient/',
        img: '/hbclient/img/head/home.png',
    }, {
        label: '社区治理',
        key: 'community',
        link: '/hbclient/smartSearch',
        img: '/hbclient/img/head/dangjian.png',
    }, {
        label: '培训就业',
        key: 'employment',
        link: '/hbclient/companyManages',
        img: '/hbclient/img/head/shequ.png',
        auth: (personal) => ((personal || {}).organization || {}).platformType === 1,
    },
    {
        label: '公共服务',
        key: 'service',
        link: '/hbclient/tasks',
        img: '/hbclient/img/head/gonggong.png',
        auth: (personal) => ((personal || {}).organization || {}).platformType !== 2,
    },
    {
        label: '协同处置',
        key: 'synergia',
        link: '/hbclient/tasks',
        img: '/hbclient/img/head/gonggong.png',
        auth: (personal) => ((personal || {}).organization || {}).platformType === 2,
    },
    {
        label: '文化服务',
        key: 'civilization',
        link: '/hbclient/activityNotices',
        img: '/hbclient/img/head/wenhua.png',
        auth: (personal) => ((personal || {}).organization || {}).platformType === 1,
    }, {
        label: '基层党建',
        key: 'political',
        link: '/hbclient/peopleView?peopleType=allPartyMembers',
        img: '/hbclient/img/head/jiuye.png',
        auth: (personal) => ((personal || {}).organization || {}).platformType !== 2,
    }, {
        label: '视联中心',
        key: 'video',
        link: '/hbclient/xueliang',
        img: '/hbclient/img/head/video.png',
        auth: (personal) => ((personal || {}).organization || {}).platformType === 1,
    }, {
        label: '系统设置',
        key: 'system',
        link: '/hbclient/organizations',
        img: '/hbclient/img/head/system.png',
    },
];

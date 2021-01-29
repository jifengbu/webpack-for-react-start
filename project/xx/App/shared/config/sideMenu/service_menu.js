import CO from '../../constants';
export default [
    {
        label: '事件处理',
        key: 'event',
        children: [
            {
                label: '事件上报',
                link: '/hbclient/tasks/publishTask',
                key: 'publishTask',
            },
            {
                label: '事件列表',
                link: '/hbclient/tasks',
                key: 'tasks',
            },
            {
                label: '归档事件',
                link: '/hbclient/tasks?stateType=3',
                key: 'finishTasks',
            },
            {
                label: '高危关注事件',
                link: '/hbclient/tasks?attentionLevel=2',
                key: 'danger',
            },
            {
                label: '矛盾纠纷事件',
                link: '/hbclient/tasks?type=0',
                key: 'contradiction',
            },
            {
                label: '婚恋家庭事件',
                link: '/hbclient/tasks?type=4',
                key: 'familyMarry',
            },
            {
                label: '风险隐患事件',
                link: '/hbclient/tasks?type=1',
                key: 'trouble',
            },
            {
                label: '信访诉求事件',
                link: '/hbclient/tasks?type=2',
                key: 'reporting',
            },
            {
                label: '视频信访诉求',
                link: '/hbclient/reserveVideos?videoType=videoMeet',
                key: 'VideoMeetPassed',
            },
            {
                label: '信访历史记录',
                link: '/hbclient/reserveVideos?videoType=history',
                key: 'videoMeetHistory',
            },
            {
                label: '举报信息',
                link: '/hbclient/reports',
                key: 'reports',
                auth: [CO.AH_CHECK_REPORT, CO.AH_SEND_REWARD],
            },
        ],
    },
    {
        label: '同城共享',
        link: '/hbclient/info',
        key: 'infos',
        auth: (personal) => ((personal || {}).organization || {}).platformType !== 2,
    },
    {
        label: '案宗管理',
        link: '/hbclient/law',
        key: 'laws',
    },
    {
        label: '司法调解',
        link: '/hbclient/judicialConciliation',
        key: 'judicialConciliations',
    },
    {
        label: '司法救助',
        link: '/hbclient/procuratorate',
        key: 'procuratorates',
    },
    {
        label: '服务机构管理',
        link: '/hbclient/serviceOrganizations',
        key: 'serviceOrganizations',
        auth: (personal) => ((personal || {}).organization || {}).platformType !== 2,
    },
    {
        label: '服务队伍成员',
        link: '/hbclient/members?memberType=serviceRankMembers',
        key: 'serviceRankMembers',
        auth: (personal) => ((personal || {}).organization || {}).platformType !== 2,
    },
    {
        label: '服务事项管理',
        link: '/hbclient/serviceThings',
        key: 'serviceThings',
        auth: (personal) => ((personal || {}).organization || {}).platformType !== 2,
    },
];

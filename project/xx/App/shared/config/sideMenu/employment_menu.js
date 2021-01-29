export default [
    {
        label: '实有企业管理',
        link: '/hbclient/companyManages',
        key: 'companyManages',
    },
    {
        label: '就业人员管理',
        link: '/hbclient/peopleView?peopleType=employments',
        key: 'employments',
    },
    {
        label: '待业人员管理',
        link: '/hbclient/peopleView?peopleType=unemployeds&isCompany=true',
        key: 'companyUnemployeds',
    },
    // {
    //     label: '培训技能申请',
    //     link: '/hbclient/trainSkillApplys',
    //     key: 'trainSkillApplys',
    // },
    // {
    //     label: '培训技能发布',
    //     link: '/hbclient/trainSkillNotices',
    //     key: 'trainSkillNotices',
    // },
    {
        label: '技能培训情况',
        link: '/hbclient/trainings',
        key: 'trainings',
    },
    {
        label: '招工发布',
        link: '/hbclient/recruits',
        key: 'recruits',
    },
];

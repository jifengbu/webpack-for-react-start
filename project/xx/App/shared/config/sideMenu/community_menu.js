export default [
    {
        label: '智能搜索',
        key: 'smartSearch',
        link: '/hbclient/smartSearch',
    },
    {
        label: '房屋管理',
        key: 'house',
        children: [
            {
                label: '楼栋列表',
                link: '/hbclient/buildingManager',
                key: 'buildingManager',
            }, {
                label: '房屋列表',
                link: '/hbclient/buildingManager/houseView',
                key: 'houseView',
            },
        ],
    },
    {
        label: '人口管理',
        key: 'basePeople',
        children: [
            {
                label: '实有人口',
                link: '/hbclient/peoples',
                key: 'peoples',
            },
            {
                label: '户籍人口',
                link: '/hbclient/peoples?peopleType=census',
                key: 'census',
            },
            {
                label: '流入人口',
                link: '/hbclient/peoples?peopleType=intoPeople',
                key: 'intoPeople',
            },
            {
                label: '流出人口',
                link: '/hbclient/peoples?peopleType=floatPeople',
                key: 'floatPeople',
            },
            {
                label: '风险等级分析',
                link: '/hbclient/peoples?peopleType=focal',
                key: 'focal',
            },
            {
                label: '人员核实',
                link: '/hbclient/peopleTemps',
                key: 'peopleTemps',
            },
        ],
    },
    {
        label: '就业就学',
        key: 'workPeople',
        children: [
            {
                label: '学龄前',
                link: '/hbclient/peopleView?peopleType=preschools',
                key: 'preschools',
            },
            {
                label: '学生',
                link: '/hbclient/peopleView?peopleType=students',
                key: 'students',
            },
            {
                label: '待业',
                link: '/hbclient/peopleView?peopleType=unemployeds',
                key: 'unemployeds',
            },
            {
                label: '本地就业',
                link: '/hbclient/peopleView?peopleType=inworks',
                key: 'inworks',
            },
            {
                label: '县外就业',
                link: '/hbclient/peopleView?peopleType=outworks',
                key: 'outworks',
            },
            {
                label: '公益性岗位',
                link: '/hbclient/peopleView?peopleType=publicWelfare',
                key: 'publicWelfare',
            },
            {
                label: '扶贫专岗',
                link: '/hbclient/peopleView?peopleType=povertyAlleviation',
                key: 'povertyAlleviation',
            },
            {
                label: '自主创业',
                link: '/hbclient/peopleView?peopleType=selfEmployment',
                key: 'selfEmployment',
            },
            {
                label: '无劳动力',
                link: '/hbclient/peopleView?peopleType=disabilitys',
                key: 'disabilitys',
            },
        ],
    },
    {
        label: '关爱人群',
        key: 'carePeople',
        children: [
            {
                label: '空巢老人',
                link: '/hbclient/peopleView?peopleType=stayOlders',
                key: 'stayOlders',
            },
            {
                label: '留守儿童',
                link: '/hbclient/peopleView?peopleType=stayChildrens',
                key: 'stayChildrens',
            },
            {
                label: '残疾人',
                link: '/hbclient/peopleView?peopleType=deformedPeoples',
                key: 'deformedPeoples',
            },
            {
                label: '伤残军人',
                link: '/hbclient/peopleView?peopleType=woundedWarriors',
                key: 'woundedWarriors',
            },
            {
                label: '退役士兵',
                link: '/hbclient/peopleView?peopleType=retiredSoldier',
                key: 'retiredSoldier',
            },
            {
                label: '低保人员',
                link: '/hbclient/peopleView?peopleType=pensionPeople',
                key: 'pensionPeople',
            },
        ],
    },
    {
        label: '关注人群',
        key: 'controlPeople',
        children: [
            {
                label: '酗酒闹事',
                link: '/hbclient/peopleView?peopleType=drinks',
                key: 'drinks',
            },
            {
                label: '涉毒人员',
                link: '/hbclient/peopleView?peopleType=drugs',
                key: 'drugs',
                needPassword: true,
            },
            {
                label: '失信人员',
                link: '/hbclient/peopleView?peopleType=dishonestPeople',
                key: 'dishonestPeople',
            },
            {
                label: '邪教人员',
                link: '/hbclient/peopleView?peopleType=heresy',
                key: 'heresy',
            },
            {
                label: '疑似精神病',
                link: '/hbclient/peopleView?peopleType=doubtMentals',
                key: 'doubtMentals',
            },
            {
                label: '违法青少年',
                link: '/hbclient/peopleView?peopleType=IllegalTeenagers',
                key: 'IllegalTeenagers',
            },
            {
                label: '重度精神病人',
                link: '/hbclient/peopleView?peopleType=brainLessMentalsPeoples',
                key: 'brainLessMentalsPeoples',
            },
            {
                label: '刑事前科人员',
                link: '/hbclient/peopleView?peopleType=criminals',
                key: 'criminals',
                needPassword: true,
            },

            {
                label: '信访重点人员',
                link: '/hbclient/peopleView?peopleType=noisyvisits',
                key: 'noisyvisits',
            },
            {
                label: '社区矫正人员',
                link: '/hbclient/peopleView?peopleType=communityRectification',
                key: 'communityRectification',
            },
        ],
    },
    {
        label: '系统预警',
        key: 'earlyWarning',
        children: [
            {
                label: '水电预警',
                link: '/hbclient/earlyWarning?peopleType=waterAndElectric',
                key: 'waterAndElectric',
            },
            {
                label: '风险预警',
                link: '/hbclient/earlyWarning?peopleType=riskEarlyWarning',
                key: 'riskEarlyWarning',
            },
            {
                label: '空巢老人预警',
                link: '/hbclient/earlyWarning?peopleType=lastAppearOnScreenByOldMan',
                key: 'lastAppearOnScreenByOldMan',
            },
            {
                label: '留守儿童预警',
                link: '/hbclient/earlyWarning?peopleType=lastAppearOnScreenByChild',
                key: 'lastAppearOnScreenByChild',
            },
            {
                label: '布控人员预警',
                link: '/hbclient/earlyWarning?peopleType=importantControlPeople',
                key: 'importantControlPeople',
            },
            {
                label: '尿检人员预警',
                link: '/hbclient/earlyWarning?peopleType=uroscopyControlPeople',
                key: 'uroscopyControlPeople',
            },
            {
                label: '精神病人外出预警',
                link: '/hbclient/earlyWarning?peopleType=insanityControlPeople',
                key: 'insanityControlPeople',
            },
        ],
    },
    {
        label: '民生管理',
        key: 'livelihood',
        children: [
            {
                label: '医疗保险',
                link: '/hbclient/medicals',
                key: 'medicals',
            },
            {
                label: '养老保险',
                link: '/hbclient/allowances',
                key: 'allowances',
            },
            {
                label: '低保管理',
                link: '/hbclient/pensions',
                key: 'pensions',
            },
            {
                label: '残疾人管理',
                link: '/hbclient/disabilitys',
                key: 'disabilitys',
            },
            {
                label: '走访记录',
                link: '/hbclient/visits',
                key: 'visits',
            },
        ],
    },
    {
        label: '户口管理',
        key: 'residence',
        children: [
            {
                label: '入户审查',
                link: '/hbclient/registerResidences',
                key: 'registerResidences',
            },
            {
                label: '迁出审查',
                link: '/hbclient/turnOutResidences',
                key: 'turnOutResidences',
            },
            {
                label: '注销审查',
                link: '/hbclient/destoryResidences',
                key: 'destoryResidences',
            },
        ],
    },
];

export default [
    {
        label: '视联管理',
        key: 'video',
        children: [
            {
                label: '雪亮工程',
                link: '/hbclient/xueliang',
                key: 'xueliang',
            },
            {
                label: '出入记录',
                link: '/hbclient/inOutRecords?stranger=normal',
                key: 'inOutRecords',
            },
            {
                label: '陌生人出入记录',
                link: '/hbclient/inOutRecords?stranger=stranger',
                key: 'stranger',
            },
            {
                label: '留守老人三日未出门',
                link: '/hbclient/peopleView?peopleType=lastAppearOnScreenByOldMan',
                key: 'lastAppearOnScreenByOldMan',
            },
            {
                label: '留守儿童外出未归',
                link: '/hbclient/peopleView?peopleType=lastAppearOnScreenByChild',
                key: 'lastAppearOnScreenByChild',
            },
        ],
    },
];

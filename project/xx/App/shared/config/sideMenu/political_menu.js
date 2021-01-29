export default [
    {
        label: '党组织管理',
        key: 'basicPartyOrg',
        children: [
            {
                label: '组织成员',
                link: '/hbclient/peopleView?peopleType=allPartyMembers',
                key: 'allPartyMembers',
            }, {
                label: '组织机构',
                link: '/hbclient/partyOrganizations?type=partyOrganizations',
                key: 'partyOrganizations',
            },
        ],
    },
    {
        label: '党员管理',
        link: '/hbclient/peopleView?peopleType=partyMembers',
        key: 'partyMembers',
    },
    {
        label: '预备党员管理',
        link: '/hbclient/peopleView?peopleType=prePartyMembers',
        key: 'notPartyMembers',
    },
    {
        label: '入党积极分子',
        link: '/hbclient/peopleView?peopleType=activistOfParty',
        key: 'activistOfParty',
    },
    {
        label: '党组织活动',
        link: '/hbclient/partyActives',
        key: 'partyActives',
    },
];

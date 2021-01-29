import CO from '../../constants';

export default [
    {
        label: '组织机构',
        link: '/hbclient/organizations',
        key: 'organizations',
        auth: [CO.AH_CREATE_ORGANIZATION, CO.AH_MODIFY_ORGANIZATION, CO.AH_REMOVE_ORGANIZATION, CO.AH_LOOK_ORGANIZATION],
    }, {
        label: '角色管理',
        link: '/hbclient/roles',
        key: 'roles',
        auth: [CO.AH_CREATE_ROLE, CO.AH_MODIFY_ROLE, CO.AH_REMOVE_ROLE, CO.AH_LOOK_ROLE],
    }, {
        label: '职员管理',
        link: '/hbclient/members?memberType=systemMember',
        key: 'systemMember',
        auth: [CO.AH_CREATE_MEMBER, CO.AH_MODIFY_MEMBER, CO.AH_REMOVE_MEMBER, CO.AH_LOOK_MEMBER],
    }, {
        label: '楼栋管理',
        link: '/hbclient/buildingTrees',
        key: 'buildingTrees',
        auth: [CO.AH_CREATE_MEMBER, CO.AH_MODIFY_MEMBER, CO.AH_REMOVE_MEMBER, CO.AH_LOOK_MEMBER],
    }, {
        label: '楼栋列表',
        link: '/hbclient/buildings',
        key: 'buildings',
    }, {
        label: '房屋列表',
        link: '/hbclient/houses',
        key: 'houses',
    }, {
        label: '人员列表',
        link: '/hbclient/peopleLists',
        key: 'peopleLists',
    }, {
        label: '系统设置',
        link: '/hbclient/setting',
        key: 'setting',
        auth: [CO.AH_MANAGE_SETTING],
    },
];

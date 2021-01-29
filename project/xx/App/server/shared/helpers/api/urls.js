const config = require('../../../../../config');
const apiServer = config.apiServer + '/hb/api/';
const server = apiServer + 'member/';

module.exports = {
    uploadFile: apiServer + 'uploadFile', // 上传文件
    // region
    address: apiServer + 'getRegionAddress', // 获取地址列表
    addressFromLastCode: apiServer + 'getRegionAddressFromLastCode', // 通过最后一个code地址列表
    searchAddress: apiServer + 'searchAddressCodeList', // 通过关键字搜索地址列表

    // 个人中心
    getVerifyCode: apiServer + 'requestSendVerifyCode', // 请求发送验证码
    login: server + 'login', // 登录
    register: server + 'register', // 注册
    forgotPwd: server + 'findPassword', // 忘记密码
    modifyPassword: server + 'modifyPassword', // 修改密码
    personal: server + 'getPersonalInfo', // 获取物流公司信息
    modifyPersonalInfo: server + 'modifyPersonalInfo', // 修改个人信息
    feedback: server + 'submitFeedback', // 意见反馈
    notifyCount: apiServer + 'getNotifyCount', // 获取通知数量
    notifies: apiServer + 'getNotifyList', // 获取通知列表
    readNotify: apiServer + 'readNotify', // 读取通知
    removeNotify: apiServer + 'removeNotify', // 删除通知
    setting: server + 'getSettingInfo', // 获取设置
    modifySettingInfo: server + 'modifySettingInfo', // 修正设置信息

    // 人员
    members: server + 'getMemberList', // 获取人员列表
    member: server + 'getMemberDetail', // 获取人员详情
    createMember: server + 'createMember', // 创建人员
    modifyMember: server + 'modifyMember', // 修改人员信息
    removeMember: server + 'removeMember', // 删除人员
    modifyMemberPassword: server + 'modifyMemberPassword', // 修改人员密码
    membersByRole: server + 'getMemberListByRole', // 通过角色获取人员列表
    getFamilyPeoples: server + 'getFamilyPeopleList', // 获取家庭成员
    getMemberByName: server + 'getMemberByName', // 通过姓名获取人员详情
    getMemberByPhone: server + 'getMemberByPhone', // 通过电话获取人员详情

    // 组织机构
    organizations: server + 'getOrganizationList', // 获取组织机构列表
    childOrganizations: server + 'getChildOrganizationList', // 获取组织子集机构列表
    organizationTree: server + 'getOrganizationTree', // 获取组织机构列表树形结构
    searchOrganizationTree: server + 'searchOrganizationTree', // 搜索组织机构列表树形结构
    organization: server + 'getOrganizationDetail', // 获取组织机构详情
    createOrganization: server + 'createOrganization', // 创建组织机构
    modifyOrganization: server + 'modifyOrganization', // 修改组织机构信息
    removeOrganization: server + 'removeOrganization', // 删除组织机构

    // 角色管理
    roles: server + 'getRoleList', // 获取角色列表
    role: server + 'getRoleDetail', // 获取角色详情
    removeRole: server + 'removeRole', // 删除角色
    modifyRole: server + 'modifyRole', // 修改角色
    createRole: server + 'createRole', // 创建角色

    // 获取excel数据
    excelDatas: apiServer + 'getExcelData', // 拉取excel的数据
};

/*
*
* 规则，只能添加，不能修改
*
*/

// 基础权限
export const AH_CREATE_ORGANIZATION = 1; // 创建组织
export const AH_MODIFY_ORGANIZATION = 2; // 修改组织
export const AH_REMOVE_ORGANIZATION = 3; // 删除组织
export const AH_LOOK_ORGANIZATION = 4; // 查看组织
export const AH_CHECK_ORGANIZATION = 5; // 审核组织
export const AH_CREATE_ROLE = 6; // 创建角色
export const AH_MODIFY_ROLE = 7; // 修改角色
export const AH_REMOVE_ROLE = 8; // 删除角色
export const AH_LOOK_ROLE = 9; // 查看角色
export const AH_CREATE_MEMBER = 10; // 创建成员
export const AH_MODIFY_MEMBER = 11; // 修改成员
export const AH_REMOVE_MEMBER = 12; // 删除成员
export const AH_LOOK_MEMBER = 13; // 查看成员
export const AH_MANAGE_SETTING = 14; // 管理设置
// 居住人员
export const AH_CREATE_PEOPLE = 15; // 创建居住人员
export const AH_MODIFY_PEOPLE = 16; // 修改居住人员
export const AH_REMOVE_PEOPLE = 17; // 删除居住人员
export const AH_LOOK_PEOPLE = 18; // 查看居住人员
// 楼栋信息
export const AH_CREATE_BUILDING = 19; // 创建楼栋信息
export const AH_MODIFY_BUILDING = 20; // 修改楼栋信息
export const AH_REMOVE_BUILDING = 21; // 删除楼栋信息
export const AH_LOOK_BUILDING = 22; // 查看楼栋信息
// 养老保险
export const AH_CREATE_ALLOWANCE = 23; // 创建养老保险
export const AH_MODIFY_ALLOWANCE = 24; // 修改养老保险
export const AH_REMOVE_ALLOWANCE = 25; // 删除养老保险
export const AH_LOOK_ALLOWANCE = 26; // 查看养老保险
// 医保
export const AH_CREATE_MEDICAL = 27; // 创建医保
export const AH_MODIFY_MEDICAL = 28; // 修改医保
export const AH_REMOVE_MEDICAL = 29; // 删除医保
export const AH_LOOK_MEDICAL = 30; // 查看医保
// 低保
export const AH_CREATE_PENSION = 31; // 创建低保
export const AH_MODIFY_PENSION = 32; // 修改低保
export const AH_REMOVE_PENSION = 33; // 删除低保
export const AH_LOOK_PENSION = 34; // 查看低保
// 走访记录
export const AH_CREATE_VISIT = 35; // 创建走访记录
export const AH_MODIFY_VISIT = 36; // 修改走访记录
export const AH_REMOVE_VISIT = 37; // 删除走访记录
export const AH_LOOK_VISIT = 38; // 查看走访记录
// 培训记录
export const AH_CREATE_TRAINING = 39; // 创建培训记录
export const AH_MODIFY_TRAINING = 40; // 修改培训记录
export const AH_REMOVE_TRAINING = 41; // 删除培训记录
export const AH_LOOK_TRAINING = 42; // 查看培训记录
// 招工信息
export const AH_CREATE_RECRUIT = 43; // 创建招工信息
export const AH_MODIFY_RECRUIT = 44; // 修改招工信息
export const AH_REMOVE_RECRUIT = 45; // 删除招工信息
export const AH_LOOK_RECRUIT = 46; // 查看招工信息
// 车辆信息
export const AH_CREATE_CAR = 47; // 创建车辆信息
export const AH_MODIFY_CAR = 48; // 修改车辆信息
export const AH_REMOVE_CAR = 49; // 删除车辆信息
export const AH_LOOK_CAR = 50; // 查看车辆信息
//  任务
export const AH_PUBLISH_TASK = 100; // 发布任务的权限
export const AH_DISTRIBUTE_TASK = 101; // 分派任务的权限
export const AH_LOOK_TASK = 102; // 查看任务的权限
export const AH_VISIT_TASK = 103; // 回访任务的权限
export const AH_CREATE_VIDEO_MEET = 104; // 预约信访视频会议权限
export const AH_MODIFY_VIDEO_MEET = 105; // 修改信访视频会议权限
export const AH_REMOVE_VIDEO_MEET = 106; // 删除信访视频会议权限
// 活动
export const AH_CREATE_CULTURAL_ACTIVITY = 107; // 创建文化活动
export const AH_MODIFY_CULTURAL_ACTIVITY = 108; // 修改文化活动
// 党组织
export const AH_CREATE_PARTY_ORGANIZATION = 109; // 创建党组织
export const AH_MODIFY_PARTY_ORGANIZATION = 110; // 修改党组织
// 党组织活动
export const AH_CREATE_PARTY_ACTIVITY = 111; // 创建党组织活动
export const AH_MODIFY_PARTY_ACTIVITY = 112; // 修改党组织活动
// 残疾人管理
export const AH_CREATE_DISABILITY = 113; // 创建残疾人
export const AH_MODIFY_DISABILITY = 114; // 修改残疾人
export const AH_REMOVE_DISABILITY = 115; // 删除残疾人
export const AH_LOOK_DISABILITY = 116; // 查看残疾人

export const AH_CHECK_REPORT = 117; // 审核举报
export const AH_SEND_REWARD = 118; // 举报奖励

// 预警
export const AH_SET_WARING_PEOPLE = 119; // 设置预警人员

// 法院
export const AH_CREATE_LAW = 120; // 创建法院案件
export const AH_REMOVE_LAW = 121; // 删除法院案件
export const AH_LOOK_LAW = 122; // 查看法院案件

// 司法调解
export const AH_CREATE_JUDICAL_CONCILIATION = 123; // 创建司法调解
export const AH_REMOVE_JUDICAL_CONCILIATION = 124; // 删除司法调解
export const AH_LOOK_JUDICAL_CONCILIATION = 125; // 查看司法调解
export const AH_MODIFY_JUDICAL_CONCILIATION = 126; // 修改司法调解

// 司法救助
export const AH_ADD_PROCURATORATE = 127; // 添加司法救助
export const AH_LOOK_PROCURATORATE = 128; // 查看司法救助
export const AH_CHECK_PROCURATORATE = 129; // 审核司法救助

// 定期吸毒人员检测
export const AH_ADD_DRUG_RECORD = 130; // 添加定期吸毒人员检测记录

export const AH_REMOVE_CULTURAL_ACTIVITY = 131; // 删除文化活动
export const AH_MODIFY_TASK = 132; // 修改任务的权限
export const AH_REMOVE_PARTY_ACTIVITY = 133; // 删除党组织活动

export const AH_MAP = {
    // 基础权限
    [AH_CREATE_ORGANIZATION]: '创建组织',
    [AH_MODIFY_ORGANIZATION]: '修改组织',
    [AH_REMOVE_ORGANIZATION]: '删除组织',
    [AH_LOOK_ORGANIZATION]: '查看组织',
    [AH_CHECK_ORGANIZATION]: '审核组织',
    [AH_CREATE_ROLE]: '创建角色',
    [AH_MODIFY_ROLE]: '修改角色',
    [AH_REMOVE_ROLE]: '删除角色',
    [AH_LOOK_ROLE]: '查看角色',
    [AH_CREATE_MEMBER]: '创建成员',
    [AH_MODIFY_MEMBER]: '修改成员',
    [AH_REMOVE_MEMBER]: '删除成员',
    [AH_LOOK_MEMBER]: '查看成员',
    [AH_MANAGE_SETTING]: '管理设置',
    // 居住人员
    [AH_CREATE_PEOPLE]: '创建居住人员',
    [AH_MODIFY_PEOPLE]: '修改居住人员',
    [AH_REMOVE_PEOPLE]: '删除居住人员',
    [AH_LOOK_PEOPLE]: '查看居住人员',
    // 楼栋信息
    [AH_CREATE_BUILDING]: '创建楼栋信息',
    [AH_MODIFY_BUILDING]: '修改楼栋信息',
    [AH_REMOVE_BUILDING]: '删除楼栋信息',
    [AH_LOOK_BUILDING]: '查看楼栋信息',
    // 养老保险
    [AH_CREATE_ALLOWANCE]: '创建养老保险',
    [AH_MODIFY_ALLOWANCE]: '修改养老保险',
    [AH_REMOVE_ALLOWANCE]: '删除养老保险',
    [AH_LOOK_ALLOWANCE]: '查看养老保险',
    // 医保
    [AH_CREATE_MEDICAL]: '创建医保',
    [AH_MODIFY_MEDICAL]: '修改医保',
    [AH_REMOVE_MEDICAL]: '删除医保',
    [AH_LOOK_MEDICAL]: '查看医保',
    // 低保
    [AH_CREATE_PENSION]: '创建低保',
    [AH_MODIFY_PENSION]: '修改低保',
    [AH_REMOVE_PENSION]: '删除低保',
    [AH_LOOK_PENSION]: '查看低保',
    // 走访记录
    [AH_CREATE_VISIT]: '创建走访记录',
    [AH_MODIFY_VISIT]: '修改走访记录',
    [AH_REMOVE_VISIT]: '删除走访记录',
    [AH_LOOK_VISIT]: '查看走访记录',
    // 培训记录
    [AH_CREATE_TRAINING]: '创建培训记录',
    [AH_MODIFY_TRAINING]: '修改培训记录',
    [AH_REMOVE_TRAINING]: '删除培训记录',
    [AH_LOOK_TRAINING]: '查看培训记录',
    // 招工信息
    [AH_CREATE_RECRUIT]: '创建招工信息',
    [AH_MODIFY_RECRUIT]: '修改招工信息',
    [AH_REMOVE_RECRUIT]: '删除招工信息',
    [AH_LOOK_RECRUIT]: '查看招工信息',
    // 车辆信息
    [AH_CREATE_CAR]: '创建车辆信息',
    [AH_MODIFY_CAR]: '修改车辆信息',
    [AH_REMOVE_CAR]: '删除车辆信息',
    [AH_LOOK_CAR]: '查看车辆信息',
    // 任务
    [AH_PUBLISH_TASK]: '发布任务',
    [AH_DISTRIBUTE_TASK]: '分派任务',
    [AH_LOOK_TASK]: '查看任务',
    [AH_VISIT_TASK]: '回访任务',
    [AH_CREATE_VIDEO_MEET]: '创建信访视频会议',
    [AH_MODIFY_VIDEO_MEET]: '修改信访视频会议',
    [AH_REMOVE_VIDEO_MEET]: '删除信访视频会议',
    // 活动
    [AH_CREATE_CULTURAL_ACTIVITY]: '创建文化活动',
    [AH_CREATE_PARTY_ACTIVITY]: '创建党组织活动',
    [AH_MODIFY_CULTURAL_ACTIVITY]: '修改文化活动',
    [AH_MODIFY_PARTY_ACTIVITY]: '修改党组织活动',
    [AH_REMOVE_PARTY_ACTIVITY]: '删除党组织活动',
    // 党组织
    [AH_CREATE_PARTY_ORGANIZATION]: '创建党组织',
    [AH_MODIFY_PARTY_ORGANIZATION]: '修改党组织',
    // 残疾人管理
    [AH_CREATE_DISABILITY]: '创建残疾人',
    [AH_MODIFY_DISABILITY]: '修改残疾人',
    [AH_REMOVE_DISABILITY]: '删除残疾人',
    [AH_LOOK_DISABILITY]: '查看残疾人',
    // 举报
    [AH_CHECK_REPORT]: '审核举报',
    [AH_SEND_REWARD]: '举报奖励',
    // 预警
    [AH_SET_WARING_PEOPLE]: '设置预警人员',

    // 法院
    [AH_CREATE_LAW]: '创建法院案件',
    [AH_REMOVE_LAW]: '删除法院案件',
    [AH_LOOK_LAW]: '查看法院案件',

    // 司法调解
    [AH_CREATE_JUDICAL_CONCILIATION]: '创建司法调解',
    [AH_REMOVE_JUDICAL_CONCILIATION]: '删除司法调解',
    [AH_LOOK_JUDICAL_CONCILIATION]: '查看司法调解',
    [AH_MODIFY_JUDICAL_CONCILIATION]: '修改司法调解',

    // 司法救助
    [AH_ADD_PROCURATORATE]: '添加司法救助',
    [AH_LOOK_PROCURATORATE]: '查看司法救助',
    [AH_CHECK_PROCURATORATE]: '审核司法救助',

    // 定期吸毒人员检测
    [AH_ADD_DRUG_RECORD]: '添加定期吸毒人员检测记录',

    [AH_REMOVE_CULTURAL_ACTIVITY]: '删除文化活动',
    [AH_MODIFY_TASK]: '修改任务',
};

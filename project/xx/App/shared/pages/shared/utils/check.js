import _ from 'lodash';

export function testTelePhone (phone) {
    return !phone || /^1\d{10}$/.test(phone);
}
export function testPhone (phone) {
    return /^0\d{2,3}-\d{7,8}$/.test(phone);
}
export function checkTelePhone (rule, value, callback) {
    if (!testTelePhone(value)) {
        callback('请输入正确的电话号码');
    } else {
        callback();
    }
}
export function checkSitePhone (rule, value, callback) {
    if (!testPhone(value)) {
        callback('请输入正确的座机号码');
    } else {
        callback();
    }
}
export function checkPhone (rule, value, callback) {
    if (!testPhone(value) && !testTelePhone(value)) {
        callback('请输入正确的电话号码');
    } else {
        callback();
    }
}
export function checkPostNumber (rule, value, callback) {
    if (value && !/^[1-9]\d{5}(?!\d)$/.test(value)) {
        callback('请输入正确的邮政编码');
    } else {
        callback();
    }
}
export function checkPhoneList (rule, value = '', callback) {
    const phoneList = _.reject(_.map(value.split(/;|；/), m => m.trim()), o => !o.length);
    if (phoneList.length && !_.every(phoneList, o => testPhone(o) || testTelePhone(o))) {
        callback('请输入正确的电话号码');
    } else {
        callback();
    }
}
export function checkEmail (rule, value, callback) {
    if (value && !/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(value)) {
        callback('请输入正确的邮箱地址');
    } else {
        callback();
    }
}
export function checkBankCard (rule, value, callback) {
    if (value && !/^(\d{16}|\d{19})$/.test(value)) {
        callback('请输入正确的银行卡卡号');
    } else {
        callback();
    }
}
export function checkQQ (rule, value, callback) {
    if (value && !/^[1-9][0-9]{4,10}$/.test(value)) {
        callback('请输入正确的QQ号码');
    } else {
        callback();
    }
}
export function testPayPassword (value) {
    return /^\d{6}$/.test(value);
}
export function testPassword (value) {
    return /^[\x21-\x7e]{1,20}$/.test(value);
}
export function checkPassword (rule, value, callback) {
    if (!value) {
        callback();
    } else if (!testPassword(value)) {
        callback('密码只能由1-20位数字，大小写字母和英文符号组成');
    } else {
        callback();
    }
}
export function checkVerifyCode (rule, value, callback) {
    if (value && !/^\d{4}$/.test(value)) {
        callback('请输入正确的验证码');
    } else {
        callback();
    }
}
export function checkRecuitNumber (rule, value, callback) {
    if (value && !/^[1-9]\d*$/.test(value)) {
        callback('人数必须是整数');
    } else if (value < 1) {
        callback('人数不能少于1');
    } else {
        callback();
    }
}
export function checkAgeNumber (rule, value, callback) {
    if (value && !/^[1-9]\d*$/.test(value)) {
        callback('年龄必须是整数');
    } else if (value < 18) {
        callback('年龄不能少于18');
    } else if (value > 70) {
        callback('年龄不能大于70');
    } else {
        callback();
    }
}
export function checkRecuitMoney (rule, value, callback) {
    if (value && !/^[1-9]\d*$/.test(value)) {
        callback('资薪必须是整数');
    } else if (value < 1) {
        callback('资薪不能少于1');
    } else {
        callback();
    }
}
export function testPlateNo (plateNo) {
    return /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/.test(plateNo);
}
export function checkPlateNo (rule, value, callback) {
    if (!testPlateNo(value)) {
        callback('请输入正确的车牌');
    } else {
        callback();
    }
}
export function checkAge (rule, str, callback) {
    let re = /^[0-9]*[1-9][0-9]*$/;
    if (!re.test(str)) {
        callback('请输入正确的年龄');
    } else {
        callback();
    }
}
export function checkTax (rule, str, callback) {
    let re = /^[A-Z0-9]{18}$/;
    if (!re.test(str)) {
        callback('请输入正确的税号');
    } else {
        callback();
    }
}
export function checkIdNo (rule, idNo = '', callback) {
    const number = idNo.split('');
    const W = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];// 加权因子
    const ValideCode = [ 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ];// 身份证验证位值.10代表X
    if (!number || number.length !== 18) {
        return callback('请输入正确身份证号');
    }
    if (number[17] === 'x' || number[17] === 'X') {
        number[17] = 10;
    }
    let sum = 0;
    for (let i = 0; i < 17; i++) {
        sum += W[i] * number[i];
    }
    if (number[17] != ValideCode[sum % 11]) {
        console.log(`[checkIdNo]: ${idNo} last number should be ${ValideCode[sum % 11]}`);
        callback('请输入正确身份证号');
    }
    callback();
}
export function checkInt2PointNum (rule, str, callback) {
    let re = /^[0-9]+(.[0-9]{1,2})?$/;
    if (!re.test(str)) {
        callback('请输入正数且最多保留2位小数');
    } else {
        callback();
    }
}
export function checkIntNum (rule, str, callback) {
    var re = /^[0-9]*[1-9][0-9]*$/;
    if (!re.test(str)) {
        callback('请输入正整数');
    } else {
        callback();
    }
}
// 验证货单号
export function checkOrderId (str) {
    let re = /[a-z0-9]{24}/;
    if (re.test(str)) {
        return false;
    } else {
        return true;
    }
}

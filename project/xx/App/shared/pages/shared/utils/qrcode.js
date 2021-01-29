// type的定义：1: 货单， 2：司机， 3：回单, 4:打卡
const WEIXIN_URL = 'http://weixin.qq.com/r/typ9Za3EJPBbrekG93_l';
export function genQRString (id, type) {
    return `${WEIXIN_URL}?${type}${id}`;
}
export function getQRResult (str = '') {
    const reg = new RegExp(`^${WEIXIN_URL}\\?(\\d)([0-9a-z]{24})$`);
    const match = str.match(reg);
    if (!match) {
        return undefined;
    }
    return { type: match[1], id: match[2] };
}

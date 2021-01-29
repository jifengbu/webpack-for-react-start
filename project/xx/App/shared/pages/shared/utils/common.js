import _ from 'lodash';
import Nzh from 'nzh';

export config from '../../../../../config';
export function _N (num, rank = 2) {
    typeof num !== 'number' && (num = 0);
    return parseFloat(num.toFixed(rank));
}
export function omitNil (obj) {
    return _.omitBy(obj, _.isNil);
}
export function _H (head) {
    return head || '/hbclient/img/common/default_head.png';
}
export function needLoadPage (data, property, pageNo, pageSize) {
    const count = _.get(data, 'count');
    const list = _.get(data, property);
    const maxFullPage = Math.floor((count - 1) / pageSize);
    const maxDetectListSize = pageNo < maxFullPage ? pageSize : count - maxFullPage * pageSize;
    const detectList = _.slice(list, pageNo * pageSize, (pageNo + 1) * pageSize);
    let needLoad = true;
    if (detectList.length === maxDetectListSize) {
        needLoad = !_.every(detectList);
    }
    return needLoad;
}
export function until (test, iterator, callback) {
    if (!test()) {
        iterator((err) => {
            if (err) {
                return callback(err);
            }
            until(test, iterator, callback);
        });
    } else {
        callback();
    }
}
export function limitStr (str = '', len) {
    if (str.length <= len) {
        return str;
    }
    return str.substr(0, len - 3) + '...';
}
export function toThousands (num) {
    return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
}

export function getPercentages (list) {
    const sum = _.sum(list);
    return list.map((v) => Math.round(v * 100 / sum) + '%');
}
export function numberParser (precision) {
    return (v) => {
        v = v.replace(/[^\d-.]+/g, '');
        const reg = /([^.]*)\.(.*)/;
        const m = v.match(reg);
        if (!m) {
            return v;
        }
        return m[1] + '.' + (m[2].replace(/\./g, '').slice(0, precision));
    };
}
export function formatPhoneList (phoneList = '', phone = '') {
    phoneList = phone + ';' + phoneList.replace('；', ';');
    phoneList = _.uniq(_.filter(_.map(phoneList.split(';'), m => m.trim()), o => !!o));
    return phoneList.join(';');
}
export function getAddressOptions (list = [], lastCode) {
    let options;
    let value = [];
    for (const item of list) {
        const parent = _.find(item, o => o.code == lastCode) || {};
        parent.children = options;
        lastCode = parent.parentCode;
        parent.name && (value.unshift(parent.name));
        options = item.map(o => ({
            value: o.name,
            label: o.name,
            code: o.code,
            level: o.level,
            isLeaf: false,
            children: o.children,
        }));
    }
    return {
        value,
        options: options || [],
    };
}
export function amountSmalltoBIG (n = 0) {
    var nzh = new Nzh({
        ch: '零壹贰叁肆伍陆柒捌玖',      // 数字字符
        ch_u: '个拾佰仟万亿兆京',       // 数位单位字符，万以下十进制，万以上万进制，个位不能省略
        ch_f: '负',                   // 负字符
        ch_d: '点',                   // 小数点字符
        m_u: '元角分厘',              // 金额单位
        m_t: '人民币',                // 金额前缀
        m_z: '',                    // 金额无小数后缀
    });
    return nzh.toMoney(n, { outSymbol: false });
}
export function urlParam (obj, key) {
    if (typeof obj !== 'object') {
        return encodeURI(`${key}=${obj}`);
    } else {
        obj = _.omitBy(obj, o => _.isNil(o));
    }
    const list = [];
    for (let i in obj) {
        const v = obj[i];
        const j = key ? `${key}[${i}]` : i;
        if (v instanceof Array) {
            for (let k in v) {
                list.push(urlParam(v[k], `${j}[${k}]`));
            }
        } else {
            list.push(urlParam(v, j));
        }
    }
    return list.join('&');
}

export function getSize (number) {
    if (number < 1024) {
        return _N(number) + 'B';
    } else if (number < 1024 * 1024) {
        return _N(number / 1024) + 'KB';
    } else {
        return _N(number / (1024 * 1024)) + 'MB';
    }
}

export function download (url, name) {
    const a = document.createElement('a');
    a.download = name;
    a.href = url;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

export function fileTypeImage (file) {
    if (file.file) {
        const obj = file.file;
        const fileName = obj.split('/')[obj.split('/').length - 1];
        const suffix = fileName.split('.')[1];
        const word = ['doc', 'docx'];
        const excel = ['xls', 'xlsx'];
        const image = ['png', 'jpg', 'jpeg'];
        const mp3 = ['mp3', 'wma', 'wav', 'midi', 'ape', 'flac'];
        const ppt = ['ppt', 'pptx'];
        const video = ['avi', 'AVI', 'mov', 'rmvb', 'rm', 'FLV', 'mp4', '3GP'];
        const _package = ['rar', 'zip'];
        if (_.includes(word, suffix)) {
            return '/hbclient/img/skydrive/word.png';
        } else if (_.includes(excel, suffix)) {
            return '/hbclient/img/skydrive/excel.png';
        } else if (_.includes(image, suffix)) {
            return file.file;
        } else if (_.includes(ppt, suffix)) {
            return '/hbclient/img/skydrive/ppt.png';
        } else if (_.includes(mp3, suffix)) {
            return '/hbclient/img/skydrive/mp3.png';
        } else if (_.includes(video, suffix)) {
            return '/hbclient/img/skydrive/video.png';
        } else if (_.includes(_package, suffix)) {
            return '/hbclient/img/skydrive/package.png';
        } else {
            return '/hbclient/img/skydrive/txt.png';
        }
    } else {
        return '/hbclient/img/skydrive/folder.png';
    }
}

export function getWindowLocationSearch () {
    const params = {};
    if (typeof window === 'undefined') {
        return params;
    }
    const { search } = window.location;
    if (search) {
        search.slice(1).split('&').forEach(o => {
            const split = o.indexOf('=');
            let val, key;
            if (split === -1) {
                key = o;
            } else {
                key = o.substr(0, split);
                val = o.substr(split + 1);
            }
            if (val === undefined) {
                if (key[0] === '!') {
                    key = key.slice(1);
                    val = false;
                } else {
                    val = true;
                }
            } else if (val === 'true') {
                val = true;
            } else if (val === 'false') {
                val = false;
            } else if (/^-?\d+(\.\d+)?$/.test(val)) { // 数字
                val = val * 1;
            } else if (/^'(-?\d+(\.\d+)?)|true|false'$/.test(val)) {
                val = val.replace(/^'|'$/g, '');
            }
            Object.assign(params, { [key]: val });
        });
    }
    return params;
}

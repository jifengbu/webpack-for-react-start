import _ from 'lodash';

const localStorage = typeof window === 'undefined' ? {
    getItem: () => null,
    setItem: () => null,
} : window.localStorage;

module.exports = {
    getNumber (key, defaultValue) {
        if (defaultValue === undefined) {
            defaultValue = 0;
        }
        let ret = localStorage.getItem(key);
        if (ret == null) {
            return defaultValue;
        }
        ret = +ret;
        if (_.isNaN(ret)) {
            return defaultValue;
        }
        return ret;
    },
    setNumber (key, val) {
        if (val === undefined) {
            val = 0;
        }
        localStorage.setItem(key, '' + val);
    },
    getString (key, defaultValue) {
        if (defaultValue === undefined) {
            defaultValue = '';
        }
        const ret = localStorage.getItem(key);
        if (ret == null) {
            return defaultValue;
        }
        return ret;
    },
    setString (key, val) {
        if (val === undefined) {
            val = '';
        }
        localStorage.setItem(key, '' + val);
    },
    getBool (key, defaultValue) {
        if (defaultValue === undefined) {
            defaultValue = false;
        }
        const ret = localStorage.getItem(key);
        if (ret == null) {
            return defaultValue;
        }
        return ret === '1';
    },
    setBool (key, val) {
        if (val === undefined) {
            val = false;
        }
        localStorage.setItem(key, val ? '1' : '0');
    },
    getObject (key, defaultValue) {
        if (defaultValue === undefined) {
            defaultValue = {};
        }
        let ret = localStorage.getItem(key);
        if (ret == null) {
            return defaultValue;
        }
        try {
            ret = JSON.parse(ret);
        } catch (e) {
            ret = defaultValue;
        }
        return ret;
    },
    setObject (key, val) {
        if (val === undefined) {
            val = {};
        }
        localStorage.setItem(key, JSON.stringify(val));
    },
    remove (key) {
        localStorage.removeItem(key);
    },
    clear () {
        localStorage.clear();
    },
};

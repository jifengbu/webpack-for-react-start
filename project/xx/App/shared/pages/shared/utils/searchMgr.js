import lc from './lc';

class Manager {
    constructor () {
        this.value = lc.getObject('searchData');
    }
    get (path, defaultValue) {
        if (defaultValue) {
            this.value[path] = { ...defaultValue, ...(this.value[path] || {}) };
        } else if (!this.value[path]) {
            this.value[path] = {};
        }
        return this.value[path];
    }
    set (path, data) {
        this.value[path] = { ...(this.value[path] || {}), ...data };
        lc.setObject('searchData', this.value);
    }
    clear () {
        this.value = {};
        lc.remove('searchData');
    }
}

module.exports = new Manager();

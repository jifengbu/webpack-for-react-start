import React from 'react';
import _ from 'lodash';
import { Form, Cascader } from 'antd';
import styles from './index.less';
import { getFormItemLayout, getDefaultRules } from './config';
import DATAS from '../../../../data';

const FormItem = Form.Item;

function getCheckValidator (label, options, needWhole) {
    return (rule, value, callback) => {
        if (!value || !value.length) {
            callback();
        } else {
            let item;
            for (const v of value) {
                item = _.find(options, m => m.value === v);
                if (!item) {
                    break;
                }
                options = item.children;
            }
            if (needWhole && !item) {
                callback(`请选择完整${label}`);
            } else {
                callback();
            }
        }
    };
}

function getValues (data, range, parents, list) {
    for (const item of parents) {
        if (range === item.name) {
            list.unshift(item.code);
            return true;
        }
        if (_.startsWith(range, item.name)) {
            if (getValues(data, range.substr(item.name.length), _.filter(data, o => o.parentCode === item.code), list)) {
                list.unshift(item.code);
                return true;
            }
        }
    }
}

export default class LocalAddressFormItem extends React.Component {
    componentDidMount () {
        const { featureCode } = this.props;
        this.data = _.map(DATAS[featureCode], o => ({ ...o, label: o.name, value: o.code }));
        const parentList = _.filter(this.data, o => o.level === 10);
        for (const item of parentList) {
            item.children = _.filter(this.data, o => o.parentCode === item.code);
        }
        this.submitValue = this.props.value[_.keys(this.props.value)[0]];
        this.options = parentList;
    }
    onChange (value, selectedOptions) {
        const { onChange } = this.props;
        this.submitValue = _.map(selectedOptions, o => o.name).join('');
        onChange && onChange(_.map(selectedOptions, o => o.name).join(''), this.options);
    }
    getSubmitValue () {
        return this.submitValue;
    }
    getAddressLastCode () {
        return (this.getAddressLastItem() || {}).code;
    }
    getAddressLastItem () {
        let lastItem;
        const { form, value } = this.props;
        const key = _.keys(value)[0];
        const values = form.getFieldValue(key);
        if (values) {
            for (const v of values) {
                const item = _.find(this.options, o => o.value === v);
                if (item) {
                    lastItem = item;
                }
            }
        }
        return lastItem;
    }
    getAddressOptions () {
        return this.options;
    }
    initValue (value) {
        if (value) {
            const { featureCode } = this.props;
            const data = DATAS[featureCode];
            const parents = _.filter(data, o => o.level === 10);
            const list = [];
            getValues(data, value, parents, list);
            return list;
        } else {
            return [];
        }
    }
    render () {
        const { form, label, value, editing, layout, placeholder, rules, required = true, needWhole = true, hasFeedback = true, disabled, formGroup, addonAfter, style } = this.props;
        const key = _.keys(value)[0];
        const defaultValue = this.initValue(value[key]);
        return (
            !!form &&
            <FormItem
                {...getFormItemLayout(layout, formGroup)}
                label={label}
                hasFeedback={hasFeedback}
                >
                {
                    editing && form.getFieldDecorator(key, {
                        initialValue: defaultValue,
                        rules: getDefaultRules(label, required, rules || [ { validator: getCheckValidator(label, this.options, needWhole) } ], '选择'),
                    })(
                        <Cascader
                            placeholder={placeholder || `请选择${label}`}
                            options={this.options}
                            onChange={::this.onChange}
                            changeOnSelect
                            disabled={disabled}
                            />
                    ) || (
                        <span className={styles.value}>{value[key]}</span>
                    )
                }
                {editing && addonAfter}
            </FormItem>
            ||
            <Cascader
                placeholder={placeholder || `请选择${label}`}
                defaultValue={defaultValue}
                options={this.options}
                onChange={::this.onChange}
                changeOnSelect
                disabled={disabled}
                style={style}
                />
        );
    }
}

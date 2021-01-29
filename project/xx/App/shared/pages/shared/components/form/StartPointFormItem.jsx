import React from 'react';
import _ from 'lodash';
import { apiQuery } from 'relatejs';
import { Form, Cascader } from 'antd';
import styles from './index.less';
import { getFormItemLayout, getDefaultRules } from './config';
const FormItem = Form.Item;

function getCheckValidator (label, options, needWhole) {
    return (rule, value, callback) => {
        if (!value || !value.length) {
            callback();
        } else {
            let item = {};
            for (const v of value) {
                item = _.find(options, m => m.value === v);
                options = item.children;
            }
            if (needWhole && !(item.isLeaf || _.includes([ 0, 4, 5, 6, 7 ], item.level))) {
                callback(`请选择完整${label}`);
            } else {
                callback();
            }
        }
    };
}

export default class StartPointFormItem extends React.Component {
    static getStartPointAddress (parentCode, callback) {
        return apiQuery({
            fragments: {
                startPointAddress: {
                    parentCode: 1,
                    code: 1,
                    level: 1,
                    name: 1,
                    id: 1,
                    isShop: 1,
                    isAgent: 1,
                    addressRegionLastCode: 1,
                    isLeaf: 1,
                },
            },
            variables: {
                startPointAddress: {
                    parentCode: {
                        value: parentCode,
                        type: 'Int!',
                    },
                },
            },
        }, (result) => {
            callback(result.startPointAddress);
        })();
    }
    static getStartPointAddressFromLastCode (addressLastCode, isLeaf, callback) {
        return apiQuery({
            fragments: {
                startPointAddressFromLastCode: {
                    parentCode: 1,
                    code: 1,
                    level: 1,
                    name: 1,
                    id: 1,
                    isShop: 1,
                    isAgent: 1,
                    addressRegionLastCode: 1,
                    isLeaf: 1,
                },
            },
            variables: {
                startPointAddressFromLastCode: {
                    addressLastCode: {
                        value: addressLastCode,
                        type: 'Int',
                    },
                    isLeaf: {
                        value: isLeaf,
                        type: 'Boolean',
                    },
                },
            },
        }, (result) => {
            callback(result.startPointAddressFromLastCode);
        })();
    }
    static defaultProps = {
        type: 0, // 0: 显示分店和收货点，1：只显示分店，2：只显示收货点
    };
    constructor (props) {
        super(props);
        this.state = {
            options: props.options,
        };
    }
    loadData (selectedOptions) {
        const { type } = this.props;
        const item = selectedOptions[selectedOptions.length - 1];
        item.loading = true;
        StartPointFormItem.getStartPointAddress(item.code, (address) => {
            address = _.reject(address, o => type === 1 ? o.isAgent : type === 2 ? o.isShop : false);
            item.children = address.map(o => ({ value: o.id || o.name, label: o.name + (o.isShop ? '（分店）' : o.isAgent ? '（收货点）' : ''), code: o.code, level: o.level, isLeaf: o.isLeaf || false, isShop: o.isShop, isAgent: o.isAgent, children: o.children }));
            item.loading = false;
            this.setState({
                options: [...this.state.options],
            });
        });
    }
    onChange (value, selectedOptions) {
        const { onChange } = this.props;
        this.selectedOptions = selectedOptions;
        onChange && onChange(this.selectedOptions[this.selectedOptions.length - 1]);
    }
    getSelectedOptions () {
        if (this.selectedOptions) {
            return this.selectedOptions;
        }

        let selectedOptions = [];
        let { options } = this.state;
        const { form, value } = this.props;
        const key = _.keys(value)[0];
        const values = form.getFieldValue(key);
        if (values) {
            for (const v of values) {
                const item = _.find(options, o => o.value === v);
                if (item) {
                    selectedOptions.push(item);
                    options = item.children;
                }
            }
        }
        return selectedOptions;
    }
    render () {
        const { options } = this.state;
        const { form, label, value, editing, layout, placeholder, rules, required = true, displayValue, needWhole = true, hasFeedback = true, disabled, formGroup, addonAfter } = this.props;
        const key = _.keys(value)[0];
        return (
            <FormItem
                {...getFormItemLayout(layout, formGroup)}
                label={label}
                hasFeedback={hasFeedback}
                >
                {
                    editing && form.getFieldDecorator(key, {
                        initialValue: value[key],
                        rules: getDefaultRules(label, required, rules || [ { validator: getCheckValidator(label, options, needWhole) } ], '选择'),
                    })(
                        <Cascader
                            placeholder={placeholder || `请选择${label}`}
                            options={options}
                            loadData={::this.loadData}
                            onChange={::this.onChange}
                            changeOnSelect
                            disabled={disabled}
                            />
                    ) || (
                        <span className={styles.value}>{displayValue}</span>
                    )
                }
                {editing && addonAfter}
            </FormItem>
        );
    }
}

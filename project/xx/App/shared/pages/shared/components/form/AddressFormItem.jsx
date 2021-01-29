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
            let item;
            for (const v of value) {
                item = _.find(options, m => m.value === v);
                if (!item) {
                    break;
                }
                options = item.children;
            }
            if (needWhole && (!item || !item.isLeaf)) {
                callback(`请选择完整${label}`);
            } else {
                callback();
            }
        }
    };
}

function getRegion (parentCode, callback) {
    return apiQuery({
        fragments: {
            address: 1,
        },
        variables: {
            address: {
                data: {
                    value: {
                        parentCode,
                    },
                    type: 'JSON!',
                },
            },
        },
    }, (result) => {
        callback(result.address);
    })();
}

export default class AddressFormItem extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            options: props.options,
        };
    }
    componentDidMount () {
        const { editing, form, value } = this.props;
        editing && form && form.setFieldsValue(value);
    }
    componentWillReceiveProps (nextProps) {
        const { options, value, form } = nextProps;
        if (options && !_.isEqual(options, this.props.options)) {
            this.setState({ options });
        }
        if (value && !_.isEqual(value, this.props.value)) {
            form && form.setFieldsValue(value);
        }
    }
    loadData (selectedOptions) {
        let { leafList, rejectList, withoutProvincialCapital } = this.props;
        const item = selectedOptions[selectedOptions.length - 1];
        item.loading = true;
        getRegion(item.code, (list) => {
            item.children = list && list.map(o => ({
                value: o.name,
                label: o.name,
                code: o.code,
                level: o.level,
                isLeaf: _.isArray(leafList) ? leafList.indexOf(o.level) !== -1 : o.isLeaf || o.level === 11 || o.level === 100,
            }));
            if (rejectList) {
                item.children = _.reject(item.children, o => rejectList.indexOf(o.level) !== -1);
            }
            if (withoutProvincialCapital && item.level === 2) {
                item.children = _.drop(item.children);
            }
            item.loading = false;
            this.setState({
                options: [...this.state.options],
            });
        });
    }
    onChange (value, selectedOptions) {
        const { onChange } = this.props;
        const { options } = this.state;
        onChange && onChange(selectedOptions[selectedOptions.length - 1], value, options);
    }
    getAddressLastCode () {
        return (this.getAddressLastItem() || {}).code;
    }
    getAddressLastItem () {
        let lastItem;
        let { options } = this.state;
        const { form, value } = this.props;
        const key = _.keys(value)[0];
        const values = form.getFieldValue(key);
        if (values) {
            for (const v of values) {
                const item = _.find(options, o => o.value === v);
                if (item) {
                    lastItem = item;
                    options = item.children;
                }
            }
        }
        return lastItem;
    }
    getAddressOptions () {
        return this.state.options;
    }
    render () {
        const { options } = this.state;
        const { form, label, value, editing, layout, placeholder, rules, required = true, needWhole = false, hasFeedback = true, disabled, formGroup, addonAfter, style } = this.props;
        const key = _.keys(value)[0];
        return (
            !!form &&
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
                        <span className={styles.value}>{value[key]}</span>
                    )
                }
                {editing && addonAfter}
            </FormItem>
            ||
            <Cascader
                placeholder={placeholder || `请选择${label}`}
                defaultValue={value[key]}
                options={options}
                loadData={::this.loadData}
                onChange={::this.onChange}
                changeOnSelect
                disabled={disabled}
                style={style}
                />
        );
    }
}

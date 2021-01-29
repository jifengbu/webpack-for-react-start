import React from 'react';
import _ from 'lodash';
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

function formatOptions (options, fieldNames) {
    if (!fieldNames) {
        return options;
    }
    return _.map(options, o => {
        const item = {};
        item.label = o[fieldNames['label'] || 'label'];
        item.value = o[fieldNames['value'] || 'value'];
        const children = o[fieldNames['children'] || 'children'];
        if (children && children.length) {
            item.children = formatOptions(children, fieldNames);
        }
        return item;
    });
}

export default class CascaderFormItem extends React.Component {
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
    onChange (value, selectedOptions) {
        const { onChange } = this.props;
        const { options } = this.state;
        onChange && onChange(selectedOptions[selectedOptions.length - 1], value, options);
    }
    getLastCode () {
        return (this.getLastItem() || {}).code;
    }
    getLastItem () {
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
    getOptions () {
        return this.state.options;
    }
    render () {
        const { form, label, value, editing, layout, placeholder, rules, required = true, needWhole = false, fieldNames, hasFeedback = true, disabled, formGroup, addonAfter } = this.props;
        const key = _.keys(value)[0];
        const options = formatOptions(this.state.options, fieldNames);

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
                            onChange={::this.onChange}
                            changeOnSelect={false}
                            disabled={disabled}
                            />
                    ) || (
                        <span className={styles.value}>{value[key]}</span>
                    )
                }
                {editing && addonAfter}
            </FormItem>
        );
    }
}

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
            if (needWhole && !item) {
                callback(`请选择完整${label}`);
            } else {
                callback();
            }
        }
    };
}

export default class CascadeFormItem extends React.Component {
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
    render () {
        const { form, label, value, editing, layout, placeholder, rules, required = true, needWhole = true, hasFeedback = true, disabled, formGroup, addonAfter, style, options, ...otherProps } = this.props;
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
                            {...otherProps}
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
                {...otherProps}
                disabled={disabled}
                style={style}
                />
        );
    }
}

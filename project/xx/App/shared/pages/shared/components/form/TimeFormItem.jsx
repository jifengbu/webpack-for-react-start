import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { Form, TimePicker } from 'antd';
import { getFormItemLayout, getDefaultRules } from './config';
const FormItem = Form.Item;

export default class CheckFormItem extends React.Component {
    handleChange = (value) => {
        const { onChange } = this.props;
        if (onChange) {
            onChange(value);
        }
    }
    render () {
        const { form, label, value, format, editing, layout, formGroup, required, rules } = this.props;
        const key = _.keys(value)[0];
        const initialValue = value[key] ? moment(value[key], 'HH:mm') : null;
        return (
            <FormItem
                {...getFormItemLayout(layout, formGroup)}
                label={label}
                >
                {
                    editing && form.getFieldDecorator(key, {
                        initialValue: value[key],
                        rules: getDefaultRules(label, required, rules),
                    })(
                        <TimePicker {...this.props} format={format} value={initialValue} onChange={::this.handleChange} />
                    ) ||
                    (
                        <span >{value[key]}</span>
                    )
                }
            </FormItem>
        );
    }
}

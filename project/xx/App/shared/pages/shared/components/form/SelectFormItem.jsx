import React from 'react';
import { Form, Select } from 'antd';
import styles from './index.less';
import _ from 'lodash';
import { getFormItemLayout, getDefaultRules } from './config';
import HelpButton from '../button/HelpButton';
const FormItem = Form.Item;
const Option = Select.Option;

export default class SelectFormItem extends React.Component {
    render () {
        const { form, help, label, value, options, unit, editing, style, selectStyle, layout, className, rules, required = true, hasFeedback = true, addonAfter, formGroup, ...otherProps } = this.props;
        const key = _.keys(value)[0];
        const initialValue = _.isArray(value[key]) ? _.map(value[key], o => _.isNumber(o) ? options[o] : o) : _.isString(value[key]) ? _.find(options, o => o == value[key]) ? _.find(options, o => o == value[key]) : _.find(options, (o, k) => k == value[key]) : options[value[key]];
        return (
            <FormItem
                {...getFormItemLayout(layout, formGroup)}
                label={label}
                style={style}
                hasFeedback={hasFeedback}
                className={className}
                >
                {
                    editing && form.getFieldDecorator(key, {
                        initialValue: _.isArray(initialValue) ? initialValue.filter(o => o !== undefined) : initialValue,
                        rules: getDefaultRules(label, required, rules),
                    })(
                        <Select style={selectStyle} placeholder={`请选择${label}`} {...otherProps}>
                            { _.values(_.mapValues(options, (v, k) => <Option key={k} value={v}>{v}</Option>))}
                        </Select>
                    ) || (
                        <span className={styles.value}>{_.isArray(initialValue) ? initialValue.filter(o => o !== undefined).join('; ') : initialValue}</span>
                    )
                }
                { !!unit && <span className={styles.unit}>{unit}</span> }
                { editing && addonAfter }
                { !!help && <HelpButton info={help} /> }
            </FormItem>
        );
    }
}

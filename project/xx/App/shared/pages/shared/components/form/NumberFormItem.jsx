import React from 'react';
import _ from 'lodash';
import { Form, InputNumber } from 'antd';
import styles from './index.less';
import { getFormItemLayout, getDefaultRules } from './config';
import { numberParser } from 'utils';
import HelpButton from '../button/HelpButton';
const FormItem = Form.Item;

function checkMinNumber (rule, value, callback) {
    if (!value) {
        callback();
    } else if (!/^-?\d+(\.\d+)?$/.test(value) || Math.abs(value) < 0.000001) {
        callback('无效数字');
    } else {
        callback();
    }
}

export default class NumberFormItem extends React.Component {
    static defaultProps = {
        parser: numberParser,
    };
    componentWillReceiveProps (nextProps) {
        if (this.innderUpdate) {
            this.innderUpdate = false;
            return;
        }

        const props = this.props;
        if (props.onChange) {
            const { value, editing } = nextProps;
            if (!_.isEqual(value, props.value)) {
                const key = _.keys(value)[0];
                editing && props.form.setFieldsValue({ [key]: value[key] });
            }
        }
    }
    handleChange = (value) => {
        const { onChange } = this.props;
        if (onChange) {
            this.innderUpdate = true;
            onChange(value);
        }
    }
    render () {
        const { form, label, value, children, min, max, step, unit, help, editing, layout, rules, parser, className, precision = 0, required = true, hasFeedback = true, formGroup, ...otherProps } = this.props;
        const key = _.keys(value)[0];
        return (
            <FormItem
                {...getFormItemLayout(layout, formGroup)}
                label={label}
                hasFeedback={hasFeedback}
                className={className}
                >
                {
                    editing && form.getFieldDecorator(key, {
                        initialValue: value[key],
                        rules: getDefaultRules(label, required, rules || [ { validator: checkMinNumber } ]),
                    })(
                        <InputNumber {...otherProps} min={min} max={max} maxLength={15} step={step} precision={precision} parser={parser(precision)} onChange={::this.handleChange} />
                    ) || (
                        <span className={styles.value}>{value[key]}</span>
                    )
                }
                { !!unit && <span className={styles.unit}>{unit}</span> }
                {children}
                { !!help && <HelpButton info={help} /> }
            </FormItem>
        );
    }
}

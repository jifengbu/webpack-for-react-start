import React from 'react';
import { Form, Select, Button, Modal, Input } from 'antd';
import styles from './index.less';
import _ from 'lodash';
import { showError } from 'utils';
import { getFormItemLayout, getDefaultRules } from './config';
import HelpButton from '../button/HelpButton';
const FormItem = Form.Item;
const Option = Select.Option;

export default class SelectFormItem extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            options: props.options || [],
        };
    }
    onChange (e) {
        const { onChange } = this.props;
        onChange && onChange(e);
    }
    addOption () {
        let { options = [] } = this.state;
        const that = this;
        let optionValue;
        Modal.confirm({
            title: '添加自定义选项',
            content: (
                <div>
                    <Input placeholder='请输入自定义内容' onChange={(e) => {
                        optionValue = e.target.value;
                    }} />
                </div>
            ),
            okText: '确定',
            cancelText: '取消',
            onOk: () => new Promise((resolve, reject) => {
                if (!optionValue.trim()) {
                    showError('自定义选项内容不能为空');
                } else {
                    options.push(optionValue);
                    that.setState({ options });
                    resolve();
                }
            }),
            width: 600,
            height: 300,
        });
    }
    render () {
        const { form, help, label, value, unit, editing, style, selectStyle, layout, className, rules, required = true, hasFeedback = true, addonAfter, formGroup, defaultValue, ...otherProps } = this.props;
        const { options } = this.state;
        const key = _.keys(value)[0];
        const initialValue = value[key];
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
                        <div className={styles.selectText}>
                            <Select style={selectStyle} defaultValue={defaultValue || initialValue} onChange={::this.onChange} placeholder={`请选择${label}`} {...otherProps}>
                                { _.values(_.mapValues(options, (v, k) => <Option key={k} value={v}>{v}</Option>))}
                            </Select>
                            <Button style={{ marginLeft: 5 }} onClick={::this.addOption}>自定义选项</Button>
                        </div>
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

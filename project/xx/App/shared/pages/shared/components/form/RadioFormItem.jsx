import React from 'react';
import _ from 'lodash';
import { Form, Radio } from 'antd';
import { getFormItemLayout, getDefaultRules } from './config';
import HelpButton from '../button/HelpButton';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

export default class RadioFormItem extends React.Component {
    render () {
        const { form, help, label, value, editing, layout, titles, addonAfter, formGroup, rules, className, required = true, ...otherProps } = this.props;
        const key = _.keys(value)[0];
        return (
            <FormItem
                {...getFormItemLayout(layout, formGroup)}
                label={label}
                className={className}
                >
                {
                    editing && form.getFieldDecorator(key, {
                        initialValue: value[key],
                        rules: getDefaultRules(label, required, rules),
                    })(
                        <RadioGroup {...otherProps} style={{ marginTop: 10 }}>
                            {
                                !titles ?
                                    <div>
                                        <Radio value>{'是'}</Radio>
                                        <Radio value={false}>{'否'}</Radio>
                                    </div>
                                :
                                titles.length == 2 ?
                                    <div>
                                        <Radio value={0}>{titles[0]}</Radio>
                                        <Radio value={1}>{titles[1]}</Radio>
                                    </div>
                                :
                                    <div>
                                        {_.map(titles, (o, k) => <Radio key={k} value={k}>{o}</Radio>)}
                                    </div>
                            }
                            { addonAfter }
                        </RadioGroup>
                    ) || (
                        <span>{!titles ? (value[key] ? '是' : '否') : titles[value[key]]}</span>
                    )
                }
                { (!!help && editing) && <HelpButton info={help} /> }
            </FormItem>
        );
    }
}

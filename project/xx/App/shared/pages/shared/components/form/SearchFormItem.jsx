import React from 'react';
import _ from 'lodash';
import { Form, Input, Modal } from 'antd';
import styles from './index.less';
import { getFormItemLayout, getDefaultRules } from './config';
import HelpButton from '../button/HelpButton';
import cn from 'classnames';
const FormItem = Form.Item;
const Search = Input.Search;

export default class SearchFormItem extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            searchVisible: false,
            hasSelectOkButton: false,
        };
    }
    doSearch () {
        this.setState({
            searchVisible: true,
            hasSelectOkButton: false,
        });
    }
    handleSelectCancel () {
        this.setState({ searchVisible: false });
    }
    onSelect (selects) {
        this.tempSelect = selects;
        this.setState({ hasSelectOkButton: true });
    }
    handleSelectOk () {
        const { value, name, form, valueType } = this.props;
        const key = _.keys(value)[0];
        const selectValue = valueType === 'name' ? this.tempSelect[0] : _.get(this.tempSelect[0], name);
        form.setFieldsValue({ [key]: selectValue });
        this.setState({ searchVisible: false });
    }
    getValue () {
        const { value } = this.props;
        const key = _.keys(value)[0];
        return this.tempSelect ? this.tempSelect[0] : value[key];
    }
    render () {
        const { form, label, value, help, name, editing, layout, rules, placeholder, modalClassName, className, required = true, hasFeedback = true, formGroup, SelectComponent, valueType, ...otherProps } = this.props;
        const { searchVisible, hasSelectOkButton } = this.state;
        const key = _.keys(value)[0];
        const initialValue = valueType === 'name' ? value[key] : _.get(value[key], name);
        return (
            <FormItem
                {...getFormItemLayout(layout, formGroup)}
                label={label}
                hasFeedback={hasFeedback}
                className={className}
                >
                {
                    editing && form.getFieldDecorator(key, {
                        initialValue,
                        rules: getDefaultRules(label, required, rules),
                    })(
                        <Search {...otherProps} onSearch={() => this.doSearch()} readOnly enterButton placeholder={placeholder || `请选择${label}`} />
                    ) || (
                        <span className={styles.value}>{initialValue}</span>
                    )
                }
                { !!help && <HelpButton info={help} /> }
                {
                    searchVisible &&
                    <Modal title={`搜索${label}`} visible className={cn(hasSelectOkButton ? styles.selectModal : styles.selectModalNoButton, modalClassName)}
                        onCancel={::this.handleSelectCancel} onOk={::this.handleSelectOk}>
                        <SelectComponent label={label} onSelect={::this.onSelect} />
                    </Modal>
                }
            </FormItem>
        );
    }
}

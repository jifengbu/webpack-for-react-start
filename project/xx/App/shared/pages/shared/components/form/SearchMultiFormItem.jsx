import React from 'react';
import _ from 'lodash';
import { Form, Modal, Button, Select } from 'antd';
import styles from './index.less';
import { getFormItemLayout, getDefaultRules } from './config';
import HelpButton from '../button/HelpButton';
import cn from 'classnames';
const FormItem = Form.Item;
const Option = Select.Option;

export default class SearchMultiFormItem extends React.Component {
    constructor (props) {
        super(props);
        const value = props.value || {};
        const key = _.keys(value)[0];
        this.state = {
            searchVisible: false,
            hasSelectOkButton: false,
            options: value[key] || [],
            visible: true,
        };
    }
    componentWillReceiveProps (nextProps) {
        const props = this.props;
        const { value } = nextProps;
        const key = _.keys(value)[0];
        if (!_.isEqual(value, props.value)) {
            this.setState({ options: value[key] });
        }
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
        const { name } = this.props;
        const { options } = this.state;
        if (name) {
            this.tempSelect = _.filter(selects, o => {
                const id = _.get(o, 'id');
                return !_.find(options, m => _.get(m, 'id') === id);
            });
        } else {
            this.tempSelect = _.filter(selects, o => !_.includes(options, o));
        }
        this.setState({ hasSelectOkButton: true });
    }
    handleSelectOk () {
        const { value, form, name } = this.props;
        let { options } = this.state;
        const key = _.keys(value)[0];
        options = options.concat(this.tempSelect);
        form.setFieldsValue({ [key]: options.map(o => name ? _.get(o, 'id') : o) });
        this.setState({ options, searchVisible: false });
    }
    getValue () {
        const { options } = this.state;
        return options;
    }
    onChange (value) {
        let { options } = this.state;
        const { name } = this.props;
        options = _.filter(options, o => _.includes(value, name ? o.id : o));
        this.setState({ options, visible: false }, () => {
            this.setState({ visible: true });
        });
    }
    changeSelectOkButton (selects) {
        if (selects.length > 0) {
            const { name } = this.props;
            let { options } = this.state;
            if (name) {
                this.tempSelect = _.filter(selects, o => {
                    const id = _.get(o, 'id');
                    return !_.find(options, m => _.get(m, 'id') === id);
                });
            } else {
                this.tempSelect = _.filter(selects, o => !_.includes(options, o));
            }
            this.setState({ hasSelectOkButton: true });
        } else {
            this.setState({ hasSelectOkButton: false });
        }
    }
    render () {
        const { form, label, value, help, name, editing, layout, style, params, rules, placeholder, modalClassName, className, required = true, hasFeedback = true, formGroup, SelectComponent, ...otherProps } = this.props;
        const { searchVisible, hasSelectOkButton, options, visible } = this.state;
        const key = _.keys(value)[0];
        const initialValue = name ? _.map(options, o => _.get(o, 'id')) : options;
        return (
            <FormItem
                {...getFormItemLayout(layout, formGroup)}
                label={label}
                hasFeedback={hasFeedback}
                style={style}
                className={className}
                >
                {
                    visible && (
                        editing && form.getFieldDecorator(key, {
                            initialValue,
                            rules: getDefaultRules(label, required, rules),
                        })(
                            <Select mode='multiple' placeholder={placeholder || `请选择${label}`} {...otherProps} onChange={::this.onChange}>
                                {
                                    name ?
                                    _.values(_.mapValues(options, (v, k) => <Option key={k} value={_.get(v, 'id')}>{_.get(v, name)}</Option>))
                                    :
                                    _.map(options, (v, k) => <Option key={k} value={v}>{v}</Option>)
                                }
                            </Select>
                        ) || (
                            <span className={styles.value}>{_.map(value[key], o => name ? _.get(o, name) : o).join('、') || '无'}</span>
                        )
                    )
                }
                { editing && <Button className={styles.searchButton} onClick={() => this.doSearch()}>搜索{label}</Button> }
                { !!help && <HelpButton info={help} /> }
                {
                    searchVisible &&
                    <Modal title={`搜索${label}`} visible className={cn(hasSelectOkButton ? styles.selectModal : styles.selectModalNoButton, modalClassName)}
                        onCancel={::this.handleSelectCancel} onOk={::this.handleSelectOk}>
                        <SelectComponent multi params={params} onSelect={::this.onSelect} rejectIds={options.map(o => o.id)} changeSelectOkButton={::this.changeSelectOkButton} />
                    </Modal>
                }
            </FormItem>
        );
    }
}

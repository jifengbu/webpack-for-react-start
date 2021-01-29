import React from 'react';
import { Form, Button, Icon } from 'antd';
import { findDOMNode } from 'react-dom';
import styles from './index.less';
import { getFormItemLayout, isNullValue } from './config';
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit';
const FormItem = Form.Item;

/*
 * value 为同行
 * children 为 下一行
 */
export default class EditSubFormItem extends React.Component {
    componentDidMount () {
        this.props.required && this.changeRequired(this.props.editing);
    }
    componentWillReceiveProps (nextProps) {
        const props = this.props;
        if (props.editing !== nextProps.editing && this.props.required) {
            this.changeRequired(nextProps.editing);
        }
    }
    changeRequired (editing) {
        const node = findDOMNode(this.formItem);
        if (node) {
            const label = node.querySelectorAll('label')[0];
            if (label) {
                if (editing) {
                    label.classList.add('ant-form-item-required');
                } else {
                    label.classList.remove('ant-form-item-required');
                }
            }
        }
    }
    render () {
        const { label, value, children, onEdit, editing, layout, formGroup, type } = this.props;

        return (
            <FormItem
                {...getFormItemLayout(layout, formGroup)}
                label={label}
                ref={(ref) => { this.formItem = ref; }}
                >
                <div className={styles.iconButtonContainer}>
                    {
                        editing &&
                        <Button className={styles.subButton} onTouchTap={onEdit}>
                            {(!type && (!(children || value))) || type === 'add' ? <Icon type='plus' /> : <EditorModeEdit /> }
                        </Button>
                    }
                    { !isNullValue(value) && <span className={editing ? '' : styles.value}>{value}</span> }
                    {!editing && !(children || !isNullValue(value)) && '无'}
                </div>
                {children}
            </FormItem>
        );
    }
}

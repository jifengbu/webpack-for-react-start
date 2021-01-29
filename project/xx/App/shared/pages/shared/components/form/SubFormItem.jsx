import React from 'react';
import { Form, Icon, Button } from 'antd';
import styles from './index.less';
import { findDOMNode } from 'react-dom';
import { getFormItemLayout } from './config';
const FormItem = Form.Item;

export default class SubFormItem extends React.Component {
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
        const { label, children, editing, layout, formGroup, buttons = [] } = this.props;

        return (
            <div>
                <FormItem
                    {...getFormItemLayout(layout, formGroup)}
                    label={label}
                    ref={(ref) => { this.formItem = ref; }}
                    className={editing && buttons.length ? '' : styles.subFormLabel} >
                    {
                        editing &&
                        <div className={styles.iconButtonContainer}>
                            {
                                !!buttons.length && buttons.map((item, i) => (
                                    item.visible &&
                                    <Button key={i} className={styles.subButton} onTouchTap={item.onClick}>
                                        {
                                            item.type === 'delete' ? <Icon type='delete' /> :
                                            item.type === 'add' ? <Icon type='plus' /> :
                                            <Icon type='plus' />
                                        }
                                    </Button>
                                ))
                            }
                        </div>
                    }
                </FormItem>
                <div className={styles.subChildren}>
                    {children}
                </div>
            </div>
        );
    }
}

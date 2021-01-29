import React from 'react';
import { Form } from 'antd';
import styles from './index.less';
import { getFormItemLayout, isNullValue } from './config';
const FormItem = Form.Item;

export default class DiffFormItem extends React.Component {
    render () {
        const { label, layout, newValue, oldValue, formGroup, isImage } = this.props;
        return (
            <FormItem
                {...getFormItemLayout(layout, formGroup)}
                label={label}
                >
                {
                    isImage && (
                        (isNullValue(oldValue) && isNullValue(newValue))
                        &&
                        <span />
                        || (
                            (isNullValue(oldValue)) &&
                            <span><img src={newValue} className={styles.image} /><span className={styles.newItem}>(新)</span></span>
                            || (
                                oldValue == newValue &&
                                <img src={newValue} className={styles.image} />
                                ||
                                <span><img src={oldValue} className={styles.image} /><span className={styles.newItem}>{ '➜' }</span><img src={newValue} className={styles.image} /></span>
                            )
                        )
                    ) || (
                        (isNullValue(oldValue) && isNullValue(newValue))
                        &&
                        <span />
                        || (
                            (isNullValue(oldValue)) &&
                            <span className={styles.newValue}>{newValue}<span className={styles.newItem}>(新)</span></span>
                            || (
                                oldValue == newValue &&
                                <span className={styles.value}>{newValue}</span>
                                ||
                                <span className={styles.value}>{oldValue}<span className={styles.newItem}>{ '➜' }</span><span className={styles.newValue}>{newValue || ''}</span></span>
                            )
                        )
                    )
                }
            </FormItem>
        );
    }
}

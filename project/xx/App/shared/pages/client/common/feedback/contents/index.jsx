import React from 'react';
import antd_form_create from 'decorators/antd_form_create';
import { Form, Input } from 'antd';
import { DetailContainer } from 'components';
import { showError, showSuccess } from 'utils';
import _ from 'lodash';
import styles from './index.less';
const FormItem = Form.Item;
const TextArea = Input.TextArea;

@antd_form_create
export default class Statistics extends React.Component {
    state = {
        waiting: false,
    };
    handleSubmit (e) {
        e.preventDefault();
        const { form, actions } = this.props;
        form.validateFields((errors, value) => {
            if (errors) {
                _.mapValues(errors, (item) => {
                    showError(_.last(item.errors.map((o) => o.message)));
                });
                return;
            }
            this.setState({ waiting: true });
            actions.feedback(value, (data) => {
                this.setState({ waiting: false });
                if (data.success) {
                    showSuccess('反馈成功');
                    form.setFieldsValue({ content: '' });
                } else {
                    showError(data.msg);
                }
            });
        });
    }
    checkContentEmpty (rule, value, callback) {
        if (value && !value.trim()) {
            callback('反馈内容不能为空');
        } else {
            callback();
        }
    }
    render () {
        const { form, loading, rootPersonal } = this.props;
        const { waiting } = this.state;
        const { getFieldDecorator } = form;
        const contentDecorator = getFieldDecorator('content', {
            rules: [
                { required: true, message: '反馈的内容不能为空' },
                { validator: this.checkContentEmpty },
            ],
        });
        const emailDecorator = getFieldDecorator('email', {
            initialValue: rootPersonal.email,
            validate: [{
                rules: [
                    { required: true, message: '请输入邮箱' },
                ],
                trigger: 'onBlur',
            }, {
                rules: [
                    { type: 'email', message: '请输入正确的邮箱地址' },
                ],
                trigger: ['onBlur', 'onChange'],
            }],
        });
        return (
            <DetailContainer title='意见反馈' {...{ loading, waiting, editing: true }} buttons={[
                    { text: '提交反馈', onClick: ::this.handleSubmit, visible: true },
            ]} >
                <div className={styles.container}>
                    <Form>
                        <div className={styles.title}>
                            请输入你需要反馈的内容:
                        </div>
                        <FormItem
                            hasFeedback
                            >
                            {contentDecorator(
                                <TextArea rows={10} maxLength={1024} />
                            )}
                        </FormItem>
                        <div className={styles.title}>
                            联系邮箱<span className={styles.titleDisc}>（留下您的联系邮箱，以便我们将处理结果通知给您，我们会严格保密）</span>:
                        </div>
                        <FormItem
                            hasFeedback
                            >
                            {emailDecorator(
                                <Input placeholder='请输入邮箱' maxLength={256} />
                            )}
                        </FormItem>
                    </Form>
                </div>
            </DetailContainer>
        );
    }
}

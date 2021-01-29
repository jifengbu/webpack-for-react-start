import React from 'react';
import antd_form_create from 'decorators/antd_form_create';
import { Form } from 'antd';
import { DetailContainer, NumberFormItem } from 'components';
import { _, handleEditCancel, showSuccess, showError } from 'utils';

@antd_form_create
export default class Setting extends React.Component {
    static fragments = {
        setting: 1,
    };
    state = {
        waiting: false,
        editing: false,
        pageData: {},
    }
    componentWillReceiveProps (nextProps) {
        const props = this.props;
        const { setting } = nextProps;
        if (!_.isEqual(setting, props.setting)) {
            this.setState({ pageData: _.cloneDeep(setting), origin: _.cloneDeep(setting) });
        }
    }
    handleSubmit (e) {
        e.preventDefault();
        const { editing, origin } = this.state;
        if (editing) {
            const { actions, form } = this.props;
            form.validateFields((errors, value) => {
                if (errors) {
                    _.mapValues(errors, (item) => {
                        showError(_.last(item.errors.map((o) => o.message)));
                    });
                    return;
                }
                value.carePeopleVisitPeriodList = [ value.carePeopleVisitPeriod0, value.carePeopleVisitPeriod1, value.carePeopleVisitPeriod2 ];
                value.controlPeopleVisitPeriodList = [ value.controlPeopleVisitPeriod0, value.controlPeopleVisitPeriod1, value.controlPeopleVisitPeriod2, value.controlPeopleVisitPeriod3 ];
                delete value.carePeopleVisitPeriod0;
                delete value.carePeopleVisitPeriod1;
                delete value.carePeopleVisitPeriod2;
                delete value.controlPeopleVisitPeriod0;
                delete value.controlPeopleVisitPeriod1;
                delete value.controlPeopleVisitPeriod2;
                delete value.controlPeopleVisitPeriod3;
                _.forIn(value, (v, k) => {
                    if (!!origin && _.isEqual(origin[k], v)) {
                        delete value[k];
                    }
                });
                if (!_.keys(value).length) {
                    showError('信息没有任何改变，无需修改');
                    return;
                }
                actions.modifySettingInfo(value, (data) => {
                    this.setState({ waiting: false });
                    if (data.success) {
                        const setting = data.context;
                        this.setState({ editing: false, pageData: _.cloneDeep(setting), origin: _.cloneDeep(setting) });
                        showSuccess('修改成功');
                    } else {
                        showError(data.msg);
                    }
                });
            });
        } else {
            this.setState({ editing: true });
        }
    }
    handleImageChange (url) {
        const { pageData } = this.state;
        pageData.logo = url;
        this.setState({ pageData });
    }
    render () {
        const { form, loading } = this.props;
        const { waiting, editing, pageData } = this.state;
        const {
            commonPeopleVisitPeriod,
            carePeopleVisitPeriod,
            controlPeopleVisitPeriod,
            carePeopleVisitPeriodList = [],
            controlPeopleVisitPeriodList = [],
        } = pageData;
        const [ carePeopleVisitPeriod0, carePeopleVisitPeriod1, carePeopleVisitPeriod2 ] = carePeopleVisitPeriodList;
        const [ controlPeopleVisitPeriod0, controlPeopleVisitPeriod1, controlPeopleVisitPeriod2, controlPeopleVisitPeriod3 ] = controlPeopleVisitPeriodList;
        return (
            <DetailContainer title='系统设置' {...{ loading, waiting, editing }} buttons={[
                    { text: '取消修改', onClick: handleEditCancel.bind(this), visible: editing },
                    { text: !editing ? '修改' : '确认修改', onClick: ::this.handleSubmit },
            ]} >
                <Form>
                    <NumberFormItem form={form} label='普通人员的走访周期' value={{ commonPeopleVisitPeriod }} min={1} step={1} max={1000} unit='天' editing={editing} />
                    <NumberFormItem form={form} label='关爱人群人员的走访周期' value={{ carePeopleVisitPeriod }} min={1} step={1} max={1000} unit='天' editing={editing} />
                    <NumberFormItem form={form} label='关注人员人员的走访周期' value={{ controlPeopleVisitPeriod }} min={1} step={1} max={1000} unit='天' editing={editing} />
                    <NumberFormItem form={form} label='留守儿童的走访周期' value={{ carePeopleVisitPeriod0 }} min={1} step={1} max={1000} unit='天' editing={editing} required={false} />
                    <NumberFormItem form={form} label='空巢老人的走访周期' value={{ carePeopleVisitPeriod1 }} min={1} step={1} max={1000} unit='天' editing={editing} required={false} />
                    <NumberFormItem form={form} label='残疾人的走访周期' value={{ carePeopleVisitPeriod2 }} min={1} step={1} max={1000} unit='天' editing={editing} required={false} />
                    <NumberFormItem form={form} label='酗酒闹事的走访周期' value={{ controlPeopleVisitPeriod0 }} min={1} step={1} max={1000} unit='天' editing={editing} required={false} />
                    <NumberFormItem form={form} label='涉毒人员的走访周期' value={{ controlPeopleVisitPeriod1 }} min={1} step={1} max={1000} unit='天' editing={editing} required={false} />
                    <NumberFormItem form={form} label='刑事前科人员的走访周期' value={{ controlPeopleVisitPeriod2 }} min={1} step={1} max={1000} unit='天' editing={editing} required={false} />
                    <NumberFormItem form={form} label='闹访人员的走访周期' value={{ controlPeopleVisitPeriod3 }} min={1} step={1} max={1000} unit='天' editing={editing} required={false} />
                </Form>
            </DetailContainer>
        );
    }
}

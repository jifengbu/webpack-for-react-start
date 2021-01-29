import React from 'react';
import { Form, Button } from 'antd';
import styles from './index.less';
import { _N } from 'utils';
import { getFormItemLayout } from './config';
import HelpButton from '../button/HelpButton';
const FormItem = Form.Item;

export default class AccountFormItem extends React.Component {
    render () {
        const { account, loading, layout, formGroup, showBillDetail } = this.props;
        const { amount, usableAmount, frozeAmount, bondAmount, lockAmount, strictAmount } = account;
        let children = [];
        let help = [];
        if (strictAmount > 0) {
            help.push('定向资金是指能用来交易，但是不能提现的资金，如平台设置账户的保底金额为定向资金；物流公司在现付中收到的运费直到收货人收到货物前这部分金额为定向资金');
        }
        if (frozeAmount > 0) {
            children.push(`冻结金额：${_N(frozeAmount)} 元`);
            help.push('冻结金额是账户在违规的情况下被平台冻结的金额，分为完全冻结和部分冻结，完全冻结后账户所有的金额都不可用，部分冻结只有超出冻结金额的部分可用');
        } else if (frozeAmount === -1) {
            children.push(`账户被完全冻结`);
            help.push('冻结金额是账户在违规的情况下被平台冻结的金额，分为完全冻结和部分冻结，完全冻结后账户所有的金额都不可用，部分冻结只有超出冻结金额的部分可用');
        }
        if (bondAmount > 0) {
            children.push(`押金：${_N(bondAmount)} 元`);
            help.push('押金是物流公司拉货按照运费的多少倍抵押在平台的金额，货物成功运达后将返还给物流公司');
        }
        if (lockAmount > 0) {
            children.push(`锁定金额：${_N(lockAmount)} 元`);
            help.push('锁定金额是指在提现的过程中，银行还没有返回结果时被锁定的部分，如果有有疑问，请联系客服');
        }
        if (children.length) {
            children.unshift(` 账户总额：${_N(amount)} 元`);
        }
        help = help.map((o, k) => `${k + 1}：${o}`);
        return (
            <FormItem
                {...getFormItemLayout(layout, formGroup)}
                label='可用余额'
                >
                { `${_N(usableAmount)} 元` }
                <span style={{ fontSize: 8, color: 'red', marginLeft: 4 }}>
                    { strictAmount > 0 && `(包含定向资金：${_N(strictAmount)} 元) ` }
                    { children.join('；') }
                </span>
                {!!help.length && <HelpButton info={help} style={{ marginLeft: 6, marginTop: 12 }} />}
                { showBillDetail && <Button type='ghost' className={styles.showDetailButton} onClick={showBillDetail} loading={loading}>明细</Button> }
            </FormItem>
        );
    }
}

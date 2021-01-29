import React from 'react';
import { _N } from 'utils';
import HelpButton from '../button/HelpButton';

export default class AccountInfo extends React.Component {
    render () {
        const { account, useYuan } = this.props;
        if (!account) {
            return null;
        }
        const key = useYuan ? 'Yuan' : '';
        const amount = account[`amount${key}`];
        const usableAmount = account[`usableAmount${key}`];
        const frozeAmount = account[`frozeAmount${key}`];
        const bondAmount = account[`bondAmount${key}`];
        const lockAmount = account[`lockAmount${key}`];
        const strictAmount = account[`strictAmount${key}`];

        let help = [];
        if (strictAmount > 0) {
            help.push('定向资金是指能用来交易，但是不能提现的资金，如平台设置账户的保底金额为定向资金；物流公司在现付中收到的运费直到收货人收到货物前这部分金额为定向资金');
        }
        if (frozeAmount > 0) {
            help.push('冻结金额是账户在违规的情况下被平台冻结的金额，分为完全冻结和部分冻结，完全冻结后账户所有的金额都不可用，部分冻结只有超出冻结金额的部分可用');
        }
        if (bondAmount > 0) {
            help.push('押金是物流公司拉货按照运费的多少倍抵押在平台的金额，货物成功运达后将返还给物流公司');
        }
        if (lockAmount > 0) {
            help.push('锁定金额是指在提现的过程中，银行还没有返回结果时被锁定的部分，如果有有疑问，请联系客服');
        }
        help = help.map((o, k) => `${k + 1}：${o}`);
        return (
            (frozeAmount == 0 && bondAmount == 0 && lockAmount == 0 && strictAmount === 0) && (
                <div>可用余额：{_N(usableAmount)} 元</div>
            ) || (
                <div>
                    <div>
                        可用余额：{_N(usableAmount)} 元
                        {strictAmount !== 0 && <span style={{ fontSize: 8, color: 'red', marginLeft: 10 }}>(包含定向资金：{_N(strictAmount)} 元)</span>}
                        {!!help.length && <HelpButton info={help} style={{ marginTop: 2 }} />}
                    </div>
                    <div style={{ fontSize: 8, color: 'red' }}>
                        总额：{_N(amount)}元
                        {frozeAmount > 0 && <span>；冻结金额：{_N(frozeAmount)} 元</span>}
                        {frozeAmount === -1 && <span>；被完全冻结</span>}
                        {bondAmount !== 0 && <span>；押金：{_N(bondAmount)} 元</span>}
                        {lockAmount !== 0 && <span>；锁定金额：{_N(lockAmount)} 元</span>}
                    </div>
                </div>
            )
        );
    }
}

import React from 'react';
import styles from './detail.less';

export default class detail extends React.Component {
    render () {
        const { type, data } = this.props;
        const { image, name, description, businessLicenseNo, investmentAmount, products, businessCase, industry, contactMan, contactPhone, totalArea, area, rentType, transformationPlan, address } = data;
        return (
            type === 'factory' &&
            <div className={styles.container}>
                <img src={image || '/hbclient/img/common/default.png'} className={styles.company_image} />
                <div className={styles.right}>
                    <div>企业名称：{name}</div>
                    <div>统一信用号：{businessLicenseNo}</div>
                    <div>所属行业：{industry}</div>
                    <div>主要产品或业务：{products}</div>
                    <div>法人代表：{contactMan}</div>
                    <div>联系方式：{contactPhone}</div>
                    <div>注册资金：{investmentAmount}</div>
                </div>
                <div className={styles.right}>
                    <div>企业经营状态：{businessCase}</div>
                    <div>占地面积（亩）：{totalArea}</div>
                    <div>厂房面积（㎡）：{area}</div>
                    <div>是否是租用厂房：{rentType}</div>
                    <div>是否有技改计划：{transformationPlan}</div>
                    <div>企业地址：{address}</div>
                    <div>企业简介：{description}</div>
                </div>
            </div>
            ||
            type === 'hospital' &&
            <div className={styles.container}>
                <img src={image || '/hbclient/img/common/default.png'} className={styles.company_image} />
                <div className={styles.right}>
                    <div>医院名称：{name}</div>
                    <div>地址：{address}</div>
                    <div>医院简介：{description}</div>
                </div>
            </div>
            ||
            type === 'school' &&
            <div className={styles.container}>
                <img src={image || '/hbclient/img/common/default.png'} className={styles.company_image} />
                <div className={styles.right}>
                    <div>学校名称：{name}</div>
                    <div>地址：{address}</div>
                    <div>学校简介：{description}</div>
                </div>
            </div>
        );
    }
}

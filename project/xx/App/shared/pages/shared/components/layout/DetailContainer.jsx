import React from 'react';
import { Button, Spin, Popover } from 'antd';
import styles from './index.less';

export default class DetailContainer extends React.Component {
    render () {
        let { title, loading, waiting, buttons = [], moreButtons, leftControl, children, topPadding } = this.props;
        const moreButtonsContent = moreButtons && moreButtons.map((item, i) => <Button key={i} type='ghost' style={{ marginTop: 5, display: 'block' }} onClick={item.onClick} loading={waiting}>{item.text}</Button>);
        return (
            <div className={styles.container}>
                <div className={styles.topContainer} {...(topPadding !== undefined ? { style: { marginBottom: topPadding } } : {})} >
                    <div className={styles.titleContainer}>
                        <div className={styles.title}>{title}</div>
                        {
                            !!leftControl &&
                            <div className={styles.leftDetailControlContainer}>
                                {leftControl}
                            </div>
                        }
                    </div>
                    <div style={{ zIndex: 150 }}>
                        {
                            buttons.map((item, i) => (
                                (item.visible !== false && !loading) && <Button key={i} type='ghost' style={{ marginLeft: 10 }} onClick={item.onClick} loading={waiting}>{item.text}</Button>
                        ))}
                        {
                            moreButtons && moreButtons.length != 0 &&
                            <Popover placement='bottom' content={moreButtonsContent} trigger='click'>
                                <img className={styles.plusButton} src={'/hbclient/img/common/more_button.png'} alt='更多按钮' />
                            </Popover>
                        }
                    </div>
                </div>
                <div className={styles.detailPanel} style={loading ? { display: 'flex' } : undefined}>
                    { loading ? <div className={styles.detailPanelSpin}><Spin /></div> : children }
                </div>
            </div>
        );
    }
}

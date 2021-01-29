import React from 'react';
import { Button } from 'antd';
import styles from './index.less';
import cn from 'classnames';
import SearchButton from '../button/SearchButton';

export default class TableContainer extends React.Component {
    static defaultProps = {
        placeholder: '输入关键字查找',
    };
    render () {
        const {
            loading,
            placeholder,
            title,
            onSearch,
            searchDefaultValue,
            moreSearch,
            exactSearch,
            refresh,
            buttons = [],
            leftControl,
            rightControl,
            children,
            toggleFullScreen,
            isFullScreen,
            className,
        } = this.props;
        const btnFullScreenText = isFullScreen ? '退出全屏' : '全屏';
        return (
            <div className={cn(styles.container, className)}>
                {
                    (!!leftControl || !!rightControl || !!onSearch || !!title || !!buttons.length || !!exactSearch) &&
                    <div className={styles.searchContainer}>
                        {
                            !!leftControl &&
                            <div className={styles.leftControlContainer}>
                                {leftControl}
                            </div>
                        }
                        { exactSearch }
                        {
                            !!onSearch &&
                            <div className={styles.search} >
                                <SearchButton placeholder={placeholder} defaultValue={searchDefaultValue} onSearch={onSearch} maxLength={20} moreSearch={moreSearch} />
                            </div>
                        }
                        {
                            !!title &&
                            <div className={onSearch ? styles.tableTitle : styles.tableTitleCenter}>{title}</div>
                        }
                        <div className={styles.buttonsContainer}>
                            { rightControl }
                            {
                                ([ { text: '刷新', onClick: refresh, visible: !!refresh }, ...buttons ]).map((item, i) => (
                                    (item.visible !== false) && <Button key={i} style={{ marginRight: 10 }} disabled={item.disabled} loading={loading} onClick={item.onClick}>{item.text}</Button>
                            ))}
                            {
                                toggleFullScreen &&
                                <div className={!isFullScreen ? styles.normalDiv : styles.hoverDiv} style={{ marginLeft: 20 }}>
                                    <img onClick={toggleFullScreen} src={!isFullScreen ? '/hbclient/img/common/do_toggle_full_screen.png' : '/hbclient/img/common/close_toggle_full_screen.png'} className={styles.toggleFullScreen} alt={btnFullScreenText} />
                                </div>
                            }
                        </div>
                    </div>
                }
                { children }
            </div>
        );
    }
}

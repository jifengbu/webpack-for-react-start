import React from 'react';
import { Button, Modal } from 'antd';
import styles from './index.less';
import SearchAddress from '../../pages/SearchAddress';

export default class SearchAddressButton extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            addressModalVisible: false,
            hasAddressOkButton: false,
        };
    }
    doSearch () {
        this.setState({
            hasAddressOkButton: false,
            addressModalVisible: true,
        });
    }
    handleSelectAddressCancel () {
        this.setState({ addressModalVisible: false });
    }
    onSelectAddress (selects) {
        this.tempAddresss = selects;
        this.setState({ hasAddressOkButton: true });
    }
    handleSelectAddressOk () {
        const address = this.tempAddresss[0];
        this.setState({ addressModalVisible: false });
        this.props.onSelectAddress(address.code);
    }
    render () {
        const { parentCode } = this.props;
        const {
            addressModalVisible,
            hasAddressOkButton,
        } = this.state;
        return (
            <div className={styles.addressButton} >
                <Button onClick={::this.doSearch}>手动搜索</Button>
                {
                    addressModalVisible &&
                    <Modal title={'搜索地址'} visible className={hasAddressOkButton ? styles.addressModal : styles.addressModalNoButton} onCancel={::this.handleSelectAddressCancel} onOk={::this.handleSelectAddressOk}>
                        <SearchAddress parentCode={parentCode} onSelect={::this.onSelectAddress} onSearch={::this.doSearch} />
                    </Modal>
                }
            </div>
        );
    }
}

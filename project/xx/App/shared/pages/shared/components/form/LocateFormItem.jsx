import React from 'react';
import { Form, Modal, Button, Input } from 'antd';
import { findDOMNode } from 'react-dom';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentDelete from 'material-ui/svg-icons/action/delete';
import NavigationArrowUpward from 'material-ui/svg-icons/navigation/arrow-upward';
import NavigationArrowDownward from 'material-ui/svg-icons/navigation/arrow-downward';
import styles from './index.less';
import TiandiMap from 'pages/TiandiMap';
import { getFormItemLayout } from './config';
const FormItem = Form.Item;

export default class LocateFormItem extends React.Component {
    static defaultProps = {
        location: [106.693355, 26.224622],
    };
    state = {
        mapModalVisible: false,
        detailAddress: this.props.detailAddress,
        address: this.props.address,
        location: this.props.location,
    };
    componentDidMount () {
        this.props.required && this.changeRequired(this.props.editing);
    }
    componentWillReceiveProps (nextProps) {
        const props = this.props;
        if (props.address !== nextProps.address) {
            this.setState({
                address: nextProps.address,
                location: nextProps.location,
                detailAddress: nextProps.detailAddress,
            });
        }
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
    getValue () {
        const { address, location, detailAddress } = this.state;
        return { address, detailAddress, location };
    }
    showBaiduMap () {
        this.setState({ mapModalVisible: true });
    }
    handleCancel () {
        this.setState({ mapModalVisible: false });
    }
    closeModal () {
        this.setState({ mapModalVisible: false });
    }
    onMapSelect (pos) {
        const { address, point: { lat, lng } } = pos;
        this.setState({ address, location: [lng, lat] });
    }
    handleDetailAddress (e) {
        this.setState({ detailAddress: e.target.value });
    }
    render () {
        const { mapModalVisible, address, location, detailAddress } = this.state;
        const { label, layout, editing, buttons, initAddress, select } = this.props;
        return (
            <FormItem
                {...getFormItemLayout(layout)}
                label={label}
                ref={(ref) => { this.formItem = ref; }}
                >
                <div className={styles.iconButtonContainer}>
                    {
                        !!buttons &&
                        buttons.map((item, i) => (
                            item.visible &&
                            <FloatingActionButton key={i} secondary={item.type === 'delete'} className={styles.iconButton} onTouchTap={item.onClick}>
                                {
                                    item.type === 'add' ? <ContentAdd /> :
                                    item.type === 'delete' ? <ContentDelete /> :
                                    item.type === 'up' ? <NavigationArrowUpward /> :
                                    <NavigationArrowDownward />
                                }
                            </FloatingActionButton>
                        ))
                    }
                    {
                        (editing || address || detailAddress) &&
                        <Button type='dashed' disabled={!editing} className={styles.locationButton} onClick={::this.showBaiduMap}>
                            <img src='/hbclient/img/common/location.png' className={styles.locationIcon} />
                        </Button>
                    }
                    {
                        editing && (
                            <view className={styles.row}><span className={styles.value}>{address}</span><Input className={styles.detailAddress} placeholder={`请输入详细地址`} value={detailAddress} maxLength={50} onChange={::this.handleDetailAddress} /></view>
                        ) || (
                            <span className={styles.value}>{(address || '') + (detailAddress || '')}</span>
                        )
                    }
                </div>
                {
                    mapModalVisible &&
                    <Modal visible title={'选择地址'} footer={null} className={styles.modal} onCancel={::this.handleCancel} >
                        <TiandiMap className={styles.mapContainer} onSelect={::this.onMapSelect} title={'地址'} initLocation={location} initAddress={initAddress} enable={editing || select} closeModal={::this.closeModal} />
                    </Modal>
                }
            </FormItem>
        );
    }
}

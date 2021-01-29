import React from 'react';
import { Form, Icon, Upload, Modal, Button, Spin } from 'antd';
import _ from 'lodash';
import styles from './index.less';
import { formatFileSize, getFormItemLayout } from './config';
import { showError } from '../../utils/confirm';
import { createSocketIO } from '../../utils';
const FormItem = Form.Item;

const uploadProps = {
    name: 'file',
    action: '/hb/api/uploadFile',
    supportServerRender: true,
};

function getCheckValidator (label, count, noFull, required) {
    if (required) {
        return (rule, value, callback) => {
            if (!noFull) {
                if (!value || value.length < count) {
                    callback(`请选择 ${label} `);
                } else {
                    callback();
                }
            } else {
                callback();
            }
        };
    }
}

export default class ImageListFormItem extends React.Component {
    static defaultProps = {
        maxSize: 10 * 1024 * 1024, // 10M
    };
    constructor (props, context) {
        super(props, context);
        const key = _.keys(props.value)[0];
        let _value = props.value[key] ? _.isArray(props.value[key]) ? props.value[key] : [props.value[key]] : [];
        const fileList = _value.map((o, i) => ({ url: o || '/hbclient/img/common/default.png', thumbUrl: o || '/hbclient/img/common/default.png', status: 'done', uid: -i }));
        this.state = {
            previewVisible: false,
            loadingVisible: false,
            previewImage: '',
            fileList,
        };
    }
    componentWillReceiveProps (nextProps) {
        if (this.innderUpdate) {
            this.innderUpdate = false;
            return;
        }
        const props = this.props;
        const { value, editing } = nextProps;
        if (!_.isEqual(value, props.value)) {
            const key = _.keys(value)[0];
            let _value = value[key] ? _.isArray(value[key]) ? value[key] : [value[key]] : [];
            const fileList = _value.map((o, i) => ({ url: o || '/hbclient/img/common/default.png', thumbUrl: o || '/hbclient/img/common/default.png', status: 'done', uid: -i }));
            this.setState({ fileList });
            editing && props.form.setFieldsValue({ [key]: value[key] });
        }
    }
    handleCancel = () => this.setState({ previewVisible: false });
    handleLoading = () => {
        this.setState({ loadingVisible: false });
        this.removeaddSetPhotoListener();
    }
    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    };
    handleChange = ({ fileList }) => {
        const { form, value, onChange } = this.props;
        const key = _.keys(value)[0];
        this.setState({ fileList }, () => {
            if (_.every(fileList, o => o.status === 'done')) {
                const urls = fileList.map(o => o.url || (o.status === 'done' ? o.response.context.url : undefined));
                form.setFieldsValue({ [key]: urls });
                if (onChange) {
                    this.innderUpdate = true;
                    onChange(urls);
                }
            }
        });
    };
    beforeUpload (file) {
        const { maxSize } = this.props;
        if (file.size > maxSize) {
            showError('图片大小不能超过' + formatFileSize(maxSize));
            return false;
        }
        return true;
    }
    addSetPhotoListening (e) {
        e.stopPropagation();
        const { rootPersonal, form, value, onChange } = this.props;
        let { fileList } = this.state;
        const key = _.keys(value)[0];
        this.setState({ loadingVisible: true });
        this.socket = createSocketIO(rootPersonal.userId)
        .on('RP_SET_PHOTO_NF', obj => {
            let file = { url: obj.photo, thumbUrl: obj.photo, status: 'done', uid: _.random(1000) };
            fileList.push(file);
            this.setState({ fileList, loadingVisible: false }, () => {
                const urls = fileList.map(o => o.url || (o.status === 'done' ? o.response.context.url : undefined));
                form.setFieldsValue({ [key]: urls });
                if (onChange) {
                    this.innderUpdate = true;
                    onChange(urls);
                }
            });
            this.removeaddSetPhotoListener();
        });
    }
    removeaddSetPhotoListener () {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = undefined;
        }
    }
    render () {
        const { form, label, layout, editing, count = 1, value, required = true, classNames = [], noFull = false, phoneUpload = true } = this.props;
        const { previewVisible, previewImage, fileList, loadingVisible } = this.state;
        const key = _.keys(value)[0];
        const uploadButton = (
            <div>
                <Icon type='plus' style={{ fontSize: 40, color: '#999' }} />
                <div style={{ fontSize: 8 }}>点击上传</div>
                { phoneUpload && <Button className={styles.phoneUploadButton} type='primary' onClick={::this.addSetPhotoListening}>手机上传</Button>}
            </div>
        );
        return (
            <FormItem
                {...getFormItemLayout(layout)}
                label={label}
                className={styles.imageList}
                >
                {editing && form.getFieldDecorator(key, { initialValue: value[key], rules: [ { required, message: `请选择${label}` }, { validator: getCheckValidator(label, count, noFull, required) } ] })(<span style={{ marginTop: 10 }} />)}
                <div className={classNames[0]}>
                    <Upload
                        {...uploadProps}
                        accept='.jpg,.png'
                        listType='picture-card'
                        fileList={fileList}
                        beforeUpload={::this.beforeUpload}
                        onPreview={::this.handlePreview}
                        onRemove={editing}
                        onChange={::this.handleChange}
                        className={classNames[1]}
                        >
                        {(!editing || fileList.length >= count) ? null : uploadButton}
                    </Upload>
                </div>
                {
                    previewVisible &&
                    <Modal visible footer={null} className={styles.imageModal} onCancel={this.handleCancel}>
                        <img style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                }
                {
                    loadingVisible &&
                    <Modal visible footer={null} onCancel={this.handleLoading}>
                        <div className={styles.loadingWrapper}>
                            <Spin size='large' tip='等待手机上传' />
                        </div>
                    </Modal>
                }
            </FormItem>
        );
    }
}

import React from 'react';
import { Input, Icon, Popover } from 'antd';

export default class SearchButton extends React.Component {
    onSearch = () => {
        const { onSearch } = this.props;
        if (onSearch) {
            onSearch(this.input.input.value);
        }
        this.input.focus();
    }
    focus () {
        this.input.focus();
    }
    blur () {
        this.input.blur();
    }
    cleanAll () {
        this.input.input.value = '';
        this.onSearch();
    }
    render () {
        const { placeholder, maxLength, moreSearch, defaultValue } = this.props;
        return (
            <Input
                onPressEnter={this.onSearch}
                {...{ placeholder, maxLength, defaultValue }}
                suffix={[
                    <Icon key='close' type='close-circle' style={{ marginRight: '10px' }} onClick={::this.cleanAll} />,
                    <Icon key='search' type='search' onClick={::this.onSearch} style={{ cursor: 'pointer' }} />,
                    moreSearch &&
                    <Popover key='down' placement='bottom' content={moreSearch} title='高级查找' trigger='click'>
                        <Icon type='down' style={{ cursor: 'pointer', marginLeft: 20 }} />
                    </Popover>,
                ]}
                ref={(ref) => { this.input = ref; }}
                />
        );
    }
}

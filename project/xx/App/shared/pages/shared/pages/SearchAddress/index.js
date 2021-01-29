import React from 'react';
import { dataConnect } from 'relatejs';
import { searchMgr, showError } from 'utils';
import SearchAddress from './contents';

@dataConnect(
    (state) => ({ pageSize: 20 }),
    null,
    (props) => ({
        manualLoad: true,
        fragments: SearchAddress.fragments,
        variablesTypes: {
            searchAddress: {
                keyword: 'String',
                parentCode: 'Int',
            },
        },
    }),
)
export default class SearchAddressContainer extends React.Component {
    refresh () {
        const { relate, parentCode = 0 } = this.props;
        relate.refresh({
            variables: {
                searchAddress: {
                    keyword: searchMgr.get('searchAddress').keyword,
                    parentCode,
                },
            },
            callback (data) {
                if (!data.searchAddress) {
                    showError('没有相关银行卡');
                }
            },
        });
    }
    loadMore (pageNo, cb) {
        const { relate, parentCode = 0 } = this.props;
        relate.loadMore({
            variables: {
                searchAddress: {
                    keyword: searchMgr.get('searchAddress').keyword,
                    parentCode,
                },
            },
            property: 'list',
            callback: cb,
        });
    }
    render () {
        return (
            <SearchAddress {...this.props} refresh={::this.refresh} loadMore={::this.loadMore} />
        );
    }
}

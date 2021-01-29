import React from 'react';
import { Tree, Input, Spin } from 'antd';
import { apiQuery } from 'relatejs';
import styles from './index.less';
import _ from 'lodash';

const { TreeNode } = Tree;
const { Search } = Input;

const filterTree = (treeData, keyword, expandedKeys) => {
    const list = [];
    for (const item of treeData) {
        item.children = item.children && item.children.length ? filterTree(item.children, keyword, expandedKeys) : undefined;
        if (item.children || item.name.indexOf(keyword) > -1) {
            expandedKeys.push(item.id);
            list.push(item);
        }
    }
    return list.length ? list : undefined;
};
const getAllExpandedKeys = (treeData) => {
    let expandedKeys = [];
    for (const item of treeData) {
        expandedKeys.push(item.id);
        const childrenKeys = item.children && item.children.length ? getAllExpandedKeys(item.children) : [];
        expandedKeys = [ ...expandedKeys, ...childrenKeys ];
    }
    return expandedKeys;
};

export default class TreeList extends React.Component {
    state = {
        treeData: [],
        searchValue: '',
        expandedKeys: [],
        originExpandedKeys: [],
        autoExpandParent: true,
        waiting: false,
    }
    componentWillReceiveProps (nextProps) {
        const { treeData } = nextProps;
        if (!this.state.treeData.length) {
            this.setState({ treeData, originData: _.cloneDeep(treeData) });
        }
    }
    onChange (obj, list) {
        const { onSelect } = this.props;
        const { treeData } = this.state;
        list = list || treeData;
        _.forEach(list, o => {
            if (_.isEqual(o, obj)) {
                o.checked = !o.checked;
                onSelect(obj, o.checked);
            } else if (o.children) {
                this.onChange(obj, o.children);
            }
        });
        this.setState({ treeData });
    }
    onFilter (searchValue) {
        const { originData } = this.state;
        if (!searchValue) {
            this.setState({ treeData: _.cloneDeep(originData), searchValue, expandedKeys: [] });
        } else {
            const expandedKeys = [];
            const treeData = filterTree(_.cloneDeep(originData), searchValue, expandedKeys);
            this.setState({ treeData, searchValue, expandedKeys });
        }
    }
    onSearch (searchValue = '') {
        const { originData, expandedKeys, originExpandedKeys } = this.state;
        searchValue = searchValue.trim();
        if (!searchValue) {
            return this.setState({ treeData: _.cloneDeep(originData), searchValue: '', expandedKeys: originExpandedKeys });
        }
        this.setState({ waiting: true });
        apiQuery({
            fragments: {
                searchOrganizationTree: 1,
            },
            variables: {
                searchOrganizationTree: {
                    data: {
                        value: {
                            keyword: searchValue,
                            hasMember: this.props.hasMember,
                        },
                        type: 'JSON!',
                    },
                },
            },
        }, (result) => {
            const treeData = result.searchOrganizationTree.list || [];
            this.setState({ waiting: false, treeData, searchValue, originExpandedKeys: expandedKeys, expandedKeys: getAllExpandedKeys(treeData) });
        })();
    }
    onExpand (expandedKeys) {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    }
    update (id) {
        const { expandedKeys } = this.state;
        this.setState({
            expandedKeys: _.uniq([ ...expandedKeys, id ]),
            autoExpandParent: true,
        });
    }
    getNodeLoop (id, treeData = []) {
        for (const item of treeData) {
            if (item.id === id) {
                return item;
            }
            const parent = this.getNodeLoop(id, item.children);
            if (parent) {
                return parent;
            }
        }
    }
    getNode (id) {
        if (!id) {
            return undefined;
        }
        const { treeData } = this.state;
        return this.getNodeLoop(id, treeData);
    }
    loadData (node) {
        return new Promise(resolve => {
            if (node.props.children) {
                return resolve();
            }
            apiQuery({
                fragments: {
                    organizationTree: 1,
                },
                variables: {
                    organizationTree: {
                        data: {
                            value: {
                                parentId: node.props.parentId,
                                hasMember: this.props.hasMember,
                            },
                            type: 'JSON!',
                        },
                    },
                },
            }, (result) => {
                node.props.dataRef.children = result.organizationTree.list;
                this.setState({
                    originData: _.cloneDeep(this.state.treeData),
                });
                resolve();
            })();
        });
    }
    showTreeNode (parent, treeData = []) {
        const list = [];
        const { onSelect } = this.props;
        const { searchValue } = this.state;
        treeData.forEach(o => {
            const index = o.name.indexOf(searchValue);
            const beforeStr = o.name.substr(0, index);
            const afterStr = o.name.substr(index + searchValue.length);
            const title = index > -1 ? (
                <span style={{ display: 'flex', flexDirection: 'row', color: o.type === 'member' ? 'red' : undefined }}>
                    {
                        !!onSelect &&
                        <div style={{ paddingRight: 15, paddingLeft: 10 }} onClick={() => { this.onChange(o); }}>
                            <img style={{ width: 12, marginTop: 4 }} src={o.checked ? '/hbclient/img/common/select.png' : '/hbclient/img/common/un_select.png'} />
                        </div>
                    }
                    {beforeStr}
                    <span style={{ color: '#32CD32' }}>{searchValue}</span>
                    {afterStr}
                </span>
            ) : (
                <span style={{ display: 'flex', flexDirection: 'row', color: o.type === 'member' ? 'red' : undefined }}>
                    {
                        !!onSelect &&
                        <div style={{ paddingRight: 15, paddingLeft: 10 }} onClick={() => { this.onChange(o); }}>
                            <img style={{ width: 12, marginTop: 4 }} src={o.checked ? '/hbclient/img/common/select.png' : '/hbclient/img/common/un_select.png'} />
                        </div>
                    }
                    {o.name}
                </span>
            );
            if (o.children && o.children.length > 0) {
                list.push(
                    <TreeNode
                        title={<div style={{ display: 'flex', flexDirection: 'row' }} onClick={() => this.props.doPress && this.props.doPress(parent, o)}>{title}</div>}
                        key={o.id}
                        parentId={o.id}
                        dataRef={o}
                        >
                        { o.children && this.showTreeNode(o, o.children) }
                    </TreeNode>
                );
            } else {
                list.push(
                    <TreeNode
                        title={<div style={{ display: 'flex', flexDirection: 'row' }} onClick={() => this.props.doPress && this.props.doPress(parent, o)}>{title}</div>}
                        key={o.id}
                        parentId={o.id}
                        isLeaf={o.isLeaf}
                        dataRef={o}
                        />
                );
            }
        });
        return list;
    }
    render () {
        const { treeData, expandedKeys, autoExpandParent, waiting } = this.state;
        return (
            <div className={styles.organizationTree}>
                <Search enterButton className={styles.search} placeholder='输入关键字搜索' onSearch={::this.onSearch} />
                {
                    waiting &&
                    <div className={styles.spin}><Spin /></div>
                    ||
                    <Tree
                        onExpand={::this.onExpand}
                        expandedKeys={expandedKeys}
                        autoExpandParent={autoExpandParent}
                        className={styles.tree}
                        loadData={::this.loadData}>
                        { this.showTreeNode(null, treeData) }
                    </Tree>
                }
            </div>
        );
    }
}

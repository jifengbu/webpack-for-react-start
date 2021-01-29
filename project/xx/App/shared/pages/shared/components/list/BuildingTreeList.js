import React from 'react';
import { Tree, Input } from 'antd';
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

export default class TreeList extends React.Component {
    state = {
        treeData: [],
        searchValue: '',
        expandedKeys: [],
        autoExpandParent: true,
    }
    componentWillReceiveProps (nextProps) {
        const { treeData } = nextProps;
        if (!this.state.treeData.length) {
            this.setState({ treeData, originData: _.cloneDeep(treeData) });
        }
    }
    onSearch (searchValue) {
        const { originData } = this.state;
        if (!searchValue) {
            this.setState({ treeData: _.cloneDeep(originData), searchValue, expandedKeys: [] });
        } else {
            const expandedKeys = [];
            const treeData = filterTree(_.cloneDeep(originData), searchValue, expandedKeys);
            this.setState({ treeData, searchValue, expandedKeys });
        }
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
    loadData (node) {
        return new Promise(resolve => {
            if (node.props.children) {
                return resolve();
            }
            apiQuery({
                fragments: {
                    buildingTree: 1,
                },
                variables: {
                    buildingTree: {
                        data: {
                            value: {
                                parentId: node.props.parentId,
                                parentType: node.props.parentType,
                                selectType: this.props.selectType,
                            },
                            type: 'JSON!',
                        },
                    },
                },
            }, (result) => {
                node.props.dataRef.children = result.buildingTree.list;
                this.setState({
                    originData: _.cloneDeep(this.state.treeData),
                });
                resolve();
            })();
        });
    }
    showTreeNode (parent, treeData = []) {
        const list = [];
        const { searchValue } = this.state;
        treeData.forEach(o => {
            const index = o.name.indexOf(searchValue);
            const beforeStr = o.name.substr(0, index);
            const afterStr = o.name.substr(index + searchValue.length);
            const familyHolderName = o.familyHolderName;
            const familyHolderRelation = o.familyHolderRelation;
            const title = index > -1 ? (
                <span>
                    {beforeStr}
                    <span style={{ color: '#f50' }}>{searchValue}</span>
                    {afterStr}
                    {familyHolderName && `(${familyHolderName})`}
                    {familyHolderRelation && `(${familyHolderRelation})`}
                </span>
            ) : (
                <span>{o.name}{familyHolderName && `(${familyHolderName})`}{familyHolderRelation && `(${familyHolderRelation})`}</span>
            );
            if (o.children && o.children.length > 0) {
                list.push(
                    <TreeNode
                        title={<div onClick={() => this.props.doPress(parent, o)}>{title}</div>}
                        key={o.id}
                        parentId={o.id}
                        parentType={o.type}
                        dataRef={o}
                        >
                        { o.children && this.showTreeNode(o, o.children) }
                    </TreeNode>
                );
            } else {
                list.push(
                    <TreeNode
                        title={<div onClick={() => this.props.doPress(parent, o)}>{title}</div>}
                        key={o.id}
                        parentId={o.id}
                        parentType={o.type}
                        isLeaf={o.isLeaf}
                        dataRef={o}
                        />
                );
            }
        });
        return list;
    }
    render () {
        const { hasNoSearch } = this.props;
        const { treeData, expandedKeys, autoExpandParent } = this.state;
        return (
            <div className={styles.organizationTree}>
                { !hasNoSearch && <Search enterButton className={styles.search} placeholder='输入关键字搜索' onSearch={::this.onSearch} /> }
                <Tree
                    onExpand={::this.onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    className={styles.tree}
                    loadData={::this.loadData}>
                    { this.showTreeNode(null, treeData) }
                </Tree>
            </div>
        );
    }
}

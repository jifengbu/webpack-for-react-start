import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import { generateConnectorId } from '../helpers/connectors-ids';
import getVariables from '../helpers/get-variables';
import hoistStatics from 'hoist-non-react-statics';
import invariant from 'invariant';
import removeConnector from '../actions/remove-connector';
import _ from 'lodash';

const keepData = {};

export default function dataConnect (...args) {
    invariant(args.length, 'Relate: a dataConnect does not have arguments specified');

    const getReduxState = args.length > 1 && args[0];
    const getReduxDispatches = args.length > 2 && args[1];
    const getBundle = args[args.length - 1];

    return function wrapWithDataConnect (WrappedComponent) {
        class ConnectData extends Component {
            static propTypes = {
                relateConnectorData: PropTypes.object,
                CONNECTOR_ID: PropTypes.string.isRequired,
            };

            static contextTypes = {
                fetchData: PropTypes.func.isRequired,
                store: PropTypes.any.isRequired,
                relate_ssr: PropTypes.func,
            };

            static defaultProps = {
                relateConnectorData: {},
            };

            static relateIdentifier = 'DATA_CONNECT';

            constructor (props, context) {
                super(props, context);

                this.constructor.displayName = WrappedComponent.name;

                // Relate connector info
                this.relate = {
                    refresh: ::this.refresh,
                    loadMore: ::this.loadMore,
                    loadPage: ::this.loadPage,
                    resetPageAttribute () { this.__page = undefined; },
                    getPageAttribute (key) { return _.get(this, ['__page', key]); },
                    variables: {},
                    __page: props.__page,
                };

                // get bundle
                this.initialBundle = this.processBundle(props);
                if (!props.relateConnectorData || Object.keys(props.relateConnectorData).length === 0) {
                    this.initialHasDataToFetch = !!(
                        this.initialBundle &&
                        !this.initialBundle.manualLoad &&
                        this.hasDataToFetch(this.initialBundle.fragments)
                    );
                    if (this.context.relate_ssr) {
                        this.initialFetchData();
                    }
                    // Set initial state
                    this.state = {
                        loading: this.initialHasDataToFetch,
                        error: false,
                    };
                } else {
                    this.state = {
                        loading: false,
                        error: false,
                    };
                }
            }

            componentWillMount () {
                this.initialFetchData();
            }

            shouldComponentUpdate (nextProps, nextState) {
                return (
                    !this.state.loading ||
                    this.state.loading && !nextState.loading ||
                    this.state.error !== nextState.error
                );
            }

            componentWillUnmount () {
                if (!this.initialBundle && this.initialBundle.keepData) {
                    this.context.store.dispatch(removeConnector(this.props.CONNECTOR_ID));
                }
            }

            initialFetchData () {
                if (this.initialHasDataToFetch) {
                    this.fetchData({
                        fragments: this.initialBundle.fragments,
                        variables: this.initialBundle.initialVariables,
                        mutations: this.initialBundle.mutations,
                    });
                } else {
                    console.log(`[relatejs]: initialHasDataToFetch=${this.initialHasDataToFetch}`);
                }
            }

            /* 如果没有设置 property，则取 variables 的键值，如果不需要请求参数的时候使用 property ,需要的时候必须使用 variables
            * 不需要参数的情况
            * relate.refresh({
            *     property: 'personal',
            * });
            *
            * 要参数的情况
            * relate.refresh({
            *     variables: {
            *         clients: {
            *             pageNo: 0,
            *             pageSize,
            *             keyword,
            *         },
            *     },
            * });
            */
            refresh ({ variables, property, callback }) {
                const properties = [...(variables ? _.keys(variables) : []), ...(_.isArray(property) ? property : [property])];
                const bundle = this.processBundle(this.props, variables);

                // Fetch data
                if (bundle) {
                    this.setState({
                        loading: true,
                    }, () => {
                        this.fetchData({
                            fragments: _.pick(bundle.fragments, properties),
                            variables,
                            mutations: bundle.mutations,
                            callback,
                        });
                    });
                }
            }

            // 适合做上拉加载更多的列表
            loadMore ({ variables, property, callback }) {
                const key = _.keys(variables)[0];
                const bundle = this.processBundle(this.props, variables);
                // Fetch data
                if (bundle && !this.lock) {
                    this.lock = true;
                    this.setState({
                        loading: true,
                        loadingMore: true,
                    }, () => {
                        this.fetchData({
                            fragments: _.pick(bundle.fragments, key),
                            variables,
                            mutations: bundle.mutations,
                            loadingMoreProperty: property || true,
                            callback,
                        });
                    });
                }
            }

            // 适合做分页的表格
            loadPage ({ variables, property, callback }) {
                const key = _.keys(variables)[0];
                const bundle = this.processBundle(this.props, variables);
                const pageNo = variables[key].pageNo === undefined ? variables[key].data.pageNo : variables[key].pageNo;
                const pageSize = variables[key].pageSize === undefined ? variables[key].data.pageSize : variables[key].pageSize;
                // Fetch data
                if (bundle && !this.lock) {
                    this.lock = true;
                    this.setState({
                        loadingPage: true,
                    }, () => {
                        this.fetchData({
                            fragments: _.pick(bundle.fragments, key),
                            variables,
                            mutations: bundle.mutations,
                            loadingPageProperty: property || true,
                            loadingPageStartIndex: pageNo * pageSize,
                            callback,
                        });
                    });
                }
            }

            hasDataToFetch (fragments) {
                return typeof fragments === 'object' && Object.keys(fragments).length > 0;
            }

            processBundle (props, variables) {
                const bundle = getBundle && getBundle(props);

                this.variablesTypes = bundle && bundle.variablesTypes || {};
                this.relate.variables = variables || bundle && bundle.initialVariables || {};

                return bundle;
            }

            fetchData ({ fragments, variables, mutations, loadingMoreProperty = false, loadingPageProperty = false, loadingPageStartIndex = 0, callback }) {
                console.log('[relatejs] fetchData:', { fragments, variables, mutations, loadingMoreProperty, loadingPageProperty, loadingPageStartIndex });
                const { fetchData } = this.context;
                if (fetchData && this.hasDataToFetch(fragments)) {
                    const fetchOptions = {
                        fragments,
                        variables: getVariables({
                            variables,
                            variablesTypes: this.variablesTypes,
                            fragments,
                            displayName: typeof WrappedComponent !== 'undefined' && WrappedComponent.displayName,
                        }),
                        ID: this.props.CONNECTOR_ID,
                        mutations,
                        loadingMoreProperty,
                        loadingPageProperty,
                        loadingPageStartIndex,
                    };
                    if (this.context.relate_ssr) {
                        fetchData(fetchOptions);
                    } else {
                        fetchData(fetchOptions)
                        .then((data) => {
                            callback && callback(data);
                            const { loadingMore } = this.state;
                            if (loadingMoreProperty && loadingMore) {
                                const key = _.keys(variables)[0];
                                const pageNo = variables[key].pageNo === undefined ? variables[key].data.pageNo : variables[key].pageNo;
                                const pageSize = variables[key].pageSize === undefined ? variables[key].data.pageSize : variables[key].pageSize;
                                if (loadingMoreProperty === true) {
                                    const item = data[key];
                                    if (item) {
                                        _.set(this.relate, ['__page', 'default'], { hasMore: item.length >= pageSize, pageNo });
                                    }
                                } else {
                                    const item = _.get(data[key], loadingMoreProperty);
                                    if (item) {
                                        _.set(this.relate, ['__page', loadingMoreProperty], { hasMore: item.length >= pageSize, pageNo });
                                    }
                                }
                            }

                            this.setState({
                                loading: false,
                                loadingMore: false,
                                loadingPage: false,
                                error: false,
                            });

                            this.lock = false;
                        })
                        .catch(() => {
                            this.setState({
                                loading: false,
                                loadingMore: false,
                                loadingPage: false,
                                error: true,
                            });
                        });
                    }
                } else {
                    if (!this.context.relate_ssr) {
                        this.setState({
                            loading: false,
                            loadingMore: false,
                            loadingPage: false,
                            error: false,
                        });
                    }
                }
            }

            render () {
                const { relateConnectorData, ...otherProps } = this.props;
                const { loading, loadingMore, loadingPage } = this.state;
                return (
                    <WrappedComponent
                        {...otherProps}
                        {...relateConnectorData}
                        relate={this.relate}
                        loading={loading}
                        loadingMore={loadingMore}
                        loadingPage={loadingPage}
                        />
                );
            }
        }

        const Connected = connect(
            () => function map (state, props) {
                const refuxProps = getReduxState && getReduxState(state, props) || {};
                if (!this.CONNECTOR_ID) {
                    const finalProps = Object.assign({}, props, refuxProps);
                    const initialBundle = getBundle && getBundle(finalProps) || {};
                    const variables = getVariables({
                        variables: initialBundle.initialVariables,
                        variablesTypes: initialBundle.variablesTypes,
                        fragments: initialBundle.fragments,
                    });
                    const _compare = {
                        fragments: initialBundle.fragments,
                        variables,
                    };
                    if (state.relateReducer.server) {
                        _.forEach(state.relateReducer.server, (compare, id) => {
                            if (_.isEqual(compare, _compare)) {
                                this.CONNECTOR_ID = id;
                                return false;
                            }
                            return true;
                        });
                    }
                    if (!this.CONNECTOR_ID) {
                        if (initialBundle.keepData) {
                            _.forEach(keepData, (compare, id) => {
                                if (_.isEqual(compare, _compare)) {
                                    this.CONNECTOR_ID = id;
                                    return false;
                                }
                                return true;
                            });
                            if (!this.CONNECTOR_ID) {
                                this.CONNECTOR_ID = generateConnectorId();
                            }
                            keepData[this.CONNECTOR_ID] = _compare;
                        } else {
                            this.CONNECTOR_ID = generateConnectorId();
                        }
                    }
                }
                return Object.assign(
                    refuxProps,
                    {
                        relateConnectorData: state.relateReducer[this.CONNECTOR_ID],
                        CONNECTOR_ID: this.CONNECTOR_ID,
                    },
                );
            },
            (dispatch) => Object.assign(
                getReduxDispatches && getReduxDispatches(dispatch) || {},
                {
                    removeConnector: dispatch(removeConnector),
                }
            )
        )(ConnectData);

        return hoistStatics(Connected, WrappedComponent, {
            relateIdentifier: true,
        });
    };
}

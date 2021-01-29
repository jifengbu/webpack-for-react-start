import _ from 'lodash';

export default class Connectors {
    constructor () {
        this.connectors = {};
    }

    connectorExists (connectorId) {
        return this.connectors[connectorId] && true;
    }

    generateConnectorData (connectorId) {
        const connector = this.connectors[connectorId];
        return connector.data;
    }

    // Process a query through the connectors that requested it
    processConnectors (queryConnectors, queryName, relativeNodes) {
        console.log('[relatejs]: processConnectors', { queryConnectors, queryName, relativeNodes });
        _.forEach(queryConnectors, (connectorQuery, connectorId) => {
            // Check if queryName is a scoped one
            const actualQueryName = connectorQuery.scopes && connectorQuery.scopes[queryName] || queryName;
            const isInConnectorFragments = connectorQuery.fragments[actualQueryName] && true;
            const isScopedQuery = actualQueryName !== queryName;
            const scopedOther =
            !isScopedQuery && // is not a scoped query
            connectorQuery.scopes && // has scopes
            _.values(connectorQuery.scopes).indexOf(actualQueryName) !== -1; // query has not been scoped

            // check if query was triggered by this connector
            // 1st case for scoped queries
            // 2nd case for non scope queries (they cannot be a value in scope)
            if ((isInConnectorFragments && isScopedQuery) ||
            (isInConnectorFragments && !isScopedQuery && !scopedOther)) {
                this.connectors[connectorId] = this.connectors[connectorId] || {
                    data: {},
                    fragments: {},
                    mutations: {},
                };
                const conn = this.connectors[connectorId];
                const { loadingMoreProperty, loadingPageProperty } = connectorQuery;
                // Add query data
                if (loadingMoreProperty) {
                    if (loadingMoreProperty === true) {
                        conn.data[actualQueryName] = [...conn.data[actualQueryName], ...relativeNodes];
                    } else {
                        _.set(conn.data[actualQueryName], loadingMoreProperty, [..._.get(conn.data[actualQueryName], loadingMoreProperty), ..._.get(relativeNodes, loadingMoreProperty)]);
                    }
                } else if (loadingPageProperty) {
                    let index = connectorQuery.loadingPageStartIndex;
                    if (loadingPageProperty === true) {
                        const list = conn.data[actualQueryName] || [];
                        _.forEach(relativeNodes, (item) => {
                            list[index++] = item;
                        });
                        for (let i = 0; i < index; i++) {
                            if (list[i] === undefined) {
                                list[i] = false;
                            }
                        }
                        conn.data[actualQueryName] = list;
                    } else {
                        const list = _.get(conn.data[actualQueryName], loadingPageProperty) || [];
                        _.forEach(_.get(relativeNodes, loadingPageProperty), (item) => {
                            list[index++] = item;
                        });
                        for (let i = 0; i < index; i++) {
                            if (list[i] === undefined) {
                                list[i] = false;
                            }
                        }
                        _.set(conn.data[actualQueryName], loadingPageProperty, list);
                    }
                } else {
                    Object.assign(conn.data, { [actualQueryName]: relativeNodes });
                }

                // fragments
                Object.assign(conn.fragments, {
                    [actualQueryName]: connectorQuery.fragments[actualQueryName],
                });

                // mutations listeners
                conn.mutations = connectorQuery.mutations || {};
            }
        });
    }

    // Check if any connector is listening to the mutation passed as argument
    checkMutationListeners (mutationName, relativeNodes) {
        const connsToUpdate = [];
        console.log('[relatejs]: checkMutationListeners', { mutationName, relativeNodes, connectors: this.connectors });
        _.forEach(this.connectors, (connector, connectorId) => {
            const mutation = connector.mutations && connector.mutations[mutationName];
            if (mutation && mutation.constructor === Function) {
                connsToUpdate.push(connectorId);
                mutation({ state: connector.data, data: relativeNodes, connector, _ });
            }
        });
        return connsToUpdate;
    }

    deleteConnector (connectorId) {
        this.connectors[connectorId] && delete this.connectors[connectorId];
    }
}

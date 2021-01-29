import invariant from 'invariant';
import q from 'q';
import React from 'react';

import { resetConnectorsIds } from '../helpers/connectors-ids';

function processElement ({ element, context, rootDataConnectors, dataConnectors }) {
    try {
        if (element !== null) {
            const { props, type } = element;
            if (typeof type === 'function') {
                const ElementClass = element.type;
                let finalProps = props;
                if (ElementClass.defaultProps) {
                    finalProps = Object.assign({}, ElementClass.defaultProps, props);
                }
                // console.log("=============1", element);
                // console.log("=============2", ElementClass);
                const Element = new ElementClass(
                    finalProps,
                    context
                );

                if (type.relateIdentifier === 'ROOT_DATA_CONNECT') {
                    rootDataConnectors.push(Element);
                } else if (type.relateIdentifier === 'DATA_CONNECT') {
                    dataConnectors.push(Element);
                }

                // Generate context for children
                let newContext = context;
                if (Element.getChildContext) {
                    newContext = Object.assign({}, context, Element.getChildContext());
                }
                // console.log("=============3", !!Element.render);
                // go through children
                const renderResult = Element.render ? Element.render() : ElementClass(finalProps, context);
                // console.log("=============4", renderResult);
                processElement({
                    element: renderResult,
                    context: newContext,
                    rootDataConnectors,
                    dataConnectors,
                });
            } else if (props && props.children) {
                React.Children.forEach(props.children, (childElement) => {
                    processElement({
                        element: childElement,
                        context,
                        rootDataConnectors,
                        dataConnectors,
                    });
                });
            }
        }
    } catch (err) {
        console.log('=============5', err);
        invariant(false, 'Relate: error traversing components tree');
    }
}

export default function getAllDataDependencies (rootElement, getData) {
    const rootDataConnectors = [];
    const dataConnectors = [];

    // Ensure connectors ids are reset
    resetConnectorsIds('server_');

    // traverse tree
    processElement({
        element: rootElement,
        context: {
            relate_ssr: getData,
        },
        rootDataConnectors,
        dataConnectors,
    });

    // fetch data for each root data connector
    return q()
    .then(() => {
        let result;

        if (rootDataConnectors.length) {
            result = rootDataConnectors[0].fetchData();
        } else {
            result = null;
        }

        return result;
    })
    .then(() => resetConnectorsIds())
    .catch(() => {
        invariant(false, 'Relate: error getting data');
    });
}

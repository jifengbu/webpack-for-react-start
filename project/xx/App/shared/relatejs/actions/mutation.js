import invariant from 'invariant';
import { buildQueryAndVariables } from '../helpers/fragments';

import actionTypes from './types';
import request from '../helpers/request';

export default function (options, callback = false) {
    return (dispatch, getState) => {
        invariant(options.fragments, 'Relate: Mutation needs fragments defined');

        const mutation = buildQueryAndVariables(options.fragments, options.variables, 'mutation');
        const { headers, body, withCredentials } = getState().relateReducer;
        return request({
            dispatch,
            type: actionTypes.mutation,
            query: mutation.query,
            variables: mutation.variables,
            fragments: options.fragments,
            headers: options.headers || headers,
            body: options.body || body,
            withCredentials,
        }).then((result) => {
            if (callback !== false) {
                callback(result, dispatch);
            }
        });
    };
}

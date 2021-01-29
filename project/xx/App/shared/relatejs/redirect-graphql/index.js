import { buildQueryAndVariables } from '../helpers/fragments';
import request from '../helpers/request';

const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
};

export function apiQuery (options, callback) {
    const mutation = buildQueryAndVariables(options.fragments, options.variables, 'query');
    const params = { ...mutation, headers };
    return () => {
        return request(params).then(({ data }) => {
            callback(data);
        });
    };
}

export function apiMutation (options, callback) {
    const mutation = buildQueryAndVariables(options.fragments, options.variables, 'mutation');
    const params = { ...mutation, headers };
    return () => {
        return request(params).then(({ data }) => {
            callback(data);
        });
    };
}

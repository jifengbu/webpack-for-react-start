import { mutation } from 'relatejs';

export function createRole (data, callback) {
    return (dispatch, getState) => {
        return mutation({
            fragments: { createRole: 1 },
            variables: { createRole: { data: { value: data, type: 'JSON!' } } },
        }, (result) => {
            callback(result.createRole);
        })(dispatch, getState);
    };
}
export function modifyRole (data, callback) {
    return (dispatch, getState) => {
        return mutation({
            fragments: { modifyRole: 1 },
            variables: { modifyRole: { data: { value: data, type: 'JSON!' } } },
        }, (result) => {
            callback(result.modifyRole);
        })(dispatch, getState);
    };
}
export function removeRole (roleId, password, callback) {
    return (dispatch, getState) => {
        return mutation({
            fragments: { removeRole: 1 },
            variables: { removeRole: { data: { value: { roleId, password }, type: 'JSON!' } } },
        }, (result) => {
            callback(result.removeRole);
        })(dispatch, getState);
    };
}

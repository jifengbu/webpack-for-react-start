import { mutation } from 'relatejs';

export function createOrganization (data, callback) {
    return (dispatch, getState) => {
        return mutation({
            fragments: { createOrganization: 1 },
            variables: { createOrganization: { data: { value: data, type: 'JSON!' } } },
        }, (result) => {
            callback(result.createOrganization);
        })(dispatch, getState);
    };
}

export function modifyOrganization (data, callback) {
    return (dispatch, getState) => {
        return mutation({
            fragments: { modifyOrganization: 1 },
            variables: { modifyOrganization: { data: { value: data, type: 'JSON!' } } },
        }, (result) => {
            callback(result.modifyOrganization);
        })(dispatch, getState);
    };
}
export function removeOrganization (organizationId, password, callback) {
    return (dispatch, getState) => {
        return mutation({
            fragments: { removeOrganization: 1 },
            variables: { removeOrganization: { data: { value: { organizationId, password }, type: 'JSON!' } } },
        }, (result) => {
            callback(result.removeOrganization);
        })(dispatch, getState);
    };
}

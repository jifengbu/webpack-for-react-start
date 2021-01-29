import { mutation } from 'relatejs';

export function createMember (data, callback) {
    return (dispatch, getState) => {
        return mutation({
            fragments: { createMember: 1 },
            variables: { createMember: { data: { value: data, type: 'JSON!' } } },
        }, (result) => {
            callback(result.createMember);
        })(dispatch, getState);
    };
}
export function modifyMember (data, callback) {
    return (dispatch, getState) => {
        return mutation({
            fragments: { modifyMember: 1 },
            variables: { modifyMember: { data: { value: data, type: 'JSON!' } } },
        }, (result) => {
            callback(result.modifyMember);
        })(dispatch, getState);
    };
}
export function removeMember (memberId, password, callback) {
    return (dispatch, getState) => {
        return mutation({
            fragments: { removeMember: 1 },
            variables: { removeMember: { data: { value: { memberId, password }, type: 'JSON!' } } },
        }, (result) => {
            callback(result.removeMember);
        })(dispatch, getState);
    };
}
export function modifyMemberPassword (data, callback) {
    return (dispatch, getState) => {
        return mutation({
            fragments: { modifyMemberPassword: 1 },
            variables: { modifyMemberPassword: { data: { value: data, type: 'JSON!' } } },
        }, (result) => {
            callback(result.modifyMemberPassword);
        })(dispatch, getState);
    };
}

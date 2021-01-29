import { apiQuery, apiMutation, mutation } from 'relatejs';

export function getVerifyCode (email, callback) {
    return () => {
        return apiQuery({
            fragments: { getVerifyCode: 1 },
            variables: { getVerifyCode: { data: { value: { email }, type: 'JSON!' } } },
        }, (result) => {
            callback(result.getVerifyCode);
        })();
    };
}
export function login (data, callback) {
    return () => {
        return apiQuery({
            fragments: { login: 1 },
            variables: { login: { data: { value: data, type: 'JSON!' } } },
        }, (result) => {
            callback(result.login);
        })();
    };
}
export function forgotPwd (data, callback) {
    return () => {
        return apiMutation({
            fragments: { forgotPwd: 1 },
            variables: { forgotPwd: { data: { value: data, type: 'JSON!' } } },
        }, (result) => {
            callback(result.forgotPwd);
        })();
    };
}
export function feedback (data, callback) {
    return () => {
        return apiMutation({
            fragments: { feedback: 1 },
            variables: { feedback: { data: { value: data, type: 'JSON!' } } },
        }, (result) => {
            callback(result.feedback);
        })();
    };
}
export function modifyPersonalInfo (data, callback) {
    return (dispatch, getState) => {
        return mutation({
            fragments: { modifyPersonalInfo: 1 },
            variables: { modifyPersonalInfo: { data: { value: data, type: 'JSON!' } } },
        }, (result) => {
            callback(result.modifyPersonalInfo);
        })(dispatch, getState);
    };
}
export function modifyPassword (data, callback) {
    return (dispatch, getState) => {
        return mutation({
            fragments: { modifyPassword: 1 },
            variables: { modifyPassword: { data: { value: data, type: 'JSON!' } } },
        }, (result) => {
            callback(result.modifyPassword);
        })(dispatch, getState);
    };
}

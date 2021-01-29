import { mutation } from 'relatejs';

export function readNotify (notifyId, callback) {
    return (dispatch, getState) => {
        return mutation({
            fragments: { readNotify: 1 },
            variables: { readNotify: { data: { value: { notifyId }, type: 'JSON!' } } },
        }, (result) => {
            callback(result.readNotify);
        })(dispatch, getState);
    };
}

export function removeNotify (notifyId, callback) {
    return (dispatch, getState) => {
        return mutation({
            fragments: { removeNotify: 1 },
            variables: { removeNotify: { data: { value: { notifyId }, type: 'JSON!' } } },
        }, (result) => {
            callback(result.removeNotify);
        })(dispatch, getState);
    };
}

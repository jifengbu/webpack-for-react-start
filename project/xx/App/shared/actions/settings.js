import { mutation } from 'relatejs';

export function modifySettingInfo (data, callback) {
    return (dispatch, getState) => {
        return mutation({
            fragments: { modifySettingInfo: 1 },
            variables: { modifySettingInfo: { data: { value: data, type: 'JSON!' } } },
        }, (result) => {
            callback(result.modifySettingInfo);
        })(dispatch, getState);
    };
}

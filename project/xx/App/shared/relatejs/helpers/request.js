import request from 'superagent';
import _ from 'lodash';
import Q from 'q';

let hasShow = false;
function omitAll (obj) {
    if (_.isPlainObject(obj)) {
        return _.mapValues(obj, (o) => omitAll(o));
    } else if (_.isArray(obj)) {
        return _.map(obj, (o) => omitAll(o));
    } else if (obj === null) {
        return undefined;
    }
    return obj;
}
export default function doRequest ({ dispatch, query, variables, type, headers, body, ...params }) {
    console.log('[relatejs]: doRequest', { dispatch, query, variables, type, headers, body, ...params });
    return new Q()
    .then(() => {
        const deferred = Q.defer();
        let promise = deferred.promise;

        const dataObj = { query, variables, ...body, __SUPER_AUTHORIZATION__: window.__SUPER_AUTHORIZATION__ };
        const payload =
        headers['Content-Type'] === 'text/plain' ?
        JSON.stringify(dataObj) :
        dataObj;

        const req = request
        .post('/hbclient/graphql')
        .set(headers)
        .send(payload);

        if (params.withCredentials) {
            req.withCredentials();
        }

        req
        .end((error, res) => {
            if (error) {
                console.error('[relatejs]:', res && res.text);
                deferred.reject(error);
            } else {
                const data = omitAll(res.body);
                console.log('[relatejs]: body', data);
                const { errors } = data;
                const invalidToken = _.find(errors, (item) => /^invalidToken#/.test(item.message));
                const unauthorized = _.find(errors, (item) => item.message === 'unauthorized');
                if (errors && errors.length && (invalidToken || unauthorized)) {
                    if (!hasShow) {
                        hasShow = true;
                        if (invalidToken) {
                            window.alert(invalidToken.message.replace(/^invalidToken#/, ''));
                        } else {
                            window.alert('登录超时请重新登录');
                        }
                        window.location.href = '/hbclient/logout';
                        hasShow = false;
                    }
                } else {
                    deferred.resolve(data);
                }
            }
        });

        if (dispatch) {
            console.log('[relatejs]: start dispatch');
            promise = promise.then(({ data, errors }) => {
                console.log('[relatejs]: dispatch', { type, data, errors, ...params });
                dispatch({ type, data, errors, ...params });
                return data;
            });
        }

        return promise;
    });
}

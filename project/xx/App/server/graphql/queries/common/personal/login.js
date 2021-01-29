import GraphQLJSON from 'graphql-type-json';
import passport from 'passport';

export default {
    type: GraphQLJSON,
    args: { data: { type: GraphQLJSON } },
    async resolve (root, { data }, options) {
        return new Promise((resolve) => {
            const { req } = root;
            req.body = data;
            console.log('[login]: start', data);
            passport.authenticate('local', (err, user) => {
                console.log('[login]: authenticate', err, user);
                if (err) {
                    resolve({ msg: err.message });
                } else {
                    req.logIn(user, (error) => {
                        console.log('[login] logIn:', error);
                        if (error) {
                            resolve({ msg: '服务器错误' });
                        } else {
                            resolve({ success: true });
                        }
                    });
                }
            })(req);
        });
    },
};

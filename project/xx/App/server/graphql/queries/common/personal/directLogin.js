import GraphQLJSON from 'graphql-type-json';
import { post, urls } from 'helpers/api';

export default {
    type: GraphQLJSON,
    args: { data: { type: GraphQLJSON } },
    async resolve (root, { data }, options) {
        const ret = await post(urls.login, data, root) || {};
        return ret.context || {};
    },
};

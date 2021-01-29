import GraphQLJSON from 'graphql-type-json';
import { post, urls } from 'helpers/api';

export default {
    type: GraphQLJSON,
    args: { data: { type: GraphQLJSON } },
    async resolve (root, { data }, options) {
        return await post(urls.feedback, data, root) || { msg: '服务器错误' };
    },
};

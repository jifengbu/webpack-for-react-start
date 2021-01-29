import GraphQLJSON from 'graphql-type-json';
import { authorize } from '../../../authorize';
import { post, urls } from 'helpers/api';

export default {
    type: GraphQLJSON,
    args: { data: { type: GraphQLJSON } },
    async resolve (root, { data }, options) {
        authorize(root);
        return await post(urls.removeRole, data, root) || { msg: '服务器错误' };
    },
};

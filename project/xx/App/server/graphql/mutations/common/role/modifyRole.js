import GraphQLJSON from 'graphql-type-json';
import { authorize } from '../../../authorize';
import { post, urls } from 'helpers/api';

export default {
    type: GraphQLJSON,
    args: { data: { type: GraphQLJSON } },
    async resolve (root, { data }, options) {
        authorize(root);
        const ret = await post(urls.modifyRole, data, root);
        if (!ret) {
            return { msg: '服务器错误' };
        }
        return ret;
    },
};

import GraphQLJSON from 'graphql-type-json';
import { authorize } from '../../../authorize';
import { post, urls } from 'helpers/api';

export default {
    type: GraphQLJSON,
    args: { data: { type: GraphQLJSON } },
    async resolve (root, { data }, options) {
        authorize(root);
        const ret = await post(urls.addressFromLastCode, { ...data, type: 0 }, root) || {};
        return ret.success ? ret.context.addressList : [];
    },
};

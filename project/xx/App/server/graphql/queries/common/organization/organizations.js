import GraphQLJSON from 'graphql-type-json';
import { authorize } from '../../../authorize';
import { post, urls } from 'helpers/api';

export default {
    type: GraphQLJSON,
    args: { data: { type: GraphQLJSON } },
    async resolve (root, { data }, options) {
        authorize(root);
        const ret = await post(urls.organizations, data, root) || {};
        return ret.context || {};
    },
};

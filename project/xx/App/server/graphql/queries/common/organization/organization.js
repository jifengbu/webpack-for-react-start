import GraphQLJSON from 'graphql-type-json';
import { authorize } from '../../../authorize';
import { post, urls } from 'helpers/api';

export default {
    type: GraphQLJSON,
    args: { data: { type: GraphQLJSON } },
    async resolve (root, { data }, options) {
        authorize(root);
        if (!data.organizationId) {
            return undefined;
        }
        const ret = await post(urls.organization, data, root) || {};
        return ret.success ? ret.context : undefined;
    },
};

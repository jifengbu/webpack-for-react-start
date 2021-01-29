import { authorize } from '../../../authorize';
import GraphQLJSON from 'graphql-type-json';
import { post, urls } from 'helpers/api';

export default {
    type: GraphQLJSON,
    async resolve (root, params, options) {
        authorize(root);
        const ret = await post(urls.personal, params, root) || {};
        return ret.context || {};
    },
};

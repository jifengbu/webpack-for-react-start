import {
    GraphQLInt,
} from 'graphql';
import { authorize } from '../../../authorize';
import { post, urls } from 'helpers/api';

export default {
    type: GraphQLInt,
    async resolve (root, params, options) {
        authorize(root);
        const ret = await post(urls.notifyCount, params, root) || {};
        return ret.success ? ret.context.count : undefined;
    },
};

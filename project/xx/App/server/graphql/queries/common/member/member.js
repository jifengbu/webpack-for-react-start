import GraphQLJSON from 'graphql-type-json';
import { authorize } from '../../../authorize';
import { post, urls } from 'helpers/api';

export default {
    type: GraphQLJSON,
    args: { data: { type: GraphQLJSON } },
    async resolve (root, { data }, options) {
        authorize(root);
        let url = urls.member;
        if (data.name) {
            url = urls.getMemberByName;
        } else if (data.phone) {
            url = urls.getMemberByPhone;
        }
        const ret = await post(urls.member, data, root) || {};
        return ret.success ? ret.context : undefined;
    },
};

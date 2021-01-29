import _ from 'lodash';
import {
    GraphQLObjectType,
    GraphQLSchema,
} from 'graphql';

import mutations from './graphql/mutations';
import queries from './graphql/queries';

class SchemaManager {
    constructor () {
        this.init();
    }

    async init () {
        this.queryFields = _.clone(queries);
        this.mutationFields = _.clone(mutations);

        this.rootQuery = new GraphQLObjectType({
            name: 'Query',
            fields: () => (this.queryFields),
        });
        this.rootMutation = new GraphQLObjectType({
            name: 'Mutation',
            fields: () => (this.mutationFields),
        });
    }

    getSchema () {
        const schema = {
            query: this.rootQuery,
        };

        if (Object.keys(this.mutationFields).length) {
            schema.mutation = this.rootMutation;
        }
        return new GraphQLSchema(schema);
    }
}

export default new SchemaManager();

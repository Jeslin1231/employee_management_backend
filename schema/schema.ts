import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';
import { MutationTokenType } from './token';

const Message = new GraphQLObjectType({
  name: 'Message',
  fields: {
    message: { type: GraphQLString },
    name: { type: GraphQLString },
  },
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      hello: {
        type: Message,
        resolve: () => ({
          message: 'Hello world',
          name: 'John Doe',
        }),
      },
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      Token: {
        type: MutationTokenType,
        resolve: () => ({}),
      },
    },
  }),
});

export default schema;

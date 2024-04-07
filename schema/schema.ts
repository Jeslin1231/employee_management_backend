import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';
import { createToken } from './token';

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
      createToken: createToken,
    },
  }),
});

export default schema;

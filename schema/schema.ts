import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';
import { checkToken, createToken } from './token';
import { register } from './auth';

const Message = new GraphQLObjectType({
  name: 'Hello',
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
      checkToken: checkToken,
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createToken: createToken,
      register: register,
    },
  }),
});

export default schema;

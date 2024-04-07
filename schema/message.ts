import { GraphQLString, GraphQLObjectType } from 'graphql';

export const MessageType = new GraphQLObjectType({
  name: 'Message',
  fields: {
    api: { type: GraphQLString },
    type: { type: GraphQLString },
    message: { type: GraphQLString },
  },
});

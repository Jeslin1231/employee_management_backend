import { GraphQLObjectType, GraphQLString } from 'graphql';
import Token from '../model/token';
import jwt from 'jsonwebtoken';

const TokenType = new GraphQLObjectType({
  name: 'Token',
  fields: {
    email: { type: GraphQLString },
    token: { type: GraphQLString },
  },
});

const MutationTokenType = new GraphQLObjectType({
  name: 'MutationToken',
  fields: {
    createToken: {
      type: TokenType,
      args: {
        email: { type: GraphQLString },
      },
      resolve: async (parent, args) => {
        const { email } = args;
        const token = jwt.sign({ email }, process.env.SECRET || '');
        await Token.create({ email, token });
        return { email, token };
      },
    },
  },
});

export { TokenType, MutationTokenType };

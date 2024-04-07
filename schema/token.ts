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

interface CreateTokenArgs {
  email: string;
}

const createTokenResolver = async (_: any, args: CreateTokenArgs) => {
  const { email } = args;
  const token = jwt.sign({ email }, process.env.SECRET || '');
  await Token.create({ email, token });
  return { email, token };
};

export const createToken = {
  type: TokenType,
  args: {
    email: { type: GraphQLString },
  },
  resolve: createTokenResolver,
};

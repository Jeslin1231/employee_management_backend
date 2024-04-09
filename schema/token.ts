import { GraphQLObjectType, GraphQLString } from 'graphql';
import Token from '../model/token';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from './error';
import { MessageType } from './message';

const TokenType = new GraphQLObjectType({
  name: 'Token',
  fields: {
    email: { type: GraphQLString },
    token: { type: GraphQLString },
  },
});

const createTokenResolver = async (_: any, args: { email: string }) => {
  const { email } = args;
  const token = jwt.sign({ email }, process.env.SECRET || '', {
    expiresIn: 180,
  });
  const tokenModel = await Token.findOne({ email });
  if (tokenModel) {
    await tokenModel.updateOne({ token, createdAt: new Date() });
  } else {
    const newToken = new Token({ email, token });
    await newToken.save();
  }
  return { email, token };
};

export const createToken = {
  type: TokenType,
  args: {
    email: { type: GraphQLString },
  },
  resolve: createTokenResolver,
};

const checkTokenResolver = async (_: any, args: { token: string }) => {
  const { token } = args;
  const tokenModel = await Token.findOne({ token });
  if (!tokenModel) {
    throw new UnauthorizedError(
      'Invalid registration token',
      'INVALID_REGISTRATION_TOKEN',
    );
  } else {
    try {
      jwt.verify(token, process.env.SECRET || '');
    } catch (error) {
      throw new UnauthorizedError(
        'Invalid registration token',
        'INVALID_REGISTRATION_TOKEN',
      );
    }
    return {
      api: 'checkToken',
      type: 'query',
      status: 'success',
      message: 'Token is valid',
    };
  }
};

export const checkToken = {
  type: MessageType,
  args: {
    token: { type: GraphQLString },
  },
  resolve: checkTokenResolver,
};

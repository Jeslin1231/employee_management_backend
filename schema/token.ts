import { GraphQLObjectType, GraphQLString } from 'graphql';
import Token from '../model/token';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from './error';
import { MessageType } from './message';
import User from '../model/user';

const TokenType = new GraphQLObjectType({
  name: 'Token',
  fields: {
    email: { type: GraphQLString },
    token: { type: GraphQLString },
  },
});

const createTokenResolver = async (
  _: any,
  args: { email: string },
  context: any,
) => {
  if (!context.authorized) {
    throw new UnauthorizedError('Unauthorized access', 'UNAUTHORIZED_ACCESS');
  }
  const user = await User.findOne({ _id: context.userId });
  if (!user) {
    throw new UnauthorizedError('Unauthorized access', 'UNAUTHORIZED_ACCESS');
  }
  if (user.role !== 'hr') {
    throw new UnauthorizedError('Unauthorized access', 'UNAUTHORIZED_ACCESS');
  }

  const { email } = args;
  const token = jwt.sign({ email }, process.env.SECRET || '', {
    expiresIn: 180,
  });
  const URL = `${process.env.client_URL}/register/${token}`;
  const tokenModel = await Token.findOne({ email });
  if (tokenModel) {
    await tokenModel.updateOne({ URL, token, createdAt: new Date() });
  } else {
    const newToken = new Token({ email, token, URL });
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

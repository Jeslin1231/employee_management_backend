import { GraphQLString } from 'graphql';
import { MessageType } from './message';
import { InternalServerError, InvalidInputError } from './error';
import Auth from '../model/auth';
import { cryptPassword } from './password';

interface SignupArgs {
  username: string;
  email: string;
  password: string;
}

const RegisterResolver = async (_: any, args: SignupArgs) => {
  const { username, email, password } = args;
  const encryptedPassword = await cryptPassword(password);

  const existedUsername = await Auth.findOne({ username });
  if (existedUsername) {
    throw new InvalidInputError('Username already existed', 'username');
  }

  const existedEmail = await Auth.findOne({ email });
  if (existedEmail) {
    throw new InvalidInputError('Email already existed', 'email');
  }

  try {
    const auth = new Auth({ username, email, password: encryptedPassword });
    await auth.save();
    return { api: 'signup', type: 'mutation', message: 'User created' };
  } catch (error) {
    throw new InternalServerError('Failed to create user');
  }
};

export const register = {
  type: MessageType,
  args: {
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  resolve: RegisterResolver,
};

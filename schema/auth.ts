import { GraphQLString, GraphQLObjectType } from 'graphql';
import { MessageType } from './message';
import { InternalServerError, InvalidInputError } from './error';
import Auth from '../model/auth';
import { comparePassword, cryptPassword } from './password';
import jwt from 'jsonwebtoken';

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
    return { api: 'register', type: 'mutation', message: 'User created' };
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

interface LoginArgs {
  username: string;
  password: string;
}

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    token: { type: GraphQLString },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    role: { type: GraphQLString },
    status: { type: GraphQLString },
  },
});

const LoginResolver = async (_: any, args: LoginArgs) => {
  const { username, password } = args;
  const user = await Auth.findOne({ username });
  if (!user) {
    throw new InvalidInputError('User not found', 'username');
  }

  const isValidPassword = await comparePassword(password, user.password);
  if (!isValidPassword) {
    throw new InvalidInputError("Password doesn't match", 'password');
  }

  const token = jwt.sign({ id: user._id }, process.env.SECRET || '', {
    expiresIn: '1d',
  });
  return {
    id: user._id,
    token,
    username: user.username,
    email: user.email,
    role: user.role,
    status: user.status,
  };
};

export const login = {
  type: UserType,
  args: {
    username: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  resolve: LoginResolver,
};

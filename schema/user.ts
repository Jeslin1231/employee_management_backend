import { GraphQLString, GraphQLObjectType, GraphQLList } from 'graphql';
import { MessageType } from './message';
import {
  InternalServerError,
  InvalidInputError,
  UnauthorizedError,
  NotFoundError,
} from './error';
import User from '../model/user';
import Employee from '../model/employee';
import { comparePassword, cryptPassword } from './password';
import jwt from 'jsonwebtoken';
import Token from '../model/token';

interface SignupArgs {
  token: string;
  username: string;
  email: string;
  password: string;
  role: string;
}

const RegisterResolver = async (_: any, args: SignupArgs) => {
  const { token, username, email, password, role } = args;

  const tokenModel = await Token.findOne({ token });
  if (!tokenModel) {
    throw new InvalidInputError('Token not found', 'token');
  }
  try {
    jwt.verify(token, process.env.SECRET || '');
  } catch (error) {
    throw new InvalidInputError('Expired token', 'token');
  }

  const encryptedPassword = await cryptPassword(password);

  const existedUsername = await User.findOne({ username });
  if (existedUsername) {
    throw new InvalidInputError('Username already existed', 'username');
  }

  const existedEmail = await User.findOne({ email });
  if (existedEmail) {
    throw new InvalidInputError('Email already existed', 'email');
  }

  try {
    const user = new User({
      username,
      email,
      password: encryptedPassword,
      role,
    });
    await user.save();
    await tokenModel.updateOne({ user: user._id });
    return {
      api: 'register',
      type: 'mutation',
      status: 'sucess',
      message: 'User created',
    };
  } catch (error) {
    throw new InternalServerError('Failed to create user');
  }
};

export const register = {
  type: MessageType,
  args: {
    token: { type: GraphQLString },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    role: { type: GraphQLString },
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
  const user = await User.findOne({ username });
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

const UserWithInfoType = new GraphQLObjectType({
  name: 'UserWithInfo',
  fields: {
    id: { type: GraphQLString },
    username: { type: GraphQLString },
    fullName: { type: GraphQLString },
    email: { type: GraphQLString },
    status: { type: GraphQLString },
  },
});

const queryAllUserResolver = async (_: any, args: any, context: any) => {
  if (!context.authorized || !context.userId) {
    throw new UnauthorizedError('Access denied', 'UNAUTHORIZED');
  }

  const user = await User.findById(context.userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  if (user.role !== 'hr') {
    throw new UnauthorizedError('Access denied', 'UNAUTHORIZED');
  }

  try {
    const users = await User.find();
    const updatedusers = await Promise.all(
      users.map(async user => {
        let fullName = ''; // Initialize fullName variable
        const employee = await Employee.findOne({ user: user._id });
        if (employee) {
          if (employee.middleName) {
            fullName = `${employee.firstName} ${employee.middleName} ${employee.lastName}`;
          } else {
            fullName = `${employee.firstName} ${employee.lastName}`;
          }
        }

        return {
          id: user._id,
          username: user.username,
          email: user.email,
          status: user.status,
          fullName: fullName,
        }; // Map token to match tokenHistory fields
      }),
    );

    return updatedusers;
  } catch (error) {
    throw new InternalServerError('Failed to fetch user data');
  }
};

export const queryAllUser = {
  type: new GraphQLList(UserWithInfoType),
  resolve: queryAllUserResolver,
};

const onBoardingFeedbackResolver = async (_: any, args: any, context: any) => {
  if (!context.authorized || !context.userId) {
    throw new UnauthorizedError('Access denied', 'UNAUTHORIZED');
  }

  const user = await User.findById(context.userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  if (user.role !== 'hr') {
    throw new UnauthorizedError('Access denied', 'UNAUTHORIZED');
  }

  try {
    const user = await User.findById(args.employee);
    if (user) {
      user.status = args.status;
      await user.save();
    }

    const employee = await Employee.findOne({ user: args.employee });
    if (employee) {
      employee.feedback = args.feedback ?? '';
      await employee.save();
    }
    return {
      api: 'onBoardingFeedback',
      type: 'mutation',
      status: 'sucess',
      message: 'Feedback submitted',
    };
  } catch (error) {
    throw new InternalServerError('Failed to fetch user data');
  }
};

export const onBoardingFeedback = {
  type: MessageType,
  args: {
    employee: { type: GraphQLString },
    feedback: { type: GraphQLString },
    status: { type: GraphQLString },
  },
  resolve: onBoardingFeedbackResolver,
};

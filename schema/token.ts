import { GraphQLObjectType, GraphQLString, GraphQLList } from 'graphql';
import Token from '../model/token';
import jwt from 'jsonwebtoken';
import { UnauthorizedError, NotFoundError, InternalServerError } from './error';
import { MessageType } from './message';
import User from '../model/user';
import Employee from '../model/employee';
import nodemailer from 'nodemailer';

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
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL,
      pass: process.env.PASS,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Registration Link',
    text: `This is your registration link: ${URL}`,
  };
  await transporter.sendMail(mailOptions, function (err, info) {
    if (err) console.log(err);
    else console.log(info);
  });
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

const tokenHistory = new GraphQLObjectType({
  name: 'TokenHistory',
  fields: {
    username: { type: GraphQLString },
    fullName: { type: GraphQLString },
    email: { type: GraphQLString },
    URL: { type: GraphQLString },
    status: { type: GraphQLString },
  },
});

const getAllTokenHistoryResolver = async (_: any, __: any, context: any) => {
  if (!context.authorized) {
    throw new UnauthorizedError('Unauthorized access', 'UNAUTHORIZED_ACCESS');
  }
  const user = await User.findById(context.userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  if (user.role !== 'hr') {
    throw new UnauthorizedError('Unauthorized access', 'UNAUTHORIZED_ACCESS');
  }

  try {
    const tokens = await Token.find();
    // Map each token to a Promise that resolves with the updated token
    const updatedTokens = await Promise.all(
      tokens.map(async token => {
        const id = token.user;
        const user = await User.findById(id);
        const username = user?.username;
        const status = user?.status;

        let fullName = ''; // Initialize fullName variable
        const employee = await Employee.findOne({ user: id });
        if (employee) {
          if (employee.middleName) {
            fullName = `${employee.firstName} ${employee.middleName} ${employee.lastName}`;
          } else {
            fullName = `${employee.firstName} ${employee.lastName}`;
          }
        }

        return {
          username: username,
          fullName: fullName,
          email: token.email,
          URL: token.URL,
          status: status,
        }; // Map token to match tokenHistory fields
      }),
    );

    return updatedTokens; // Return the list of updated tokens
  } catch (error) {
    throw new InternalServerError('Failed to get token history');
  }
};

export const getAllTokenHistory = {
  type: new GraphQLList(tokenHistory),
  resolve: getAllTokenHistoryResolver,
};

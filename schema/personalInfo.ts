import { GraphQLString } from 'graphql';
// import jwt from 'jsonwebtoken';
import Employee from '../model/employee';
import { MessageType } from './message';
import { InvalidInputError } from './error';

interface NameArgs {
  token: string;
  avatar: string;
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  preferredName: string;
  ssn: string;
  dateOfBirth: string;
  gender: string;
}

const createNameResolver = async (_parent: any, args: NameArgs) => {
  const {
    // token,
    avatar,
    email,
    firstName,
    middleName,
    lastName,
    preferredName,
    ssn,
    dateOfBirth,
    gender,
  } = args;
  // console.log(args)
  try {
    //     const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET || '');
    // if (!decodedToken) {
    //     throw new InvalidInputError(
    //         'Wrong Token',
    //         'token'
    //     );
    // }

    // const userId = decodedToken.id;

    const employee = new Employee({
      avatar,
      email,
      firstName,
      middleName,
      lastName,
      preferredName,
      ssn,
      dateOfBirth,
      gender,
    });
    console.log(employee);
    await employee.save();
    return {
      avatar,
      email,
      firstName,
      middleName,
      lastName,
      preferredName,
      ssn,
      dateOfBirth,
      gender,
    };
  } catch (error) {
    throw new InvalidInputError(
      'Failed to create user',
      'FAILED_TO_CREATE_USER',
    );
  }
};

export const createName = {
  type: MessageType,
  args: {
    token: { type: GraphQLString },
    avatar: { type: GraphQLString },
    email: { type: GraphQLString },
    firstName: { type: GraphQLString },
    middleName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    preferredName: { type: GraphQLString },
    ssn: { type: GraphQLString },
    dateOfBirth: { type: GraphQLString },
    gender: { type: GraphQLString },
  },
  resolve: createNameResolver,
};

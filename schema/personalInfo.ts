import { GraphQLString } from 'graphql';
import jwt from 'jsonwebtoken';
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
  gender: 'Male' | 'Female';
}

const updateNameResolver = async (_parent: any, args: NameArgs) => {
  const {
    token,
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
  try {
    const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET || '');
    if (!decodedToken) {
      throw new InvalidInputError('Wrong Token', 'token');
    }
    const userId = decodedToken.id;

    const employee = await Employee.findById(userId);
    // If employee not found, throw an error
    if (!employee) {
      throw new InvalidInputError('Employee not found', 'employee');
    }

    // Update the employee's information
    employee.avatar = avatar;
    employee.email = email;
    employee.firstName = firstName;
    employee.middleName = middleName;
    employee.lastName = lastName;
    employee.preferredName = preferredName;
    employee.ssn = ssn;
    // employee.dateOfBirth = dateOfBirth;
    employee.gender = gender;

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

export const updateName = {
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
  resolve: updateNameResolver,
};

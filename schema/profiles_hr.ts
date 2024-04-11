import { GraphQLString, GraphQLList, GraphQLObjectType } from 'graphql';
import Employee from '../model/employee';
import User from '../model/user';
import { NotFoundError, UnauthorizedError, InternalServerError } from './error';

const AllEmployeesProfileType = new GraphQLObjectType({
  name: 'AllEmployeesProfileType',
  fields: {
    user: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    middleName: { type: GraphQLString },
    visaType: { type: GraphQLString },
    ssn: { type: GraphQLString },
    workPhone: { type: GraphQLString },
    cellPhone: { type: GraphQLString },
    email: { type: GraphQLString },
  },
});

const getAllEmployeesProfilesResolver = async (
  _parent: any,
  args: any,
  context: any,
) => {
  if (!context.authorized) {
    throw new UnauthorizedError('Unauthorized', 'UNAUTHORIZED');
  }
  const user = await User.findById(context.userId);
  if (!user) {
    throw new NotFoundError('User not found');
  } else if (user.role !== 'hr') {
    throw new UnauthorizedError('Unauthorized', 'UNAUTHORIZED');
  }

  try {
    const employees = await Employee.find();
    return employees;
  } catch (error) {
    throw new InternalServerError('Failed to get employees profiles');
  }
};

export const getAllEmployeesProfiles = {
  type: new GraphQLList(AllEmployeesProfileType),
  resolve: getAllEmployeesProfilesResolver,
};

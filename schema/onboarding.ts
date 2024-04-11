import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLList,
} from 'graphql';
import DateScalar from './date';
import {
  InternalServerError,
  InvalidInputError,
  UnauthorizedError,
} from './error';
import Employee from '../model/employee';
import { MessageType } from './message';
import User from '../model/user';

const EmergencyContactType = new GraphQLObjectType({
  name: 'EmergencyContact',
  fields: {
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    middleName: { type: GraphQLString },
    relationship: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  },
});

const EmergencyContactInputType = new GraphQLInputObjectType({
  name: 'EmergencyContactInput',
  fields: {
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    middleName: { type: GraphQLString },
    relationship: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  },
});

const DocumentType = new GraphQLObjectType({
  name: 'Document',
  fields: {
    file: { type: GraphQLString },
    type: { type: GraphQLString },
  },
});

const EmergencyContactList = new GraphQLList(EmergencyContactType);
const EmergencyContactListInput = new GraphQLList(EmergencyContactInputType);

const DocumentList = new GraphQLList(DocumentType);

const EmployeeType = new GraphQLObjectType({
  name: 'OnboardingData',
  fields: {
    _id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    middleName: { type: GraphQLString },
    preferredName: { type: GraphQLString },
    email: { type: GraphQLString },
    avatar: { type: GraphQLString },
    ssn: { type: GraphQLString },
    dateOfBirth: { type: DateScalar },
    gender: { type: GraphQLString },
    apartment: { type: GraphQLString },
    streetAddress: { type: GraphQLString },
    city: { type: GraphQLString },
    state: { type: GraphQLString },
    zip: { type: GraphQLString },
    cellPhone: { type: GraphQLString },
    workPhone: { type: GraphQLString },
    citizenship: { type: GraphQLString },
    visaType: { type: GraphQLString },
    visaStartDate: { type: DateScalar },
    visaEndDate: { type: DateScalar },
    referralFirstName: { type: GraphQLString },
    referralMiddleName: { type: GraphQLString },
    referralLastName: { type: GraphQLString },
    referralEmail: { type: GraphQLString },
    referralPhone: { type: GraphQLString },
    referralRelationship: { type: GraphQLString },
    emergencyContacts: { type: EmergencyContactList },
    documents: { type: DocumentList },
  },
});

const EmployeeInputType = new GraphQLInputObjectType({
  name: 'OnboardingDataInput',
  fields: {
    avatar: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    middleName: { type: GraphQLString },
    preferredName: { type: GraphQLString },
    streetAddress: { type: GraphQLString },
    apartment: { type: GraphQLString },
    city: { type: GraphQLString },
    state: { type: GraphQLString },
    zip: { type: GraphQLString },
    email: { type: GraphQLString },
    cellPhone: { type: GraphQLString },
    ssn: { type: GraphQLString },
    dateOfBirth: { type: DateScalar },
    gender: { type: GraphQLString },
    citizenship: { type: GraphQLString },
    identity: { type: GraphQLString },
    visa: { type: GraphQLString },
    visaType: { type: GraphQLString },
    startDate: { type: DateScalar },
    endDate: { type: DateScalar },
    optReceipt: { type: GraphQLString },
    referralFirstName: { type: GraphQLString },
    referralMiddleName: { type: GraphQLString },
    referralLastName: { type: GraphQLString },
    referralEmail: { type: GraphQLString },
    referralPhone: { type: GraphQLString },
    referralRelationship: { type: GraphQLString },
    emergencyContacts: { type: EmergencyContactListInput },
  },
});

interface QueryEmployeeArgs {
  userId: string;
}

const queryEmployeeDataResolver = async (
  _: any,
  args: QueryEmployeeArgs,
  context: any,
) => {
  if (
    !context.authorized ||
    !context.userId ||
    context.userId !== args.userId
  ) {
    throw new UnauthorizedError('Access denied', 'UNAUTHORIZED');
  }

  try {
    const employee = await Employee.findOne({ user: args.userId });
    if (!employee) {
      throw new InvalidInputError('Employee not found', 'user');
    }
    return employee;
  } catch (error) {
    throw new InternalServerError('Failed to fetch employee data');
  }
};

export const queryEmployee = {
  type: EmployeeType,
  args: {
    userId: { type: GraphQLString },
  },
  resolve: queryEmployeeDataResolver,
};

const onboardingResolver = async (_: any, args: any, context: any) => {
  if (!context.authorized || !context.userId) {
    throw new UnauthorizedError('Access denied', 'UNAUTHORIZED');
  }

  const user = await User.findById(context.userId);
  if (!user) {
    throw new InvalidInputError('User not found', 'user');
  }

  const employee = await Employee.findOne({ user: context.userId });
  if (employee) {
    throw new InvalidInputError('Employee already exists', 'user');
  }

  let documents = [];
  if (args.data.avatar || args.data.avatar !== '') {
    documents.push({ file: args.data.avatar, type: 'avatar' });
  }
  if (args.data.optReceipt || args.data.optReceipt !== '') {
    documents.push({ file: args.data.optReceipt, type: 'receipt' });
  }

  const newEmployee = new Employee({
    user: context.userId,
    firstName: args.data.firstName,
    lastName: args.data.lastName,
    middleName: args.data.middleName,
    preferredName: args.data.preferredName,
    streetAddress: args.data.streetAddress,
    apartment: args.data.apartment,
    city: args.data.city,
    state: args.data.state,
    zip: args.data.zip,
    email: args.data.email,
    cellPhone: args.data.cellPhone,
    ssn: args.data.ssn,
    dateOfBirth: args.data.dateOfBirth,
    gender: args.data.gender,
    citizenship: args.data.citizenship == 'yes' ? args.data.identity : 'visa',
    visaType: args.data.visa === 'other' ? args.data.visaType : args.data.visa,
    visaStartDate: args.data.startDate,
    visaEndDate: args.data.endDate,
    referralFirstName: args.data.referralFirstName,
    referralMiddleName: args.data.referralMiddleName,
    referralLastName: args.data.referralLastName,
    referralEmail: args.data.referralEmail,
    referralPhone: args.data.referralPhone,
    referralRelationship: args.data.referralRelationship,
    emergencyContacts: args.data.emergencyContacts,
    documents: documents,
  });
  await newEmployee.save();
  user.employee = newEmployee._id;
  await user.save();

  return {
    api: 'onboarding',
    type: 'mutation',
    status: 'success',
    message: 'Employee onboarded successfully',
  };
};

export const onboarding = {
  type: MessageType,
  args: {
    data: { type: EmployeeInputType },
  },
  resolve: onboardingResolver,
};

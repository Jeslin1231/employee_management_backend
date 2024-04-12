import {
  GraphQLString,
  GraphQLList,
  GraphQLObjectType,
  GraphQLInputObjectType,
} from 'graphql';
import Employee from '../model/employee';
import { UnauthorizedError, InvalidInputError, NotFoundError } from './error';
import DateScalar from './date';
import { MessageType } from './message';

// name part
interface NameSectionArgs {
  avatar: string;
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  preferredName: string;
  ssn: string;
  dateOfBirth: Date;
  gender: 'male' | 'female';
}

const NameSectionInputType = new GraphQLInputObjectType({
  name: 'NameSectionInput',
  fields: {
    avatar: { type: GraphQLString },
    email: { type: GraphQLString },
    firstName: { type: GraphQLString },
    middleName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    preferredName: { type: GraphQLString },
    ssn: { type: GraphQLString },
    dateOfBirth: { type: DateScalar },
    gender: { type: GraphQLString },
  },
});

const updateNameSectionResolver = async (
  parent: any,
  args: { data: NameSectionArgs },
  context: any,
) => {
  const {
    avatar,
    email,
    firstName,
    middleName,
    lastName,
    preferredName,
    ssn,
    dateOfBirth,
    gender,
  } = args.data;

  if (!context.authorized) {
    throw new UnauthorizedError('Unauthorized', 'unauthorized');
  }
  const userId = context.userId;
  const employee = await Employee.findOne({ user: userId });

  // If employee not found, throw an error
  if (!employee) {
    throw new NotFoundError('Employee not found');
  }
  try {
    // update avatar
    if (avatar) {
      const avatarDocument = employee.documents.find(doc => {
        return doc.type === 'avatar';
      });

      if (avatarDocument) {
        avatarDocument.file = avatar;
        await employee.save();
      } else {
        const newDocument = {
          type: 'avatar',
          file: avatar,
        };
        employee.documents.push(newDocument);
        await employee.save();
      }
    }

    // Update the employee's information
    employee.email = email ?? employee.email;
    employee.firstName = firstName ?? employee.firstName;
    employee.middleName = middleName ?? employee.middleName;
    employee.lastName = lastName ?? employee.lastName;
    employee.preferredName = preferredName ?? employee.preferredName;
    employee.ssn = ssn ?? employee.ssn;
    employee.dateOfBirth = dateOfBirth ?? employee.dateOfBirth;
    employee.gender = gender ?? employee.gender;
    await employee.save();

    return {
      api: 'updateNameSection',
      type: 'mutation',
      status: 'success',
      message: 'Employee name information updated',
    };
  } catch (error) {
    throw new InvalidInputError('Failed to update user', 'employee');
  }
};

export const updateNameSection = {
  type: MessageType,
  args: {
    data: { type: NameSectionInputType },
  },
  resolve: updateNameSectionResolver,
};

//   Address
interface addressSectionArgs {
  streetAddress: string;
  apartment: string;
  city: string;
  state: string;
  zip: string;
}

const AddressSectionInputType = new GraphQLInputObjectType({
  name: 'AddressSectionInput',
  fields: {
    streetAddress: { type: GraphQLString },
    apartment: { type: GraphQLString },
    city: { type: GraphQLString },
    state: { type: GraphQLString },
    zip: { type: GraphQLString },
  },
});

const updateAddressSectionResolver = async (
  _parent: any,
  args: { data: addressSectionArgs },
  context: any,
) => {
  const { streetAddress, apartment, city, state, zip } = args.data;

  if (!context.authorized) {
    throw new UnauthorizedError('Unauthorized', 'unauthorized');
  }
  const userId = context.userId;
  const employee = await Employee.findOne({ user: userId });
  // If employee not found, throw an error
  if (!employee) {
    throw new NotFoundError('Employee not found');
  }
  try {
    // Update the employee's information
    employee.streetAddress = streetAddress ?? employee.streetAddress;
    employee.apartment = apartment ?? employee.apartment;
    employee.city = city ?? employee.city;
    employee.state = state ?? employee.state;
    employee.zip = zip ?? employee.zip;

    await employee.save();
    return {
      api: 'updateAddressSection',
      type: 'mutation',
      status: 'success',
      message: 'Employee address information updated',
    };
  } catch (error) {
    throw new InvalidInputError('Failed to update user', 'employee');
  }
};

export const updateAddressSection = {
  type: MessageType,
  args: {
    data: { type: AddressSectionInputType },
  },
  resolve: updateAddressSectionResolver,
};

// contact part

interface contactSectionArgs {
  cellPhone: string;
  workPhone: string;
}

const ContactSectionInputType = new GraphQLInputObjectType({
  name: 'ContactSectionInput',
  fields: {
    cellPhone: { type: GraphQLString },
    workPhone: { type: GraphQLString },
  },
});

const updateContactSectionResolver = async (
  _parent: any,
  args: { data: contactSectionArgs },
  context: any,
) => {
  const { cellPhone, workPhone } = args.data;

  if (!context.authorized) {
    throw new UnauthorizedError('Unauthorized', 'unauthorized');
  }
  const userId = context.userId;
  const employee = await Employee.findOne({ user: userId });
  // If employee not found, throw an error
  if (!employee) {
    throw new NotFoundError('Employee not found');
  }
  try {
    // Update the employee's information
    employee.cellPhone = cellPhone ?? employee.cellPhone;
    employee.workPhone = workPhone ?? employee.workPhone;

    await employee.save();
    return {
      api: 'updateContactSection',
      type: 'mutation',
      status: 'success',
      message: 'Employee contact information updated',
    };
  } catch (error) {
    throw new InvalidInputError('Failed to update user', 'employee');
  }
};

export const updateContactSection = {
  type: MessageType,
  args: {
    data: { type: ContactSectionInputType },
  },
  resolve: updateContactSectionResolver,
};

// Employment part

const EmploymentSectionInputType = new GraphQLInputObjectType({
  name: 'EmploymentSectionInput',
  fields: {
    citizenship: { type: GraphQLString },
    visaType: { type: GraphQLString },
    visaStartDate: { type: DateScalar },
    visaEndDate: { type: DateScalar },
  },
});

const updateEmploymentSectionResolver = async (
  _parent: any,
  args: any,
  context: any,
) => {
  const { citizenship, visaType, startDate, endDate } = args.data;

  if (!context.authorized) {
    throw new UnauthorizedError('Unauthorized', 'unauthorized');
  }
  if (citizenship !== 'no') {
    throw new InvalidInputError(
      'You must not be a citizen or a permanent resident',
      'employee',
    );
  }
  const userId = context.userId;
  const employee = await Employee.findOne({ user: userId });
  // If employee not found, throw an error
  if (!employee) {
    throw new NotFoundError('Employee not found');
  }
  try {
    // Update the employee's information
    employee.visaType = visaType ?? employee.visaType;
    employee.visaStartDate = startDate ?? employee.visaStartDate;
    employee.visaEndDate = endDate ?? employee.visaEndDate;

    await employee.save();
    return {
      visaType,
      startDate,
      endDate,
    };
  } catch (error) {
    throw new InvalidInputError('Failed to update user', 'employee');
  }
};

export const updateEmploymentSection = {
  type: MessageType,
  args: {
    data: { type: EmploymentSectionInputType },
  },
  resolve: updateEmploymentSectionResolver,
};

// Emergency Contact part
const EmergencyContactType = new GraphQLObjectType({
  name: 'EmergencyContactUpdate',
  fields: {
    _id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    middleName: { type: GraphQLString },
    relationship: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  },
});

const EmergencyContactInputType = new GraphQLInputObjectType({
  name: 'EmergencyContactUpdateInput',
  fields: {
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    middleName: { type: GraphQLString },
    relationship: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  },
});

const EmergencyContactList = new GraphQLList(EmergencyContactType);
const EmergencyContactListInput = new GraphQLList(EmergencyContactInputType);

const EmergencyContactSectionInputType = new GraphQLInputObjectType({
  name: 'EmergencyContactSectionInput',
  fields: {
    emergencyContacts: { type: EmergencyContactListInput },
  },
});

const updateEmergencyContactSectionResolver = async (
  _parent: any,
  args: any,
  context: any,
) => {
  const { emergencyContacts } = args.data;

  if (!context.authorized) {
    throw new UnauthorizedError('Unauthorized', 'unauthorized');
  }
  const userId = context.userId;
  const employee = await Employee.findOne({ user: userId });
  // If employee not found, throw an error
  if (!employee) {
    throw new NotFoundError('Employee not found');
  }
  try {
    // Update the employee's information
    employee.emergencyContacts =
      emergencyContacts ?? employee.emergencyContacts;

    await employee.save();
    return {
      api: 'updateEmergencyContactSection',
      type: 'mutation',
      status: 'success',
      message: 'Employee emergency contact information updated',
    };
  } catch (error) {
    throw new InvalidInputError('Failed to update user', 'employee');
  }
};

export const updateEmergencyContactSection = {
  type: MessageType,
  args: {
    data: { type: EmergencyContactSectionInputType },
  },
  resolve: updateEmergencyContactSectionResolver,
};

// get all personal information
const PersonalAllInfoType = new GraphQLObjectType({
  name: 'PersonalAllInfo',
  fields: {
    user: { type: GraphQLString },
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
    visaType: { type: GraphQLString },
    visaStartDate: { type: DateScalar },
    visaEndDate: { type: DateScalar },
    emergencyContacts: { type: EmergencyContactList },
  },
});

const getPersonalAllInfoResolver = async (
  _parent: any,
  _args: any,
  context: any,
) => {
  if (!context.authorized) {
    throw new UnauthorizedError('Unauthorized', 'unauthorized');
  }
  const userId = context.userId;
  const employee = await Employee.findOne({ user: userId });
  // If employee not found, throw an error
  if (!employee) {
    throw new NotFoundError('Employee not found');
  }
  try {
    const avatar = employee.documents[0].file;
    employee.avatar = avatar;
    return employee;
  } catch (error) {
    throw new InvalidInputError('Failed to update user', 'employee');
  }
};

export const getPersonalAllInfo = {
  type: PersonalAllInfoType,
  resolve: getPersonalAllInfoResolver,
};

import {
  GraphQLString,
  GraphQLList,
  GraphQLObjectType,
  GraphQLInputObjectType,
} from 'graphql';
import Employee from '../model/employee';
import { UnauthorizedError, InvalidInputError, NotFoundError } from './error';
import DateScalar from './date';

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

const NameSectionType = new GraphQLObjectType({
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
  args: NameSectionArgs,
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
  } = args;

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
    throw new InvalidInputError('Failed to update user', 'employee');
  }
};

export const updateNameSection = {
  type: NameSectionType,
  args: {
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

const AddressSectionType = new GraphQLObjectType({
  name: 'AddressSection',
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
  args: addressSectionArgs,
  context: any,
) => {
  const { streetAddress, apartment, city, state, zip } = args;

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
      streetAddress,
      apartment,
      city,
      state,
      zip,
    };
  } catch (error) {
    throw new InvalidInputError('Failed to update user', 'employee');
  }
};

export const updateAddressSection = {
  type: AddressSectionType,
  args: {
    streetAddress: { type: GraphQLString },
    apartment: { type: GraphQLString },
    city: { type: GraphQLString },
    state: { type: GraphQLString },
    zip: { type: GraphQLString },
  },
  resolve: updateAddressSectionResolver,
};

// contact part

interface contactSectionArgs {
  cellPhone: string;
  workPhone: string;
}

const ContactSectionType = new GraphQLObjectType({
  name: 'ContactSection',
  fields: {
    cellPhone: { type: GraphQLString },
    workPhone: { type: GraphQLString },
  },
});

const updateContactSectionResolver = async (
  _parent: any,
  args: contactSectionArgs,
  context: any,
) => {
  const { cellPhone, workPhone } = args;

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
      cellPhone,
      workPhone,
    };
  } catch (error) {
    throw new InvalidInputError('Failed to update user', 'employee');
  }
};

export const updateContactSection = {
  type: ContactSectionType,
  args: {
    cellPhone: { type: GraphQLString },
    workPhone: { type: GraphQLString },
  },
  resolve: updateContactSectionResolver,
};

// Employment part

const EmploymentSectionType = new GraphQLObjectType({
  name: 'EmploymentSection',
  fields: {
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
  const { visaType, startDate, endDate } = args;

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
  type: EmploymentSectionType,
  args: {
    visaType: { type: GraphQLString },
    startDate: { type: DateScalar },
    endDate: { type: DateScalar },
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
  name: 'EmergencyContactInputUpdate',
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

const EmergencyContactSectionType = new GraphQLObjectType({
  name: 'EmergencyContactSection',
  fields: {
    emergencyContacts: { type: EmergencyContactList },
  },
});

const updateEmergencyContactSectionResolver = async (
  _parent: any,
  args: any,
  context: any,
) => {
  const { contacts } = args;

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
    employee.emergencyContacts = contacts ?? employee.emergencyContacts;

    await employee.save();
    return {
      contacts,
    };
  } catch (error) {
    throw new InvalidInputError('Failed to update user', 'employee');
  }
};

export const updateEmergencyContactSection = {
  type: EmergencyContactSectionType,
  args: {
    contacts: { type: EmergencyContactListInput },
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

import {
  GraphQLString,
  GraphQLList,
  GraphQLObjectType,
  GraphQLInputObjectType,
} from 'graphql';
import Employee, { EmergencyContact } from '../model/employee';
import { InvalidInputError } from './error';
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
  gender: 'Male' | 'Female';
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
  try {
    if (!context.authorized) {
      throw new InvalidInputError('Unauthorized', 'UNAUTHORIZED');
    }
    const userId = context.userId;
    const employee = await Employee.findOne(userId);
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
    employee.dateOfBirth = dateOfBirth;
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

const getNameSectionResolver = async (_parent: any, context: any) => {
  try {
    if (!context.authorized) {
      throw new InvalidInputError('Unauthorized', 'UNAUTHORIZED');
    }
    const userId = context.userId;
    const employee = await Employee.findOne(userId);
    if (!employee) {
      throw new InvalidInputError('Employee not found', 'employee');
    }
    return {
      avatar: employee.avatar,
      email: employee.email,
      firstName: employee.firstName,
      middleName: employee.middleName,
      lastName: employee.lastName,
      preferredName: employee.preferredName,
      ssn: employee.ssn,
      dateOfBirth: employee.dateOfBirth,
      gender: employee.gender,
    };
  } catch (error) {
    throw new InvalidInputError('Failed to get user', 'FAILED_TO_GET_USER');
  }
};

export const getNameSection = {
  type: NameSectionType,
  resolve: getNameSectionResolver,
};

// address part
interface addressSectionArgs {
  streetAddress: string;
  Apartment: string;
  city: string;
  state: string;
  zip: string;
}

const AddressSectionType = new GraphQLObjectType({
  name: 'AddressSection',
  fields: {
    streetAddress: { type: GraphQLString },
    Apartment: { type: GraphQLString },
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
  const { streetAddress, Apartment, city, state, zip } = args;
  try {
    if (!context.authorized) {
      throw new InvalidInputError('Unauthorized', 'UNAUTHORIZED');
    }
    const userId = context.userId;
    const employee = await Employee.findOne(userId);
    // If employee not found, throw an error
    if (!employee) {
      throw new InvalidInputError('Employee not found', 'employee');
    }

    // Update the employee's information
    employee.streetAddress = streetAddress;
    employee.Apartment = Apartment;
    employee.city = city;
    employee.state = state;
    employee.zip = zip;

    await employee.save();
    return {
      streetAddress,
      Apartment,
      city,
      state,
      zip,
    };
  } catch (error) {
    throw new InvalidInputError(
      'Failed to create user',
      'FAILED_TO_CREATE_USER',
    );
  }
};

export const updateAddressSection = {
  type: AddressSectionType,
  args: {
    streetAddress: { type: GraphQLString },
    Apartment: { type: GraphQLString },
    city: { type: GraphQLString },
    state: { type: GraphQLString },
    zip: { type: GraphQLString },
  },
  resolve: updateAddressSectionResolver,
};

const getAddressSectionResolver = async (_parent: any, context: any) => {
  try {
    if (!context.authorized) {
      throw new InvalidInputError('Unauthorized', 'UNAUTHORIZED');
    }
    const userId = context.userId;
    const employee = await Employee.findOne(userId);
    if (!employee) {
      throw new InvalidInputError('Employee not found', 'employee');
    }
    return {
      streetAddress: employee.streetAddress,
      Apartment: employee.Apartment,
      city: employee.city,
      state: employee.state,
      zip: employee.zip,
    };
  } catch (error) {
    throw new InvalidInputError('Failed to get user', 'FAILED_TO_GET_USER');
  }
};

export const getAddressSection = {
  type: AddressSectionType,
  resolve: getAddressSectionResolver,
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
  try {
    if (!context.authorized) {
      throw new InvalidInputError('Unauthorized', 'UNAUTHORIZED');
    }
    const userId = context.userId;
    const employee = await Employee.findOne(userId);
    // If employee not found, throw an error
    if (!employee) {
      throw new InvalidInputError('Employee not found', 'employee');
    }

    // Update the employee's information
    employee.cellPhone = cellPhone;
    employee.workPhone = workPhone;

    await employee.save();
    return {
      cellPhone,
      workPhone,
    };
  } catch (error) {
    throw new InvalidInputError(
      'Failed to create user',
      'FAILED_TO_CREATE_USER',
    );
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

const getContactSectionResolver = async (_parent: any, context: any) => {
  try {
    if (!context.authorized) {
      throw new InvalidInputError('Unauthorized', 'UNAUTHORIZED');
    }
    const userId = context.userId;
    const employee = await Employee.findOne(userId);
    if (!employee) {
      throw new InvalidInputError('Employee not found', 'employee');
    }
    return {
      cellPhone: employee.cellPhone,
      workPhone: employee.workPhone,
    };
  } catch (error) {
    throw new InvalidInputError('Failed to get user', 'FAILED_TO_GET_USER');
  }
};

export const getContact = {
  type: ContactSectionType,
  resolve: getContactSectionResolver,
};

// Employment part
interface employmentSectionArgs {
  visaType: string;
  visaStartDate: Date;
  visaEndDate: Date;
}

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
  args: employmentSectionArgs,
  context: any,
) => {
  const { visaType, visaStartDate, visaEndDate } = args;
  try {
    if (!context.authorized) {
      throw new InvalidInputError('Unauthorized', 'UNAUTHORIZED');
    }
    const userId = context.userId;
    const employee = await Employee.findOne(userId);
    // If employee not found, throw an error
    if (!employee) {
      throw new InvalidInputError('Employee not found', 'employee');
    }

    // Update the employee's information
    employee.visaType = visaType;
    employee.visaStartDate = visaStartDate;
    employee.visaEndDate = visaEndDate;

    await employee.save();
    return {
      visaType,
      visaStartDate,
      visaEndDate,
    };
  } catch (error) {
    throw new InvalidInputError(
      'Failed to create user',
      'FAILED_TO_CREATE_USER',
    );
  }
};

export const updateEmploymentSection = {
  type: EmploymentSectionType,
  args: {
    visaType: { type: GraphQLString },
    visaStartDate: { type: DateScalar },
    visaEndDate: { type: DateScalar },
  },
  resolve: updateEmploymentSectionResolver,
};

const getEmploymentSectionResolver = async (_parent: any, context: any) => {
  try {
    if (!context.authorized) {
      throw new InvalidInputError('Unauthorized', 'UNAUTHORIZED');
    }
    const userId = context.userId;
    const employee = await Employee.findOne(userId);
    if (!employee) {
      throw new InvalidInputError('Employee not found', 'employee');
    }
    return {
      visaType: employee.visaType,
      visaStartDate: employee.visaStartDate,
      visaEndDate: employee.visaEndDate,
    };
  } catch (error) {
    throw new InvalidInputError('Failed to get user', 'FAILED_TO_GET_USER');
  }
};

export const getEmploymentSection = {
  type: EmploymentSectionType,
  resolve: getEmploymentSectionResolver,
};

// Emergency Contact part
interface EmergencyContactSectionArgs {
  contacts: EmergencyContact[];
}

const EmergencyContactInputType = new GraphQLInputObjectType({
  name: 'EmergencyContact',
  fields: {
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    middleName: { type: GraphQLString },
    cellPhone: { type: GraphQLString },
    email: { type: GraphQLString },
    relationship: { type: GraphQLString },
  },
});

const EmergencyContactOutputType = new GraphQLObjectType({
  name: 'EmergencyContact',
  fields: {
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    middleName: { type: GraphQLString },
    cellPhone: { type: GraphQLString },
    email: { type: GraphQLString },
    relationship: { type: GraphQLString },
  },
});

const emergencyContactSectionListOutput = new GraphQLList(
  EmergencyContactOutputType,
);
const emergencyContactSectionListInput = new GraphQLList(
  EmergencyContactInputType,
);

const EmergencyContactSectionType = new GraphQLObjectType({
  name: 'EmergencyContactSection',
  fields: {
    contacts: { type: emergencyContactSectionListOutput },
  },
});

const updateEmergencyContactSectionResolver = async (
  _parent: any,
  args: EmergencyContactSectionArgs,
  context: any,
) => {
  try {
    if (!context.authorized) {
      throw new InvalidInputError('Unauthorized', 'UNAUTHORIZED');
    }

    const userId = context.userId;
    const employee = await Employee.findOne(userId);

    if (!employee) {
      throw new InvalidInputError('Employee not found', 'employee');
    }

    // Create a new array containing copies of the contact objects
    employee.emergencyContacts = args.contacts.map(contact => ({
      ...contact,
    }));

    await employee.save();

    return {
      message: 'Emergency contacts updated successfully',
    };
  } catch (error) {
    throw new InvalidInputError(
      'Failed to update emergency contacts',
      'FAILED_TO_UPDATE_EMERGENCY_CONTACTS',
    );
  }
};

export const updateEmergencyContactSection = {
  type: EmergencyContactSectionType,
  args: {
    contacts: { type: emergencyContactSectionListInput },
  },
  resolve: updateEmergencyContactSectionResolver,
};

const getEmergencyContactSectionResolver = async (
  _parent: any,
  context: any,
) => {
  try {
    if (!context.authorized) {
      throw new InvalidInputError('Unauthorized', 'UNAUTHORIZED');
    }

    const userId = context.userId;
    const employee = await Employee.findOne(userId);

    if (!employee) {
      throw new InvalidInputError('Employee not found', 'employee');
    }

    return {
      contacts: employee.emergencyContacts,
    };
  } catch (error) {
    throw new InvalidInputError(
      'Failed to get emergency contacts',
      'FAILED_TO_GET_EMERGENCY_CONTACTS',
    );
  }
};

export const getEmergencyContactSection = {
  type: EmergencyContactSectionType,
  resolve: getEmergencyContactSectionResolver,
};

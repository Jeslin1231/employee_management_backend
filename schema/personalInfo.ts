import { GraphQLString, GraphQLList, GraphQLInputObjectType } from 'graphql';
import Employee, { EmergencyContact } from '../model/employee';
import { MessageType } from './message';
import { InvalidInputError } from './error';
import DateScalar from './date';

// name part
interface NameArgs {
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

const updateNameResolver = async (
  _parent: any,
  args: NameArgs,
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

export const updateName = {
  type: MessageType,
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
  resolve: updateNameResolver,
};

const getNameResolver = async (_parent: any, _args: any, context: any) => {
  try {
    if (!context.authorized) {
      throw new InvalidInputError('Unauthorized', 'UNAUTHORIZED');
    }
    const userId = context.userId;
    const employee = await Employee.findById(userId);
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

export const getName = {
  type: MessageType,
  resolve: getNameResolver,
};

// address part
interface addressArgs {
  streetAddress: string;
  Apartment: string;
  city: string;
  state: string;
  zip: string;
}

const updateAddressResolver = async (
  _parent: any,
  args: addressArgs,
  context: any,
) => {
  const { streetAddress, Apartment, city, state, zip } = args;
  try {
    if (!context.authorized) {
      throw new InvalidInputError('Unauthorized', 'UNAUTHORIZED');
    }
    const userId = context.userId;
    const employee = await Employee.findById(userId);
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

export const updateAddress = {
  type: MessageType,
  args: {
    token: { type: GraphQLString },
    streetAddress: { type: GraphQLString },
    Apartment: { type: GraphQLString },
    city: { type: GraphQLString },
    state: { type: GraphQLString },
    zip: { type: GraphQLString },
  },
  resolve: updateAddressResolver,
};

const getAddressResolver = async (_parent: any, _args: any, context: any) => {
  try {
    if (!context.authorized) {
      throw new InvalidInputError('Unauthorized', 'UNAUTHORIZED');
    }
    const userId = context.userId;
    const employee = await Employee.findById(userId);
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

export const getAddress = {
  type: MessageType,
  resolve: getAddressResolver,
};

// contact part

interface contactArgs {
  cellPhone: string;
  workPhone: string;
}

const updateContactResolver = async (
  _parent: any,
  args: contactArgs,
  context: any,
) => {
  const { cellPhone, workPhone } = args;
  try {
    if (!context.authorized) {
      throw new InvalidInputError('Unauthorized', 'UNAUTHORIZED');
    }
    const userId = context.userId;
    const employee = await Employee.findById(userId);
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

export const updateContact = {
  type: MessageType,
  args: {
    token: { type: GraphQLString },
    cellPhone: { type: GraphQLString },
    workPhone: { type: GraphQLString },
  },
  resolve: updateContactResolver,
};

const getContactResolver = async (_parent: any, _args: any, context: any) => {
  try {
    if (!context.authorized) {
      throw new InvalidInputError('Unauthorized', 'UNAUTHORIZED');
    }
    const userId = context.userId;
    const employee = await Employee.findById(userId);
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
  type: MessageType,
  resolve: getContactResolver,
};

// Employment part
interface employmentArgs {
  visaType: string;
  visaStartDate: Date;
  visaEndDate: Date;
}

const updateEmploymentResolver = async (
  _parent: any,
  args: employmentArgs,
  context: any,
) => {
  const { visaType, visaStartDate, visaEndDate } = args;
  try {
    if (!context.authorized) {
      throw new InvalidInputError('Unauthorized', 'UNAUTHORIZED');
    }
    const userId = context.userId;
    const employee = await Employee.findById(userId);
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

export const updateEmployment = {
  type: MessageType,
  args: {
    token: { type: GraphQLString },
    visaType: { type: GraphQLString },
    visaStartDate: { type: DateScalar },
    visaEndDate: { type: DateScalar },
  },
  resolve: updateEmploymentResolver,
};

const getEmploymentResolver = async (
  _parent: any,
  _args: any,
  context: any,
) => {
  try {
    if (!context.authorized) {
      throw new InvalidInputError('Unauthorized', 'UNAUTHORIZED');
    }
    const userId = context.userId;
    const employee = await Employee.findById(userId);
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

export const getEmployment = {
  type: MessageType,
  resolve: getEmploymentResolver,
};

// Emergency Contact part
interface EmergencyContactArgs {
  contacts: EmergencyContact[];
}

const updateEmergencyContactResolver = async (
  _parent: any,
  args: EmergencyContactArgs,
  context: any,
) => {
  try {
    if (!context.authorized) {
      throw new InvalidInputError('Unauthorized', 'UNAUTHORIZED');
    }

    const userId = context.userId;
    const employee = await Employee.findById(userId);

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

const EmergencyContactInputType = new GraphQLInputObjectType({
  name: 'EmergencyContactInput',
  fields: {
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    middleName: { type: GraphQLString },
    cellPhone: { type: GraphQLString },
    email: { type: GraphQLString },
    relationship: { type: GraphQLString },
  },
});

export const updateEmergencyContact = {
  type: MessageType,
  args: {
    token: { type: GraphQLString },
    contacts: { type: new GraphQLList(EmergencyContactInputType) },
  },
  resolve: updateEmergencyContactResolver,
};

const getEmergencyContactResolver = async (
  _parent: any,
  _args: any,
  context: any,
) => {
  try {
    if (!context.authorized) {
      throw new InvalidInputError('Unauthorized', 'UNAUTHORIZED');
    }

    const userId = context.userId;
    const employee = await Employee.findById(userId);

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

export const getEmergencyContact = {
  type: MessageType,
  resolve: getEmergencyContactResolver,
};

import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';
import { checkToken, createToken } from './token';
import { login, register } from './user';
import { getAllEmployeesProfiles } from './profiles_hr';
import { queryEmployee, onboarding } from './onboarding';
import {
  updateNameSection,
  updateAddressSection,
  updateContactSection,
  updateEmploymentSection,
  updateEmergencyContactSection,
  getPersonalAllInfo,
} from './personalInfo';
import { visa } from './visa';

const Message = new GraphQLObjectType({
  name: 'Hello',
  fields: {
    message: { type: GraphQLString },
    name: { type: GraphQLString },
  },
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      hello: {
        type: Message,
        resolve: () => ({
          message: 'Hello world',
          name: 'John Doe',
        }),
      },
      checkToken: checkToken,
      login: login,
      getAllEmployeesProfiles: getAllEmployeesProfiles,
      getPersonalAllInfo: getPersonalAllInfo,
      employee: queryEmployee,
      visa: visa,
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createToken: createToken,
      register: register,
      onboarding: onboarding,
      updateNameSection: updateNameSection,
      updateAddressSection: updateAddressSection,
      updateContactSection: updateContactSection,
      updateEmploymentSection: updateEmploymentSection,
      updateEmergencyContactSection: updateEmergencyContactSection,
    },
  }),
});

export default schema;

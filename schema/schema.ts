import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';
import { checkToken, createToken } from './token';
import { login, register } from './user';
import {
  updateNameSection,
  updateAddressSection,
  updateContactSection,
  updateEmploymentSection,
  updateEmergencyContactSection,
  getNameSection,
  getAddressSection,
  getContact,
  getEmergencyContactSection,
  getEmploymentSection,
} from './personalInfo';

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
      getNameSection: getNameSection,
      getAddressSection: getAddressSection,
      getContactSection: getContact,
      getEmergencyContactSection: getEmergencyContactSection,
      getEmploymentSection: getEmploymentSection,
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createToken: createToken,
      register: register,
      updateNameSection: updateNameSection,
      updateAddressSection: updateAddressSection,
      updateContactSection: updateContactSection,
      updateEmploymentSection: updateEmploymentSection,
      updateEmergencyContactSection: updateEmergencyContactSection,
    },
  }),
});

export default schema;

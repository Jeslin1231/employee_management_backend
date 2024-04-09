import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';
import { checkToken, createToken } from './token';
import { login, register } from './user';
import {
  updateName,
  updateAddress,
  updateContact,
  updateEmployment,
  updateEmergencyContact,
  getName,
  getAddress,
  getContact,
  getEmergencyContact,
  getEmployment,
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
      getName: getName,
      getAddress: getAddress,
      getContact: getContact,
      getEmergencyContact: getEmergencyContact,
      getEmployment: getEmployment,
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createToken: createToken,
      register: register,
      updateName: updateName,
      updateAddress: updateAddress,
      updateContact: updateContact,
      updateEmployment: updateEmployment,
      updateEmergencyContact: updateEmergencyContact,
    },
  }),
});

export default schema;

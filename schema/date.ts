import { GraphQLScalarType, Kind } from 'graphql';
import { InvalidInputError } from './error';

const DateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize(value) {
    if (value instanceof Date) {
      return value.getTime();
    }
    throw new Error('GraphQL Date scalar serializer expects a Date object');
  },
  parseValue(value) {
    if (typeof value === 'number') {
      return new Date(value);
    }
    throw new InvalidInputError('Invalid date input', 'number');
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10));
    }
    return null;
  },
});

export default DateScalar;

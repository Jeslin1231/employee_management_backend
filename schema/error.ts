import { GraphQLError, GraphQLErrorExtensions } from 'graphql';

export class NotFoundError extends GraphQLError {
  extensions: GraphQLErrorExtensions;
  constructor(message: string) {
    super(message);
    this.extensions = {
      status: 404,
      code: 'NOT_FOUND',
    };
  }
}

export class InvalidInputError extends GraphQLError {
  extensions: GraphQLErrorExtensions;
  constructor(message: string, field: string) {
    super(message);
    this.extensions = {
      status: 500,
      code: 'INVALID_INPUT',
      field,
    };
  }
}

export class InternalServerError extends GraphQLError {
  extensions: GraphQLErrorExtensions;
  constructor(message: string) {
    super(message);
    this.extensions = {
      status: 500,
      code: 'INTERNAL_SERVER_ERROR',
    };
  }
}

export class UnauthorizedError extends GraphQLError {
  extensions: GraphQLErrorExtensions;
  constructor(message: string, code: string) {
    super(message);
    this.extensions = {
      status: 401,
      code,
    };
  }
}

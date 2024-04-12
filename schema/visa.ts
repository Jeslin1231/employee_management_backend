import { GraphQLObjectType, GraphQLString, GraphQLList } from 'graphql';
import { UnauthorizedError, NotFoundError, InternalServerError } from './error';
import Visa from '../model/visa';
import User from '../model/user';
import Employee from '../model/employee';
import DateScalar from './date';
import { MessageType } from './message';

const VisaDocumentType = new GraphQLObjectType({
  name: 'VisaDocument',
  fields: {
    feedback: { type: GraphQLString },
    url: { type: GraphQLString },
    status: { type: GraphQLString },
  },
});

const VisaType = new GraphQLObjectType({
  name: 'Visa',
  fields: {
    visaTitle: { type: GraphQLString },
    optReceipt: { type: VisaDocumentType },
    optEad: { type: VisaDocumentType },
    i983: { type: VisaDocumentType },
    i20: { type: VisaDocumentType },
  },
});

const queryVisaResolver = async (_: any, __: any, context: any) => {
  if (!context.authorized || !context.userId) {
    throw new UnauthorizedError('Access denied', 'UNAUTHORIZED');
  }

  const visa = await Visa.findOne({ user: context.userId });
  if (!visa) {
    const newVisa = new Visa({
      user: context.userId,
      visaTitle: 'f1',
      optReceipt: { feedback: '', url: '', status: 'unsubmitted' },
      optEad: { feedback: '', url: '', status: 'unsubmitted' },
      i983: { feedback: '', url: '', status: 'unsubmitted' },
      i20: { feedback: '', url: '', status: 'unsubmitted' },
    });
    await newVisa.save();
    return newVisa;
  }
  return visa;
};

export const visa = {
  type: VisaType,
  resolve: queryVisaResolver,
};

const AllVisaType = new GraphQLObjectType({
  name: 'AllVisas',
  fields: {
    id: { type: GraphQLString },
    fullName: { type: GraphQLString },
    preferredName: { type: GraphQLString },
    visaTitle: { type: GraphQLString },
    visaStartDate: { type: DateScalar },
    visaEndDate: { type: DateScalar },
    optReceipt: { type: VisaDocumentType },
    optEad: { type: VisaDocumentType },
    i983: { type: VisaDocumentType },
    i20: { type: VisaDocumentType },
  },
});

const getAllVisaResolver = async (_: any, __: any, context: any) => {
  if (!context.authorized || !context.userId) {
    throw new UnauthorizedError('Access denied', 'UNAUTHORIZED');
  }

  const user = await User.findById(context.userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  if (user.role !== 'hr') {
    throw new UnauthorizedError('Unauthorized access', 'UNAUTHORIZED_ACCESS');
  }

  try {
    const visas = await Visa.find();

    const updtaedVisas = await Promise.all(
      visas.map(async visa => {
        const id = visa.user;

        let fullName = '';
        const employee = await Employee.findOne({ user: id });
        if (employee) {
          if (employee?.middleName) {
            fullName = `${employee.firstName} ${employee.middleName} ${employee.lastName}`;
          } else {
            fullName = `${employee?.firstName} ${employee?.lastName}`;
          }
        }

        const startDate = employee?.visaStartDate;
        const endDate = employee?.visaEndDate;
        const preferredName = employee?.preferredName;

        return {
          id: visa.user,
          fullName: fullName,
          preferredName: preferredName,
          visaTitle: visa.visaTitle,
          visaStartDate: startDate,
          visaEndDate: endDate,
          optReceipt: visa.optReceipt,
          optEad: visa.optEad,
          i983: visa.i983,
          i20: visa.i20,
        };
      }),
    );
    return updtaedVisas;
  } catch (error) {
    throw new InternalServerError('Failed to get visa in progress');
  }
};
export const allVisa = {
  type: new GraphQLList(AllVisaType),
  resolve: getAllVisaResolver,
};

interface visaFeedbackArgs {
  id: string;
  doc: string;
  feedback: string;
  status: 'unsubmitted' | 'pending' | 'approved' | 'rejected';
}

const visaFeedbackResolver = async (
  _: any,
  args: visaFeedbackArgs,
  context: any,
) => {
  if (!context.authorized || !context.userId) {
    throw new UnauthorizedError('Access denied', 'UNAUTHORIZED');
  }
  const user = await User.findById(context.userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  if (user.role !== 'hr') {
    throw new UnauthorizedError('Unauthorized access', 'UNAUTHORIZED_ACCESS');
  }

  const { id, doc, feedback, status } = args;

  const visa = await Visa.findOne({ user: id });
  if (!visa) {
    throw new NotFoundError('Visa not found');
  }

  if (doc === 'optReceipt') {
    if (visa.optReceipt) {
      visa.optReceipt.feedback = feedback ?? '';
      visa.optReceipt.status = args.status;
    } else {
      throw new InternalServerError('Invalid document');
    }
  } else if (doc === 'optEad') {
    if (visa.optEad) {
      visa.optEad.feedback = feedback ?? '';
      visa.optEad.status = status;
    } else {
      throw new InternalServerError('Invalid document');
    }
  } else if (doc === 'i983') {
    if (visa.i983) {
      visa.i983.feedback = feedback ?? '';
      visa.i983.status = status;
    } else {
      throw new InternalServerError('Invalid document');
    }
  } else if (doc === 'i20') {
    if (visa.i20) {
      visa.i20.feedback = feedback ?? '';
      visa.i20.status = status;
    } else {
      throw new InternalServerError('Invalid document');
    }
  } else {
    throw new InternalServerError('Invalid document');
  }

  await visa.save();
  return {
    api: 'updateDocumentStatus',
    type: 'mutation',
    status: 'success',
    message: 'Document status updated successfully',
  };
};

export const visaFeedback = {
  type: MessageType,
  args: {
    id: { type: GraphQLString },
    doc: { type: GraphQLString },
    feedback: { type: GraphQLString },
    status: { type: GraphQLString },
  },
  resolve: visaFeedbackResolver,
};

const updateVisaStatusResolver = async (
  _: any,
  args: { fileType: string; uri: string },
  context: any,
) => {
  if (!context.authorized || !context.userId) {
    throw new UnauthorizedError('Access denied', 'UNAUTHORIZED');
  }

  const visa = await Visa.findOne({ user: context.userId });
  if (!visa) {
    throw new NotFoundError('Visa not found');
  }

  visa.set(`${args.fileType}.status`, 'pending');
  visa.set(`${args.fileType}.url`, args.uri);
  await visa.save();
  return {
    api: 'updateVisaStatus',
    type: 'success',
    status: 'success',
    message: 'Visa status updated',
  };
};

export const updateVisaStatus = {
  type: MessageType,
  args: {
    fileType: { type: GraphQLString },
    uri: { type: GraphQLString },
  },
  resolve: updateVisaStatusResolver,
};

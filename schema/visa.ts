import { GraphQLObjectType, GraphQLString, GraphQLList } from 'graphql';
import { UnauthorizedError, NotFoundError, InternalServerError } from './error';
import Visa from '../model/visa';
import User from '../model/user';
import Employee from '../model/employee';
import DateScalar from './date';

const VisaDocumentType = new GraphQLObjectType({
  name: 'VisaDocument',
  fields: {
    feedback: { type: GraphQLString },
    url: { type: GraphQLString },
    status: { type: GraphQLString },
  },
});

const ReceiptType = new GraphQLObjectType({
  name: 'Receipt',
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
  type: ReceiptType,
  resolve: queryVisaResolver,
};

const AllVisaType = new GraphQLObjectType({
  name: 'AllVisas',
  fields: {
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

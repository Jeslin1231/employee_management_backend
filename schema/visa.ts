import { GraphQLObjectType, GraphQLString } from 'graphql';
import { UnauthorizedError } from './error';
import Visa from '../model/visa';

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

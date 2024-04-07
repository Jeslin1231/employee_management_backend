import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const DocumentSchema = new Schema({
  feedback: String,
  status: {
    type: String,
    enum: ['unsubmitted', 'pending', 'approved', 'rejected'],
    default: 'unsubmitted',
  },
});

const VisaSchema = new Schema({
  employee: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  visaTitle: {
    type: String,
    required: true,
  },
  optReceipt: DocumentSchema,
  optEad: DocumentSchema,
  i983: DocumentSchema,
  i20: DocumentSchema,
});

const Visa = mongoose.model('Visa', VisaSchema);
export default Visa;

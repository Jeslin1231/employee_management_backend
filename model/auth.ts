import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const AuthSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['normal', 'hr'],
    default: 'normal',
    required: true,
  },
  status: {
    type: String,
    enum: ['unsubmitted', 'pending', 'approved', 'rejected'],
    default: 'unsubmitted',
    required: true,
  },
  employee: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
  },
});

const Auth = mongoose.model('Auth', AuthSchema);
export default Auth;

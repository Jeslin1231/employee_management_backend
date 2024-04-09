import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const TokenSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Auth',
  },
  fullName: {
    type: String,
    // required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    // expires: 180,
  },
});

const Token = mongoose.model('Token', TokenSchema);
export default Token;

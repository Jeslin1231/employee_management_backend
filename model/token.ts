import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const TokenSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
  },
  username: {
    type: String,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  URL: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Token = mongoose.model('Token', TokenSchema);
export default Token;

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
});

const Auth = mongoose.model('Auth', AuthSchema);
export default Auth;

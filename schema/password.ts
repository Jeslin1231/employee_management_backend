import bcrypt from 'bcrypt';
import { InternalServerError } from './error';

export const cryptPassword = async (password: string) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw new InternalServerError('Failed to encrypt password');
  }
};

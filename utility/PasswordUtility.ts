import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { VenderPayload } from '../dto';
import { AuthPayload } from '../dto/Auth.dto';
require('dotenv').config();
import { Request } from 'express';

export const generateSalt = async () => {
  return await bcrypt.genSalt();
};

export const generateHashedPassword = async (
  password: string,
  salt: string,
) => {
  return await bcrypt.hash(password, salt);
};

export const validatePassword = async (
  enteredPassword: string,
  savedPassword: string,
  salt: string,
) => {
  return (
    (await generateHashedPassword(enteredPassword, salt)) === savedPassword
  );
};

export const generateSignature = (payload: VenderPayload) => {
  return jwt.sign(payload, process.env.APP_SECRET || '', {
    expiresIn: '1d',
  });
};

export const validateSignature = async (req: Request) => {
  const signature = req.get('Authorization');

  if (signature) {
    const payload = (await jwt.verify(
      signature.split(' ')[1],
      process.env.APP_SECRET || '',
    )) as AuthPayload;
    req.user = payload;

    return true;
  }

  return false;
};

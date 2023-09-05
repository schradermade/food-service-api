import express, { Request, Response, NextFunction } from 'express';
import { plainToClass } from 'class-transformer';
import { CreateCustomerInputs } from '../dto/Customer.dto';
import { validate } from 'class-validator';
import {
  generateHashedPassword,
  generateOtp,
  generateSalt,
  generateSignature,
  onRequestOtp,
} from '../utility';
import { Customer } from '../models/Customer';

export const CustomerSignup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const customerInputs = plainToClass(CreateCustomerInputs, req.body);

  const inputErrors = await validate(customerInputs, {
    validationError: { target: true },
  });

  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors);
  }

  const { email, phone, password } = customerInputs;

  const salt = await generateSalt();
  const userPassword = await generateHashedPassword(password, salt);

  const { otp, expiry } = generateOtp();

  const customerExists = await Customer.findOne({ email: email });

  if (customerExists !== null) {
    return res
      .status(409)
      .json({ message: 'User already exists with the provided email.' });
  }

  const result = await Customer.create({
    email: email,
    password: userPassword,
    salt: salt,
    phone: phone,
    otp: otp,
    otp_expiry: expiry,
    firstName: '',
    lastName: '',
    address: '',
    verified: false,
    lat: 0,
    lng: 0,
  });

  if (result) {
    // send the OTP to customer
    await onRequestOtp(otp, phone);

    // generate the signature
    const signature = generateSignature({
      _id: result._id,
      email: result.email,
      verified: result.verified,
    });

    // send the OTP to customer
    return res.status(201).json({
      signature: signature,
      verified: result.verified,
      email: result.email,
    });
  }
  return res.status(400).json({ message: 'Error with Signature' });
};

export const CustomerLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {};

export const CustomerVerify = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {};

export const RequestOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {};

export const GetCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {};

export const EditCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {};

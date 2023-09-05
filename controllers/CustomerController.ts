import express, { Request, Response, NextFunction } from 'express';
import { plainToClass } from 'class-transformer';
import { CreateCustomerInputs, UserLoginInputs } from '../dto/Customer.dto';
import { validate } from 'class-validator';
import {
  generateHashedPassword,
  generateOtp,
  generateSalt,
  generateSignature,
  onRequestOtp,
  validatePassword,
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
      otp: result.otp,
    });
  }
  return res.status(400).json({ message: 'Error with Signature' });
};

export const CustomerLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const loginInputs = plainToClass(UserLoginInputs, req.body);

  const loginErrors = await validate(loginInputs, {
    validationError: { target: false },
  });

  if (loginErrors.length > 0) {
    return res.status(409).json(loginErrors);
  }

  const { email, password } = loginInputs;

  const customer = await Customer.findOne({ email: email });

  if (customer) {
    const validation = await validatePassword(
      password,
      customer.password,
      customer.salt,
    );
    if (validation) {
      // generate the signature
      const signature = generateSignature({
        _id: customer._id,
        email: customer.email,
        verified: customer.verified,
      });

      // send the OTP to customer
      return res.status(201).json({
        signature: signature,
        verified: customer.verified,
        email: customer.email,
        otp: customer.otp,
      });
    }
  }
  return res.status(404).json({ message: 'Login eerror' });
};

export const CustomerVerify = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { otp } = req.body;

  const customer = req.user;
  if (customer) {
    const profile = await Customer.findById(customer._id);
    if (profile) {
      if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
        profile.verified = true;

        const updatedCustomerResponse = await profile.save();

        // generate the signature
        const signature = generateSignature({
          _id: updatedCustomerResponse._id,
          email: updatedCustomerResponse.email,
          verified: updatedCustomerResponse.verified,
        });

        return res.status(201).json({
          signature: signature,
          verified: updatedCustomerResponse.verified,
          email: updatedCustomerResponse.email,
        });
      }
    }
  }
  return res.status(400).json({ message: 'Error with OTP Validation' });
};

export const RequestOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile) {
      const { otp, expiry } = generateOtp();

      profile.otp = otp;
      profile.otp_expiry = expiry;

      await profile.save();

      await onRequestOtp(otp, profile.phone);

      return res
        .status(200)
        .json({
          message: `OTP sent to your registered phone number: ${profile.otp}`,
        });
    }
  }

  res.status(400).json({ message: 'Error with Request OTP' });
};

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

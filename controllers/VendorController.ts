import { Request, Response, NextFunction } from 'express';
import { EditVendorInputs, VendorLoginInputs } from '../dto';
import { generateSignature, validatePassword, getVendor } from '../utility';

export const VendorLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = <VendorLoginInputs>req.body;

  const existingVendor = await getVendor(undefined, email);

  if (!existingVendor) {
    return res.json({ message: 'This vendor does not exist.' });
  }

  const passwordValid = await validatePassword(
    password,
    existingVendor.password,
    existingVendor.salt,
  );
  if (passwordValid) {
    const signature = generateSignature({
      _id: existingVendor.id,
      email: existingVendor.email,
      foodType: existingVendor.foodType,
      name: existingVendor.name,
    });
    return res.json(signature);
  } else {
    return res.json({ message: 'Password is not valid!' });
  }
};

export const GetVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user;

  if (user) {
    const existingVendor = await getVendor(user._id);
    return res.json(existingVendor);
  }

  return res.json({ message: 'Vendor information not found' });
};

export const UpdateVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { foodType, name, address, phone } = <EditVendorInputs>req.body;
  const user = req.user;

  if (user) {
    const existingVendor = await getVendor(user._id);
    if (existingVendor !== null) {
      existingVendor.name = name;
      existingVendor.address = address;
      existingVendor.phone = phone;
      existingVendor.foodType = foodType;

      const savedResult = await existingVendor.save();
      return res.json(savedResult);
    }

    return res.json(existingVendor);
  }

  return res.json({ message: 'Vendor information not found' });
};

export const UpdateVendorService = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user;

  if (user) {
    const existingVendor = await getVendor(user._id);
    if (existingVendor !== null) {
      existingVendor.serviceAvailable = !existingVendor.serviceAvailable;
      const savedResult = await existingVendor.save();
      return res.json(savedResult);
    }

    return res.json(existingVendor);
  }

  return res.json({ message: 'Vendor information not found' });
};

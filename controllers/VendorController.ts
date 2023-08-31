import { Request, Response, NextFunction } from 'express';
import { EditVendorInputs, VendorLoginInputs } from '../dto';
import { generateSignature, validatePassword, getVendor } from '../utility';
import { CreateFoodInputs } from '../dto/Food.dto';
import { Food } from '../models';

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

  const passwordIsValid = await validatePassword(
    password,
    existingVendor.password,
    existingVendor.salt,
  );

  if (passwordIsValid) {
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

export const AddFood = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user;

  if (user) {
    const { name, description, category, foodType, readyTime, price } = <
      CreateFoodInputs
    >req.body;

    const vendor = await getVendor(user._id);

    if (vendor !== null) {
      const files = req.files as [Express.Multer.File];

      const imageFileNames = files.map(
        (file: Express.Multer.File) => file.filename,
      );

      const createdFood = await Food.create({
        vendorId: vendor._id,
        name: name,
        description: description,
        category: category,
        foodType: foodType,
        images: imageFileNames,
        readyTime: readyTime,
        price: price,
        rating: 0,
      });

      vendor.foods.push(createdFood);
      const result = await vendor.save();

      return res.json(result);
    }
  }

  return res.json({ message: 'Could not add food item' });
};

export const GetFoods = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user;

  if (user) {
    const foods = await Food.find({ vendorId: user._id });

    if (foods !== null) {
      return res.json(foods);
    }
  }

  return res.json({ message: 'Food info not found.' });
};

import express, { Request, Response, NextFunction } from 'express';
import { FoodDoc, Vendor } from '../models';

export const GetFoodAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const pincode = req.params.pincode;

  const result = await Vendor.find({
    pincode: pincode,
    serviceAvailable: false,
  })
    .sort([['rating', 'descending']])
    .populate('foods');

  if (result.length > 0) {
    return res.status(200).json(result);
  }

  return res.status(404).json({ message: 'No restaurants found.' });
};

export const GetTopRestaurants = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const pincode = req.params.pincode;

  const result = await Vendor.find({
    pincode: pincode,
    serviceAvailable: false,
  })
    .sort([['rating', 'descending']])
    .limit(10);

  if (result.length > 0) {
    return res.status(200).json(result);
  }

  return res.status(404).json({ message: 'Top Restaurant not found.' });
};

export const GetFoodsIn30Min = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const pincode = req.params.pincode;

  const result = await Vendor.find({
    pincode: pincode,
    serviceAvailable: false,
  }).populate('foods');

  if (result.length > 0) {
    let foodResult: any = [];

    result.map((vendor) => {
      const foods = vendor.foods as [FoodDoc];
      const filteredResults = foods.filter((food) => food.readyTime < 30);
      foodResult.push(...filteredResults);
    });

    return res.status(200).json(foodResult);
  }

  return res.status(404).json({ message: 'Food in 30 min not found.' });
};

export const SearchFoods = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const pincode = req.params.pincode;

  const result = await Vendor.find({
    pincode: pincode,
    serviceAvailable: false,
  }).populate('foods');

  if (result.length > 0) {
    const foodsResult = [] as any;
    result.map((vendor) => foodsResult.push(...vendor.foods));
    return res.status(200).json(foodsResult);
  }

  return res.status(404).json({ message: 'Search foods found no data.' });
};

export const RestaurantById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.id;

  const result = await Vendor.findById(id).populate('foods');

  if (result) {
    return res.status(200).json(result);
  }

  return res
    .status(404)
    .json({ message: `Restaurant with id: ${id} not found!` });
};

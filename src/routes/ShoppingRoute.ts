import express, { Request, Response, NextFunction } from 'express';
import {
  GetFoodAvailability,
  GetFoods,
  GetFoodsIn30Min,
  GetTopRestaurants,
  RestaurantById,
  SearchFoods,
} from '../controllers';

const router = express.Router();

// Food Availability
router.get('/:pincode', GetFoodAvailability);
// Top Restaurants
router.get('/top-restaurants/:pincode', GetTopRestaurants);
// Foods Availabe in 30 Min
router.get('/foods-in-30-min/:pincode', GetFoodsIn30Min);
// Search Foods
router.get('/search/:pincode', SearchFoods);
// Find Restaurant by ID
router.get('/restaurant/:id', RestaurantById);

export { router as ShoppingRoute };

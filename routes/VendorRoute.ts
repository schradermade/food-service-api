import express, { Request, Response, NextFunction } from 'express';
import {
  AddFood,
  GetFoods,
  GetVendorProfile,
  UpdateVendorProfile,
  UpdateVendorService,
  VendorLogin,
} from '../controllers';
import { authenticateUser } from '../middlewares';

const router = express.Router();

router.post('/login', VendorLogin);

router.use(authenticateUser);
router.get('/profile', GetVendorProfile);
router.patch('/profile', UpdateVendorProfile);
router.patch('/service', UpdateVendorService);

router.post('/food', AddFood);
router.get('/foods', GetFoods);

router.post('/food', AddFood);
router.get('/foods');

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: 'Hello from Vendor' });
});

export { router as VendorRoute };

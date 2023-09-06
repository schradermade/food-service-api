import mongoose from 'mongoose';
import { MONGO_DB_URI } from '../config';

export default async () => {
  try {
    mongoose.connect(MONGO_DB_URI || '');
    console.log('DB Connected...');
  } catch (error) {
    console.log(error);
  }
};

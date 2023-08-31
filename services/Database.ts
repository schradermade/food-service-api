require('dotenv').config();
import mongoose from 'mongoose';

export default async () => {
  try {
    mongoose.connect(process.env.MONGO_DB_URI || '');
    console.log('DB Connected...');
  } catch (error) {
    console.log(error);
  }
};

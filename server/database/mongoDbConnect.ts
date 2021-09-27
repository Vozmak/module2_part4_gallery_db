import mongoose from 'mongoose';
import config from '../config.json'

const url: string = config.connectDb;

const connectDb = async () => {
  await mongoose.connect(url);
};

export { connectDb };

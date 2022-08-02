import 'express-async-errors';
import mongoose from 'mongoose';

import { app } from './app';

//from auth-mongo-depl
const start = async () => {
  console.log('Starting up......');
  if (!process.env.JWT_KEY) {
    throw new Error('env secret must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!');
  });
};

start();

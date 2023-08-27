import 'express-async-errors';
import mongoose from 'mongoose';
import { randomChalk } from 'ody-utils';
import app from './app';
import initiate_master from './services/agent/initiate-master';

const PORT = process.env.PORT || 8000;

if (!process.env.JWT_KEY) {
  throw new Error('Env Missing: JWT_KEY must be provided');
}

if (!process.env.ANTI_CAPCAY_API_KEY) {
  throw new Error('Env Missing: ANTI_CAPCAY_API_KEY must be provided');
}

if (!process.env.MASTER_USERNAME) {
  throw new Error('Env Missing: MASTER_USERNAME must be provided');
}

if (!process.env.MASTER_PASSWORD) {
  throw new Error('Env Missing: MASTER_PASSWORD must be provided');
}

if (!process.env.IDN_BASE_URL) {
  throw new Error('Env Missing: IDN_BASE_URL must be provided');
}

if (!process.env.IDN_USERNAME) {
  throw new Error('Env Missing: IDN_USERNAME must be provided');
}

if (!process.env.IDN_PASSWORD) {
  throw new Error('Env Missing: IDN_PASSWORD must be provided');
}

if (!process.env.IDN_PIN) {
  throw new Error('Env Missing: IDN_PIN must be provided');
}

if (!process.env.VIGOR_USERNAME) {
  throw new Error('Env Missing: VIGOR_USERNAME must be provided');
}

if (!process.env.VIGOR_PASSWORD) {
  throw new Error('Env Missing: VIGOR_PASSWORD must be provided');
}

const DB_NAME = process.env.DB_NAME || 'generator-4D';
mongoose.connect(`mongodb://127.0.0.1:27017/${DB_NAME}`);
randomChalk('Connected to MongoDB');

mongoose.connection.on('error', error => {
  console.error('MongoDB connection error', error);
});

mongoose.connection.on('disconnected', () => {
  randomChalk('MongoDB disconnected');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  randomChalk('MongoDB terminated');
  process.exit(0);
});

app.listen(PORT, () => {
  randomChalk(`Listening on port: ${PORT}`);
});

initiate_master();

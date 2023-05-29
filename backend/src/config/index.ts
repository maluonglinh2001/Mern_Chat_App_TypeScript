import { config } from 'dotenv';
import mongoose from 'mongoose';
import color from 'colors';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, PORT, SECRET_KEY, LOG_FORMAT, LOG_DIR, ORIGIN, MONGO_URI } = process.env;

export async function connectToDatabase(): Promise<void> {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(color.yellow('Database connected!'));
  } catch (error) {
    console.error(color.red('Failed to connect to the database:'), error);
    process.exit(1);
  }
}

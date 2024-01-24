import mongoose from "mongoose";
import { config } from '../util/config.util';

export const db = () => {
  mongoose
  .connect(config.MONGODB_URL as string)
  .then(() => {
    console.log('Connected Successfully to the database');
  })
  .catch((err: Error) => {
    console.error(err);
  });
}
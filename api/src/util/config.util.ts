import { config as dotenv } from 'dotenv'

dotenv();

export const config = {
  PORT: process.env.PORT,
  MONGODB_URL: process.env.MONGODB_URL,
  SECRET_KEY: process.env.SECRET_KEY
};
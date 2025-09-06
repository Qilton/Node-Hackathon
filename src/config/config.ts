import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  mongoUri: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI || 'mongodb+srv://Qilton:9832900366@cluster0.waa82mj.mongodb.net/',
};
  export const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export default config;
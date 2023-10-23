import dotenv from "dotenv";

dotenv.config();

export const {
    PORT,
    NODE_ENV,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    SECRET,
    DATABASE_URL_DEV,
    DATABASE_URL_TEST,
    DATABASE_URL
} = process.env;

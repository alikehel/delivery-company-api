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
    DATABASE_URL,
    AWS_S3_BUCKET,
    AWS_PROFILE,
    AWS_REGION,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    OPENAI_API_KEY
} = process.env;

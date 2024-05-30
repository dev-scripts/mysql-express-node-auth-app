import dotenv from "dotenv-safe";
dotenv.config();
export const envVariables = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV || "development",

  DB_TYPE: process.env.DB_TYPE,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT || 8000,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,

  SECRET_TOKEN: process.env.SECRET_TOKEN as string,

  AWS_REGION: process.env.AWS_REGION as string,
  AWS_SES_SECRET_ACCESS_KEY: process.env.AWS_SES_SECRET_ACCESS_KEY as string,
  AWS_SES_ACCESS_KEY_ID: process.env.AWS_SES_ACCESS_KEY_ID as string,
  FROM_EMIAL: process.env.FROM_EMIAL as string,

  WEB_APP_BASE_URL: process.env.WEB_APP_BASE_URL as string,
};

export default envVariables;

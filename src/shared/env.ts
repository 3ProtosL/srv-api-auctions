// src/config/envs.ts
import 'dotenv/config';
import Joi from 'joi';



interface EnvVars {
  PORT: number;
  MONGO_URI: string;
  APPWRITE_ENDPOINT: string;
  APPWRITE_PROJECT_ID: string;
  APPWRITE_BUCKET_ID: string;
  APPWRITE_API_KEY: string;
}


const envsSchema = Joi
  .object({
    PORT: Joi.number().default(3000),
    MONGO_URI: Joi.string().required(),
    APPWRITE_ENDPOINT: Joi.string().required(),
    APPWRITE_PROJECT_ID: Joi.string().required(),
    APPWRITE_BUCKET_ID: Joi.string().required(),
    APPWRITE_API_KEY: Joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  mongoUri: envVars.MONGO_URI,
  appwrite: {
    endpoint: envVars.APPWRITE_ENDPOINT,
    projectId: envVars.APPWRITE_PROJECT_ID,
    bucketId: envVars.APPWRITE_BUCKET_ID,
    apiKey: envVars.APPWRITE_API_KEY,
  },
};
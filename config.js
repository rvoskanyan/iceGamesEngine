import dotenv from 'dotenv';

dotenv.config();

export const websiteAddress = process.env.WEB_SITE_ADDRESS;
export const mongoDbUri = process.env.MONGODB_URI;
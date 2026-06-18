// api.ts

const isDevelopment = __DEV__;

export const BASE_URL = isDevelopment
    ? process.env.EXPO_PUBLIC_API_URL_DEV
    : process.env.EXPO_PUBLIC_API_URL_PROD;

export const BASE_URL_API = `${BASE_URL}/api`;
export const BASE_URL_IMAGES = `${BASE_URL}/images/`;


if (!BASE_URL) {
    console.warn("Warning: BASE_URL is undefined. Check your .env configuration.");
}
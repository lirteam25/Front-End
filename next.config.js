/** @type {import('next').NextConfig} */
require("dotenv").config({ path: './.env' });

const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        hostname: "gateway.pinata.cloud"
      },
      {
        hostname: "res.cloudinary.com"
      },
      {
        hostname: "fonts.google.com/"
      }
    ]
  },
  env: {
    DB_URL: process.env.DB_URL,
    FIREBASE_CONF_APIKEY: process.env.FIREBASE_CONF_APIKEY,
    FIREBASE_CONF_AUTH_DOMAIN: process.env.FIREBASE_CONF_AUTH_DOMAIN,
    FIREBASE_CONF_DATABASE_URL: process.env.FIREBASE_CONF_DATABASE_URL,
    FIREBASE_CONF_PROJECT_ID: process.env.FIREBASE_CONF_PROJECT_ID,
    FIREBASE_CONF_STORAGE_BUCKET: process.env.FIREBASE_CONF_STORAGE_BUCKET,
    FIREBASE_CONF_MESSAGING_SENDER_ID: process.env.FIREBASE_CONF_MESSAGING_SENDER_ID,
    FIREBASE_CONF_APP_ID: process.env.FIREBASE_CONF_APP_ID,
    FIREBASE_CONF_MEASURAMENT_ID: process.env.FIREBASE_CONF_MEASURAMENT_ID,
    NEXT_PUBLIC_GATEWAY_URL: process.env.NEXT_PUBLIC_GATEWAY_URL,
    PINATA_API_KEY: process.env.PINATA_API_KEY,
    PINATA_SECRET_API_KEY: process.env.PINATA_SECRET_API_KEY,
    PINATA_GATEWAY_TOKEN: process.env.PINATA_GATEWAY_TOKEN,
    PINATA_JWT: process.env.PINATA_JWT,
    CLOUDINARY_URL: process.env.CLOUDINARY_URL,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    OWNER_PRIVATE_KEY: process.env.OWNER_PRIVATE_KEY,
    ALCHEMY_RPC_MAINNET: process.env.ALCHEMY_RPC_MAINNET,
    THIRDWEB_PROJECT_ID: process.env.THIRDWEB_PROJECT_ID,
    THIRDWEB_API_KEY: process.env.THIRDWEB_API_KEY,
    ACTIVE_CHAIN: process.env.ACTIVE_CHAIN,
    CROSSMINT_PROJECT_ID: process.env.CROSSMINT_PROJECT_ID,
    NEXT_PUBLIC_DOMAIN: process.env.NEXT_PUBLIC_DOMAIN,
    META_PIXELS_ID: process.env.META_PIXELS_ID
  }
};

module.exports = nextConfig;
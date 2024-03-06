/** @type {import('next').NextConfig} */
require("dotenv").config({ path: './.env' });

const nextConfig = {
  webpack: config => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config
  },
  reactStrictMode: false,
  swcMinify: true,
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
    DB_URL: process.env.NODE_ENV == "production" ? process.env.DB_URL : process.env.DB_URL_DEV,
    FIREBASE_CONF_APIKEY: process.env.NODE_ENV == "production" ? process.env.FIREBASE_CONF_APIKEY : process.env.FIREBASE_CONF_APIKEY_DEV,
    FIREBASE_CONF_AUTH_DOMAIN: process.env.NODE_ENV == "production" ? process.env.FIREBASE_CONF_AUTH_DOMAIN : process.env.FIREBASE_CONF_AUTH_DOMAIN_DEV,
    FIREBASE_CONF_DATABASE_URL: process.env.FIREBASE_CONF_DATABASE_URL,
    FIREBASE_CONF_PROJECT_ID: process.env.NODE_ENV == "production" ? process.env.FIREBASE_CONF_PROJECT_ID : process.env.FIREBASE_CONF_PROJECT_ID_DEV,
    FIREBASE_CONF_STORAGE_BUCKET: process.env.NODE_ENV == "production" ? process.env.FIREBASE_CONF_STORAGE_BUCKET : process.env.FIREBASE_CONF_STORAGE_BUCKET_DEV,
    FIREBASE_CONF_MESSAGING_SENDER_ID: process.env.NODE_ENV == "production" ? process.env.FIREBASE_CONF_MESSAGING_SENDER_ID : process.env.FIREBASE_CONF_MESSAGING_SENDER_ID_DEV,
    FIREBASE_CONF_APP_ID: process.env.NODE_ENV == "production" ? process.env.FIREBASE_CONF_APP_ID : process.env.FIREBASE_CONF_APP_ID_DEV,
    FIREBASE_CONF_MEASURAMENT_ID: process.env.NODE_ENV == "production" ? process.env.FIREBASE_CONF_MEASURAMENT_ID : process.env.FIREBASE_CONF_MEASURAMENT_ID_DEV,
    PINATA_API_KEY: process.env.NODE_ENV == "production" ? process.env.PINATA_API_KEY : process.env.PINATA_API_KEY_DEV,
    PINATA_SECRET_API_KEY: process.env.NODE_ENV == "production" ? process.env.PINATA_SECRET_API_KEY : process.env.PINATA_SECRET_API_KEY_DEV,
    CLOUDINARY_URL: process.env.NODE_ENV == "production" ? process.env.CLOUDINARY_URL : process.env.CLOUDINARY_URL_DEV,
    CLOUDINARY_CLOUD_NAME: process.env.NODE_ENV == "production" ? process.env.CLOUDINARY_CLOUD_NAME : process.env.CLOUDINARY_CLOUD_NAME_DEV,
    OWNER_PRIVATE_KEY: process.env.NODE_ENV == "production" ? process.env.OWNER_PRIVATE_KEY : process.env.OWNER_PRIVATE_KEY_DEV,
    ALCHEMY_RPC_MAINNET: process.env.NODE_ENV == "production" ? process.env.ALCHEMY_RPC_MAINNET : process.env.ALCHEMY_RPC_TESTNET_DEV,
    WEB3MODAL_PROJECT_ID: process.env.WEB3MODAL_PROJECT_ID
  }
};

module.exports = nextConfig;
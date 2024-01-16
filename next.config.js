/** @type {import('next').NextConfig} */
require("dotenv").config({ path: './.env' });
const { i18n } = require('./next-i18next.config');

const nextConfig = {
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
    DB_URL: process.env.DB_URL,
    FIREBASE_CONF_APIKEY: process.env.FIREBASE_CONF_APIKEY,
    FIREBASE_CONF_AUTH_DOMAIN: process.env.FIREBASE_CONF_AUTH_DOMAIN,
    FIREBASE_CONF_DATABASE_URL: process.env.FIREBASE_CONF_DATABASE_URL,
    FIREBASE_CONF_PROJECT_ID: process.env.FIREBASE_CONF_PROJECT_ID,
    FIREBASE_CONF_STORAGE_BUCKET: process.env.FIREBASE_CONF_STORAGE_BUCKET,
    FIREBASE_CONF_MESSAGING_SENDER_ID: process.env.FIREBASE_CONF_MESSAGING_SENDER_ID,
    FIREBASE_CONF_APP_ID: process.env.FIREBASE_CONF_APP_ID,
    FIREBASE_CONF_MEASURAMENT_ID: process.env.FIREBASE_CONF_MEASURAMENT_ID,
    PINATA_API_KEY: process.env.PINATA_API_KEY,
    PINATA_SECRET_API_KEY: process.env.PINATA_SECRET_API_KEY,
    CLOUDINARY_URL: process.env.CLOUDINARY_URL,
    METAMASK_WALLET_PRIVATE_KEY_TORIUKE: process.env.METAMASK_WALLET_PRIVATE_KEY_TORIUKE,
    METAMASK_WALLET_PRIVATE_KEY_MARLON: process.env.METAMASK_WALLET_PRIVATE_KEY_MARLON,
    METAMASK_WALLET_PRIVATE_KEY_TROVIERO: process.env.METAMASK_WALLET_PRIVATE_KEY_TROVIERO,
    ALCHEMY_RPC_MAINNET: process.env.ALCHEMY_RPC_MAINNET
  },
  i18n
};

module.exports = nextConfig;
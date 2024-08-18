/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN || 'https://lirmusic.com', // Replace with your actual domain
    generateRobotsTxt: true, // (Optional) Generate robots.txt file
    sitemapSize: 5000, // (Optional) Split sitemap if you have more than 5000 URLs
    exclude: ['/success', "/mobileLogin", "successLogin", "/404"], // (Optional) Exclude specific routes if needed
};

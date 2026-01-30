/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "appetizing-cabbage-e4ead111c1.strapiapp.com",
      },
      // Add your main Strapi domain if different
      {
        protocol: "https",
        hostname: "*.strapiapp.com",
      },
      // If you have a custom domain for Strapi, add it here
      // {
      //   protocol: "https",
      //   hostname: 'your-strapi-domain.com',
      // },
    ],
  },
};

module.exports = nextConfig;

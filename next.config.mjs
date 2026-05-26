/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default nextConfig;

module.exports = {
  async redirects() {
    return [
      {
        source: '/500',
        destination: 'https://500.naturatech.org',
        permanent: true,
      },
    ];
  },
};
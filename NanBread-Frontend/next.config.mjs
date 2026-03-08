/** @type {import('next').NextConfig} */
const flaskUrl = process.env.NEXT_PUBLIC_FLASK_API_URL || 'http://localhost:8080';

const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${flaskUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { appDir: true },
  async redirects() {
    return [
      {
        source: '/auth',
        destination: '/auth/login',
        permanent: true,
      },
      {
        source: '/editTopicPoint',
        destination: '/',
        permanent: true,
      },
      {
        source: '/account',
        destination: '/account/accountInformation',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig

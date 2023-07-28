/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { appDir: true },
  env: {
    // eslint-disable-next-line no-undef
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '',
  },
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

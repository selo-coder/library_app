/* eslint-disable no-undef */
/** @type {import('next').NextConfig} */

const nextConfig = {
  httpAgentOptions: {
    keepAlive: true,
  },
  experimental: { appDir: true, serverActions: true },
  env: {
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

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)

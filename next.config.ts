import type { NextConfig } from 'next'
import { getApiDomain } from './utils/domain'

const nextConfig: NextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  turbopack: {
    resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },
  rewrites: async () => {
    
    return [
      {
        source: '/api/:path*',
        destination: getApiDomain() + '/:path*',
      },
    ]
  },
}

export default nextConfig

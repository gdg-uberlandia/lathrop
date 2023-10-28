/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: true,
  images: {
    domains: ['firebasestorage.googleapis.com', 'media.licdn.com', 'raw.githubusercontent.com'],
  },
  /*exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      '/': { page: '/' },
      '/home': { page: '/' },
      '/sponsors': { page: '/sponsors' },
      '/speakers': { page: '/speakers' },
      '/campaigns': { page: '/campaigns' },
    }
  },*/
}


module.exports = nextConfig

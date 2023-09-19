/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: true,
  // images: {
  //   loader: 'akamai',
  //   path: '/',
  //   domains: ['firebasestorage.googleapis.com'],
  // },
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

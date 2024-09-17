/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    dangerouslyAllowSVG: true,
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

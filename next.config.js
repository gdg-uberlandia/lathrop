/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2592000,
    domains: [
      "firebasestorage.googleapis.com",
      "media.licdn.com",
      "raw.githubusercontent.com",
      "lh3.googleusercontent.com",
      "i.ytimg.com",
      "storage.googleapis.com",
      "api.dicebear.com",
      "pokedex.devfesttriangulo.com.br",
    ],
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
};

module.exports = nextConfig;

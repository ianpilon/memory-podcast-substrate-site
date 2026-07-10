const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.jsx',
  defaultShowCopyCode: true,
})

module.exports = withNextra({
  reactStrictMode: true,
  async redirects() {
    return [
      // The central thesis was renamed; keep old links and bookmarks working.
      {
        source: '/memory-as-substrate-thesis',
        destination: '/memory-as-navigation-thesis',
        permanent: true,
      },
    ]
  },
  // Ship the wiki .mdx files alongside the /api/chat serverless function so its
  // BM25 retrieval can read them at request time (Vercel and similar platforms).
  // Next.js 14 nests this key under `experimental`; Next.js 15 moves it to top-level.
  experimental: {
    outputFileTracingIncludes: {
      '/api/chat': ['./src/pages/**/*.mdx', './src/pages/**/*.md'],
    },
  },
})

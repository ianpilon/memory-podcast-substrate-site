const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.jsx',
  defaultShowCopyCode: true,
})

module.exports = withNextra({
  reactStrictMode: true,
  async redirects() {
    return [
      // The central thesis was renamed twice (substrate -> navigation -> construction);
      // keep old links and bookmarks working by pointing both at the current page.
      {
        source: '/memory-as-substrate-thesis',
        destination: '/memory-as-construction-thesis',
        permanent: true,
      },
      {
        source: '/memory-as-navigation-thesis',
        destination: '/memory-as-construction-thesis',
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

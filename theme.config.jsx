export default {
  logo: <span style={{ fontWeight: 'bold' }}>Memory as Construction</span>,
  project: {
    link: 'https://github.com/ianpilon/memory-as-construction-site'
  },
  docsRepositoryBase: 'https://github.com/ianpilon/memory-as-construction-site/tree/main',
  useNextSeoProps() {
    return {
      titleTemplate: '%s – Memory as Construction'
    }
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      <meta name="description" content="A Karpathy-style LLM wiki on memory, identity, and the construction question." />
    </>
  ),
  navigation: {
    prev: true,
    next: true
  },
  footer: {
    text: 'Memory as Construction wiki ' + new Date().getFullYear()
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: true
  },
  toc: {
    float: true,
    title: 'On This Page'
  }
}

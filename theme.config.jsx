export default {
  logo: <span style={{ fontWeight: 'bold' }}>Memory as Substrate</span>,
  project: {
    link: 'https://github.com/ianpilon/memory-podcast-substrate-site'
  },
  docsRepositoryBase: 'https://github.com/ianpilon/memory-podcast-substrate-site/tree/main',
  useNextSeoProps() {
    return {
      titleTemplate: '%s – Memory as Substrate'
    }
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      <meta name="description" content="A Karpathy-style LLM wiki on memory, identity, and the substrate question." />
    </>
  ),
  navigation: {
    prev: true,
    next: true
  },
  footer: {
    text: 'Memory as Substrate wiki ' + new Date().getFullYear()
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

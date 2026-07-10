# Memory as Construction

A Karpathy-style LLM wiki on memory, identity, and the construction question. The central thesis: **memory is not storage to be retrieved; it is the construction process by which an agent persists across time.** Five converging arguments support it, from psychology, biology, and AI engineering.

**Live:** https://memory-as-construction-site.vercel.app

> See [On the Rename](https://memory-as-construction-site.vercel.app/on-naming) for the arc from "substrate" to "navigation" to "construction." The short version: biological and AI memory differ at the substrate level but share a function, and the name has to sit at the function level where they are genuinely the same thing.

## The thesis

- **Psychology** (Martin Conway): the Self-Memory System. Memory and self are bidirectionally coupled; memory is reconstructed at every retrieval.
- **Biology** (Michael Levin): memory as agential cognitive glue. Active reinterpretation, no single substrate, scale-free across cells and lineages.
- **AI engineering, principles** (Robert Youssef): the paradigm shift from retrieval to identity construction. Five principles current AI memory lacks.
- **AI engineering, measured** (NapMem / Xu et al.): memory as a structured action space the agent navigates, not passively retrieved context. The first measured source in the wiki.

## Architecture: two sources of truth

This repo is the **published artifact**, not the editing surface. Content lives in an Obsidian vault and is compiled into the site.

```
Obsidian vault (Wiki/*.md)   ──convert-wiki.py──▶   src/pages/*.mdx   ──▶   Next.js build
       the editing source                            the site
```

- **Obsidian vault** (`memory-as-construction/`): the source of truth. Pages use `[[slug]]` wiki-links, plus `[[slug|alias]]` where the link label should differ from the slug.
- **`scripts/convert-wiki.py`**: rewrites `[[slug]]` → `[slug](/slug)`, handles aliases, and writes the `.mdx` files. Run it after editing the vault. It skips `index.md`, which is hand-maintained on the site side as `src/pages/index.mdx`.

Process pages ([Log](https://memory-as-construction-site.vercel.app/log), [Open Questions](https://memory-as-construction-site.vercel.app/open-questions), [On the Rename](https://memory-as-construction-site.vercel.app/on-naming)) document ingest history and the unresolved tensions between sources.

## Features

- **Built-in AI chat** (Groq-powered, with BM25 retrieval over the wiki). A pill-shaped "Ai" button sits bottom-right on every page; `Cmd+/` toggles it.
- **Drag-drop source ingest.** A "+ Add source" button drafts wiki pages from a dropped `.md`/`.txt`/`.pdf` and opens a pull request with the new files.
- Dark/Light mode, full-text search, mobile responsive, code highlighting, table of contents, MDX support.

## AI Chat

Per question, the API ranks all `.mdx` pages by BM25 against the query, sends the top 4 most relevant pages (plus the page being viewed) to Groq's Llama 3.3 70B, and asks for a short answer with markdown citations. Citations render as inline clickable links. Chat history persists across in-app navigation until Reset.

**Setup:**
1. Copy `.env.local.example` to `.env.local`.
2. Get a free [Groq API key](https://console.groq.com/keys) and paste it as `GROQ_API_KEY=...`.
3. `npm run dev`

On Vercel, set `GROQ_API_KEY` as an environment variable instead. To change the suggested prompts, edit `src/components/WikiChat.jsx`.

## Drag-drop source ingest

Drop a `.md`, `.txt`, or `.pdf` and the server extracts the text, asks Groq to draft a summary page plus 3 to 8 concept pages following the Karpathy-style wiki format, then opens a pull request on this repo. Review the diff and merge; Vercel auto-redeploys with the new pages.

`POST /api/ingest` parses the upload with `formidable`, extracts text (`.md`/`.txt` directly, `.pdf` via [`unpdf`](https://github.com/unjs/unpdf)), calls Groq with the file content plus the current index for context, then uses Octokit to create a branch and open a PR.

**Required env vars (in addition to `GROQ_API_KEY`):**
- `GITHUB_TOKEN` — fine-grained PAT with `Contents: Read and write` + `Pull requests: Read and write` on this repo. Generate at https://github.com/settings/personal-access-tokens/new.
- `GITHUB_REPO_OWNER` — your GitHub username or org.
- `GITHUB_REPO_NAME` — the repo name (defaults to `memory-as-construction-site`).
- `GITHUB_BASE_BRANCH` — optional, defaults to `main`.
- `WIKI_TOPIC` — optional, injected into the LLM prompt for better outputs.

On Vercel, paste all of these into Settings → Environment Variables (Production + Preview + Development). Paste the `GITHUB_TOKEN` value directly into Vercel, never into a chat or other tool.

**Limits:** 10 MB file size, 60 second serverless function timeout (Vercel Hobby). Scanned PDFs without selectable text fail with a clear error message. Large PDFs may need to be split.

> **Security note:** `/api/ingest` is unauthenticated and spends Groq tokens while opening PRs via the configured PAT. If the deployed URL is public, anyone can use it. Add auth or rate limiting before enabling it on a public deployment.

## Tech stack

- [Next.js](https://nextjs.org/) + [Nextra](https://nextra.site/) (docs theme)
- [Tailwind CSS](https://tailwindcss.com/)
- [MDX](https://mdxjs.io/)
- [Groq](https://groq.com/) (Llama 3.3 70B) for chat and ingest
- [Octokit](https://github.com/octokit/rest.js) for PR creation
- Python 3 for the vault → site converter

## Quick start

```bash
git clone https://github.com/ianpilon/memory-as-construction-site.git
cd memory-as-construction-site
npm install
npm run dev
```

Open http://localhost:3000.

## Regenerating pages from the vault

After editing the Obsidian vault, regenerate the site pages:

```bash
python3 scripts/convert-wiki.py
```

The script expects the vault at `Documents/Obsidian Vault/memory-as-construction/Wiki`. Edit `WIKI_DIR` at the top of the script if your path differs. It overwrites all generated `.mdx` files except `index.mdx`, which is hand-maintained.

## Project structure

```
src/
├── pages/          # MDX wiki pages (generated) + index.mdx (hand-maintained)
│   ├── api/        # /api/chat (BM25 + Groq), /api/ingest (upload → PR)
│   └── _meta.json  # sidebar structure (hand-maintained)
├── components/     # WikiChat.jsx, UploadDrop.jsx, useThemeTokens.js
└── styles/         # globals.css
scripts/
└── convert-wiki.py # Obsidian vault → Nextra .mdx
theme.config.jsx    # branding, nav, TOC
next.config.js      # Nextra config, file tracing for /api/chat, redirects
```

## Deployment

This site deploys on Vercel from `main`. Push to `main` and Vercel auto-deploys.

For a fresh deploy:

1. Push the code to GitHub.
2. Import the repository into [Vercel](https://vercel.com).
3. Set the environment variables (see above). Deploy with zero additional configuration.

Manual build:

```bash
npm run build
npm run start
```

## License

MIT — see the [LICENSE](LICENSE) file.

---
Made by [Ian Pilon](https://github.com/ianpilon)

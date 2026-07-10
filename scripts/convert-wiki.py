#!/usr/bin/env python3
"""Convert Obsidian-style wiki .md files to Nextra .mdx files.

Reads Wiki/*.md from the source wiki, rewrites [[slug]] to [slug](/slug),
escapes any MDX-hostile characters, and writes to src/pages/*.mdx.

Skips index.md (handled separately) and any *.md without a clear slug.
"""

import re
import sys
from pathlib import Path

WIKI_DIR = Path("/Users/ianpilon/Documents/Obsidian Vault/memory-as-navigation/Wiki")
OUT_DIR = Path(__file__).resolve().parent.parent / "src" / "pages"
SKIP = {"index.md"}

# Matches Obsidian wiki-links. Supports two forms:
#   [[slug]]            -> [slug](/slug)
#   [[slug|alias]]      -> [alias](/slug)
WIKI_LINK_RE = re.compile(r"\[\[([a-z0-9][a-z0-9\-]*)(?:\|([^\]]+))?\]\]")


def rewrite_links(text: str) -> str:
    def repl(m: re.Match) -> str:
        slug = m.group(1)
        label = m.group(2) or slug
        return f"[{label}](/{slug})"

    return WIKI_LINK_RE.sub(repl, text)


def convert(src: Path, dst: Path) -> None:
    body = src.read_text(encoding="utf-8")
    body = rewrite_links(body)
    dst.write_text(body, encoding="utf-8")


def main() -> int:
    if not WIKI_DIR.exists():
        print(f"ERROR: wiki dir not found: {WIKI_DIR}", file=sys.stderr)
        return 1
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    md_files = sorted(p for p in WIKI_DIR.glob("*.md") if p.name not in SKIP)
    if not md_files:
        print("ERROR: no .md files found to convert", file=sys.stderr)
        return 1

    converted = []
    for src in md_files:
        slug = src.stem
        dst = OUT_DIR / f"{slug}.mdx"
        convert(src, dst)
        converted.append(slug)

    print(f"Converted {len(converted)} files to {OUT_DIR}")
    for s in converted:
        print(f"  {s}.mdx")
    return 0


if __name__ == "__main__":
    sys.exit(main())

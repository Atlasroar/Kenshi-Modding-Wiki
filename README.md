# Kenshi Modding Wiki

An independent field manual for Kenshi modding: FCS, dialogue, save editing,
world building, and character assets.

**Status:** all 17 owner-cleared modding guides are imported and organized by
topic. Their 46 image locations have visible placeholders; eight references to
articles outside this batch are explicitly marked. No screenshots have been
imported. GitHub Actions checks pull requests and publishes approved changes on
`main`.

**Site:** <https://atlasroar.github.io/Kenshi-Modding-Wiki/>

The [GitHub Wiki](https://github.com/Atlasroar/Kenshi-Modding-Wiki/wiki) is the
website's knowledge base: setup, CSS, JSON/configuration, contribution guidelines,
deployment, and technical decisions. The public website contains modding guides.

External source links belong on the public Credits page. Guide pages and the
footer link internally so readers can follow a workflow without leaving the
site. The approved community-link exceptions are the permanent sidebar's
GitHub Discussions link and the homepage contribution blurb's GitHub Wiki link.

The Wiki preserves the
[implementation plan](https://github.com/Atlasroar/Kenshi-Modding-Wiki/wiki/Implementation-Plan)
and [content audit](https://github.com/Atlasroar/Kenshi-Modding-Wiki/wiki/Content-Audit).
The [import manifest](docs/modding-imports.json) records all source fingerprints,
image-placeholder locations, and out-of-batch references.

## Local development

Install **Node.js 24 LTS**, then run:

```shell
npm ci
npm run dev
```

Open the localhost URL printed by Quartz. The preview watches source changes.

```shell
npm run check
npm run build
npm run test:site
```

The output checks require a fresh production build. Generated files are written
to `public/` and are not committed. `npm run format` formats site-maintained
files; upstream Quartz sources are excluded except the custom stylesheet.

## Project layout

| Path                        | Purpose                                                      |
| --------------------------- | ------------------------------------------------------------ |
| `content/`                  | Reviewed, publishable Markdown and referenced assets         |
| `quartz.config.yaml`        | Quartz 5 site, plugin, navigation, and palette configuration |
| `quartz/styles/custom.scss` | Original Kenshi-inspired website styling                     |
| `site/`                     | Ordered guide navigation and documentation redirects         |
| `docs/modding-imports.json` | Versioned source fingerprints and media/reference ledger     |
| `scripts/site.test.mjs`     | Focused generated-site checks                                |
| `quartz/`                   | Pinned upstream Quartz engine                                |

Pages must have `publish: true` to enter the site build. This is a second layer of
protection, not permission to commit private notes. Only explicitly reviewed
content belongs in this repository.

The local Obsidian vault remains read-only. Do not copy the whole vault,
`.obsidian` settings, or a shared media directory into the repository. Review
each article's source credits, reuse rights, links, and referenced assets first.

## Hosting

The [site workflow](.github/workflows/site.yml) verifies pull requests without
deploying them. After a reviewed merge, the `main` build publishes `public/`
through GitHub Pages. Failed checks block that deployment.

See [publishing and rollback](https://github.com/Atlasroar/Kenshi-Modding-Wiki/wiki/Publishing-and-Rollback) for repository settings,
manual releases, and recovery. The Pages build source must be **GitHub Actions**.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for links to the Wiki's contribution,
article-writing, and CSS documentation. Do not add maintainer documentation to
the public guide website.

## Licensing

The existing repository license is preserved in [LICENSE](LICENSE). Quartz's
MIT notice is retained in [LICENSE.txt](LICENSE.txt); see
[third-party notices](THIRD_PARTY.md). Imported text and media need their own
provenance and reuse review.

This is an unofficial community project, not an official Lo-Fi Games website.

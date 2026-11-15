# Kenshi Modding Wiki implementation plan

## Goal and boundaries

Create a readable, responsive documentation website and wiki using Markdown,
Quartz, and GitHub Pages. Adapt the useful visual ideas in the local Obsidian
setup, rather than copying the desktop application's interface.

The vault is a read-only source. Nothing should automatically publish or
synchronize the entire vault. Only reviewed content and referenced assets belong
in this repository. GitHub Pages hosts a static website; editing remains a
Markdown/Git workflow.

## Source inventory

The initial read-only inspection found:

| Collection          | Markdown pages | Other files          | Initial scope                  |
| ------------------- | -------------: | -------------------- | ------------------------------ |
| Kenshi Modding Wiki |             17 | None                 | First reviewed content import  |
| Kenshi Wiki         |          2,566 | None                 | Later reference-library import |
| Genesis             |             17 | One tech-tree canvas | Optional later section         |
| Kenshi landing note |              1 | None                 | Input for a reviewed homepage  |

Encore is the selected Obsidian theme. Relevant customizations include Kenshi
notebook backgrounds, infobox callouts, and multi-column layouts. The appearance
settings use JetBrains Mono; the Encore overrides select neutral colors and
disable grain. Shade Sanctuary is installed but is not the selected theme.

The Kenshi tree contains no image files. Obsidian's attachment setting points to a
separate media directory. Across the Markdown files, the initial scan found 26
duplicate-basename groups, seven files with expiring media URLs, and several
Obsidian/custom callout forms. These are migration risks, not a complete audit.

Do not commit local absolute vault paths or unrelated Obsidian settings.

## Architecture

- **Generator:** Quartz v5.1.0, imported from its tagged upstream scaffold.
- **Runtime:** Node.js 24 LTS; use the upstream lockfile and `npm ci`.
- **Content:** reviewed Markdown under `content/`.
- **Configuration:** `quartz.config.yaml`, using the matching Quartz 5 format.
- **Presentation:** site-specific styles in `quartz/styles/custom.scss`, with
  shared colors and system-font fallbacks configured in the site configuration.
- **Hosting:** GitHub Actions and GitHub Pages, introduced after local review.
- **Public URL:** use GitHub's actual Pages URL when deployment is configured.
  Until then, configure for the standard repository subpath,
  `atlasroar.github.io/Kenshi-Modding-Wiki`.

Quartz was chosen for Obsidian-compatible links, embeds, frontmatter, and
callouts. A custom application would add unnecessary maintenance. Jekyll is
viable, but requires more adaptation of the current content.

Keep the existing GPL-3.0 repository license. Preserve Quartz's separate MIT
notice in `LICENSE.txt` and document upstream provenance in `THIRD_PARTY.md`.
Do not assume either license grants redistribution rights to imported articles,
images, fonts, or Obsidian themes.

## Milestones

### 1. Document and build the foundation

**Work**

1. Commit this plan to the repository's documentation when the work is committed.
2. Add the pinned Quartz scaffold without upstream demo content, publishing
   workflows, or release automation.
3. Configure the site title, repository subpath, local/system typography,
   navigation, search, article contents, and backlinks. Disable analytics and
   avoid remote font dependencies.
4. Build an original homepage and an original contributor guide demonstrating
   the intended Markdown and callout patterns. Clearly distinguish new site
   documentation from imported game documentation.
5. Style a Kenshi-inspired field manual: restrained sand/parchment surfaces,
   charcoal text, rust accents, and readable light/dark themes. Use original CSS
   rather than redistributing theme snippets before checking their licenses.
6. Document local setup, source boundaries, and the commands used to validate
   the site. Keep generated output and local runtime packages out of Git.

**Acceptance**

- A production build succeeds from repository files alone.
- The homepage and contributor guide link to each other and are searchable.
- Wikilinks, an alias, heading links, tables, nested callouts, and an infobox
  render correctly in the representative content.
- Layout works at 375px and 1440px widths. Navigation remains keyboard-usable;
  tables scroll rather than widening the page; infoboxes stack on mobile.
- Both light and dark themes retain readable text and visible focus indicators.
- Static assets and article links resolve beneath `/Kenshi-Modding-Wiki/`.
- No private vault content or paths, local-filesystem hyperlinks, remote fonts,
  analytics, or unreviewed third-party images are included in the generated
  site. Example game installation paths may remain as instructional text.

**Stop point:** review the visual/content foundation before importing the vault.

### 2. Audit and approve the first content batch

**Prerequisite:** milestone 1.

**Work**

1. Inventory the 17 modding guides with a read-only, explicitly scoped process.
2. Record ownership, source credits, publication approval, proposed destination,
   and asset dependencies for each guide.
3. Build a deterministic source-to-public-path map. Resolve duplicate names with
   qualified paths, never arbitrary first matches.
4. Check wikilinks and Markdown links, aliases, headings, block references,
   embeds, HTML image sources, and links outside the Kenshi tree.
5. Identify missing images, expired media URLs, empty link labels, export
   artifacts, and local-file links. Treat example game installation paths as
   documentation, not automatically as broken website links.
6. Locate only the referenced assets in the media directory. Do not copy the
   whole directory. Preserve unresolved findings explicitly.

**Acceptance**

- A reviewed allowlist covers every guide and asset proposed for publication.
- Each source has a unique destination and clear attribution/permission status.
- Unresolved references are listed, not silently dropped or mapped incorrectly.
- No local paths, private notes, or unrelated attachments enter public history.

**Stop point:** get publication decisions for unclear provenance or private notes.

### 3. Migrate the modding guides

**Prerequisite:** milestone 2 approval.

**Work**

1. Establish the migration pattern with a small image-free pilot, then extend it
   to long FCS references, linked guides, tables, and HTML-image content.
2. Preserve original Markdown where possible; rewrite links using the approved
   path map. Verify wrapped paragraphs and raw HTML against the renderer.
3. Port custom layout behavior only when the representative content requires it.
   Obsidian application/editor selectors should not enter the website theme.
4. Import the remaining approved guides. Per the owner's subsequent decision,
   replace each image reference with a visible, labeled placeholder at its
   original location; do not make missing images a blocker for this batch.
   Import actual media only after separate review.
5. Add populated navigation sections for Getting Started, FCS, Dialogue,
   World & Buildings, Characters & Assets, and Save Editing as content supports
   them. Do not create empty guides to fill the menu.

**Acceptance**

- Approved guides render correctly, are searchable, and preserve source credits.
- Internal links, anchors, tables, and callouts work. Image locations contain
  either reviewed media or an explicitly approved visible placeholder, never
  broken local images or expired signed image URLs.
- Dependencies outside the batch appear as explicit "reference page not imported"
  notices, with meaningful labels. Do not create empty articles, invent links,
  or silently import material outside the approved collection.
- Review mobile navigation and the longest guide before proceeding.

### 4. Deploy the reviewed site

**Prerequisite:** milestone 3 review.

**Work**

1. Add pull-request build checks and a Pages workflow for approved changes on
   `main`. Use locked dependencies/plugins and official Pages artifact/deploy
   actions.
2. Configure Pages to use GitHub Actions and confirm its actual public URL.
3. Use appropriate minimum token permissions and the `github-pages` environment.
4. Verify direct article visits, refreshes, the 404 page, search, navigation,
   canonical URLs, and assets at the real repository subpath.
5. Document publishing and rollback through Git history.

**Acceptance**

- A clean CI checkout builds without the author's local drive.
- The deployed site passes the same content and subpath checks as the local
  build.
- Only reviewed content appears in source history, search indexes, and output.

### 5. Expand the reference library

**Prerequisite:** a stable deployment and separate publication review.

- Review and import the 2,566 reference pages in manageable batches.
- Resolve category/interlanguage export artifacts and duplicate basenames.
- Verify attribution and reuse terms before reproducing third-party text/media.
- Measure full-build size, performance, search usability, and Pages limits.
- Keep reference material distinct from tutorials.
- Decide separately whether Genesis development notes and its tech-tree canvas
  should be public; preview supported canvas rendering before adopting it.
- Consider a one-way allowlisted import command only after publication rules
  are stable. Automatic synchronization is not part of the initial release.

## Validation strategy

Use the smallest checks that demonstrate the milestone's behavior:

- Dependency installation from the lockfile.
- Type-checking and formatting checks for the site's maintained configuration,
  content, and styles.
- A production build.
- Focused generated-output checks for expected pages, working local links,
  search inclusion, custom callout markup, and correct asset paths.
- Browser inspection where available, including both themes and mobile/desktop
  widths. Record limitations rather than claiming visual verification that did
  not happen.

The production build is the source of truth for rendered content. A successful
server startup alone is not sufficient.

## Progress

| Milestone                                    | Status                                |
| -------------------------------------------- | ------------------------------------- |
| 1. Document and build the foundation         | Complete; ready for review            |
| 2. Audit and approve the first content batch | Audit and owner clearance complete    |
| 3. Migrate the modding guides                | All 17 imported with placeholders     |
| 4. Deploy the reviewed site                  | Workflow ready; first publish pending |
| 5. Expand the reference library              | Not started                           |

### Foundation completion record

The foundation now includes the pinned Quartz engine, a Kenshi-inspired
light/dark theme, an original homepage, and an original writing guide. The
foundation was completed before the guide imports below. No deployment workflow
is enabled.

Verification performed:

- `npm ci`, `npm run check`, `npm run build`, and `npm run test:site`.
- Generated-output checks for internal links, heading anchors, aliases,
  styles/scripts, search inclusion, custom callouts, and page classes.
- An isolated build proving that notes without explicit publication approval
  and assets referenced only by those notes stay out of HTML output and search.
- Browser inspection of the production output mounted beneath the repository
  subpath, including search-result navigation and direct article loads.
- Both sample pages at 375px and 1440px in both themes: no horizontal page
  overflow, stacked mobile infoboxes, and responsive homepage cards.
- A deliberately oversized table cell scrolls inside its container without
  widening the 375px page. Sampled body and article-link contrast exceeds 7:1
  against the article surface in both themes.

Local verification used a checksum-verified portable Node.js 24 runtime because
Node was not available on the machine's normal command path. Install Node.js 24
LTS for the documented development commands in a regular terminal.

The standard `npm run dev` preview serves from the site root. Production-subpath
verification must use production output: the upstream development renderer
omits the configured basepath even when its server receives `--baseDir`.

### First-batch audit record

The read-only inspection of all 17 modding guides is documented in the
[first-batch content audit](content-audit.md), including a proposed unique
destination for every source file.

The audit found 11 referenced local images not located by filename and 35 remote
image references with expired URL timestamps. Local article dependencies include
10 missing section-index links, seven references to five notes outside the
batch, and one other unresolved article target. Five internal links have empty
labels, and 26 category/interlanguage-style export links need review.

The owner explicitly confirmed clearance for all 17 guides with original
credits and license terms preserved. That decision is recorded in the content
audit. It does not extend to the larger reference library or replacement media.
Development/clipping material in `Tech Overhaul Notes.md` was deferred from the
pilot, then reviewed and included as development notes in the full batch below.
No vault files have been modified.

### Three-guide pilot record

The approved first pilot contains:

- `Color Map for Armors Guide.md`, including its glossary.
- `Creating a New Race Guide.md`, with its WIP status and existing warning
  against copying others' textures retained.
- `Fast Healing Beds.md`, presented as a short tip.

Each imported page preserves the original game instructions, date, and relevant
metadata, records its source filename and original SHA-256, and includes a source
and migration notice. Category export links are represented as tags rather than
broken navigation. No new license has been assigned to the source material.

An original modding landing page links the three imports from the homepage.
The other 14 guides and all referenced media remain outside the pilot.

Pilot verification includes a production build, type/format checks, generated
link and search checks, and a regression check for source notices and WIP
status. Tag pages are enabled so imported tag metadata does not create broken
links. The existing publication-filter check still excludes unpublished notes
and their unreferenced assets.

### Complete modding-batch record

The owner subsequently requested the remaining pages without waiting for image
recovery:

> Wherever an image SHOULD be simply add a line or something like "Place relevant image here"

This supersedes the earlier requirement to resolve media before importing
image-dependent guides. All 14 remaining guides are now imported, for **17 total**.
The source vault stays read-only and the larger reference library and separate
Genesis collection remain outside this batch.

The [import manifest](modding-imports.json) records each source filename,
SHA-256, canonical public slug, original image location, and pending article
reference. It contains no absolute vault paths or signed media URLs.

Completed work:

- Added **46 labeled image placeholders** at the original Markdown/HTML image
  locations: FCS 33, Find Specific Dialogue 4, Name Database 3, Buildings 2,
  In Game Editor 2, Three Person Conversations 1, and Vendor Lists 1.
- Repaired ten section-index links and the two links between imported guides.
  Filled empty labels and converted category export navigation to tags.
- Marked eight out-of-batch article references explicitly rather than creating
  broken links, guessing destinations, or importing uncleared dependencies.
- Organized the homepage and modding index into FCS, Dialogue, World & Buildings,
  Characters & Races, Assets & Animations, and Save Editing.
- Preserved original credits, source URLs, warnings, and WIP status. Promoted
  existing FCS/dialogue section labels into headings for usable contents lists.
  Kept Tech Overhaul Notes clearly labeled as development notes and corrected
  misleading clipping metadata without inventing an author.
- Extended generated-site checks to cover all 17 searchable/reachable guides,
  source notices, original warnings/credits, all 46 image markers, and all eight
  explicit reference notices. Instructional installation paths are allowed;
  local-file hyperlinks and private user/vault paths are not.

The next milestone is deployment preparation after local review. Screenshot
restoration is follow-up content work, not a prerequisite for this approved
placeholder version. No game instructions have been independently retested.

Completion validation: `npm run check`, `npm run build`, and all six
`npm run test:site` checks pass. The modding index, long FCS guide, dialogue
reference, and HTML-image dialogue guide were checked at 375px and 1440px in
both themes: no horizontal page overflow, and every image marker fits its
container. Direct article and in-app navigation work under the production
repository subpath. All 17 original source fingerprints remain unchanged.

### Publication preparation

The owner requested a new pull request and publication, and explicitly approved
merging the setup PR once its checks pass.

`.github/workflows/site.yml` checks pull requests and `main` using Node.js 24,
locked dependencies, type/format checks, a production build, and the full
generated-site checks. Only a successful `main` build uploads a Pages artifact
and enters the deployment job. Pull requests cannot deploy.

Official actions use verified commit pins. Builds have read-only repository
access; Pages write and OIDC permissions are scoped to deployment through the
`github-pages` environment. The workflow retains environment protection.

GitHub reports the project URL as
<https://atlasroar.github.io/Kenshi-Modding-Wiki/>. Its previous legacy
branch-source setting must be switched to GitHub Actions before release.
[Publishing and rollback](publishing.md) documents the release path and recovery.

All three imported articles were inspected in the browser at 375px and 1440px
in both themes. They retain their source notices, the armor glossary renders as
a table, the race guide retains its WIP warning, and neither article content nor
Explorer navigation escapes the viewport or repository subpath. Original vault
fingerprints remain unchanged for all 17 audited guides.

**Next step:** review the pilot, then continue with the remaining guide
dependencies in small batches. The full-library migration and Pages deployment
remain incomplete.

## References

- [Quartz v5.1.0 source](https://github.com/jackyzha0/quartz/tree/v5.1.0)
- [Quartz Obsidian compatibility](https://quartz.jzhao.xyz/features/obsidian-compatibility)
- [Quartz configuration](https://quartz.jzhao.xyz/configuration)
- [Quartz GitHub Pages deployment](https://quartz.jzhao.xyz/hosting#github-pages)

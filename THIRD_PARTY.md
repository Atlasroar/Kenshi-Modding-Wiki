# Third-party notices

## Quartz

This site includes the Quartz engine from
[jackyzha0/quartz, tag v5.1.0](https://github.com/jackyzha0/quartz/tree/v5.1.0).
Its source is included under `quartz/`, together with the upstream runtime and
type-support files at the repository root.

Quartz is MIT-licensed. Its copyright and permission notice are preserved in
`LICENSE.txt`. The repository's existing `LICENSE` file is retained separately.
Dependencies retain their own licenses and are resolved by `package-lock.json`.

The site configuration, `quartz/styles/custom.scss`, local package scripts,
content, and project documentation are site-specific additions or modifications.
Upstream demonstration content and release workflows are not included.

## Obsidian visual references

The original site styling takes visual direction from the author's Kenshi
notebook setup. Encore and Obsidian CSS snippets are not bundled or copied into
this site. Their licenses must be reviewed before any future code reuse.

Quartz's bundled static assets remain covered by its upstream notice. System
fonts are used without remote font requests. No Kenshi screenshots or font files
have been imported.

## Imported guide text

The repository owner confirmed clearance to republish all 17 source guides with
original credits and license terms preserved. All 17 guides are now imported;
the [import manifest](docs/modding-imports.json) lists their source filenames
and original content fingerprints.

Each imported page records its source note and original content fingerprint.
The source notes do not identify a specific source-license name, so none has
been inferred. Existing notices are preserved, including the race guide's
warning against copying others' textures and its work-in-progress status.
Republication clearance does not relicense imported text under Quartz's MIT
license.

Existing contributor credits and source links are retained, including references
to Boron, Cattrina, Shidan, and Tablesalt. Tech Overhaul Notes is explicitly
presented as development notes: its clipping-service title was normalized and a
note-link field was not misrepresented as an author.

At the owner's request, all 46 image references have visible placeholders.
No screenshots, diagrams, expired signed image URLs, or replacement media have
been imported. Future image replacements need their own attribution and reuse
review.

See the [content audit and import log](docs/content-audit.md) for the owner
decision, migration boundaries, and outstanding dependencies.

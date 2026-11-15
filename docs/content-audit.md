# First-batch content audit

**Status:** read-only inspection complete; the owner has confirmed republication
clearance for all 17 guides with credits and source terms preserved. All 17 are
now imported. At the owner's request, all 46 image locations have visible
placeholders; no media has been imported.

This report covers the 17 Markdown files in the local **Kenshi Modding Wiki**
folder. It records the original audit findings and subsequent migration
decisions, not reproductions of the articles. Baseline dependency counts below
describe the source files, not broken links in the migrated website.

## Findings

| Finding                                                |                        Result |
| ------------------------------------------------------ | ----------------------------: |
| Guides inspected                                       |                            17 |
| Local link/embed occurrences                           |                            31 |
| References resolving to another guide in this batch    |                             2 |
| References resolving elsewhere in the Kenshi tree      | 7, targeting 5 distinct notes |
| References unresolved within the inspected Kenshi tree |                            22 |
| Ambiguous local targets among the inspected references |                             0 |
| Empty internal link labels                             |                             5 |
| Category/interlanguage-style export links              |                            26 |
| Referenced local images not located by filename        |                            11 |
| Remote image references with expired URL timestamps    |                            35 |
| Actual local-filesystem hyperlinks found               |                             0 |

The 22 unresolved local references comprise **10 section-index links**, **11
image references**, and **one other missing article target**. This does not mean
that all 22 need new source material: the section-index links can point to an
original modding landing page when that section is introduced.

An absence of broken links or images is not evidence that an article is
cleared for publication.

## Source-to-destination map

All destinations below are relative to `content/` and now exist. The migration
work column preserves findings from the original audit; the completion record
below explains how they were handled. The [import manifest](modding-imports.json)
is the machine-readable source/path, image-location, and dependency ledger.

| Source filename                           | Proposed destination                             | Main migration work                                                                                                             |
| ----------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| Buildings Collision & Navmesh.md          | `modding/world/building-collision-navmesh.md`    | Two missing images; one reference-library dependency; blank link label; Boron credit signal                                     |
| Claim Town Ownership.md                   | `modding/save-editing/claim-town-ownership.md`   | Two links to one reference-library note; blank label; distinguish the linked Shidan guide from this article's authorship        |
| Color Map for Armors Guide.md             | `modding/assets/armor-color-maps.md`             | Review provenance; retain glossary table; replace category export link with site metadata                                       |
| Creating a New Race Guide.md              | `modding/characters/creating-a-race.md`          | Review provenance, nested instructions, and category export links                                                               |
| Dialogue Condition & Effects.md           | `modding/dialogue/conditions-and-effects.md`     | Repair section-index link; link to the migrated FCS guide; review long reference-style content                                  |
| Fast Healing Beds.md                      | `modding/world/fast-healing-beds.md`             | Review provenance; convert category export link; assess whether it belongs as a short tip rather than a full guide              |
| How to Find Specific Dialogue.md          | `modding/dialogue/find-specific-dialogue.md`     | Four missing images; one reference-library dependency; blank label; preserve Tablesalt, Cattrina, and Shidan credit context     |
| In Game Editor.md                         | `modding/world/in-game-editor.md`                | Two expired remote image references; section-index and FCS links; linked website provenance                                     |
| Invisible Characters Guide.md             | `modding/characters/invisible-characters.md`     | Section-index link; category export link; review provenance                                                                     |
| Killing Npcs at Game Start.md             | `modding/world/kill-npcs-at-game-start.md`       | Section-index link; category export links; explicit Cattrina attribution                                                        |
| Multiuser Animation Guides.md             | `modding/assets/multiuser-animations.md`         | Section-index link; category export link; preserve stated uncertainty rather than treating untested ideas as confirmed behavior |
| Name Database Guide.md                    | `modding/characters/name-databases.md`           | Three missing images; section-index link; category export links; Shidan credit                                                  |
| Sleeping On Npc Beds.md                   | `modding/world/public-npc-beds.md`               | Section-index link; category export links; review provenance                                                                    |
| Tech Overhaul Notes.md                    | `modding/fcs/tech-overhaul-notes.md`             | **Defer from the initial import:** clipping/development-note metadata needs a separate scope and authorship review              |
| The FCS - A Complete Guide.md             | `modding/fcs/complete-guide.md`                  | 33 expired remote image references; section-index link; source credits spanning more than one website                           |
| Three Person Conversations with Player.md | `modding/dialogue/three-person-conversations.md` | One missing diagram; one reference-library dependency; section-index link; blank label                                          |
| Vendor Lists.md                           | `modding/world/vendor-lists.md`                  | One missing image; two reference-library dependencies; another unresolved article link; blank label; Cattrina credit signal     |

The destinations are distinct and folder-qualified. Preserve stable public
paths once imported. Do not silently flatten them to basenames or invent
aliases that collide with the later reference collection.

## Local media dependencies

These are the filenames used by the articles. Case-insensitive filename lookup
found no matching files in the Kenshi tree or the configured media directory.
The images may exist elsewhere or under different names; no such match has
been established.

| Guide                                  | Referenced filenames                                                                                                                                     |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Buildings Collision & Navmesh          | `Bounding_Box.png`, `Plane_Collider.png`                                                                                                                 |
| How to Find Specific Dialogue          | `SearchforDialogueLine1OpenWithNotepad.png`, `SearchforDialogueLine.png`, `SearchforDialogueLine6ColumnsStringID.png`, `SearchforDialogueLine2inFCS.png` |
| Name Database Guide                    | `DroidNameRandomizer.png`, `INITIAL1.png`, `WordSwaps.png`                                                                                               |
| Three Person Conversations with Player | `Three-speaker_flow_chart_pic.png`                                                                                                                       |
| Vendor Lists                           | `SellerVendorList.png`                                                                                                                                   |

Do not replace missing images with guessed screenshots or silently delete their
references. The owner selected visible placeholders at the original image
locations for this import. Later resolutions can locate an approved original,
create an accurate approved replacement, or explicitly revise a guide so it is
complete without that image. Each replacement still needs content review.

### Expired remote images

| Guide                      | Image-reference occurrences | Expiration timestamp embedded in the URLs |
| -------------------------- | --------------------------: | ----------------------------------------- |
| In Game Editor             |                           2 | 2024-04-22 00:47:13 UTC                   |
| The FCS - A Complete Guide |                          33 | 2024-04-20 23:48:00 UTC                   |

These are reference counts, not a claim that every URL identifies a unique
image. Their expiry timestamps are already in the past. No requests were made
to the signed image URLs, and no media was downloaded.

The full signed URLs and their policy/signature query parameters are
intentionally excluded from this report. Source-page availability and
replacement-image permission still need verification.

## Article-link dependencies

### Missing section index

Ten guide links target `[[Kenshi Modding Wiki]]`, which has no matching note in
the inspected Kenshi tree.

All ten links now map explicitly to the original `content/modding/index.md`.
No similarly named private note was searched for or imported automatically.

### Existing notes outside the first batch

Seven link occurrences resolve to these five notes under the Kenshi reference
collection:

| Reference note                   | Guides depending on it                                                |
| -------------------------------- | --------------------------------------------------------------------- |
| `Building_making_tutorial.md`    | Buildings Collision & Navmesh                                         |
| `Changing_Town_Ownership.md`     | Claim Town Ownership, two occurrences                                 |
| `Dialogue_Structure_Overlook.md` | How to Find Specific Dialogue; Three Person Conversations with Player |
| `Caravan_Trader_Boss.md`         | Vendor Lists                                                          |
| `Creating_New_Towns.md`          | Vendor Lists                                                          |

The heading reference into `Dialogue_Structure_Overlook.md` resolves to an
existing heading under Quartz's heading-slug rules. Other cross-note references
in this batch do not introduce additional heading/block targets.

These dependencies sit outside the 17-guide clearance and are **not approved
for import merely by being linked**. Either review and include the dependency
in a later batch, use a verified public source link, or rewrite the referring
passage so it is self-contained. Do not generate empty reference pages as
substitutes.

For this batch, all seven occurrences have meaningful labels and an explicit
**reference page not imported** notice. They do not generate dead links.

### Other unresolved article link

`Vendor Lists.md` links to
`Creating_a_Special_Placeable/Lootable_Item_for_Your_Town`. No matching note was
found in the inspected tree. The slash is part of the link target and behaves
as a directory separator. Its location now has an explicit unimported-reference
notice rather than a guessed link.

### Export cleanup

Five existing internal links have empty visible labels. Supply meaningful labels
using the approved target's title rather than leaving invisible links.

The 26 category/interlanguage-style links are export artifacts, not valid site
navigation. Review categories for conversion to tags or section membership.
Keep language navigation only when a corresponding reviewed translation exists.

## Provenance and publication review

The inspected notes contain contributor names including Boron, Cattrina, Shidan,
and Tablesalt. They also reference Kenshi Fandom, Lost Blog, Steam Community,
and Reddit. A mention, a source link, or possession of a local copy is not itself
proof of authorship or redistribution permission.

Some signals are explicit credits; others refer to an external guide or a
contributor's advice. Do not turn every mentioned name into an article author.

For each article and asset proposed for import, record:

- The original source and actual author, where known.
- Whether the material is original, adapted, quoted, or copied.
- The applicable reuse license or other permission, including attribution and
  any share-alike requirements.
- The owner's decision to publish it here.
- Any corrections or replacements needed before publication.

Do not assume the repository's GPL-3.0 license or Quartz's MIT license covers
these articles and screenshots.

Automated requests could not confirm the current source-site terms: the Kenshi
Fandom article and Fandom licensing page returned HTTP 403, while the referenced
Lost Blog page had a transport-level retrieval failure. These failures do not
establish what the applicable licenses are or whether reuse is permitted.

### Development-note metadata review

`Tech Overhaul Notes.md` has clipping metadata rather than clean article
metadata: its title identifies the source service, and its author field points
to a note instead of identifying an author. It was excluded from the first
pilot, then included in the remaining-guide import as explicitly labeled
development notes. Its article title/description were normalized, the original
service title and source URL retained, and no author inferred from the note-link
field. The short original assertions and warnings were not rewritten as a
complete or independently tested tutorial.

## Selected first pilot

Start with reviewed, image-free material to establish the migration pattern,
then address image-dependent articles:

1. `Color Map for Armors Guide.md` can exercise a substantive article and glossary
   table without missing media dependencies.
2. `Creating a New Race Guide.md` can exercise nested procedural instructions.
3. `Fast Healing Beds.md` can exercise a short-tip format.
4. Add an original modding landing page and convert reviewed category metadata.
5. Add link- and image-dependent guides only after resolving their recorded
   blockers. Do not describe the first pilot as a complete modding-library import.

The owner subsequently confirmed clearance, and the first three guides listed
above have now been imported. The selection remains a technical ordering
decision, not a finding that image-free content has different reuse rules.

## Publication clearance and import log

On 2026-11-15, the repository owner confirmed:

> All 17 guides are cleared, with original credits and license terms preserved

This decision authorizes the reviewed guide collection; it does not automatically
include the larger reference library, unrelated notes, replacement images, or
new third-party material. Do not infer a specific license name where the source
note does not provide one.

| Pilot guide                | State                   | Changes from the source note                                                                                                                                                 |
| -------------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Color Map for Armors Guide | Imported                | Added publication/provenance metadata, descriptive glossary column headings, a source notice, and a return link; converted category export navigation to tags                |
| Creating a New Race Guide  | Imported                | Added publication/provenance metadata, a source notice, and a return link; retained the texture-copying warning and preserved WIP status as both a tag and a visible callout |
| Fast Healing Beds          | Imported as a short tip | Added publication/provenance metadata, a source notice, and a return link; converted category export navigation to tags                                                      |

Original game instructions were not rewritten or independently retested.
Formatting was normalized for the website. Each imported file records the
SHA-256 of the original source bytes so future synchronization can detect source
changes.

An original `content/modding/index.md` links the pilot guides. The homepage links
to that section, and tag navigation is generated for the imported metadata.
No screenshots, local attachment contents, or signed image URLs entered the
pilot. At that stop point the other 14 guides remained unimported; the record
below supersedes that temporary state.

### Remaining 14 guides: completed with explicit image placeholders

The owner subsequently requested:

> Wherever an image SHOULD be simply add a line or something like "Place relevant image here"

All remaining destinations in the map now contain their guide text, original
credits/source links, publication metadata, original SHA-256, migration notice,
and return navigation. The three pilot imports were preserved.

| Guide                                  | Image placeholders |
| -------------------------------------- | -----------------: |
| The FCS - A Complete Guide             |                 33 |
| How to Find Specific Dialogue          |                  4 |
| Name Database Guide                    |                  3 |
| Buildings Collision & Navmesh          |                  2 |
| In Game Editor                         |                  2 |
| Three Person Conversations with Player |                  1 |
| Vendor Lists                           |                  1 |
| Other ten guides                       |                  0 |
| **Total**                              |             **46** |

Every marker says **Place relevant image here** with a label. The HTML image
inside a dialogue guide's figure is covered, as are images originally embedded
inside paragraphs. No attachment contents or signed media URLs were copied.
The [manifest](modding-imports.json) retains original source line numbers and
local/remote image kind without retaining expired query parameters.

All ten section links and two in-batch article links use canonical destinations.
Eight out-of-batch references have visible, meaningful notices. Original WIP
status and warnings remain visible, including the race guide's texture warning.
FCS and dialogue labels became headings to make long pages navigable.

The homepage and modding index now expose the complete 17-guide batch by topic.
The larger reference collection and separate Genesis collection remain
unimported. Actual screenshots can be restored later with appropriate reuse
review; their absence no longer blocks this owner-approved placeholder version.

The production build and all six generated-site checks pass, including exact
image/reference counts, guide navigation/search, retained source notices and
warnings, and publication filtering. Browser review of the landing page and
three representative long/HTML-image pages found no page overflow or clipped
markers at 375px/1440px in either theme. All 17 source hashes were rechecked
after migration and are unchanged.

## Inspection boundaries and limitations

- Read the 17 guides as UTF-8 without changing their bytes.
- Parsed Markdown links, reference definitions, HTML links/images, wikilinks,
  frontmatter, and relevant heading targets.
- Excluded inline/fenced code from hyperlink detection; example game paths are
  not reported as local-filesystem hyperlinks.
- Used Kenshi-tree filenames to resolve local targets; opened linked notes only
  when checking their heading references.
- Compared referenced image filenames against media-directory entries without
  reading or importing unrelated attachment contents.
- Did not crawl the rest of the vault, test modding instructions in Kenshi,
  determine rights from unsupported assumptions, or claim that all external
  source links are currently reachable.

**Next step:** review the complete local modding batch before configuring Pages.
Image restoration and any larger reference-library import remain separate work.

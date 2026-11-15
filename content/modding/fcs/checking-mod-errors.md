---
title: FCS Error Checking
description: Inspect and rescan mod errors, distinguish missing dependencies, and interpret the source's 17 error types.
publish: true
tags:
  - kenshi
  - modding
  - fcs
cssclasses:
  - page-kenshi
  - center-images
source_title: Using the FCS
source_revision: 92817
source_license: CC BY-SA 3.0 Unported (adapted text)
---

[[fcs/index|FCS guides]] · [[modding/fcs/managing-mods|Mod management]]

## Inspect and rescan

The Errors window opens when loading a mod with detected errors, and is also
available from the toolbar. Double-click an error to open its associated item.

![the FCS Errors window](assets/fcs/errors.png)

By default, it shows errors associated with the current mod. **Show From All
Mods** includes other mods; errors without an identifiable originating mod
always appear. The list updates on load, not continuously: use **Scan** to
check the active mod again after edits.

The context menu offers **Delete item**, **Remove Invalid References** (from the
associated item), **Clear changes** (revert this active mod's changes to the
item), and **Ignore** (temporarily mark the error resolved; it may return).

> [!warning] Check dependencies before deleting
> An undefined reference or missing modified item can mean a dependency was not
> loaded. Removing the reference or clearing changes is destructive, not a
> substitute for loading the required data.

## Error reference

| Error                                              | Meaning and response                                                                                                                                                                                 |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Undefined reference                                | A referenced item is missing. Check unloaded dependencies first; otherwise Remove Invalid References can remove the broken links.                                                                    |
| Reference to deleted item                          | The active mod deleted a referenced item. Remove the reference or restore the item.                                                                                                                  |
| Reference to incorrect item type                   | Definitions may have changed, or data may be corrupt. Remove the invalid reference after investigating.                                                                                              |
| No closing decorator tag                           | Dialogue formatting needs a closing `</>`. Double-click to locate the line.                                                                                                                          |
| Word swap not terminated                           | Word swaps use `/SWAP/`. A slash used for something else can cause a false positive.                                                                                                                 |
| Empty word swap                                    | A dialogue line contains `//`. Inspect and correct it.                                                                                                                                               |
| Missing word swap                                  | Dialogue refers to a swap absent from the word-swaps list.                                                                                                                                           |
| Multiple primary references to dialogue line       | Corrupt dialogue links, associated with an older bug. Inspect and manually repair link tags.                                                                                                         |
| No primary reference to dialogue line              | Related dialogue-link corruption; inspect the link tags.                                                                                                                                             |
| Orphaned dialogue object                           | A line or condition belongs to no dialogue. Confirm it is orphaned, then delete it or use Cleanup. The "Dialogue line is not associated with any dialogue" opening warning identifies this case too. |
| Reference list contains too many items             | The list has a reference-count limit. Remove the excess references.                                                                                                                                  |
| Item has changed type                              | Possible corruption or mod conflict changed the item's object type. Investigate the conflicting data.                                                                                                |
| Value was the wrong type and has been converted    | Definitions probably changed. Check that the converted value is correct.                                                                                                                             |
| Value is the wrong type and could not be converted | The value was reset to its default after a definition change. Review and update it if necessary.                                                                                                     |
| Modified item undefined                            | Changes target a missing item. Check unloaded or changed dependencies; if the edits are no longer valid, Clear changes removes them. The item may appear with most values missing.                   |
| Item with id has already been defined by mod       | An ID conflicts with another loaded mod. Immediately after a merge this can be a false positive that resolves on save. Otherwise investigate the collision.                                          |
| New values have been added                         | Definitions added properties. Review them if needed; the notice generally does not require a fix.                                                                                                    |

Use [[modding/fcs/managing-mods#cleanup|Cleanup]] only after understanding which
task is appropriate, then rescan.

This page's adapted text is **CC BY-SA 3.0 Unported**.
[[credits#using-the-fcs-text-license|Credits]] identifies the original article,
contributors, revision, license, and changes. Screenshot permissions and individual source files are listed in
[[credits#fcs-screenshot-credits|screenshot credits]].

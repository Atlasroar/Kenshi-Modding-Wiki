---
title: FCS Mod Management
description: Understand load order, merge choices, cleanup operations, and Steam upload requirements.
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

[[fcs/index|FCS guides]] · [[modding/fcs/using-the-fcs|Interface walkthrough]]

## Change and merge colors

These describe the Changes/merge window. Do not confuse them with the
[[modding/fcs/using-the-fcs#object-and-property-colors|Game World color key]].

| Color  | Meaning                                                                                                                   |
| ------ | ------------------------------------------------------------------------------------------------------------------------- |
| Green  | New item.                                                                                                                 |
| Blue   | Existing item modified.                                                                                                   |
| Grey   | Deleted item.                                                                                                             |
| Orange | A later mod changes the item; merged changes will still be overridden.                                                    |
| Red    | Merge conflict: both mods changed the item since the previous merge. Inspect the values before accepting or rejecting it. |
| Purple | Modified remove item; the source describes this as combining blue and red states.                                         |

## Load order

Mods higher in the load list load first. **Later entries take precedence** when
mods change the same data. If `FasterBeakThings.mod` is followed by
`SlowerBeakThings.mod`, the latter wins; reverse them if that is not intended.

![mod load order](assets/fcs/loadorder.png)

## Merge another mod

Open **Merge** from the toolbar and choose the source mod, or use **`*`** to load
another data file. The destination is your **active mod**. A mod already open as
its dependency cannot be merged; a mod later in the list can.

![selecting data to merge into the active mod](assets/fcs/merge-mod.png)

The checkbox has **three distinct states**:

| State      | Effect                                                                                                |
| ---------- | ----------------------------------------------------------------------------------------------------- |
| Ignore     | Default. Neither merges nor discards the change.                                                      |
| Selected   | Applies the change to the active mod.                                                                 |
| Deselected | Skips the change and keeps it hidden in subsequent merges; **Show Skipped Changes** reveals it again. |

![Ignore checkbox state](assets/fcs/ignorebox.png)

![Selected checkbox state](assets/fcs/selected-box.png)

![Deselected checkbox state](assets/fcs/deselected-box.png)

Select several items and click a checkbox to change them together, or use the
context menu. Its recursive check/uncheck actions also include referenced items,
which is useful for selecting a dialogue and all its lines.

**Fix References** includes new items needed by selected references.
**Merge level data** includes the source mod's level data; the option is disabled
when there is none.

## Cleanup

The toolbar's **Cleanup** acts on the active mod. Its options are not interchangeable:

| Task                      | Removes                                                                                         |
| ------------------------- | ----------------------------------------------------------------------------------------------- |
| Remove deprecated fields  | Properties absent from `fcs.def`; skips items with no definitions at all.                       |
| Remove deleted items      | Items created by the active mod and removed by a later mod.                                     |
| Delete orphaned items     | Items flagged as owned by another item but with no references, such as detached dialogue lines. |
| Remove invalid references | References to missing items.                                                                    |
| Remove undefined items    | Items whose types are absent from `fcs.def`, except items referenced by other items.            |

![active-mod cleanup tasks](assets/fcs/cleanup.png)

Game World's context-menu **Clean Item** only removes deprecated fields from the
selected items; it does not run every cleanup task.

> [!warning] Missing is not necessarily unwanted
> Before removing references, check whether a required dependency is unloaded.
> Review deletions and conflicts rather than treating Cleanup as an automatic fix.
> See [[modding/fcs/checking-mod-errors|error checking]].

## Upload to Steam

For Steam connectivity, launch the FCS **through Steam in online mode**. Opening
the executable directly from the game folder does not provide the Steam
connection needed for uploading. This requirement is Cattrina's contribution
to the source article.

### Annotated upload checklist

Cattrina's screenshot adds the following guidance:

- Include the mod's file name in its Workshop title and enter your Steam name
  as the author. Increase the version on every update, including small changes.
- If the mod is a patch, check that its original mod appears under
  **Dependencies**. Choose the appropriate tags.
- Use a square `.jpg` thumbnail below **1 MB**. The source recommends
  power-of-two dimensions, such as **512 x 512** or **1024 x 1024**, and warns
  that PNG thumbnails may not display correctly.
- Start with **private** visibility so you can finish the description and add
  images on the Workshop page. Use concise change notes for updates.
- The refresh control can load the description from Steam. If the dialog says
  **Not connected to Steam**, close the FCS and reopen it through Steam.

These are the source screenshot's recommendations, not independently retested
requirements for a newer FCS or Steam release.

![Steam upload controls](assets/fcs/uploadmodtosteam.png)

This page's adapted text is **CC BY-SA 3.0 Unported**.
[[credits#using-the-fcs-text-license|Credits]] identifies the original article,
contributors, revision, license, and changes. Screenshot permissions and individual source files are listed in
[[credits#fcs-screenshot-credits|screenshot credits]].

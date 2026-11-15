---
title: Using the FCS
description: Launch the Forgotten Construction Set, select an active mod, and navigate its objects and properties.
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

[[fcs/index|FCS guides]]

The Forgotten Construction Set edits Kenshi's game data, with terrain and visual
effects outside its scope. Its name comes from Kenshi's early working title,
Forgotten. This walkthrough covers the interface; continue with
[[modding/fcs/searching-and-editing-data|searching and bulk editing]],
[[modding/fcs/managing-mods|load order and mod management]], and
[[modding/fcs/checking-mod-errors|error checking]].

## Launch and select a mod

Open `forgotten construction set.exe` in your Kenshi installation directory,
or launch Kenshi through Steam and choose **Launch Modding tool**.

<span class="image-placeholder" role="note" data-image-index="1" data-image-source="Game_editor.PNG">Place relevant image here: Steam's Launch Modding tool option (Game_editor.PNG)</span>

Create a separate test mod. In the opening dialog, **ACTIVE** identifies the mod
that will receive your saved changes. Keep later-loaded mods selected when you
need to see changes that may override yours, then select **DONE**.

<span class="image-placeholder" role="note" data-image-index="2" data-image-source="Opening_Mod.PNG">Place relevant image here: selected dependencies and active mod (Opening_Mod.PNG)</span>

> [!warning] Check the active destination
> Loaded dependencies are not your editing destination. Confirm **ACTIVE** before
> changing data, and keep experimental changes isolated from core game data.

## Find objects in Game World

Most editable objects are in **Game World**. The toolbar separately provides
**Global game settings** and **Artifacts settings**, the latter for unique,
non-respawnable items scattered around the world.

<span class="image-placeholder" role="note" data-image-index="3" data-image-source="Navbar.PNG">Place relevant image here: global and artifact settings in the toolbar (Navbar.PNG)</span>

Game World contains categories, an item list, property columns, and a search box.
Select a category, then double-click an item to edit it. Select several items and
press **Enter** to open them together. Click column headers to sort; right-click
them to add columns. The search box narrows the selected category's results.

<span class="image-placeholder" role="note" data-image-index="4" data-image-source="FCS_Game_World_Window.png">Place relevant image here: the four areas of Game World (FCS_Game_World_Window.png)</span>

**A parent category does not necessarily contain all its subcategory items.**
For example, Dialogue Package does not include every Word Swap or Dialogue.
The category layout is defined in `fcs_layout.def` beside the executable.

### Object and property colors

| Color  | Meaning in Game World and object properties                   |
| ------ | ------------------------------------------------------------- |
| Black  | Value from a base mod.                                        |
| Blue   | Modified by the active mod.                                   |
| Green  | Created by the active mod.                                    |
| Grey   | Deleted by the active mod or a later mod.                     |
| Orange | Created by a later mod; cannot be modified in the active mod. |

The Changes/merge window has a related but different
[[modding/fcs/managing-mods#change-and-merge-colors|color key]].

## Add useful columns

Right-click the item-list header to show **String ID** (unique identifier),
**Ref** (number of items referencing this item), **Type** (object type), or
**State** (its color-coded state). Sort with a header, drag to reorder columns,
and resize them as needed.

<span class="image-placeholder" role="note" data-image-index="5" data-image-source="Custom_Columns.PNG">Place relevant image here: the custom-column menu (Custom_Columns.PNG)</span>

Use **Add** for an object's property and **Add List** for reference-list data.
In Add List, **Items** and **values** determine the displayed contents. With
neither selected, the column shows the list's item count.

<span class="image-placeholder" role="note" data-image-index="6" data-image-source="Add_list.PNG">Place relevant image here: Add List display options (Add_list.PNG)</span>

To change a list column's options, add it again with the new settings. Toggle a
column in the header's Columns menu to remove it; **Reset** removes all added
columns.

<span class="image-placeholder" role="note" data-image-index="7" data-image-source="Custom_columns2.PNG">Place relevant image here: list contents and values displayed as columns (Custom_columns2.PNG)</span>

## Edit an object

An object window contains scalar properties (numbers, names, filenames, enums),
reference lists linking to other objects, and help for the highlighted property.
Available properties depend on the object type. If double-clicking opens a
specialized editor instead, use **Alt + double-click** for this object view.

<span class="image-placeholder" role="note" data-image-index="8" data-image-source="Object_view.PNG">Place relevant image here: values, references, and field help in object view (Object_view.PNG)</span>

The **[...]** menu provides these actions:

| Action                 | Purpose                                                                                   |
| ---------------------- | ----------------------------------------------------------------------------------------- |
| Show References        | Find all items linking to this item.                                                      |
| Copy Data From Item    | Replace this item's properties with another item's properties.                            |
| Add ToDo List item     | Add an entry for the item in Notes.                                                       |
| Duplicate item         | Make a copy.                                                                              |
| Add missing fields     | Add missing properties defined in `fcs.def`.                                              |
| Remove obsolete fields | Remove properties no longer defined in `fcs.def`; equivalent to Clean Item in Game World. |

For the older, extended compilation, see
[[modding/fcs/complete-guide|The FCS - A Complete Guide]].

This page's adapted text is **CC BY-SA 3.0 Unported**.
[[credits#using-the-fcs-text-license|Credits]] identifies the original article,
contributors, revision, license, and changes. Screenshot placeholders identify
source files pending separate reuse permission.

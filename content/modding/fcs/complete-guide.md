---
date: 2024-04-20T14:44
tags:
  - kenshi
  - modding
  - fcs
cssclasses:
  - page-kenshi
  - center-images
title: The FCS - A Complete Guide
description: An extended FCS interface and data-management guide with source screenshots.
publish: true
source_collection: Kenshi Modding Wiki
source_note: The FCS - A Complete Guide.md
source_sha256: 35e93f87d560e167f5ba3149221fde891ce600e6cc577b159115ee2fa10213df
source_license: Not specified in the source note; existing terms retained
source_categories: []
---

[[modding/index|Modding guides]]

## Introduction

What’s an FCS?

The FCS, or Forgotten Construction Set, is an application used to create and modify data used to create the world of Kenshi. Almost everything in Kenshi can be modified using this tool, with the exception of terrain and visual effects.

Where can I find the FCS?

`\Steam\steamapps\common\Kenshi\forgotten construction set.exe`

FCS can also be opened through steam. When launching the game, select the Launch Modding tool option.

![Steam's Launch Modding tool option](assets/fcs/game-editor.png)

When Selecting Play On Steam You can select the modding tool Here

Game editor

Why is it called FCS?

FCS stands for Forgotten Construction Set. Kenshi was previously called “Forgotten” in early development. Really this application should be called KCS, but it’s been out for so long that it’s too late to change it now.

## Useful non-official guides

We’re a bit late to this whole documentation thing, over the years our community has done a wonderful job of documenting a variety of uses for FCS, which we will shamelessly link to below:

Save Editing 101 By Shidan

- See also Shidan's compilation of notes on game and FCS mechanics

Kenshi Modding 101: FCS and Dialogue By Boron

## Layout

### Opening a mod

When first loading up FCS you’ll be greeted with a screen which will look something like this:

![selected dependencies and active mod](assets/fcs/opening-mod.png)

Note the location of the ACTIVE text, this is where your changes will be saved (should you decide to make any).

It is highly advised that you create your own mod for testing purposes where any changes can remain isolated from any core game data.

> [!warning] Check the active destination
> Loaded dependencies are not your editing destination. Confirm **ACTIVE** before
> changing data, and keep experimental changes isolated from core game data.

Mods that are currently set to be loaded by the game will already be ticked. You should leave the mods that will be loaded after your mod ticked as you will be able to see any changes that could be overriding your mod.

When ready, click DONE to open a mod

### Toolbar

The toolbar at the top is used to access various functions.

![global and artifact settings in the toolbar](assets/fcs/navbar.png)

- Global settings modifies the game’s constants
- Artifact settings brings up a lost of global artefacts that spawn on a new game start
- Cleanup allows you to remove redundant data
- Changes displays a list of all changes to existing items and new game data objects
- Assets displays a list of all external assets, like textures and meshes
- Notes brings up your FCS-internal note editor
- Errors identifies any problems inside the FCS
- The merge function lets you merge multiple mods into one file
- Export mods file lets you export your currently loaded mod list (inside FCS) to the game launcher for easy testing
- Find and replace lets you replace strings across multiple files at once
- Spell check compares your spelling with the two dictionary text files (Dictionary.txt and Dictionary_custom.txt) found in Kenshi/
- On the far right, clicking the arrow reveals the Open Any button, which allows you to open and edit save files

### Cleanup

The cleanup function removes redundant information across all files added or modified by your mod and incorrect data left over in vanilla kenshi as of 1.0.64.

![active-mod cleanup tasks](assets/fcs/cleanup.png)

- Remove deprecated fields

- Remove all item properties that are not defined in fcs.def This ignores items that have no definitions at all

- Remove deleted items

- Delete items that were created by the active mod and removed by a later mod

- Delete orphaned items

- Delete items that are flagged as owned by another item and have no references. This includes things like dialogue lines that are somehow not part of a dialogue

- Remove invalid references

- Delete any references to missing items

- Remove undefined items

- Delete all items with types that are not defined in fcs.def This will not affect items that are referenced by other items.

<span class="image-placeholder" role="note" data-image-index="5">Place relevant image here: The FCS - A Complete Guide screenshot 5</span>

Deprecated fields are removed. In this instance, these fields once existed but were since refactored into NPC class. Making a copy of Izumi and running the cleanup function gets rid of this information.

The cleanup function when you right click on items in the Game World window runs the ‘Remove deprecated fields’ task on the selected items

> [!warning] Missing is not necessarily unwanted
> Before removing references, check whether a required dependency is unloaded.
> Review deletions and conflicts rather than treating Cleanup as an automatic fix.
> Use the [[modding/fcs/complete-guide#types-of-errors|error reference]] to
> investigate the cause first.

### To Do List

The to do list can be useful for organising your tasks.

Add new entries by right-clicking on game objects and adding them to the list. From the list, you can open each item directly or right click it to change or update information.

<span class="image-placeholder" role="note" data-image-index="6">Place relevant image here: The FCS - A Complete Guide screenshot 6</span>

i personally use the guilded to do list as it manages easier and can support discussions on the item

### Errors

The errors list shows potential problems the FCS can identify. See the
[[modding/fcs/complete-guide#types-of-errors|error reference]] below for all
17 documented error types.

### Open Any

The Open Any function allows you to open, view, and edit:

- Save files
- Platoon files
- Leveldata files
- Interior data files

Its function is limited as far as modding goes, but browsing these files can give more insight into how gamedata works. Opening any .save file lets you see the current relations of each faction with the player and each other and see how many factions exist in-game in total, which is important if you’re using a lot of fake factions to store world data.

Useful For Save editing though: Save Editing Guide

## Artifacts

Artifacts are rare items that spawn randomly across the game world in high qualities. The artefacts list is used to limit the total number of them that are spawned, and is found at the header bar in the FCS:

These unique items are non-respawnable; the toolbar's Artifact settings controls
them separately from Global game settings.

<span class="image-placeholder" role="note" data-image-index="7">Place relevant image here: The FCS - A Complete Guide screenshot 7</span>

Inside, you can define how many of each artefact should spawn:

- Specialist and Masterwork armours, crossbows, and robotic limbs
- Rare items like ancient science books
- The quality and quantity of each weapon model
- The artefacts list is independent of items spawned other ways, such as by shopkeepers and building inventories.

### Adding Artefact Spawn Locations

Artefacts need to know where to spawn, and to do so you need to define both the towns in which they spawn and the buildings. You’re not placing them by hand – rather, you’re adding potential spawn locations that are randomised on game start.

<span class="image-placeholder" role="note" data-image-index="8">Place relevant image here: The FCS - A Complete Guide screenshot 8</span>

It’s recommended to use higher artefact values for residents who (might) receive artefacts than the towns they’re in to prevent weird edge cases where things go missing.

- Gear artifacts refer to armours, weapons, limbs, and crossbows.
- Item artifacts are the rare research items used in vanilla – AI cores, ancient science books, and engineering research. There’s nothing stopping you from adding other unique ingredients as artifacts, though.

## Global Constants

Global constants are game balancing settings. It’s advisable to leave them unchanged unless you’re making one of the following:

- An overhaul or total conversation
- A mod that rebalances an area of gameplay, such as a “combat” mod that specifically redesigns elements of combat, or an “economy” mod that overhauls the game’s economic systems
- A general “balance” mod

The entries should be self-explanatory with the following clarifications:

- Build material dismantle percentages apply to each ingredient individually. So, with the default 60% percentage, a building that uses one each of four separate ingredients will return the full amount when dismantled.
- Max faction size should be capped at 256. That’s the hard limit for player characters and adding more will make the game crash.
- Carry person weight applies to all character types – human, and animal.
- Days per year affects nothing other than biome seasons, which by default are mostly the same in each biome.
- Avoid setting minimum lockpick chance too high, otherwise players with low-level characters will frequently find it impossible to escape from imprisonment.

When rebalancing global constants for any purpose, it’s worth spending enough time in-game to get a feel for them to avoid unintended power curves and balancing issues.

## Navigating and locating data

### The Game World Window

![the four areas of Game World](assets/fcs/fcs-game-world-window.png)

1. Object categories and subcategories

- NOTE: the root category does not necessarily contain all of the items found in the subcategories. E.g. Dialogue Package does NOT contain all the items found in Word Swaps or Dialogue
- This layout can be modified in fcs_layout.def (found in the same folder as forgotten construction set.exe)

3. The items in the selected category

- Double click on items here to open and modify them
- If you have multiple items selected, press return to open them all

5. Object property columns

- Click to sort items
- Right click to add columns
- See Custom Columns

7. The search box for narrowing the results shown in panel 2

- See the Searching for data section below for an in depth look at this feature and how to use it

### Colour Coding of Items

The colour of the items in the list dictate the state of the item. This colour code system is also used for properties of the items.

- Black - Value is from a base mod
- Blue - Value is modified by the active mod
- Green - Value was created by the active mod
- Grey - Item is deleted by the active mod, or by a later mod.
- Orange - Item is created by a later mod. You can’t modify these in the active mod

### Custom Columns

![the custom-column menu](assets/fcs/custom-columns.png)

You can add additional columns to the item list to display any item property from the right click menu.

The default options shown above are as follows;

- String ID - The unique ID of the item
- Ref - Number of other items that reference this item
- Type - The object type e.g. CHARACTER, BUILDING, RESEARCH
- State - The item state indicated by its colour coding (see previous section)

All of these columns (as well as any custom ones you might add) can be used to sort the items in the current display section by clicking on the column header. Columns can also be re-arranged via drag and drop and resized however you see fit.

The Add/Add List options allow users to add columns for any property an item may have.

The ‘Add List’ option will open the dialog window seen below and allows you to view reference data at a glance.

![Add List display options](assets/fcs/add-list.png)

The Items and values options determine what to display (see image below for example).

If neither are checked the column will display the number of items in that list.

If you want to change these options after adding the column, just add the list again with the new options.

![list contents and values displayed as columns](assets/fcs/custom-columns2.png)

To remove any column, right click the header bar, go to columns and select the column you’d like to add or remove. The ‘Reset’ option will remove all additional columns.

### Object view

Double clicking on an item in the game world list will open up the object and give a view which will look something like this;

![values, references, and field help in object view](assets/fcs/object-view.png)

NOTE: If an object does not open this window by default, using ALT + Double click will open the item with this menu.

The properties on display will be different for each type of object available (e.g. a dialogue package won’t have an unarmed stats property, but a character will).

1. The value properties for this object

- Numbers, names, file paths and Enum dropdown

3. Object reference lists

- Anything referencing another object

5. A description of the highlighted property

The [...] button in the top right corner contains some extra actions to run on this item:

- Show References - display all items that link to this item.
- Copy Data From Item - Sets all properties in this item to match another item
- Add ToDo List item - Adds an entry for this item in the notes window
- Duplicate item - Makes a copy of this item
- Add missing fields - Add any properties defined in fcs.def that are missing from this item
- Remove obsolete fields - Delete any properties in this item that are no longer defined in fcs.def. This is the same as the ‘Clean item’ action in the Game World context menu.

## Data management tools

### Searching for data

The search box can be used in a multitude of ways to help locate data.

### Search by Name or StringID

The default behaviour for text in this box. In the below example you can see everything in the Building category with the word “dome” in the name.

NOTE: This search is NOT case sensitive

![building-name search for dome](assets/fcs/search.png)

### Search by value

Operators can be used to search for objects with certain values.

NOTE: Searching by value IS case sensitive for the property and is NOT case sensitive for your search term.

- Equal to

- Operator =
- Gives an exact match on a property

For example, `can block = true` finds weapons whose `can block` property is true.

![exact property-value search](assets/fcs/equal-to.png)

- Not Equal to

- Operator !=
- Does the opposite of the above

- Greater/Less than

- Operators > < >= <=

- More than
- Less than
- More than or equal
- Less than or equal
- For comparing numeric values

![numeric comparison search](assets/fcs/greaterless-than.png)

- Can also be used for list sizes, such as the example below.

- Showing all squads with more than 1 reference in the faction list

The filter is `faction > 1`.

![faction reference-list count search](assets/fcs/greaterless-than2.png)

- Contains

- Operator :
- For showing items with properties containing the given value
- E.g. below, all lines of dialogue which contain the word “Hello”

![dialogue text containing Hello](assets/fcs/contains.png)

For indexed fields such as dialogue lines where you have text0, text1, etc, you can search specifically by text0, or search all of them by omitting the number.

For example, `text0 : Hello` searches one indexed field, while `text : Hello`
searches across the indexed text fields.

- Does not contain

- Operator !:
- Provides the opposite result of the Contains operator mentioned above
- E.g. below, all crossbows with descriptions that don’t include “quality”

![descriptions not containing quality](assets/fcs/notcontains.png)

- Regex

- Operator ?
- Matches a string field to the provided regex
- A regular-expression reference and tester is listed in
  [[credits#fcs-tools-and-references|Credits]].

![a regular-expression search](assets/fcs/regex.png)

- Combining multiple search terms

The semi-colon operator can be used to use multiple search terms. In the example below, we’re searching for Buildings with “outpost” in the name and need over 100 building materials to complete construction.

The combined filter is `outpost; build materials > 100`.

![combined name and construction-cost filters](assets/fcs/combined-search.png)

- Special properties

- These are case sensitive.

- Ref - filter on number of references to the item, same as the Ref custom column
- Type - filter on item type.
- State - filter on item state

You can filter by references in a number of ways:

- Filter by reference count - ‘things > 5’ will get all items with more than 5 references in a list called things. All numeric operators will work.
- Filter by reference target - ‘things = item name’ will get all items that reference an item called ‘item name’. This can be the name or string id of the item.
- Filter by reference values: ‘things.v0 = 4’ will get all items with the first value of any referenced item in the things reference list being 4. This works with all numeric operators, and keys v0, v1 and v2 match the three potential values.
- Filter by property of referenced item: ‘things.property = blah’ will match all items that contain a reference to an item in its things list that would match a filter of ‘property = blah’. This also works with the special properties mentioned above.
- This system is fully recursive so you can chain multiple lists together, eg dialogs.lines.lines.effect > 0

- Recursive reference searching

Properties of objects referenced by list items can also be searched for using the period operator.

In the example below, we search for the list of characters for those part of a faction which are anti slavery.

The filter is `faction.anti slavery = true`.

![searching characters through faction properties](assets/fcs/recursive.png)

This method is fully recursive. Below is another example demonstrating this. The search is for all interior buildings with a functionality reference object that consumes items with a value of over 500 cats.

The filter is `functionality.consumes.value > 500`.

![searching through several reference lists](assets/fcs/recursive2.png)

- Set Field

Another useful function that allows setting a specific value in all selected items. This is found in the right click menu.

![Set Field on selected objects](assets/fcs/set-field.png)

As well as setting the value for multiple items at once, numerical fields can also be modified through multiplication, division, addition and subtraction.

There’s also support for adding and modifying reference values in bulk

![bulk reference-value editing](assets/fcs/set-field-2.png)

> [!warning] Review the selection
> Bulk operations affect the selected items, not just the object you inspected.
> Confirm the active mod, field, and selection before applying a change.

- Find and Replace

You can run find and replace on any text or filename field. The function is located in the right click menu in the Game World window and will run on all selected items.

Running it on dialogue items will affect all lines in that dialogue. You can also access it within the dialogue window where it will also run on all the lines.

It has the option to use regular expression searches.

- Spellcheck

The spell check option can be found in the top toolbar of the application, the conversation editor window and in the right click context menu of the navigation window.

![the toolbar spellcheck button](assets/fcs/spellcheckbar.png)

- Spellcheckbar

The toolbar button will run the spell check operation for all items.

- Spellcheckcontext

The right click context menu option will run the spell check operation for all selected items.

![spellcheck for selected items](assets/fcs/spellcheckcontext.png)

Spelling checks are done against the two dictionary files Dictionary.txt and Dictionary_custom.txt.

Currently these dictionaries are only set up to support english. For other languages, we recommend amending or replacing the contents of Dictionary.txt with words from your preferred language. FCS developers are currently only native english speakers, so we’re not the best judges of what constitutes a good dictionary in any other language.

## Managing your mod

### Item colour key

These colors describe the Changes/merge window, not the
[[modding/fcs/complete-guide#colour-coding-of-items|Game World and object-property color key]].

- Green - New item
- Blue - Modified existing item
- Grey - Deleted item
- Orange - Changes to this item in a later mod

- These changes can be merged but they will have no effect since a later mod will change the values anyway.

- Red - Merge conflict

- This means the item has been modified in both your mod and the mod you are merging since you last merged so the system cannot automatically detect which change is more recent.
- They are generally not an issue but you should check the values to verify if you want to accept or reject the change.

- Purple - Modified remove item

- Combination of Blue and Red states

### Loading your mod in game

![mod load order](assets/fcs/loadorder.png)

Order is very important in this file. Entries at the top will be loaded before entries lower down.

For example;

-FasterBeakThings.mod

-SlowerBeakThings.mod

The SlowerBeakThings.mod will take precedence over the FasterBeakThings.mod. If this isn’t the desired effect, swap them over so SlowerBeakThings.mod is first in the list.

### Merging Mods

You can merge data from another mod file using the merge tool from the top bar

![selecting data to merge into the active mod](assets/fcs/merge-mod.png)

First select a mod to merge with the active file. You can either select a mod from the list, or load any data file with the ‘*’ button.

You will not be able to merge a mod that is open as a dependency of the active mod, but you can merge mods that are later in the list.

The check boxes have three states:

![Ignore checkbox state](assets/fcs/ignorebox.png)

Ignorebox : Ignore - these changes will not be merged or discarded. This is the default.

![Selected checkbox state](assets/fcs/selected-box.png)

Selected Box : Selected - these changes will be applied to to the active mod

![Deselected checkbox state](assets/fcs/deselected-box.png)

Deselected Box : Deselected - these changes will be skipped and will not show up again next time you merge this mod. The Show Skipped Changes button will display changes that were previously skipped.

You can tick multiple boxes at once by selecting multiple items and clicking a checkbox, or from the right click menu. The right click menu also has recursive commands that will check or uncheck the selected item and any items referenced by that item. This allows easily selecting a complete dialogue and all of its lines.

The fix references command will ensure that any new items will also be merged if you have selected any references to them.

If a mod contains level data, that can also be merged with the merge level data checkbox. It will be disabled if there is no level data to merge.

### Uploading your mod to Steam

Launch the FCS through Steam in online mode for Workshop connectivity.
The standalone executable does not provide the Steam connection needed for
uploading. Cattrina contributed this guidance and annotated screenshot to the
Wiki article.

#### Annotated upload checklist

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

### Errors

If any errors are detected, the error window will display when you load your mod. This window is also available from the tool strip.

![the FCS Errors window](assets/fcs/errors.png)

Double clicking on an error will open the associated item.

Right clicking will show some options to resolve the error:

- Delete item - This will delete the associated item.
- Remove Invalid references. This will delete any references to invalid items that the associated item contains.
- Clear changes - This will revert any changes the active mod makes to this item.
- Ignore - This temporarily marks the error resolved. It may come back again later.

By default only errors associated with the current mod are displayed. You can show all errors with the show from all mods option. Some errors do not know which mod caused the problem so will always be shown.

If you open an item and get the ‘Dialogue line is not associated with any dialogue’
message, inspect its links and confirm it is orphaned before deleting it or
using Cleanup.

The errors list is only updated when a mod is loaded. The scan button can rescan the active mod for any new errors.

> [!warning] Check dependencies before deleting
> An undefined reference or missing modified item can mean a dependency was not
> loaded. Removing the reference or clearing changes is destructive, not a
> substitute for loading the required data.

### Types of Errors

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

---

> [!info] Source and migration status
> Imported from `The FCS - A Complete Guide.md` in the owner's Kenshi Modding Wiki collection, with republication clearance confirmed by the repository owner. Existing credits, source terms, and notices are retained. This migration does not assign a new license or imply independent verification of the game instructions. Approved Wiki screenshots illustrate the matching sections; four additional legacy illustrations remain explicit placeholders. The original source-image audit is preserved.

Return to the [[modding/index|modding guides]].

---
date: 2024-04-20T14:44
tags:
  - kenshi
  - modding
  - dialogue
  - wip
cssclasses:
  - page-kenshi
  - center-images
title: How to Find Specific Dialogue
description: Locate dialogue lines using text search and StringIDs.
publish: true
source_collection: Kenshi Modding Wiki
source_note: How to Find Specific Dialogue.md
source_sha256: aa2316dcdac78cee9b7dd3d98c5d970ca4dc71a0165650e0abc745dfb880ace8
source_license: Not specified in the source note; existing terms retained
source_categories:
  - WIP
  - Dialogue
  - Modding
---

> [!warning] Work in progress
> The source marks this guide as WIP. Its original instructions have not been independently retested for the current game version.

This marvelous step by step how to was posted in the Steam forums by
Tablesalt. Images by Cattrina. This page is part of the <span class="pending-reference" role="note">Dialogue Structure Overlook (reference page not imported)</span>
guide.

EDIT: Shidan made a comment on this guide; since the original post was
made, we have gotten an update from the devs. All you really need is to
type 'text: Sure, follow' on the search when you are in the _line tab
without the ''. I leave this guide here anyways, maybe this can be used
in some way.

_Want to know how certain dialogue back and forth is done in FCS? Want
to change one single phrase to something else? But you just cannot find
where the line is located in FCS?_

NOTE NOTE: to find word swaps you must search from the word swap
category and you do not find the word swap result from the notepad. You
need to first know how the word swap is done and then look for the word
swap fe. /MEUS/ from the note. BUT as word swaps are inherently used
several times you might not find what you want. So if you do not find
the sentence with this method, it is either added by a non vanilla mod
or it is a word swap. Or there is a spelling mishap. Might just be a
different ' that is used.

**Example:** you want to find the sentence 'Sure, follow me'. Vanilla
game uses /MEUS/ in this sentence, so you need to look for 'Sure, follow
/MEUS/'

**Example 2**: same way looking for 'sure follow' does not bring you a
result, as the comma is missing.

### Here's how:

**1.** Open up Dialogue.mod in a text editor, like Notepad. Right click
and select open with notepad.

It is located in the data folder in your Kenshi installation folder, fe.
`C:\Program Files (x86)\Steam\steamapps\common\Kenshi\data`

If you are looking for a line in a not vanilla mod, you do this to the
mod file. Those are in the workshop folder and you might want to first
copy it to your Kenshi/mods folder.
<span class="image-placeholder" role="note" data-image-index="1">Place relevant image here: SearchforDialogueLine1OpenWithNotepad</span>
**2.** Search for the line you're looking for. Before the line itself,
there'll be some information separated by pipe characters.

**3.** You're looking for the StringId (basically the identifier that
Kenshi uses to identify the line). It'll look something like
"48889-Dialogue.mod". Copy the number part.

<figure>
<span class="image-placeholder" role="note" data-image-index="2">Place relevant image here: SearchforDialogueLine</span>
<figcaption>SearchforDialogueLine.png</figcaption>
</figure>

**4**. Open up Forgotten Construction Set (it should be located in your
install directory, next to the kenshi executable). At this point you can
create a new mod if you want to make changes, or just hit "Done" if you
just want to look at the dialogue.

**5**. In the "Game World" window, expand the "Dialogue Package"
category at the left, then click the "_lines" category.

**6**. Right click on the panel on the right, and check the "Columns -\>
StringId" option. (This is not usually necessary).
<span class="image-placeholder" role="note" data-image-index="3">Place relevant image here: SearchforDialogueLine6ColumnsStringID</span>
**7**. Enter the StringId you copied from Dialogue.mod into the search
bar at the bottom of the FCS panel.

**8.** There should be just one DIALOGUE_LINE that matches it, so double
click on that to open the dialogue view, where you can click around to
get details about when the line is said, who says it, etc.
<span class="image-placeholder" role="note" data-image-index="4">Place relevant image here: SearchforDialogueLine2inFCS</span>

---

> [!info] Source and migration status
> Imported from `How to Find Specific Dialogue.md` in the owner's Kenshi Modding Wiki collection, with republication clearance confirmed by the repository owner. Existing credits, source terms, and notices are retained. This migration does not assign a new license or imply independent verification of the game instructions. Source image locations use explicit placeholders rather than broken image links.

Return to the [[modding/index|modding guides]].

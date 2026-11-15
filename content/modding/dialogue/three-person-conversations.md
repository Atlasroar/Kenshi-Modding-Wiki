---
date: 2024-04-20T14:44
tags:
  - kenshi
  - modding
  - dialogue
cssclasses:
  - page-kenshi
  - center-images
title: Three Person Conversations with Player
description: A dialogue structure using the player and alternating interjectors.
publish: true
source_collection: Kenshi Modding Wiki
source_note: Three Person Conversations with Player.md
source_sha256: 596b975de043bc90c0faa775f64bb29450dac2d932a43270fc5396cd7d55ac50
source_license: Not specified in the source note; existing terms retained
source_categories:
  - Dialogue
  - Modding
---

[[modding/index|Modding guides]]

<span class="image-placeholder" role="note" data-image-index="1">Place relevant image here: Three speaker flow chart pic</span>You
can make a dialogue between three persons, including a player character.

For this to function, you need a host character, that does not take part
in the conversation, but the player clicks on. They have the first
line(s), but the moment you change the speaker they cannot talk again.
They cannot be added as an interjector.

You can then alternate between interjectors and the player. You cannot
have interjectors to talk each other, you need a player input after each
interjector line. You could put something like \[continue listening\]
for the player line. I would also recommend an option to exit the
conversation.

All affects (like da join squad fast) apply to the host.

I noticed this works best if you have the interjectors as specific
characters, because if you do not use 'is character' it is possible
someone else to be triggered instead.

And, of course, the entire chain breaks if there is no NPC to interject.

This article is part of the <span class="pending-reference" role="note">Dialogue Structure Overlook (reference page not imported)</span> guide.

---

> [!info] Source and migration status
> Imported from `Three Person Conversations with Player.md` in the owner's Kenshi Modding Wiki collection, with republication clearance confirmed by the repository owner. Existing credits, source terms, and notices are retained. This migration does not assign a new license or imply independent verification of the game instructions. Source image locations use explicit placeholders rather than broken image links.

Return to the [[modding/index|modding guides]].

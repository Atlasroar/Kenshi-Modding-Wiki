---
date: 2024-04-20T14:44
tags:
  - kenshi
  - modding
  - assets
cssclasses:
  - page-kenshi
  - center-images
title: Multiuser Animation Guides
description: Options and limitations for multi-character seating and animations.
publish: true
source_collection: Kenshi Modding Wiki
source_note: Multiuser Animation Guides.md
source_sha256: 13660daa1641f3f4a4d9cc7c50cb143141d96f7b38d884a4d1ff4ad4a6c7837d
source_license: Not specified in the source note; existing terms retained
source_categories:
  - Modding
---

[[modding/index|Modding guides]]

Kenshi is lacking some of the finesse when making a multi-person chair
for example.

Kenshi does allow multiple characters to sit on an object, but there is
no offset option in FCS for each sitter. Characters would sit on top of
each other.

But we got two options:

**A)** a female and a male skeleton (or any two or more different
skeletons\*) can sit on a single object nicely side by side, if the
sitting animation is made so that the bone positions are saved a bit
aside from the origo, the other left and the other right. AKA
in-building the offset to the animation. Both animations are saved on
the animation strip with the same exact name.

**B)** any amount of characters can sit on a 'church bench' if each
character has their own chair. This would mean the bench is divided in
several mesh parts, which are each a seat. No, you cannot make that a
single object with several parts, just does not work that way. It would
mean the person setting up the bench would have to manually place each
part side by side.

Many modders are able to set up their interiors like this easily, but
not many players have those skills. So the player could hardly build the
bench precisely, although it does not really have to be perfect. But
would surely frustrate many. It may be possible to set all the bench
parts to link to each other, have not really explored this, but all the
pieces would have to be identical and stand alone. I have not tested
this with animation functions.

_\*Technically it would be impossible for the player to know which
characters of theirs have different skeleton, resulting in an experience
of 'sometimes it works, sometimes it does not'. So far easier for all
players to understand, is to use this only on animation pairs that are
traditionally male and female animations, like a wedding, ball dance,
etc. Gay marriage would require the option B._

---

> [!info] Source and migration status
> Imported from `Multiuser Animation Guides.md` in the owner's Kenshi Modding Wiki collection, with republication clearance confirmed by the repository owner. Existing credits, source terms, and notices are retained. This migration does not assign a new license or imply independent verification of the game instructions. Source image locations use explicit placeholders rather than broken image links.

Return to the [[modding/index|modding guides]].

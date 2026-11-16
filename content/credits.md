---
title: Credits
description: What information the guides use, where it came from, and where it appears.
publish: true
comments: false
---

Each source below describes the information used and links back to the guide
where it appears. Original source terms still apply.

## Homepage sources

The owner-supplied _Kenshi_ note provided the overview of squad control, skills,
base building, injuries, survival, and open-ended play. It cites the
[Kenshi Steam listing](https://store.steampowered.com/app/233860/Kenshi/) and
[Lo-Fi Games](https://lofigames.com/) for its game information.
The [Kenshi Wiki homepage](https://kenshi.fandom.com/wiki/Kenshi_Wiki)
([revision 75072](https://kenshi.fandom.com/wiki/Kenshi_Wiki?oldid=75072),
[contributor history](https://kenshi.fandom.com/wiki/Kenshi_Wiki?action=history))
provided the sword-punk game introduction and community-reference context.
Used on [[index|Kenshi. A world worth changing.]].
The descriptions were rewritten, combined, and connected to this site's modding
guides; source promotional prose, artwork, trailers, live statistics, and
hardware recommendations were not copied. Wiki-derived adaptations are credited
to the Kenshi Wiki contributors under
[CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/).

## Guide credits

### reKenshi and KenshiLib sources

The owner's
[The Ultimate Guide To RE_Kenshi / ReKenshi](https://steamcommunity.com/sharedfiles/filedetails/?id=3766654540)
supplied Windows/Proton installation, settings, plugin installation and examples,
support workflows, and eight original screenshots. Used on
[[rekenshi/overview|reKenshi Overview]], with relevant feature/troubleshooting
context on [[rekenshi/features|Features & Settings]],
[[rekenshi/faq|FAQ & Common Problems]], and
[[rekenshi/kenshilib/index|KenshiLib Overview]].
The owner identified this as their original guide and confirmed image-reuse
permission. Existing collaborator/source terms still apply; no new license is
assigned to the guide or screenshots.

BFrizz's [reKenshi wiki home](https://github.com/BFrizzleFoShizzle/RE_Kenshi/wiki)
supplied the project structure and bug-reporting preferences used on
[[rekenshi/overview|reKenshi Overview]] and
[[rekenshi/faq|FAQ & Common Problems]].
The [feature reference](https://github.com/BFrizzleFoShizzle/RE_Kenshi/wiki/RE_Kenshi-Features)
supplied the **0.2.18** feature ranges, performance caveats, and advanced settings
used on [[rekenshi/features|Features & Settings]] and summarized in
[[rekenshi/overview|reKenshi Overview]].

The [upstream FAQ](https://github.com/BFrizzleFoShizzle/RE_Kenshi/wiki/FAQ--and-Common-problems-%28WIP%29)
supplied missing-DLL causes, recruitment limits, and report/UUID/crash-dump
privacy details for [[rekenshi/faq|FAQ & Common Problems]].
The source is work in progress, and its general compatibility goal is not
repeated as a guarantee for every plugin combination.

The [file-rebind API](https://github.com/BFrizzleFoShizzle/RE_Kenshi/wiki/Using-RE_Kenshi-to-mod-hard-coded-file-paths)
supplied exact-path matching, JSON escaping, and `modroot` semantics for
[[rekenshi/file-rebinding|File Rebinding]].
The [source-linked mod configuration schema](https://github.com/BFrizzleFoShizzle/RE_Kenshi/blob/0.2.12_fork/mod-config.schema.json)
is an additional reference for that API and [[rekenshi/features|Features & Settings]].
The [logging walkthrough](https://github.com/BFrizzleFoShizzle/RE_Kenshi/wiki/Finding-file-paths-for-rebinding)
supplied the capture workflow and three screenshots for
[[rekenshi/finding-file-paths|Finding File Paths]].

The [heightmap tutorial](https://github.com/BFrizzleFoShizzle/RE_Kenshi/wiki/Loading-the-heightmap-from-your-mods-folder)
supplied the enabled `.mod`, `RE_Kenshi.json`, replacement-heightmap workflow,
and three additional screenshots for
[[rekenshi/heightmaps|Loading a Modded Heightmap]].
The [sound-bank walkthrough](https://github.com/BFrizzleFoShizzle/RE_Kenshi/wiki/Using-RE_Kenshi-to-mod-sound-banks)
supplied the legacy Wwise workflow, event logging, sample JSON, and twelve
screenshots for [[rekenshi/sound-banks|Sound Banks]]. Its incomplete-documentation
warnings and version-specific tool recommendations are retained.
The owner confirmed image-reuse permission for the supplied source material;
no separate screenshot license is inferred from a code license.

The [KenshiLib wiki](https://github.com/BFrizzleFoShizzle/KenshiLib/wiki)
supplied the development/implementation scope for
[[rekenshi/kenshilib/index|KenshiLib Overview]].
Its [hook tutorial](https://github.com/BFrizzleFoShizzle/KenshiLib/wiki/Hooking-functions)
supplied stub resolution, alternate method definitions, continuation chains,
calling-convention cautions, and unfinished ABI/VMT limitations for
[[rekenshi/kenshilib/hooks|Function Hooks]].
The [checked Functions.h](https://github.com/BFrizzleFoShizzle/KenshiLib/blob/1ce4a163739bbdf17254259039d7aa74fcc11cc0/Include/core/Functions.h)
was used to verify the API names rather than copy malformed sample code.

The [checked reKenshi README](https://github.com/BFrizzleFoShizzle/RE_Kenshi/blob/c8dfbc9621b9263863722852f819c4c0f440475a/README.md)
and [0.3.5 release](https://github.com/BFrizzleFoShizzle/RE_Kenshi/releases/tag/v0.3.5)
supplied supported game builds, compatible-executable setup, manual-install
limits, and removal steps for [[rekenshi/overview|reKenshi Overview]] and
[[rekenshi/faq|FAQ & Common Problems]].
The [checked KenshiLib README](https://github.com/BFrizzleFoShizzle/KenshiLib/blob/1ce4a163739bbdf17254259039d7aa74fcc11cc0/README.md)
supplied compiler/dependency requirements, thread safety, and licensing
qualifications for [[rekenshi/kenshilib/index|KenshiLib Overview]].
The wiki revisions, source fingerprints, and original image hashes are in the
[import record](https://github.com/Atlasroar/Kenshi-Modding-Wiki/blob/main/docs/modding-imports.json).

#### reKenshi downloads and development resources

For the installation and support references used by
[[rekenshi/overview|reKenshi Overview]] and [[rekenshi/faq|the FAQ]], use the
official [reKenshi releases](https://github.com/BFrizzleFoShizzle/RE_Kenshi/releases),
[Nexus download](https://www.nexusmods.com/kenshi/mods/847),
[Nexus bug reports](https://www.nexusmods.com/kenshi/mods/847?tab=bugs),
[project issue tracker](https://github.com/BFrizzleFoShizzle/RE_Kenshi/issues),
and [Genesis Modding Guild](https://discord.gg/g7F6aHw).
The project's wiki explains its preferred direct-support route.
Microsoft provides the
[x64 Visual C++ redistributable](https://aka.ms/vs/17/release/vc_redist.x64.exe)
and [supported-download reference](https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist).

For [[rekenshi/kenshilib/index|KenshiLib development]], the original resources are
[KenshiLib Examples](https://github.com/BFrizzleFoShizzle/KenshiLib_Examples),
[example dependencies](https://github.com/BFrizzleFoShizzle/KenshiLib_Examples_deps),
and the [KenshiLib repository](https://github.com/BFrizzleFoShizzle/KenshiLib).
The [GNU GPLv3 text](https://www.gnu.org/licenses/gpl-3.0.html) and each project's
license/dependency notices govern their code; the pages do not assign those
terms indiscriminately to every ordinary FCS mod.
For [[rekenshi/sound-banks|Sound Banks]], the source's
[legacy Wwise resource](https://wiki.totalwar.com/w/Wwise_-_Audio_Modding)
is retained as a version-specific reference, not a promise that an old download
remains available. Plugin examples and optional video references remain in
the owner's original Steam guide rather than being embedded as third-party
cards or executable content here.

### Dialogue guide sources

[Kenshi Modding 101: FCS and Dialogue](https://steamcommunity.com/sharedfiles/filedetails/?id=1444279946)
supplied package/event concepts, availability settings, squad-leader context,
and debugging exercises.
[Simple Dialogue Modding Guide](https://steamcommunity.com/sharedfiles/filedetails/?id=804686889)
supplied the illustrated root/child workflow, word swaps, conditions, effects,
and character-package assignment.
Used on [[modding/dialogue/creating-dialogue|Creating Dialogue in the FCS]].
The instructions were rewritten and combined, with screenshot-only steps
explained in text. The owner supplied the saved guides and confirmed permission
to republish their screenshots; no new license is assigned to the Steam sources.

[Using the FCS](https://kenshi.fandom.com/wiki/Using_the_FCS) supplied the editor
interface, searches, bulk editing, load order, merging, cleanup, Steam uploads,
17 error types, and 30 screenshots. The
[FCS interface article](https://lost-blog.com/fcs-interface/) supplied additional
interface notes. Used on [[modding/fcs/complete-guide|The FCS - A Complete Guide]].

The [in-game editor article](https://lost-blog.com/in-game-editor/) supplied
instructions for towns, buildings, interiors, and placement.
Used on [[modding/world/in-game-editor|In Game Editor]].

The [Steam vendor-list discussion](https://steamcommunity.com/app/233860/discussions/3/1739980540120440391/)
supplied vendor-list setup and related item-list advice.
Used on [[modding/world/vendor-lists|Vendor Lists]].

[Save Editing 101](https://steamcommunity.com/sharedfiles/filedetails/?id=1370334383)
was cited as a related save-editing reference, not as the source of every
ownership instruction. Referenced on
[[modding/save-editing/claim-town-ownership|Claim Town Ownership]].

An [older navmesh example](https://www.reddit.com/r/Kenshi/comments/upmm4q/modular_fortresses_for_lita_done/)
was referenced to illustrate complex building collision and navigation work.
Referenced on [[modding/world/building-collision-navmesh|Buildings Collision & Navmesh]].

### Imported notes without a recorded public source

The following information came from owner-cleared imported notes. No public
source URL was recorded, so none is guessed. Note titles, original fingerprints,
and retained source details are available in the
[import record](https://github.com/Atlasroar/Kenshi-Modding-Wiki/blob/main/docs/modding-imports.json).

Dialogue talkers, conditions, and effects are used on
[[modding/dialogue/conditions-and-effects|Dialogue Condition & Effects]].

Dialogue text searches, StringIDs, and the older text-editor lookup method are
used on [[modding/dialogue/find-specific-dialogue|How to Find Specific Dialogue]].

The owner-cleared _Three Person Conversations with Player_ note supplied the
host/interjector structure, player-input requirements, effect-recipient warning,
and missing-interjector limitation. Used on
[[modding/dialogue/creating-dialogue#three-person-conversations-with-the-player|Creating Dialogue in the FCS]].

Race-creation steps and warnings are used on
[[modding/characters/creating-a-race|Creating a New Race Guide]].

Character-name database setup is used on
[[modding/characters/name-databases|Name Database Guide]].

Invisible-character setup is used on
[[modding/characters/invisible-characters|Invisible Characters Guide]].

NPC removal at game start is used on
[[modding/world/kill-npcs-at-game-start|Killing Npcs at Game Start]].

NPC-bed access information is used on
[[modding/world/public-npc-beds|Sleeping On Npc Beds]].

Armor color-map setup is used on
[[modding/assets/armor-color-maps|Color Map for Armors Guide]].

Multiuser animation workflows are used on
[[modding/assets/multiuser-animations|Multiuser Animation Guides]].

## Using the FCS: text license

Material adapted from Kenshi Wiki contributors'
[Using the FCS, revision 92817](https://kenshi.fandom.com/wiki/Using_the_FCS?oldid=92817),
with contributors identified through its
[history](https://kenshi.fandom.com/wiki/Using_the_FCS?action=history), remains
available under [CC BY-SA 3.0 Unported](https://creativecommons.org/licenses/by-sa/3.0/).
The adaptation consolidates and rewrites the instructions, adds safety notes
and copyable examples, and transcribes the annotated Steam-upload checklist
in [[modding/fcs/complete-guide|The FCS - A Complete Guide]].
This does not relicense unrelated source material.

## FCS screenshot credits

The [Using the FCS article](https://kenshi.fandom.com/wiki/Using_the_FCS) supplied
the 30 screenshots used on [[modding/fcs/complete-guide|The FCS - A Complete Guide]].
Wiki-team reuse permission was confirmed on 2026-11-15; the source community's
CC-BY-SA notice is retained and the image contents are unchanged.
Original file links, recorded uploader roles, dimensions, permissions, and
hashes remain in the [import record](https://github.com/Atlasroar/Kenshi-Modding-Wiki/blob/main/docs/modding-imports.json).

## FCS tools and references

[Save Editing 101](https://steamcommunity.com/sharedfiles/filedetails/?id=1370334383),
[game/FCS mechanics notes](https://steamcommunity.com/sharedfiles/filedetails/?id=2570870493),
[Kenshi Modding 101: FCS and Dialogue](https://steamcommunity.com/sharedfiles/filedetails/?id=1444279946),
and [How to Find and Edit Mods](https://steamcommunity.com/sharedfiles/filedetails/?id=1608980474)
are further-reading references named by the source manual and retained for
[[modding/fcs/complete-guide|The FCS - A Complete Guide]], not separate claims
that their instructions were incorporated.

[Regexr](https://regexr.com/) is the regular-expression reference and tester
mentioned in [[modding/fcs/complete-guide|The FCS - A Complete Guide]].

## Website sources

[Quartz](https://quartz.jzhao.xyz/) provides the website generator; its MIT
license and notices remain in the repository.
The [website source repository](https://github.com/Atlasroar/Kenshi-Modding-Wiki)
and [technical Wiki](https://github.com/Atlasroar/Kenshi-Modding-Wiki/wiki)
contain the implementation and contribution instructions.

Browse [[modding/index|all modding guides]].

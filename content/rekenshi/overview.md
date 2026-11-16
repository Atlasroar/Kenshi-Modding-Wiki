---
title: reKenshi Overview
description: Install reKenshi, understand native plugins, find its settings, and choose a modding workflow.
publish: true
---

RE_Kenshi, usually written reKenshi here, is BFrizz's extension and native-plugin
loader for Kenshi. Where the FCS changes the game's exposed data, native plugins
can add behavior that the FCS cannot express. KenshiLib supplies the reconstructed
game structures and function access used by plugin developers.

This overview combines the owner's _The Ultimate Guide To RE_Kenshi / ReKenshi_
with the project wiki and installation documentation. Original sources,
downloads, and screenshot permission are collected on
[[credits#rekenshi-and-kenshilib-sources|Credits]].

## Choose your starting point

For playing with plugins, install reKenshi and follow the plugin's own
requirements. You do not need to compile reKenshi or KenshiLib.
For FCS-based extensions, start with [[rekenshi/file-rebinding|File Rebinding]],
[[rekenshi/heightmaps|Loading a Modded Heightmap]], or
[[rekenshi/sound-banks|Sound Banks]].
For C++ development, use the [[rekenshi/kenshilib/index|KenshiLib Overview]].

> [!warning] Versions matter
> The feature wiki labels its coverage **0.2.18**; the supplied guide also
> describes **0.3.x** plugin loading. The checked release, **0.3.5**, lists
> supported Steam/GOG builds of Kenshi **1.0.65 and 1.0.68**. This does not mean
> arbitrary executables are supported: the installer prepares a compatible
> 1.0.65-based executable for supported 1.0.68 installations. Check the release
> you actually install. The examples below are source-based, not independently
> retested in the game.

## What reKenshi adds

Built-in options include emergency saving after some crashes, a random-number
generation fix, adjustable game speeds, a higher camera limit, shader and
collider caching, heightmap loading options, and overrides for attack slots
and squad/faction limits. None is a promise that every crash can be recovered
or that every machine will run faster.

![Emergency-save prompt offering to attempt a save when Kenshi crashes](assets/rekenshi/emergency-save.png)

The [[rekenshi/features|Features & Settings]] reference explains the documented
ranges, checkboxes, performance costs, and advanced options.

## Install on Windows

1. Use the official release or Nexus download listed on
   [[credits#rekenshi-downloads-and-development-resources|Credits]].
   Choose the standard installer archive rather than the loose/manual package
   unless you deliberately need manual installation.
2. Extract **all** archive contents together before running the installer.
3. Run the included `RE_Kenshi_vX.X.X.exe`, select the correct Kenshi executable,
   check the language, and follow the prompts.
4. Start Kenshi normally. Confirm that the main-menu version text includes
   `RE_Kenshi vx.x.x - Kenshi 1.0.x - x64 (Newland)`.
5. Open **Options > Mods > RE_Kenshi Settings**. In a running game, reach Options
   through the Esc menu.

![Nexus download list identifying the reKenshi installer package](assets/rekenshi/installer-download.png)

The source screenshot shows **0.3.4**; it illustrates which package to select,
not the current release number.

![Extracted installer with the Kenshi executable path and language selector highlighted](assets/rekenshi/installer-path.png)

The optional reKenshi shortcut can skip some startup initialization. It is not
required to load reKenshi when the regular launch has been configured correctly.
For missing DLL errors, see [[rekenshi/faq#installer-cannot-find-a-dll|the FAQ]].

### Supported manual installation

The checked README limits manual installation to supported Steam/GOG
**1.0.65** builds. Use the installer for **1.0.68**, where compatibility setup
is required.

From the loose archive's `install` directory, copy `RE_Kenshi.dll`,
`KenshiLib.dll`, `CompressToolsLib.dll`, and the complete `RE_Kenshi` folder
into the Kenshi installation root. Preserve the folder's `locale`, `RVAs`,
and `game_speed_tutorial.png` contents. In `Plugins_x64.cfg`, put this entry
before the Direct3D11 renderer plugin:

```ini
Plugin=RE_Kenshi
```

Confirm the version text after launching. Do not mix loose files from different
releases or use these instructions to bypass the 1.0.68 installer.

### Disable or uninstall

Use the installer's **Uninstall** action for removal. If it cannot run, removing
`Plugin=RE_Kenshi` from `Plugins_x64.cfg` disables the plugin.
For the documented supported-1.0.68 setup, `--norekenshi` launches vanilla
Kenshi 1.0.68 instead of the compatible reKenshi executable.

## Install through Proton on Linux or Steam Deck

The supplied Steam guide describes this community workflow; Proton behavior,
paths, and installer dialogs may vary.

1. In Steam, open Kenshi's **Manage > Browse local files** and copy the location
   of its executable.
2. Download and extract the complete reKenshi installer archive.
3. Add the installer executable to Steam as a **Non-Steam Game**.
4. In that entry's **Properties > Compatibility**, force **Proton Experimental**.
5. Launch the installer through Steam and enter the actual Kenshi executable
   path when requested. A Windows-style `Z:` drive is Proton's mapping to the
   Linux filesystem; do not assume hidden `.local` folders will be easy to browse.
6. Follow the installer prompts. Desktop/Start-menu shortcuts are optional and
   usually unnecessary for this workflow.
7. Launch Kenshi normally through Steam and check its version text and
   reKenshi settings.

Do not judge success solely by whether a separate executable is visible.
If installation fails, record the error rather than repeatedly changing files
at random; see [[rekenshi/faq#linux-and-steam-deck|Linux troubleshooting]].

## Configure the in-game controls

Open **Options > Mods > RE_Kenshi Settings** from the main menu or Esc menu.
Game-speed values can be fractional: `0.5` is slow motion and `3.5` is faster
than normal. The source warns that **negative speeds can crash the game**.
Speeds above `1000x` are not officially supported.

![reKenshi game-speed settings and interface](assets/rekenshi/game-speed-settings.png)

![Annotated explanation of the custom game-speed controls](assets/rekenshi/game-speed-controls.png)

For squad/faction and attack-slot overrides, enable the associated checkbox
as well as choosing a value. Zero or an unchecked override restores the
game/mod-controlled value; a small accidental override can prevent recruitment.

### ReShade, camera changes, and other plugins

The supplied guide places ReShade in the `RE_Kenshi` subfolder for reKenshi
**0.3.1 and later**. Treat this as version-specific integration advice and check
the current renderer/plugin instructions. It also suggests the DUST rendering
framework as an alternative, not a component required by reKenshi.

The guide describes missing free-camera functionality in **0.3.0/0.3.1** and
its restoration in **0.3.2**. Do not present that historical limitation as a
restriction of every newer release.

## Install and maintain plugins

The supplied guide dates reKenshi's newer plugin support to **0.3.0+**.
Each plugin can require a newer reKenshi/KenshiLib combination.

For Workshop plugins, subscribe and enable the matching mod in Kenshi's mod
list. For non-Workshop packages, follow the package's instructions for placing
the mod under `mods` and enabling it. Check required companion plugins too.

Avoid casually copying Workshop plugins into a renamed local `mods` folder.
A local copy can take precedence over the subscribed version and keep an old
DLL active while Steam updates the Workshop copy. Backups and intentional local
development are different from keeping two active installations.

The source often groups plugins at one end of the load order, but that is not
a universal compatibility guarantee. Follow explicit dependencies and author
instructions. UI plugins can interact with ordinary UI mods, and native hooks
can conflict. Update or isolate the affected packages before assuming load
order alone fixes the problem.

## Examples from the supplied guide

These are examples of the ecosystem, not an exhaustive catalog or an independent
compatibility review. Download/source references remain on Credits.

| Area                    | Examples named in the guide                                             |
| ----------------------- | ----------------------------------------------------------------------- |
| Modding and diagnostics | Kenshi Extension Plugin, ReDev, FCS Extended, BFrizz's Extra Extensions |
| Rendering and camera    | DUST, Freecam Rebuilt, Character Highlight, Attachment Optimization     |
| Character interaction   | Manual Combat, Go Prone, Hide Your Helmet, Japanese IME Input Support   |
| Inventory and building  | Extra Inventory Sections, Rotate Items, Wall-B-Gone                     |
| Additional systems      | Boundless Thirst, Better Banking, Need Sleep, LimbRegen                 |

For example, the guide lists Kenshi Extension Plugin as requiring
**KenshiLib 0.5.0+ / reKenshi 0.3.5+**. This is a package-specific requirement,
not the minimum for every plugin.

### FCS Extended and BFrizz's Extra Extensions

FCS Extended loads custom `fcs.def` configurations and exposes additional
editor/plugin features. The supplied guide pairs BFrizz's Extra Extensions
with reKenshi **0.3.0+** and requires FCS Extended for authoring its extensions.
These are separate packages, not vanilla FCS features.

The listed extra conditions check sleeping, short-term perception tags,
alliance through disguise, unmodified/modified stats, weapon level, and armour
level. In the armour-level comparison, matching **one equipped piece** is enough;
do not interpret it as a comparison against every piece.
The source names these checks `DC_IS_SLEEPING`, `DC_HAS_SHORT_TERM_TAG`,
`DC_IS_ALLY_BECAUSE_OF_DISGUISE`, `DC_STAT_LEVEL_UNMODIFIED`,
`DC_STAT_LEVEL_MODIFIED`, `DC_WEAPON_LEVEL`, and `DC_ARMOUR_LEVEL`.

The listed effects can transfer or destroy a quantity of items. A transferred
item goes to the speaker's inventory, or the ground when there is no room.
Variable operations compare equality/greater-than/less-than and set or add a
value; adding a negative value performs subtraction. Consult the package's
current documentation before relying on exact field names or semantics.

## Get help or report a bug

The project wiki prefers direct support contact for installer problems because
installer reports alone may lack enough diagnostic detail. Credits collects
the project support channels, issue tracker, Nexus bug page, and download links.
Include the reKenshi/game versions, Windows versus Linux/Steam Deck, reproduction
steps, and the exact error.

The supplied guide shows how the Genesis Modding Guild's **Channels & Roles**
selection reveals its Kenshi/reKenshi channels; channel names and organization
can change.

![Selecting the Kenshi community role in the supplied support-server screenshot](assets/rekenshi/support-role.png)

![reKenshi support, plugin, and development channels in the supplied screenshot](assets/rekenshi/support-channels.png)

The in-game **General > Report Bug** workflow is also available.

![reKenshi's in-game bug-report interface](assets/rekenshi/report-bug.png)

The UUID hash helps the developer associate reports and crash dumps, but a crash
dump can contain identifying data. Review what you send; see
[[rekenshi/faq#bug-reports-and-privacy|Bug reports and privacy]].

## Licensing and next steps

The projects' core code is GPLv3 and dependencies have their own terms.
KenshiLib's README specifically warns that plugins generally need GPLv3-compatible
distribution. Review the licenses applying to your code and dependencies;
do not turn that into a blanket claim that every ordinary data-only FCS mod
automatically has the same license.

Continue with [[rekenshi/features|Features & Settings]],
[[rekenshi/faq|FAQ & Common Problems]], or the
[[rekenshi/kenshilib/index|KenshiLib Overview]].

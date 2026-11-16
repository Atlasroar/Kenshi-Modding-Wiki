---
title: Features & Settings
description: reKenshi's documented player features, modding interfaces, performance tradeoffs, and advanced settings.
publish: true
---

This reference condenses the project's **0.2.18 feature wiki** and the supplied
Steam guide. Newer releases may change options, defaults, or UI labels.
Use the [[rekenshi/overview|Overview]] for installation and plugin loading.
Sources and original screenshots are credited on
[[credits#rekenshi-and-kenshilib-sources|Credits]].

## Player features

| Feature                  | What it changes                                                                   | Important limitation                                                |
| ------------------------ | --------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Emergency saves          | Attempts to save when the crash handler detects a failure                         | Recovery can fail; keep normal saves and backups                    |
| RNG fix                  | Corrects the random-number behavior affecting randomized recruits and item spawns | This is not a promise of particular recruit or loot results         |
| Custom speeds            | Fractional slow motion and speeds up to `1000x`                                   | Negative values can crash the game; larger values are unsupported   |
| Camera height            | Doubles the documented maximum camera height                                      | Extreme zoom can expose shadow/visual bugs                          |
| Shader cache             | Reuses compiled shaders to reduce some startup work                               | Stuttering or load-time improvement varies                          |
| Mod-list scroll fix      | Keeps the list from jumping to its top after changes                              | Can be disabled to restore the vanilla behavior                     |
| Skip splash screens      | Skips introductory screens before the menu                                        | The source's measured saving is machine-specific                    |
| Skip unused mipmap reads | Avoids unused texture reads below maximum texture quality                         | The source also associates this option with BC7 texture fixes       |
| PhysX collider cache     | Avoids repeatedly loading the same collider                                       | Reduces repeated file/CPU work; not every delay is collider-related |

![Example of the crash-handler emergency-save prompt](assets/rekenshi/emergency-save.png)

## Mod-controlled limits

The documented sliders allow attack slots **1-5**, maximum squad size
**1-1000**, maximum faction size **1-1000**, and maximum squads **1-1000**.
Check the override checkbox as well as setting the slider. An unchecked override
or a slider at **0** falls back to the value from the game/mods.

The source describes manual out-of-range values in `RE_Kenshi.ini` as unofficial.
It also reports UI problems above **256 characters in a squad**; that observation
is not a guarantee of stable large-squad gameplay. For recruitment problems,
check [[rekenshi/faq#cannot-talk-to-recruits|the relevant limits first]].

## Heightmap loading

**Compressed heightmap:** requires the installer to have created the compressed
heightmap. It is generally aimed at HDD loading; decoded values can use up to
**500 MB** of additional RAM. The documented installer defaults enable
compression for HDDs and disable it for SSDs.

**Fast uncompressed heightmap:** reads the ordinary `.TIF` file differently.
It does not require the compressed installer option and is the wiki's preferred
starting point for SSDs. The source reports compressed loading can be slower
on some high-end SSDs, with improvements from **0.2.9** onward.

The first run attempts to choose a mode based on the drive. The Steam guide's
broader recommendation for compressed mode is not a reason to ignore the
wiki's drive-specific tradeoff: compare on your actual system.

## Modder features

`RE_Kenshi.json` provides [[rekenshi/file-rebinding|file-path rebinding]] and
[[rekenshi/sound-banks|sound-bank loading]]. These are mod configuration files,
not settings for this website.
The [[rekenshi/finding-file-paths|file I/O logger]] helps discover exact paths;
[[rekenshi/heightmaps|the heightmap tutorial]] demonstrates a complete rebind.
The source JSON schema is linked from Credits.

## Advanced configuration

Back up `RE_Kenshi.ini` before editing, close the game, and preserve the file's
existing format. Despite its extension, the documented examples use JSON-style
setting names and boolean values. Do not paste a standalone fragment over the
whole file.

| Setting                | Documented change                                                                                                                         |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `PreloadHeightmap`     | `true` preloads/decompresses the entire compressed heightmap into RAM; poorly tested, so leave disabled unless deliberately investigating |
| `EnableEmergencySaves` | `false` disables the crash-save attempt                                                                                                   |
| `CheckUpdates`         | `false` disables the update checker                                                                                                       |
| `FixModListScroll`     | `false` restores vanilla mod-list scrolling                                                                                               |
| `SkipUnusedMipReads`   | `false` disables skipping unused mipmap reads                                                                                             |
| `CachePhysXColliders`  | `false` disables the collider cache                                                                                                       |

### Hash checking is not version support

The source documents `IgnoreHash: true` for modified executables of an
**already supported** game version. It does **not** make an unsupported version
compatible. Leave normal checking enabled unless you understand the specific
supported-executable modification. If a game update then causes failures,
restore `IgnoreHash` to `false` and verify supported versions.

### Diagnostics have a cost

File I/O logging, audio ID/event/switch/state logging, and leaving the
**Debug Log** tab visible can reduce performance. Enable only the diagnostics
needed for a test, then disable them and leave the log tab.

These descriptions have not been independently benchmarked or retested in Kenshi.
